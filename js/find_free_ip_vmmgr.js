async function findFreeIp(netId) {
  let url = 'https://vps.smartape.net/vm/v3/ip?orderby=ip_addr%20asc&limit=0,512&where=((network%20EQ%20' + netId + '))';
  let response = await fetch(url, {
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

  let netMasks = (number) => {
    return Math.pow(2, 32 - number);
  };

  let subnetMask = json.list[0].ipnet_name.split('/')[1];
  let subnetAddress = json.list[0].ipnet_name.split('/')[0];

  let sortedList = json.list.sort((a, b) => parseInt(a.ip_addr.split('.')[3]) - parseInt(b.ip_addr.split('.')[3]));

  let netName = subnetAddress.split('.').slice(0, 3).join('.');
  let netNameNum = subnetAddress.split('.').slice(3, 4);

  let startNum = parseInt(netNameNum) + 1;
  let endNum = parseInt(netNameNum) + parseInt(netMasks(parseInt(subnetMask)));

  let freeIp = [];
  for (let i = startNum; i < endNum; i++) {
    freeIp.push(netName + '.' + i);
  }
  return freeIp.filter((el) => !sortedList.map((el2) => el2.ip_addr).includes(el));
}
findFreeIp(window.location.pathname.split('/').slice(5, 6)).then((result) => console.log(result));
