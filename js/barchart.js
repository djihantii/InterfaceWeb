function recoverData(){
  var dataLoader = new DataLoader();
  dataLoader.LoadCelanVariation("http://127.0.0.1:8000/get_celan_variation");
  return dataLoader.getCelanVariation();
}
function formatData(data){
  max=0
  products = d3.keys(data);
  teams = [];
  result = [];

  for(i=0, n=products.length; i<n; i++){
    tempTeams = d3.keys(data[products[i]]);
    tt= []
    for(j=0, m=tempTeams.length; j<m; j++){
      if(!teams.includes(tempTeams[j])){
        teams.push(tempTeams[j]);
      }
      tempTotal = {};
      tempTotal["Equipe"] = tempTeams[j];
      listCelan = data[products[i]][tempTeams[j]];
      for(k=0, l=listCelan.length; k<l; k++){
        tempEntree = listCelan[k];
        if(tempTotal[tempEntree["dateEntree"]] == null){
          tempTotal[tempEntree["dateEntree"]] =tempEntree["total"];
        }
        else{
          // alert("kanet "+ tempTotal[tempEntree["dateEntree"]] );
          tempTotal[tempEntree["dateEntree"]] = tempTotal[tempEntree["dateEntree"]]+tempEntree["total"];
          // alert("wellat "+ tempTotal[tempEntree["dateEntree"]] );
        }
        max = Math.max(max,tempTotal[tempEntree["dateEntree"]] );
      }
      tt.push(tempTotal);

    }
    tempPush = {}
    // tempPush[products[i]] = tt;
    result[products[i]] = tt;
    // tempTotal = {};
  }
  return ([result, teams, max ])

}

function allProducts(data){

}

function allDates(data){

}

