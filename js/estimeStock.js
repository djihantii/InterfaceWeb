function recoverData1(){
  //var each = localStorage.getItem('each');
  //if (each == null)
  //{console.log(datadd);
    var dataLoader = new DataLoader();
    dataLoader.LoadEach("http://127.0.0.1:5000/count_each_product_stock");

    let each = dataLoader.getEach();
    //localStorage.setItem('each',JSON.stringify(each));
    //return each;
  //}
  ret = JSON.parse(each);
  return ret;
}


function writeTables(div, data){

  keys = d3.keys(data);
  values = d3.values(data);

  var parent = document.getElementById(div);

  var tbl = document.createElement("table");
  tbl.setAttribute("border" , 2);
  tbl.setAttribute("style", "width:100%")
  var tblBody = document.createElement("tbody");


  var row1 = document.createElement("tr");

  var cell = document.createElement("td");
  var cellText = document.createTextNode("Produit");
  cell.appendChild(cellText);
  row1.appendChild(cell);

  for(i = 0; i< keys.length; i++){
    cell = document.createElement("td");
    cellText = document.createTextNode("  "+keys[i]+" ");
    cell.appendChild(cellText);
    row1.appendChild(cell);
  }

  var row2 = document.createElement("tr");

  var cell = document.createElement("td");
  var cellText = document.createTextNode("Quantité en stock");
  cell.appendChild(cellText);
  row2.appendChild(cell);

  for(var j = 0; j< values.length; j++){
    cell = document.createElement("td");
    cellText = document.createTextNode(""+values[j]);
    cell.appendChild(cellText);
    row2.appendChild(cell);
  }

  tblBody.appendChild(row1);
  tblBody.appendChild(row2);

  tbl.appendChild(tblBody);

  parent.appendChild(tbl);
  parent.appendChild(document.createElement("Br"));
  parent.appendChild(document.createElement("Br"));
  parent.appendChild(document.createElement("Br"));


}


data2 = recoverData1();
writeTables('stock', data2);
console.log(data2);
