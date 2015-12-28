var app = angular.module("refugeeApp", ['ui.router']);
app.controller("DataVizCtrl", ["$http", "$log", dataVizController]);
var countriesArray = [];

app.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
    // HOME STATES AND NESTED VIEWS ========================================
        .state('home', {
        url: '/home',
        templateUrl: 'home.html'
    })

    // nested list
    .state('home.2015', {
        url: '/2015',
        templateUrl: '2015.html',
    })

    // nested list
    .state('home.2014', {
        url: '/2014',
        templateUrl: '2014.html',
    })

    // nested list
    .state('home.2014.country', {
        url: '/country',
        templateUrl: 'country.html',
    })

    // nested list
    .state('home.2013', {
        url: '/2013',
        templateUrl: '2013.html',
    })

    // nested list
    .state('home.2012', {
        url: '/2012',
        templateUrl: '2012.html',
    })


    $urlRouterProvider.otherwise('/home');

}); // closes $routerApp.config()


function dataVizController($http, $log) {
    var self = this;
    self.title = "Refugee Data Visualizer";
    self.topTen = "TOP TEN GROUPS THIS YEAR";
    self.source = "Source: Office of Refugee Resettlement, USDHHS, December 2015";
    self.infoNotFound = {
        group: "GROUP INFO FOR CHOSEN YEAR DOES NOT EXIST.",
        chooseDifferent: "CHOOSE ANOTHER YEAR OR ANOTHER GROUP TO DISPLAY."
    };
    self.data2015Countries = [];
    self.data2014Countries = [];
    self.data2013Countries = [];
    self.data2012Countries = [];
    self.data2015;
    self.data2014;
    self.data2013;
    self.data2012;
    get2015();
    get2014();
    get2013();
    get2012();

    function get2015() {
        $http
            .get('/data2015')
            .then(function(res) {
                self.data2015 = res.data;
                for (var key in res.data[0]) {
                    self.data2015Countries.push(key);
                }
                self.data2015Countries = self.data2015Countries.slice(2, 3);
            })
            .catch(function(res) {
                $log.error('failure', res);
            });
    }

    function get2014() {
        $http
            .get('/data2014')
            .then(function(res) {
                self.data2014 = res.data;
                for (var key in res.data[0]) {
                    self.data2014Countries.push(key);
                }
                self.data2014Countries = self.data2014Countries.slice(3, 82);
            })
            .catch(function(res) {
                $log.error('failure', res);
            });
    }

    function get2013() {
        $http
            .get('/data2013')
            .then(function(res) {
                self.data2013 = res.data;
                for (var key in res.data[0]) {
                    self.data2013Countries.push(key);
                }
                self.data2013Countries = self.data2013Countries.slice(3, 82);
            })
            .catch(function(res) {
                $log.error('failure', res);
            });
    }

    function get2012() {
        $http
            .get('/data2012')
            .then(function(res) {
                self.data2012 = res.data;
                for (var key in res.data[0]) {
                    self.data2012Countries.push(key);
                }
                self.data2012Countries = self.data2012Countries.slice(2, 87);
            })
            .catch(function(res) {
                $log.error('failure', res);
            });
    }
}

