var loadData = function(urlString) {
  var request = new XMLHttpRequest();
  request.open("GET", urlString, false);
  request.send(null);

  var jsonObject = JSON.parse(request.responseText);

  return jsonObject
}

var bigDataObject = loadData("https://chhs.data.ca.gov/api/views/q4et-a8rk/rows.json?accessType=DOWNLOAD");

var metaData = bigDataObject['meta'];

var bigData = bigDataObject['data'];

var body = d3.select('body');
var description = body.select('.description');

description.append('div')
            .text(metaData.view.description);

// console.log(bigData);




// First thing we're trying
// Top 5 causes of death in california in 94102

var countOfDeathCauses = {};
var HRzipCode = '94102';

// Iterate through all items in data array
for (var i = 0; i < bigData.length; i++) {
  // If the zip code for the item matches HR's
  if (bigData[i][9] === HRzipCode) {
    //Initialize the cause of death key
    if (countOfDeathCauses[bigData[i][10]] === undefined) {
      countOfDeathCauses[bigData[i][10]] = Number(bigData[i][11]);
    } else {
      // Increment the cause of death by 1
      countOfDeathCauses[bigData[i][10]] += Number(bigData[i][11]);
    }
  }
}

var causeNames = {
  ALZ: 'Alzheimers',
  HYP: 'Hypertension',
  DIA: 'Diabeetus',
  PNF: 'Pneumonia & Influenza',
  HOM: 'Homicide',
  NEP: 'Kidney Disease',
  LIV: 'Liver Disease',
  SUI: 'Suicide',
  INJ: 'Unintended Injury',
  CLD: 'Respiratory Disease',
  STK: 'Stroke',
  CAN: 'Cancer',
  HTD: 'Heart Disease',
  OTH: 'Other'
}


// Convert death causes object into an array
var deathObject = {'name': 'deathCauses', 'children': []};
_.each(countOfDeathCauses, function(value, key, collection) {
  deathObject['children'].push({'name': causeNames[key], 'size': value});
});

console.log(deathObject)

// COPY PASTA CODE

var diameter = 960,
    format = d3.format(",d"),
    color = d3.scale.category20c();

var bubble = d3.layout.pack()
    .sort(null)
    .size([diameter, diameter])
    .padding(1.5);

var svg = d3.select("body").append("svg")
    .attr("width", diameter)
    .attr("height", diameter)
    .attr("class", "bubble");

body.select('h2')
    .text('Cause of Deaths in ' + HRzipCode + ' between 1999 & 2013');

var node = svg.selectAll(".node")
    .data(bubble.nodes(classes(deathObject))
    .filter(function(d) { return !d.children; }))
  .enter().append("g")
    .attr("class", "node")
    .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

node.append("title")
    .text(function(d) { return d.className + ": " + format(d.value); });

node.append("circle")
    .attr("r", function(d) { return d.r; })
    .style("fill", function(d) { return color(d.packageName); });

node.append("text")
    .attr("dy", ".3em")
    .style("text-anchor", "middle")
    .text(function(d) { return d.className.substring(0, d.r / 3); });

// Returns a flattened hierarchy containing all leaf nodes under the root.
function classes(root) {
  var classes = [];

  function recurse(name, node) {
    if (node.children) node.children.forEach(function(child) { recurse(node.name, child); });
    else classes.push({packageName: name, className: node.name, value: node.size});
  }

  recurse(null, root);
  return {children: classes};
}

d3.select(self.frameElement).style("height", diameter + "px");




/*

// FRAME
var graph = body.select('div')
                .append('svg')
                .classed({'graph': true})
                .style('background-color', 'grey')
                .style('height', '750px')
                .style('width', '750px');

// UPDATE
// graph;

// ENTER
var node = graph.selectAll('.bubble')
                .data(deathObject)
                .enter()
                .append('g')
                .attr('class', 'bubble')
                .attr('transform', function(d, i) {
                  return 'translate(' + (i * 20 + d[1]) + ', 200)';
                });

node.append('circle')
    .attr('r', function(d) {
      return d[1]/10;
    });

node.append('text')
    .style('text-anchor', 'middle')
    .text(function(d) {
      return d[0] + ': ' + d[1];
    })

console.log(countOfDeathCauses);

*/