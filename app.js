function sampleMeta(sample){
    d3.json('samples.json').then((data)=>{
        var sample_meta = data.metadata;
        console.log(data)
        var results = sample_meta.filter(sampleObject => sampleObject.id==sample);
        var result = results[0];
        var panel = d3.select("#sample-metadata");
        panel.html("");
        Object.entries(result).forEach(([key, value])=>{
            panel.append("h6").text(`${key.toUpperCase()}:${value}`);
        });
    });
}
function sampleCharts(sample) {
    d3.json("samples.json").then((data) => {
      var samples = data.samples;
      var resultArray = samples.filter(sampleObj => sampleObj.id == sample);
      var result = resultArray[0];
      var otu_ids = result.otu_ids;
      var otu_labels = result.otu_labels;
      var sample_values = result.sample_values;
      // Build a Bubble Chart
      var bubbleLayout = {
        title: "Bacteria Cultures Per Sample",
        margin: { t: 0 },
        hovermode: "closest",
        xaxis: { title: "OTU ID" },
        margin: { t: 30, l: 35}
      };
      var bubbleData = [
        {
          x: otu_ids,
          y: sample_values,
          text: otu_labels,
          mode: "markers",
          marker: {
            size: sample_values,
            color: otu_ids,
            colorscale: "RdBu"
          }
        }
      ];
      Plotly.newPlot("bubble", bubbleData, bubbleLayout);
      var yticks = otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();
      var barData = [
        {
          y: yticks,
          x: sample_values.slice(0, 10).reverse(),
          text: otu_labels.slice(0, 10).reverse(),
          type: "bar",
          orientation: "h",
        }
      ];
      var barLayout = {
        title: "Bacteria Cultures Found",
        margin: { t: 30, l: 75 }
      };
      Plotly.newPlot("bar", barData, barLayout);
    });
}
function refreshPage(){
    var dropdown=d3.select('#selDataset');
    d3.json('samples.json').then((data)=>{
    var sample_names = data.names;
    sample_names.forEach((name)=>{
    dropdown.append('option').text(name).property('value', name);
    });
    var firstSample = sample_names[0];
    sampleCharts(firstSample);
    sampleMeta(firstSample);
    });
}
function optionChanged(newSample){
    sampleCharts(newSample);
    sampleMeta(newSample);
}
refreshPage();