async function platformName(serverId) {
  let url = 'https://ds.smartape.net/api/dci/v3/server/' + serverId;

  let response = await fetch(url, {
    method: 'GET',
    headers: {
      'isp-box-instance': 'true',
    },
  });

  let json = {};

  if (response.ok) {
    json = await response.json();
  } else {
    console.log('Ошибка HTTP: ' + response.status);
  }

  return json;
}
platformName(window.location.pathname.split('/')[3]).then((result) => {
  let mbName = result.hardware_info.motherboard.model;

  let parent = [...document.querySelectorAll('.ispui-input-group.ispui-input-group_indent_default.ng-star-inserted')]
    .map((el) => el.querySelectorAll('ngispui-label')[0])
    .filter((el) => el)
    .filter((el) => el.innerText == 'Платформа*')[0].parentNode.parentNode;
  parent.querySelector('.ngispui-select.ngispui-select__wrapper.ngispui-select__value_cursor-pointer.ng-star-inserted').click();

  let imitateInput = () => {
    let inputEl = parent.querySelector('.ngispui-select__input-search');
    inputEl.value = mbName;
    inputEl.focus();
    inputEl.dispatchEvent(new Event('keydown', {keyCode: 'a'}));
    inputEl.dispatchEvent(new Event('keyup', {keyCode: 'a'}));

    inputEl.dispatchEvent(new Event('input', {
      view: window,
      bubbles: true,
      cancelable: true
    }))
  };

  setTimeout(imitateInput, 1000);
});