app.directive('charts', function($parse) {
    var directiveDefinitionObject = {
        restrict: 'E',
        replace: false,
        link: function(scope, element, attrs) {

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
            var svg = d3.select("charts").append("svg")
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
            var statesArray = ["Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware","DC","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan","Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire","New Jersey","New Mexico","New York","North Carolina","North Dakota","Ohio","Oklahoma","Oregon","Pennsylvania","Rhode Island","South Carolina","South Dakota","Tennessee","Texas","Utah","Vermont","Virginia","Washington","West Virginia","Wisconsin","Wyoming"
];
            var statesGeoArray = [];
            var perStateFromcountry = [0, 0, 0, 0, 0, 0, 20, 0, 0, 0, 0, 10, 0, 100, 0, 0, 0, 60, 0, 80, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 140, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            var drawnOrderStatesNameArray = ["WASHINGTON", "MONTANA", "IDAHO", "NORTH DAKOTA", "MINNESOTA", "MAINE",
                "MICHIGAN", "WISCONSIN", "OREGON", "SOUTH DAKOTA", "NEW HAMPSHIRE", "VERMONT",
                "NEW YORK", "WYOMING", "IOWA", "NEBRASKA", "MASSACHUSETTS", "ILLINOIS", "PENNSYLVANIA",
                "CONNECTICUT", "RHODE ISLAND", "CALIFORNIA", "UTAH", "NEVADA", "OHIO", "INDIANA",
                "NEW JERSEY", "COLORADO", "WEST VIRGINIA", "MISSOURI", "KANSAS", "DELAWARE", "MARYLAND",
                "VIRGINIA", "KENTUCKY", "DISTRICT OF COLUMBIA", "ARIZONA", "OKLAHOMA", "NEW MEXICO",
                "TENNESSEE", "NORTH CAROLINA", "TEXAS", "ARKANSAS", "SOUTH CAROLINA", "ALABAMA", "GEORGIA",
                "MISSISSIPPI", "LOUISIANA", "FLORIDA", "HAWAII", "ALASKA"
            ];
            var drawnOrderStatesNumberArray = [47, 26, 12, 34, 23, 19, 22, 49, 37, 41, 29, 45, 32, 50, 15, 27, 21, 13, 38, 6, 39, 4, 44, 28, 35, 14, 30, 5, 48, 25, 16, 7, 20, 46, 17, 8, 2, 36, 31, 42, 33, 43, 3, 40, 0, 10, 24, 18, 9, 11, 1];
            //draws albers map projection of the US
            var drawmap = function() {
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
                        .attr("fill", function(d, i) {
                            //keeps track of state drawing order
                            statesGeoArray.push(us.objects.states.geometries[i].id);
                            //colorization scheme using HSL spectrum and scaling country resettlement data to HSL range
                            scaled = d3.scale.linear().domain([0, d3.max(perStateFromcountry.slice(0, 51))]).range([0, 98]);
                            return "hsl(45," + scaled(perStateFromcountry.slice(0, 51)[drawnOrderStatesNumberArray[i]]) + "%,59%)";
                        });
                    //more SVG drawing calls
                    g.append("path")
                        .datum(topojson.mesh(us, us.objects.states, function(a, b) {
                            return a !== b;
                        }))
                        .attr("id", "state-borders")
                        .attr("d", path);
                });
            };
            drawmap();

            //chart drawing function
            var chartDraw = function() {
                //sets the overall dimensions of the bar chart
                var margin = {
                        top: 20,
                        right: 20,
                        bottom: 80,
                        left: 40
                    },
                    width = 830 - margin.left - margin.right,
                    height = 180 - margin.top - margin.bottom;

                //scales the x values
                var x = d3.scale.ordinal()
                    .rangeRoundBands([0, width], 0.1);

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
                var svg = d3.select("charts")
                    .append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
                //adds data to bar chart based on current dataset

                    //assigns states to x axis
                    x.domain(statesArray.slice(0, 51).map(function(d) {
                        return d;
                    }));
                    //scales y axis to max in current per country array
                    y.domain([0, d3.max(perStateFromcountry.slice(0, 51))]);
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
                        .attr("transform", "rotate(-45)");
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
                        .data(perStateFromcountry.slice(0, 51))
                        .enter().append("rect")
                        .attr("class", "bar")
                        .attr("x", function(d, i) {
                            return x(statesArray[i]);
                        })
                        .attr("width", x.rangeBand())
                        .attr("y", function(d) {
                            return y(d);
                        })
                        .attr("height", 0)
                        .transition().duration(600)
                        .attr("height", function(d) {
                            return height - y(d);
                        });

            };
            //init chart draw with 2014 TOTAL data
            chartDraw();
        }
    };
    return directiveDefinitionObject;
});
