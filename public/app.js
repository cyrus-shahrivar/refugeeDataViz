window.onload = function(){

          // i want hovering over the countries text to cause the map and the bar chart to update with the country number
          // how do i do this?  i figure i need an event broadcaster and an event listeners. event listeners need to be on the
          // bar chart and the map.  event broadcaster needs to be on each country item.
          ////////////////////////////////////////////////// VARIABLES //////////////////////////////////////////////////
          // var dispatch = d3.dispatch("load", "statechange");
          // var listOfWelcomingStates = ["ARIZONA", "FLORIDA", "GEORGIA", "IDAHO", "ILLINOIS", "IOWA", "MARYLAND", "MASSACHUSETTS",
          //                             "MICHIGAN", "NEW MEXICO", "NORTH CAROLINA", "NORTH DAKOTA", "OHIO", "OKLAHOMA", "TENNESSEE",
          //                             "TEXAS", "WISCONSIN"];
          var statesGeoArray = [];
          var drawnOrderStatesNameArray = ["WASHINGTON", "MONTANA", "IDAHO", "NORTH DAKOTA", "MINNESOTA", "MAINE",
                                          "MICHIGAN", "WISCONSIN", "OREGON", "SOUTH DAKOTA", "NEW HAMPSHIRE", "VERMONT",
                                          "NEW YORK", "WYOMING", "IOWA","NEBRASKA", "MASSACHUSETTS", "ILLINOIS", "PENNSYLVANIA",
                                          "CONNECTICUT", "RHODE ISLAND", "CALIFORNIA","UTAH", "NEVADA", "OHIO", "INDIANA",
                                          "NEW JERSEY","COLORADO","WEST VIRGINIA","MISSOURI", "KANSAS", "DELAWARE", "MARYLAND",
                                          "VIRGINIA","KENTUCKY", "DISTRICT OF COLUMBIA", "ARIZONA", "OKLAHOMA", "NEW MEXICO",
                                          "TENNESSEE", "NORTH CAROLINA", "TEXAS", "ARKANSAS","SOUTH CAROLINA", "ALABAMA","GEORGIA",
                                          "MISSISSIPPI","LOUISIANA","FLORIDA","HAWAII","ALASKA"];
          var drawnOrderStatesNumberArray = [47,26,12,34,23,19,22,49,37,41,29,45,32,50,15,27,21,13,38,6,39,4,44,28,35,14,30,5,48,25,
                                            16,7,20,46,17,8,2,36,31,42,33,43,3,40,0,10,24,18,9,11,1];

          // numbers of individuals per state from country for 2014_refugees
          var perStateFromcountry =[];
          var countriesArray = [];
          var statesArray = [];
          var country = 0;
          var arrayOfFiles = ["2015_refugees","2014_refugees","2013_refugees", "2012_refugees"];
          var dataset = "2014_refugees";
          var currentCountry = "TOTAL";
          var topTen = [];
          var topTenCountries = [];
          var placeholderArray = [];
          ////////////////////////////////////////////////// VARIABLES //////////////////////////////////////////////////

          ////////////////////////////////////////////////// DRAWING THE MAP //////////////////////////////////////////////////
          // Started with map and chart from http://bl.ocks.org/mbostock/
          // dispatch.on("load")
          var width = 860,
              height = 450,
              centered;

          var projection = d3.geo.albersUsa()
              .scale(900)
              .translate([width / 2, height / 2]);

          var path = d3.geo.path()
              .projection(projection);

          var svg = d3.select(".map-container").append("svg")
              .attr("width", width)
              .attr("height", height);

          svg.append("rect")
              .attr("class", "background")
              .attr("width", width)
              .attr("height", height);


          var g = svg.append("g");
          var scaled = 0;

      var drawmap = function () {
        d3.json("us-10m.json", function(error, us) {
          if (error) throw error;
          // console.log(us.objects.states.geometries[i].id);
          g.append("g")
              .attr("id", "states")
            .selectAll("path")
              .data(topojson.feature(us, us.objects.states).features)
            .enter().append("path")
              .attr("d", path)
              .attr("fill", function (d,i) {
                statesGeoArray.push(us.objects.states.geometries[i].id)
                //the drawn order array returns the index of the state
                //i want to scale the color based on number of individuals.  more indivduals should be higher in color, less should be lower in color
                scaled = d3.scale.linear().domain([0,d3.max(perStateFromcountry.slice(0,51))]).range([0,98]);
                return "hsl(45,"+scaled(perStateFromcountry.slice(0,51)[drawnOrderStatesNumberArray[i]]) + "%,59%)";
              })
              .on("mouseover", mousedover);

          g.append("path")
              .datum(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; }))
              .attr("id", "state-borders")
              .attr("d", path);
        });

      }

      drawmap();


          ////////////////////////////////////////////////// DRAWING THE MAP //////////////////////////////////////////////////


          ////////////////////////////////////////////////// COUNTRIES-LIST AND POPULATING ARRAYS //////////////////////////////////////////////////

          // getting data from json file, pushing data to arrays
          var populators = function() {
          d3.json(dataset+".json", function(error, data) {
              if (error) {
                // perStateFromcountry =[];
                return console.error(error);
              }
              ////////////////////////////////////////////////// COUNTRY AND ARRAY POPULATORS //////////////////////////////////////////////////


              var populateCountriesAndStates = function () {
              d3.selectAll(".top-ten ol li").remove();
              //for some reason this is not called again even though this function is triggered
              //var hi = d3.select(".countries-container").selectAll("span").data(data.Columns);

              data.Columns.forEach(function (d) {
                countriesArray.push(d);
              });

              data.Rows.forEach(function (d) {
                statesArray.push(d3.keys(d)[0]);
                // console.log([d3.values(d)[0][country]]);
                perStateFromcountry.push(d3.values(d)[0][country])
                // console.log(typeof d3.values(d)[0][country]);
                // if(d3.values(d)[0][country] == 0){
                //   console.log("zeroes present for country");
                // }else {

                // }

              });
              topTen = d3.values(data.Rows)[data.Rows.length - 1].TOTAL;
              // console.log("Current Debug",topTen);
              topTen = (_.sortBy(topTen)).slice(topTen.length-11,topTen.length-1);
              // console.log("Current Debug",topTen);

              topTenCountries = topTen.map(function (t) {
                return countriesArray[d3.values(data.Rows)[data.Rows.length - 1].TOTAL.indexOf(t)];
              })
              // console.log(topTenCountries.reverse());

              placeholderArray = topTenCountries.reverse();

              d3.select(".top-ten ol").selectAll("li")
                .data(topTenCountries)
                .enter()
                  .append("li")
                  .text(function (d) {
                    console.log(d);
                    return d;
                  })
                  .style("font-size", "12px");

            }
            ////////////
            populateCountriesAndStates();

            ////////////////////////////////////////////////// COUNTRY AND ARRAY POPULATORS //////////////////////////////////////////////////
            ////////////////////////////////////////////////// COUNTRY TOGGLE //////////////////////////////////////////////////
            d3.select(".countries-container").selectAll("li")
            .data(data.Columns)
              .enter()
              .append("li").transition().duration(1000)
              .text(function (d, i) {
                return countriesArray[i].toString().split(",").join(", ")
              })
              .style("font-size", "10px")
              .style("color", "grey")
              .style("list-style", "none")
              .attr("class","country");

            d3.select(".countries-container").selectAll("li")
            .data(data.Columns)
              .on("click", function (d,i) {
                d3.select(".flash-message").style("display", "none");
                d3.selectAll(".countries-container li").style("text-decoration", "none");
                d3.select(this).style("text-decoration", "underline");
                console.log(countriesArray[i]);
                currentCountry = countriesArray[i];
                countriesArray=[];
                perStateFromcountry = [];
                country = i;
                populateCountriesAndStates();
                drawmap();
                d3.select(".chart-container>svg").remove();
                chartDraw();
              });

              d3.select("body > div > div.left-container > div > li:nth-child("+(country+1)+")").style("text-decoration", "underline");
              ////////////////////////////////////////////////// COUNTRY TOGGLE //////////////////////////////////////////////////
          });
      }
      populators();

          var mousedover = function () {
            d3.select(this).attr("class", "state");
            //country = 2;
            // refillArray();

          }
          ////////////////////////////////////////////////// COUNTRIES-LIST AND POPULATING ARRAYS //////////////////////////////////////////////////

          ////////////////////////////////////////////////// BAR-CHART //////////////////////////////////////////////////
          var chartDraw = function () {
            var margin = {top: 20, right: 20, bottom: 80, left: 40},
                width = 830 - margin.left - margin.right,
                height = 180 - margin.top - margin.bottom;

            var x = d3.scale.ordinal()
                .rangeRoundBands([0, width], .1);
            var xAxis = d3.svg.axis()
                .scale(x)
                .orient("bottom");

            var y = d3.scale.linear()
                .range([height, 0]);


            var yAxis = d3.svg.axis()
                .scale(y)
                .orient("left")
                .ticks(10)
                .tickFormat(d3.format("d"));

            var svg = d3.select(".chart-container")
                .append("svg")
                  .attr("width", width + margin.left + margin.right)
                  .attr("height", height + margin.top + margin.bottom)
                  .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            d3.json(dataset+".json", function(error, data) {
              if (error) throw error;

              x.domain(statesArray.slice(0,51).map(function(d) { return d; }));
              y.domain([0, d3.max(perStateFromcountry.slice(0,51))]);

              svg.append("g")
                  .attr("class", "x axis")
                  .attr("transform", "translate(0," + height + ")")
                  .call(xAxis)
                  .transition().duration(600)
                    .selectAll("text")
                    .style("text-anchor", "end")
                    .style("font-size", "9px")
                    .attr("dx", "-.7em")
                    .attr("dy", "0em")
                    .attr("transform", "rotate(-45)" );;

              svg.append("g")
                  .attr("class", "y axis")
                  .call(yAxis)
                .append("text")
                  .attr("transform", "rotate(-90)")
                  .attr("y", 6)
                  .attr("dy", ".71em")
                  .style("text-anchor", "end")
                  .style("font-size", "1.0em")
                  .text("People Resettled");

              svg.selectAll(".bar")
                  .data(perStateFromcountry.slice(0,51))
                .enter().append("rect")
                  .attr("class", "bar")
                  .attr("x", function(d,i) { return x(statesArray[i]); })
                  .attr("width", x.rangeBand())
                  .attr("y", function(d) { return y(d); })
                  .attr("height", 0)
                  .transition().duration(600)
                  .attr("height", function(d) { return height - y(d); });
            });
          }
          chartDraw();
          ////////////////////////////////////////////////// BAR-CHART //////////////////////////////////////////////////
          ////////////////////////////////////////////////// YEAR TOGGLE //////////////////////////////////////////////////
          d3.select("#years-list").selectAll("li")
            .data([2015,2014,2013,2012])
            .enter()
              .append("li")
              .text(function (d,i) {
                return d;
              })
              .attr("class", "years")
              .style("list-style", "none")
              .style("color", "rgba(128, 128, 128, 0.44)")
              .style("font-size", "2em")
              .style("text-align", "center")
              .on("click", function (d,i) {
                d3.select(".top-ten").style("display: inline");
                topTen = [];
                topTenCountries = [];
                placeholderArray = [];
                d3.selectAll("#years-list li").transition().duration(500).style("font-size", "32px");
                d3.select(this).transition().duration(500).style("font-size", "64px");
                console.log(d);
                // var tempArray = [];
                d3.json(d+"_refugees.json", function (error, data) {
                  if(data.Columns.indexOf(currentCountry)>-1){
                    d3.select(".flash-message").style("display", "none");
                    country = data.Columns.indexOf(currentCountry);
                  }else {
                    // alert("info for that country of origin does not exist for chosen year");
                    d3.select(".flash-message").style("display", "inline");
                    country = 0;
                  }
                    // console.log("Current debug", d3.values(data.Rows)[data.Rows.length - 1]);
                    topTen = d3.values(data.Rows)[data.Rows.length - 1].TOTAL;
                })
                // console.log((_.sortBy(topTen)));
                //truly grabs the top 10
                // console.log((_.sortBy(topTen)).slice(topTen.length-11,topTen.length-1));
                topTen = (_.sortBy(topTen)).slice(topTen.length-11,topTen.length-1);
                topTenCountries = topTen.map(function (t) {
                  return statesArray[perStateFromcountry.indexOf(t)];
                })
                // console.log(topTenCountries.reverse());

                placeholderArray = topTenCountries.reverse();

                d3.select(".top-ten ol").selectAll("li")
                  .data(topTenCountries)
                  .enter()
                    .append("li")
                    .text(function (d) {
                      console.log(d);
                      return d;
                    })
                    .style("font-size", "12px");
                var someFunction = function(){
                  countriesArray=[];
                  dataset=arrayOfFiles[i];
                  perStateFromcountry = [];
                  // country = 0;
                  populators();
                  d3.selectAll(".countries-container li").remove();
                  drawmap();
                  d3.select(".chart-container>svg").remove();
                  chartDraw();
                }
                someFunction();
              })

            d3.select("#years-list > li:nth-child(2)")
              .style("font-size", "4em");
          ////////////////////////////////////////////////// YEAR TOGGLE //////////////////////////////////////////////////


};
