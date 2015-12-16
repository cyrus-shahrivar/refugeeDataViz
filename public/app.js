//AUTHOR: CYRUS SHAHRIVAR
//DATE: 12/15/2015
//PROJECT: REFUGEE DATA VISUALIZER

window.onload = function(){
    ////////////////////////////////////////////////// VARIABLES //////////////////////////////////////////////////

    //holds the geographic objects for identifying the order of states drawn in the SVG
    var statesGeoArray = [];
    //these two arrays are used to correspond state graphic drawing order to an alphabetical list of stats contained in the dataset
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

    //numbers of individuals per state from country for 2014_refugees
    var perStateFromcountry =[];
    //used for displaying list of countries
    var countriesArray = [];
    //used for displaying list of states
    var statesArray = [];
    //initial country choice on load - TOTAL of all countries
    var country = 0;
    //files holding yearly data
    var arrayOfFiles = ["2015_refugees","2014_refugees","2013_refugees", "2012_refugees"];
    //holds the current dataset to parse, init 2014
    var dataset = "2014_refugees";
    //used to hold current country chosen while countries assignment changes, allows for year-to-year comparisons
    var currentCountry = "TOTAL";
    //these three are used to generate the top ten list of countries/groups that were resettled in the US
    var topTen = [];
    var topTenCountries = [];
    var placeholderArray = [];
    ////////////////////////////////////////////////// VARIABLES //////////////////////////////////////////////////

    ////////////////////////////////////////////////// DRAWING THE MAP //////////////////////////////////////////////////
    //Started with map and chart from http://bl.ocks.org/mbostock/, but configured further to fit needs of this project
    //SVG holding container for map
    var width = 860,
        height = 450,
        centered;
    //albers projection d3.geo call, positions projection to center of SVG
    var projection = d3.geo.albersUsa()
        .scale(900)
        .translate([width / 2, height / 2]);
    //albers projection SVG path
    var path = d3.geo.path()
        .projection(projection);
    //SVG width and height assignment
    var svg = d3.select(".map-container").append("svg")
        .attr("width", width)
        .attr("height", height);
    //SVG rect width and height assignment
    svg.append("rect")
        .attr("class", "background")
        .attr("width", width)
        .attr("height", height);
    //appends SVG g property to SVG
    var g = svg.append("g");
    var scaled = 0;
    //draws albers map projection of the US
    var drawmap = function () {
      //gets us topojson file
      d3.json("us-10m.json", function(error, us) {
        if (error) throw error;
        //appends SVG g,path,and d properties with data from topojson file
        g.append("g")
          .attr("id", "states")
          .selectAll("path")
          .data(topojson.feature(us, us.objects.states).features)
          .enter().append("path")
            .attr("d", path)
            .attr("fill", function (d,i) {
              //keeps track of state drawing order
              statesGeoArray.push(us.objects.states.geometries[i].id);
              //colorization scheme using HSL spectrum and scaling country resettlement data to HSL range
              scaled = d3.scale.linear().domain([0,d3.max(perStateFromcountry.slice(0,51))]).range([0,98]);
              return "hsl(45,"+scaled(perStateFromcountry.slice(0,51)[drawnOrderStatesNumberArray[i]]) + "%,59%)";
            })
            //for now just highlights the states as you mouseover
            .on("mouseover", mousedover);
        //more SVG drawing calls
        g.append("path")
            .datum(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; }))
            .attr("id", "state-borders")
            .attr("d", path);
      });

    }
    //initial drawmap call
    drawmap();
    ////////////////////////////////////////////////// DRAWING THE MAP //////////////////////////////////////////////////

    ////////////////////////////////////////////////// COUNTRIES-LIST AND POPULATING ARRAYS //////////////////////////////////////////////////

    // getting data from refugee json files, pushing data to arrays
    var populators = function() {
      //gets json file based on current dataset variable
      d3.json(dataset+".json", function(error, data) {
          if (error) {
            return console.error(error);
          }
          ////////////////////////////////////////////////// COUNTRY AND ARRAY POPULATORS //////////////////////////////////////////////////
          //populates coutriesArray, statesArray, perStateFromcountry, topTen arrays
          var populateCountriesAndStates = function () {
            d3.selectAll(".top-ten ol li").remove();

            data.Columns.forEach(function (d) {
              countriesArray.push(d);
            });

            data.Rows.forEach(function (d) {
              statesArray.push(d3.keys(d)[0]);
              perStateFromcountry.push(d3.values(d)[0][country]);
            });

            topTen = d3.values(data.Rows)[data.Rows.length - 1].TOTAL;
            topTen = (_.sortBy(topTen)).slice(topTen.length-11,topTen.length-1);

            topTenCountries = topTen.map(function (t) {
              return countriesArray[d3.values(data.Rows)[data.Rows.length - 1].TOTAL.indexOf(t)];
            })
            //manipulates topTen countries to be in reverse order after sorting, then assigns to HTML DOM elements
            placeholderArray = topTenCountries.reverse();
            d3.select(".top-ten ol").selectAll("li")
              .data(topTenCountries)
              .enter()
                .append("li")
                .text(function (d) {
                  return d;
                })
                .style("font-size", "12px");

          }
          //init populator call - 2014 data
          populateCountriesAndStates();

          ////////////////////////////////////////////////// COUNTRY AND ARRAY POPULATORS //////////////////////////////////////////////////
          ////////////////////////////////////////////////// COUNTRY TOGGLE //////////////////////////////////////////////////
          //builds countries list
          d3.select(".countries-container").selectAll("li")
          .data(data.Columns)
            .enter()
            .append("li").transition().duration(1000)
            .text(function (d, i) {
              return countriesArray[i].toString().split(",").join(", ");
            })
            .style("font-size", "10px")
            .style("color", "grey")
            .style("list-style", "none")
            .attr("class","country");
          //assigns on-click functionality to countries list
          d3.select(".countries-container").selectAll("li")
          .data(data.Columns)
            .on("click", function (d,i) {
              //adds styling and resets arrays and then repopulates arrays as clicked
              d3.select(".flash-message").style("display", "none");
              d3.selectAll(".countries-container li").style("text-decoration", "none");
              d3.select(this).style("text-decoration", "underline");
              currentCountry = countriesArray[i];
              countriesArray=[];
              perStateFromcountry = [];
              country = i;
              populateCountriesAndStates();
              drawmap();
              d3.select(".chart-container>svg").remove();
              chartDraw();
            });
            //init select styling - TOTAL
            d3.select("body > div > div.left-container > div > li:nth-child("+(country+1)+")").style("text-decoration", "underline");
            ////////////////////////////////////////////////// COUNTRY TOGGLE //////////////////////////////////////////////////
        });
      }
      //init populators call - 2014 data
      populators();
      //only highlights states at this time, no additonal functionality
      var mousedover = function () {
        d3.select(this).attr("class", "state");
      }
      ////////////////////////////////////////////////// COUNTRIES-LIST AND POPULATING ARRAYS //////////////////////////////////////////////////

      ////////////////////////////////////////////////// BAR-CHART //////////////////////////////////////////////////
      //chart drawing function
      var chartDraw = function () {
        //sets the overall dimensions of the bar chart
        var margin = {top: 20, right: 20, bottom: 80, left: 40},
            width = 830 - margin.left - margin.right,
            height = 180 - margin.top - margin.bottom;

        //scales the x values
        var x = d3.scale.ordinal()
            .rangeRoundBands([0, width], .1);

        var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom");

        //scales the y values
        var y = d3.scale.linear()
            .range([height, 0]);

        //generates the y axis
        var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left")
            .ticks(10)
            .tickFormat(d3.format("d"));
        //init the bar chart SVG
        var svg = d3.select(".chart-container")
            .append("svg")
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom)
              .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        //adds data to bar chart based on current dataset
        d3.json(dataset+".json", function(error, data) {
          if (error) throw error;
          //assigns states to x axis
          x.domain(statesArray.slice(0,51).map(function(d) { return d; }));
          //scales y axis to max in current per country array
          y.domain([0, d3.max(perStateFromcountry.slice(0,51))]);
          //appends svg g property to x axis for bar chart and adds in transition
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
                .attr("transform", "rotate(-45)" );
          //appends svg g property to y axis for bar chart
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
          //adds data to individual bars and styles, adds transitions
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
      //init chart draw with 2014 TOTAL data
      chartDraw();
      ////////////////////////////////////////////////// BAR-CHART //////////////////////////////////////////////////
      ////////////////////////////////////////////////// YEAR TOGGLE //////////////////////////////////////////////////
      //year toggling list
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
            //click = transitions, emptying arrays, repopulating arrays
            d3.select(".top-ten").style("display: inline");
            topTen = [];
            topTenCountries = [];
            placeholderArray = [];
            d3.selectAll("#years-list li").transition().duration(500).style("font-size", "32px");
            d3.select(this).transition().duration(500).style("font-size", "64px");
            d3.json(d+"_refugees.json", function (error, data) {
              if(data.Columns.indexOf(currentCountry)>-1){
                d3.select(".flash-message").style("display", "none");
                country = data.Columns.indexOf(currentCountry);
              }else {
                d3.select(".flash-message").style("display", "inline");
                country = 0;
              }
                topTen = d3.values(data.Rows)[data.Rows.length - 1].TOTAL;
            })
            topTen = (_.sortBy(topTen)).slice(topTen.length-11,topTen.length-1);
            topTenCountries = topTen.map(function (t) {
              return statesArray[perStateFromcountry.indexOf(t)];
            })

            placeholderArray = topTenCountries.reverse();
            //displays top ten list of countries resettled in US for givin year
            d3.select(".top-ten ol").selectAll("li")
              .data(topTenCountries)
              .enter()
                .append("li")
                .text(function (d) {
                  return d;
                })
                .style("font-size", "12px");
            countriesArray=[];
            dataset=arrayOfFiles[i];
            perStateFromcountry = [];
            populators();
            d3.selectAll(".countries-container li").remove();
            //timeout was added to deal with asych function execution once deployed
            var timeOutFunction = setTimeout(drawmap,500);
            d3.select(".chart-container>svg").remove();
            chartDraw();
          })
        //defaults 2014 to be large font on init load
        d3.select("#years-list > li:nth-child(2)")
          .style("font-size", "4em");
      ////////////////////////////////////////////////// YEAR TOGGLE //////////////////////////////////////////////////
};
