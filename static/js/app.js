function buildMetadata(sample) {

  var sampleURL = `/metadata/${sample}`

  d3.json(`/metadata/${sample}`).then((metaSampledata) => {


    var metaPanel = d3.select("#sample-metadata");

    metaPanel.html("");

    Object.entries(metaSampledata).forEach(([key,value]) => {
      metaPanel.append("h6").text(`${key}: ${value}`);
    });   
  });
}

function buildCharts(sample) {

   // Use `d3.json` to fetch the sample data for the plots 
   d3.json(`/samples/${sample}`).then((chartSampledata) => {


    const otu_ids = chartSampledata.otu_ids;
    const otu_labels = chartSampledata.otu_labels;
    const sample_values = chartSampledata.sample_values;

    //Build a Bubble Chart using the sample data
    var bblData = [{
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: "markers",
      marker: {
        size: sample_values,
        color: otu_ids,
        colorscale: "Viridis"
      }
    }];

    // Layout
    var bblLayout = {
      margin: { t: 0},
      xaxis: {title: "OTU ID"}
    };
    // html id = 'bubble'
    Plotly.plot("bubble", bblData, bblLayout);

    //Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
    var pieData = [{
      values: sample_values.slice(0,10),
      labels: otu_ids.slice(0,10),
      hovertext: otu_labels.slice(0,10),
      type: 'pie'
    }];
    
    // Layout
    var pieLayout = {
      margin: {t: 150, l: 150},
      height: 600,
      width: 600
    };
    
    Plotly.plot('pie', pieData, pieLayout);
  });

}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
