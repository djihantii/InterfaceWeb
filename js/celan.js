

function recoverData2(team,year) {
  //var predict = localStorage.getItem('predict');
  //if (predict == "null")
  //{
    var dataLoader = new DataLoader();
    dataLoader.LoadPredict("http://127.0.0.1:5000/predict_celan?equipe="+team+"&annee="+year);
    let predict = dataLoader.getPredict();
    //localStorage.setItem('predict',JSON.stringify(predict));
    //return predict;
  //}
  return JSON.parse(predict);
}

function listMonth(year){
  supposedDates = [];
  for(i=1; i<13; i++){
    if(i<10){
      d = ""+year+"-0"+i+"";
    }else{
      d = ""+year+"-"+i+"";
    }
    supposedDates.push(d);
  }
  return supposedDates;
}


function jsonKeys(data){
  var result = [];
  for(i=0, n=data.length; i<n; i++){
    result.push(d3.keys(data[i]));
  }
  return result;
}

function drawLine(equipe, data){
  var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

}

function roundDecimal(nombre, precision){
  var precision = precision || 2;
  var tmp = Math.pow(10, precision);
  return Math.round( nombre*tmp )/tmp;
}


function getValues(data){
  var result = [];
  for(i=0; n=data.length, i<n; i++){
      result.push(roundDecimal(data[i].y_pred[0] , 2));
  }
  return result;
}

function removeChilds(div){
  parent = document.getElementById(div);
  while(parent.firstChild){
    parent.removeChild(parent.firstChild);
  }
}

function yearValidation(year , currentYear) {
  var text = /^[0-9]+$/;
  if(year.length==4) {
    if (year != 0) {
        if ((year != "") && (!text.test(year))) {

            alert("Veuillez saisir des valeurs numériques uniquement");
            return false;
        }

        if (year.length != 4) {
            alert("Année non valide, veuillez réessayer s'il vous plaît");
            return false;
        }
        var current_year=new Date().getFullYear();
        if((year < currentYear-10) || (year > current_year+10))
            {
            alert("L'année doit être entre "+(currentYear-10)+" et "+(currentYear+10));
            return false;
            }
        return true;
    } }
  else {
    alert("Année invalide, veullez réessayer s'il vous plaît")
  }
}

function fchooseYear(){

  teams = ["PS1", "PS2", "AFD", "IDF"];
  year = document.getElementById('year').value;
  if(yearValidation(year, 2020) == true){
    alert("Veuillez patienter quelques instants ")
    ps1 = recoverData2("PS1", year);
    ps2 = recoverData2("PS2", year);
    afd = recoverData2("AFD", year);
    idf = recoverData2("IDF", year);
    values_ps1 = getValues(ps1);
    values_ps2 = getValues(ps2);
    values_afd = getValues(afd);
    values_idf = getValues(idf);
    removeChilds('e1');
    removeChilds('e2');
    removeChilds('e3');
    removeChilds('e4');
    writeTables('e1', year, 'PS1', values_ps1);
    writeTables('e2', year, 'PS2', values_ps2);
    writeTables('e3', year, 'AFD', values_afd);
    writeTables('e4', year, 'IDF', values_idf);
  }

}

function writeTables(div, year, team, values){
  t = "Prédiction pour l'année "+year+" pour l'équipe "+team;
  var parent = document.getElementById(div);
  var title = document.createElement('h4');
  title.appendChild(document.createTextNode(t));
  parent.appendChild(title);

  months = listMonth(year);
  var tbl = document.createElement("table");
  tbl.setAttribute("border" , 2);
  tbl.setAttribute("style", "width:100%")
  var tblBody = document.createElement("tbody");


  var row1 = document.createElement("tr");

  var cell = document.createElement("td");
  var cellText = document.createTextNode("Année-Mois");
  cell.appendChild(cellText);
  row1.appendChild(cell);

  for(i = 0; i< 12; i++){
    cell = document.createElement("td");
    cellText = document.createTextNode("  "+months[i]+" ");
    cell.appendChild(cellText);
    row1.appendChild(cell);
  }

  var row2 = document.createElement("tr");

  var cell = document.createElement("td");
  var cellText = document.createTextNode("CELAN");
  cell.appendChild(cellText);
  row2.appendChild(cell);

  for(var j = 0; j< 12; j++){
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