function filterYear(data, product, year){
  parseTime = d3.timeParse("%Y-%m");
  data = data[product];
  result = [];
  for(i=0, n=data.length; i<n; i++){
    var tempTeam = {};
    tempTeam["Equipe"] = data[i]["Equipe"];
    dates = d3.keys(data[i]);
    for(j=0,m=dates.length; j<m; j++){
      if(!(dates[j] == "Equipe")){
        d = parseTime(dates[j]);
        if(d.getFullYear() == year){
          tempTeam[dates[j]] = data[i][dates[j]];
        }
      }
    }
    result.push(tempTeam);

  }

  return result;

}
function lastColumn(year){
  supposedDates = ["Equipe"];
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
function adjustData(data, product, year){

  max = 0;
  supposedDates = listMonth(year);
  console.log(supposedDates);
  // data = data[product];
  for(j=0, m=data.length; j<m; j++){
    for(k=0, l=supposedDates.length; k<l; k++){
      if(data[j][supposedDates[k]] == null){
        data[j][supposedDates[k]] = 0;
      }

      max = Math.max(max ,   data[j][supposedDates[k]]);
    }
  }
  last = lastColumn(year);
  data.columns = last;
  return [data, max];
}
function drawChart(data,max , id, year, teams){


  // data = data[0][product];
  // var svg = d3.select(id).append("svg"),
  //     margin = {top: 20, right: 60, bottom: 30, left: 40},
  //     width = +svg.attr("width") - margin.left - margin.right,
  //     height = +svg.attr("height") - margin.top - margin.bottom,
  //     g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      var margin = {top:10, right:30, bottom:30, left:60},
                    width =  1000 - margin.left - margin.right,
                    height = 600 - margin.top - margin.bottom;
      var g = d3.select(id).append("svg").attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom).append("g").attr("transform", "translate("+ margin.left + "," + margin.top+")");

  // The scale spacing the groups:
  var x0 = d3.scaleBand()
      .rangeRound([0, width])
      .paddingInner(0.1);

  // The scale for spacing each group's bar:
  var x1 = d3.scaleBand()
      .padding(0.05);

  var y = d3.scaleLinear()
      .rangeRound([height, 0]);




    var keys = listMonth(year);
    var groupesk = teams;
    x0.domain(groupesk);

    x1.domain(keys).rangeRound([0, x0.bandwidth()]);
    var z = d3.scaleOrdinal().domain(groupesk).range(d3.schemeSet2);
    y.domain([0, max]).nice();

   g.append("g")
      .selectAll("g")
      .data(data)
      .enter().append("g")
      .attr("class","bar")
      .attr("transform", function(d) { return "translate(" + x0(d.Equipe) + ",0)"; })
      .selectAll("rect")
      .data(function(d) { return keys.map(function(key) {return {key: key, value: d[key]}; }); })
      .enter().append("rect")
        .attr("x", function(d) {return x1(d.key); })
        .attr("y", function(d) { return y(d.value); })
        .attr("width", x1.bandwidth())
        .attr("height", function(d) {return height - y(d.value); })
        .attr("fill", function(d) { return z(d.key); });

    g.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x0));

    g.append("g")
        .attr("class", "y axis")
        .call(d3.axisLeft(y).ticks(null, "s"))
      .append("text")
        .attr("x", 2)
        .attr("y", y(y.ticks().pop()) + 0.5)
        .attr("dy", "0.32em")
        .attr("fill", "#000")
        .attr("font-weight", "bold")
        .attr("text-anchor", "start")
        .text("Total CELAN par équipe");

    var legend = g.append("g")
        .attr("font-family", "sans-serif")
        .attr("font-size", 10)
        .attr("text-anchor", "end")
      .selectAll("g")
      .data(keys.slice().reverse())
      .enter().append("g")
        .attr("transform", function(d, i) { return "translate(0," + i * 12 + ")"; });

    legend.append("rect")
        .attr("x", width+20 )
        .attr("width", 15)
        .attr("height", 15)
        .attr("fill", z)
        .attr("stroke", z)
        .attr("stroke-width",2)
        .on("click",function(d) { update(d) });

    legend.append("text")
        .attr("x", width + 20)
        .attr("y", 9.5)
        .attr("dy", "0.32em")
        .text(function(d) {return d; });

    var filtered = [];

    function update(d) {

      //
      // Update the array to filter the chart by:
      //

      // add the clicked key if not included:
      if (filtered.indexOf(d) == -1) {
       filtered.push(d);
        // if all bars are un-checked, reset:
        if(filtered.length == keys.length) filtered = [];
      }
      // otherwise remove it:
      else {
        filtered.splice(filtered.indexOf(d), 1);
      }

      //
      // Update the scales for each group(/states)'s items:
      //
      var newKeys = [];
      keys.forEach(function(d) {
        if (filtered.indexOf(d) == -1 ) {
          newKeys.push(d);
        }
      })
      x1.domain(newKeys).rangeRound([0, x0.bandwidth()]);
      y.domain([0, d3.max(data, function(d) { return d3.max(keys, function(key) { if (filtered.indexOf(key) == -1) return d[key]; }); })]).nice();

      // update the y axis:
              g.select(".y")
              .transition()
              .call(d3.axisLeft(y).ticks(null, "s"))
              .duration(500);


      //
      // Filter out the bands that need to be hidden:
      //
      var bars = g.selectAll(".bar").selectAll("rect")
        .data(function(d) { return keys.map(function(key) { return {key: key, value: d[key]}; }); })

     bars.filter(function(d) {
           return filtered.indexOf(d.key) > -1;
        })
        .transition()
        .attr("x", function(d) {
          return (+d3.select(this).attr("x")) + (+d3.select(this).attr("width"))/2;
        })
        .attr("height",0)
        .attr("width",0)
        .attr("y", function(d) { return height; })
        .duration(500);

      //
      // Adjust the remaining bars:
      //
      bars.filter(function(d) {
          return filtered.indexOf(d.key) == -1;
        })
        .transition()
        .attr("x", function(d) { return x1(d.key); })
        .attr("y", function(d) { return y(d.value); })
        .attr("height", function(d) { return height - y(d.value); })
        .attr("width", x1.bandwidth())
        .attr("fill", function(d) { return z(d.key); })
        .duration(500);


      // update legend:
      legend.selectAll("rect")
        .transition()
        .attr("fill",function(d) {
          if (filtered.length) {
            if (filtered.indexOf(d) == -1) {
              return z(d);
            }
             else {
              return "white";
            }
          }
          else {
           return z(d);
          }
        })
        .duration(100);


    }

  }


// var result = filterFile(["AFD", "PS2"]);

// alert (result[1].Equipe);
// drawChart(["PS1","PS2", "AFD", "APOR", "Total général"]);

function filterEquipe(){
  equipes = document.getElementById("choix-equipe").submit();

}


dataS = recoverData();



// function drawChart(data,max , id, year, teams){

formatted = formatData(dataS);
filtered = filterYear(formatted[0], "AIRCOM", "2019");
adjusted = adjustData( filtered,"AIRCOM", "2019");
drawChart(adjusted[0],adjusted[1], "#aircom", "2019", formatted[1]);

formatted = formatData(dataS);
filtered = filterYear(formatted[0], "CLIENT", "2019");
adjusted = adjustData( filtered,"CLIENT", "2019");
drawChart(adjusted[0],adjusted[1], "#client", "2019", formatted[1]);

formatted = formatData(dataS);
filtered = filterYear(formatted[0], "ETUDE", "2019");
adjusted = adjustData( filtered,"ETUDE", "2019");
drawChart(adjusted[0],adjusted[1], "#etude", "2019", formatted[1]);

formatted = formatData(dataS);
filtered = filterYear(formatted[0], "LFO", "2019");
adjusted = adjustData( filtered,"LFO", "2019");
drawChart(adjusted[0],adjusted[1], "#lfo", "2019", formatted[1]);

alert("Utilisez les carrés de couleur à droite pour filtrer")
