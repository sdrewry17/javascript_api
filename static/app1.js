
var names_url = "/names";

d3.json(names_url, function(error, response) {
  if (error) return console.warn(error);
  d3.select("#selDataset").selectAll("select")
    .data(response)
    .enter()
    .append("option")
    .html(function (d) {
      return `<a class="dropdown-item" href="#">${d}</a>`
    });
});


d3.select("#selDataset").on("change", optionChanged);


function optionChanged(route) {
  Plotly.d3.json(`/samples/${route}`, function(error, changeResponse) {
    if (error) return console.warn(error);
    
    // Redrawing the pie chart
    var values = changeResponse["sample_values"];
    var sum_values = values.slice(0, 9);
    var labels = changeResponse["otu_ids"];
    var sum_labels = labels.slice(0, 9);
    var pieData = [{
      values: sum_values,
      labels: sum_labels,
      type: "pie",
      name: route
    }];
    var pieLayout = {
      title: route
    };
    var $pie = document.getElementById("pie");
    Plotly.react($pie, pieData, pieLayout);


    // Redrawing the bubble chart
    var bubbleData = [{
      x: labels,
      y: values,
      mode:  "markers",
      marker: {
        size: values
      }}];
    var bubbleLayout = {
      title: route,
      showlegend: false
    };
    var $bubble = document.getElementById("bubble");
    Plotly.react($bubble, bubbleData, bubbleLayout)
    });

  //Recreating the table data
  d3.json(`/metadata/${route}`, function(error, metaResponse) {
    if (error) return console.warn(error);
    d3.select('#meta').selectAll('tr')
      .data(metaResponse)
      .enter()
      .append('tr')
      .html(function (d) {
        return `<tr><td>${d.AGE}</td><td>${d.BBTYPE}</td><td>${d.GENDER}</td><td>${d.LOCATION}</td><td>${d.SAMPLEID}</td></tr>`
        });
    });
};

function initPie() {
  Plotly.d3.json(`/samples/BB_940`, function(error, initPieResponse) {
    if (error) return console.warn(error);
    var values = initPieResponse["sample_values"];
    var sum_values = values.slice(0, 9);
    var labels = initPieResponse["otu_ids"];
    var sum_labels = labels.slice(0, 9);
    var initPieData = [{
      values: sum_values,
      labels: sum_labels,
      type: "pie",
      name: "BB_940"
    }];
    var initPieLayout = {
      title: "BB_940"
    };
    var $pie = document.getElementById("pie");
    Plotly.newPlot($pie, initPieData, initPieLayout)
  });
};

function initBubble() {
  Plotly.d3.json(`/samples/BB_940`, function(error, initBubbleResponse) {
    if (error) return console.warn(error);
    console.log(initBubbleResponse);
    var x = initBubbleResponse["otu_ids"];
    var y = initBubbleResponse["sample_values"];
    var initBubbleData = [{
      x: x,
      y: y,
      mode:  "markers",
      marker: {
        size: y
      }}];
    var initBubblelayout = {
      title: "BB_940",
      showlegend: false
    };
    var $bubble = document.getElementById("bubble");
    Plotly.newPlot($bubble, initBubbleData, initBubblelayout)
  });
};

function initMetadata() {
  var metadata_url = "/metadata/BB_940";
  d3.json(metadata_url, function(error, initMetaResponse) {
    if (error) return console.warn(error);
    console.log(initMetaResponse);
    d3.select('#meta').selectAll('tr')
      .data(initMetaResponse)
      .enter()
      .append('tr')
      .html(function (d) {
        return `<tr><td>${d.AGE}</td><td>${d.BBTYPE}</td><td>${d.GENDER}</td><td>${d.LOCATION}</td><td>${d.SAMPLEID}</td></tr>`
    });
  });
};


initPie();
initBubble();
initMetadata();



