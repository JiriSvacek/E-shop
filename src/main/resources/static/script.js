const artGetItem = document.getElementById("artGetItem"),
  artItemsLoad = document.getElementById("artItemsLoad"),
  artNewItem = document.getElementById("artNewItem"),
  artUpdatePrice = document.getElementById("artUpdatePrice"),
  artDeleteItems = document.getElementById("artDeleteItems"),
  artMain = document.getElementById("artMain"),
  TJSON = "TJSON",
  TTEXT = "TTEXT";

function hide() {
  artGetItem.style.display = "none";
  artItemsLoad.style.display = "none";
  artNewItem.style.display = "none";
  artUpdatePrice.style.display = "none";
  artDeleteItems.style.display = "none";
  artMain.style.display = "none";
}

function load() {
  hide();
  artMain.style.display = "block";
}
load();

function sendRequest(adress, requestOptions, returnFormat) {
  return fetch("http://localhost:8080/" + adress, requestOptions)
    .then((response) => {
      if (returnFormat == "TJSON") {
        return response.json();
      } else {
        return response.text();
      }
      console.log(response);
    })
    .then((result) => {
      console.log(result);
      return result;
    })
    .catch((error) => console.log("error", error));
}

function articleItemsLoad() {
  hide();
  artItemsLoad.style.display = "block";
  itemsLoad(sendRequest);
}

async function itemsLoad() {
  const onstockLoad = document.getElementById("onstockLoad");
  const requestOptions = {
    method: "GET",
    headers: { available: onstockLoad.checked },
    redirect: "follow",
  };

  const result = await sendRequest("itemsLoad", requestOptions, TJSON);

  if (document.getElementById("loadTable")) {
    artItemsLoad.removeChild(document.getElementById("loadTable"));
  }

  const table = document.createElement("table");
  table.setAttribute("id", "loadTable");
  row = table.insertRow(0);
  const arrayOfProperties = [
    "Id",
    "Part Number",
    "Name",
    "Price",
    "For sale",
    "Description",
  ];
  arrayOfProperties.forEach(function (item, index) {
    row.insertCell(index).innerHTML = item;
  });

  result.forEach((e) => {
    row = table.insertRow(1);
    row.insertCell(0).innerHTML = e?.id;
    row.insertCell(1).innerHTML = e?.partNumber;
    row.insertCell(2).innerHTML = e?.name;
    row.insertCell(3).innerHTML = e?.price;
    row.insertCell(4).innerHTML = e?.forSale;
    row.insertCell(5).innerHTML = e?.description;
  });
  artItemsLoad.appendChild(table);
}

const tableGet = document.getElementById("tableGet"),
  nOkGet = document.getElementById("nOkGet"),
  idPart = document.getElementById("idPart");

function articleGetItem() {
  hide();
  tableGet.style.display = "none";
  nOkGet.style.display = "none";
  artGetItem.style.display = "block";
}

function closeChildsGetItem() {
  nOkGet.style.display = "none";
  idPart.value = "";
}

async function getItem() {
  const requestOptions = {
    method: "GET",
    redirect: "follow",
  };
  let result = await sendRequest(
    "loadItem/" + idPart.value,
    requestOptions,
    TTEXT
  );
  if (result.length != 0) {
    result = JSON.parse(result);
  }
  if (result.hasOwnProperty("message")) {
    nOkGet.innerHTML = result["message"];
    tableGet.style.display = "none";
    nOkGet.style.display = "block";
    setTimeout(closeChildsGetItem, 3000);
  } else if (result.hasOwnProperty("error")) {
    nOkGet.innerHTML = result["status"] + " " + result["error"];
    tableGet.style.display = "none";
    nOkGet.style.display = "block";
    setTimeout(closeChildsGetItem, 3000);
  } else if (result == 0) {
    nOkGet.innerHTML = "Selected id does not have assignment item in DB";
    tableGet.style.display = "none";
    nOkGet.style.display = "block";
    setTimeout(closeChildsGetItem, 2000);
  } else {
    document.getElementById("pId").innerHTML = result.id;
    document.getElementById("pNumber").innerHTML = result.partNumber;
    document.getElementById("pName").innerHTML = result.name;
    document.getElementById("pDescription").innerHTML = result.description;
    document.getElementById("pPrice").innerHTML = result.price;
    document.getElementById("onstockGet").checked = result.forSale;
    nOkGet.style.display = "none";
    tableGet.style.display = "block";
  }
}

