async function findFreeIp(netId) {
  let url = "https://ds.smartape.net/api/dci/v3/ipmgr/ip?orderby=name%20asc&limit=0,512&where=NOT%20domain%20CP%20%27%25extended.%25%27+AND+(ipnet%20EQ%20"+netId+")";
  let response = await fetch(url, {
      headers: {
          "isp-box-instance": "true",
      },
  });

  let json = {};

  if (response.ok) {
      json = await response.json();
  } else {
      console.log("Ошибка HTTP: " + response.status);
  }

  function netMasks(number) {
      return Math.pow(2, (32-number));
  }

  let subnetMask = json.list[0].ipnet_name.split("/")[1];
  let subnetAdress = json.list[0].ipnet_name.split("/")[0];

  let sortedlist = json.list.sort(
      (a, b) =>
          parseInt(a.name.split(".")[3]) - parseInt(b.name.split(".")[3])
  );
  
  let netname = subnetAdress.split(".").slice(0, 3).join(".");
  let netnameNum = subnetAdress.split(".").slice(3, 4);

  let startNum = parseInt(netnameNum) + 1;
  let endNum = parseInt(netnameNum) + parseInt(netMasks(parseInt(subnetMask)));

  let freeIp = [];
  for (let i = startNum; i < endNum; i++) {
      freeIp.push(netname + "." + i);
  }
  return freeIp.filter(el => !(sortedlist.map(el2 => el2.name).includes(el)));

}
findFreeIp(window.location.pathname.split("/").slice(4,5)).then(result => console.log(result));