const popUp = document.getElementById("popUp"),
  partNb = document.getElementById("partNb"),
  name = document.getElementById("name"),
  description = document.getElementById("description"),
  price = document.getElementById("price"),
  onstockNew = document.getElementById("onstockNew");

function articleNewItem() {
  hide();
  popUp.style.display = "none";
  artNewItem.style.display = "block";
}

async function newItem() {
  let myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify({
    partNumber: partNb.value,
    name: name.value,
    description: description.value,
    price: price.value,
    forSale: onstockNew.checked,
  });

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  const result = await sendRequest("newItem", requestOptions, TJSON);
  afterSendNewItem(result);
}

function afterSendNewItem(result) {
  if (result.hasOwnProperty("message")) {
    popUp.innerHTML = result["message"];
    popUp.style.display = "block";
    setTimeout(function () {
      popUp.style.display = "none";
    }, 3000);
  } else {
    popUp.innerHTML = "Item was added to DB";
    popUp.style.display = "block";
    setTimeout(closeAfterNewItem, 2000);
  }
}

function closeAfterNewItem() {
  partNb.value = "";
  name.value = "";
  description.value = "";
  price.value = "";
  onstockNew.checked = false;
  popUp.style.display = "none";
}

const pricePopUp = document.getElementById("pricePopUp"),
  idPartPrice = document.getElementById("idPartPrice"),
  pricePart = document.getElementById("pricePart");

function articleUpdatePrice() {
  hide();
  pricePopUp.style.display = "none";
  idPartPrice.value = "";
  pricePart.value = "";
  artUpdatePrice.style.display = "block";
}

async function updatePrice() {
  const requestOptions = {
    method: "PUT",
    headers: {
      id: idPartPrice.value,
      price: pricePart.value,
    },
    redirect: "follow",
  };

  const result = await sendRequest("updatePrice", requestOptions, TTEXT);

  if (result.includes("message")) {
    afterUpdate(JSON.parse(result)["message"]);
  } else if (result == "0") {
    afterUpdate("No item was effected (wrong id?)");
  } else {
    afterUpdate("Update was successful");
  }
}

function afterUpdate(result) {
  pricePopUp.innerHTML = result;
  pricePopUp.style.display = "block";
  setTimeout(function () {
    idPartPrice.value = "";
    pricePart.value = "";
    pricePopUp.style.display = "none";
  }, 2500);
}

const deleteItemsPopUp = document.getElementById("deleteItemsPopUp");

function articleDeleteItems() {
  hide();
  deleteItemsPopUp.style.display = "none";
  artDeleteItems.style.display = "block";
}

function deleteItems() {
  if (confirm("Are you sure you want to delete out of stock items from DB?")) {
    deleteRequest();
  } else {
    deletePopUp("No action was done (you cancelled action)");
  }
}

async function deleteRequest() {
  const requestOptions = {
    method: "DELETE",
    redirect: "follow",
  };

  const result = await sendRequest("delete", requestOptions, TTEXT);
  if (result.includes("message")) {
    deletePopUp(JSON.parse(result)["message"]);
  } else {
    if (result == "0") {
      deletePopUp("No row effected");
    } else if (result == "1") {
      deletePopUp(result + " row was deleted");
    } else {
      deletePopUp(result + " rows was deleted");
    }
  }
}

function deletePopUp(result) {
  deleteItemsPopUp.innerHTML = result;
  deleteItemsPopUp.style.display = "block";
  setTimeout(function () {
    deleteItemsPopUp.style.display = "none";
  }, 2500);
}

const span = document.getElementById("span");

function timer() {
  const d = new Date();

  const month = addingZero(d.getMonth() + 1),
    day = addingZero(d.getDate()),
    hour = addingZero(d.getHours()),
    minute = addingZero(d.getMinutes()),
    second = addingZero(d.getSeconds());

  span.innerHTML =
    day +
    "." +
    month +
    "." +
    d.getFullYear() +
    " " +
    " " +
    hour +
    ":" +
    minute +
    ":" +
    second;
}

function addingZero(inputValue) {
  if (inputValue < 10) {
    return "0" + inputValue;
  } else {
    return inputValue;
  }
}

timer();
setInterval(timer, 1000);
