function buildBar(){
    d3.json("samples.json").then((data) => {
            // console.log(data.samples[0]);
            // console.log(data.samples[0].sample_values.slice(0,10));
            // console.log(data.samples[0].otu_ids.slice(0,10));
            
            var trace1 = {
                x: data.samples[0].sample_values.slice(0,10).reverse(),
                y: data.samples[0].otu_ids.slice(0,10).map(x=>`OTU ${x}`).reverse(),
                text:data.samples[0].otu_labels.slice(0,10).reverse(),
                type:"bar",
                orientation:"h"
            };

            var data = [trace1];
            Plotly.newPlot("bar",data);          
        });
}

function buildBubble() {
    d3.json("samples.json").then((data) => {
    console.log(data);
    var trace2 = {
    x: data.samples[0].otu_ids,
    y: data.samples[0].sample_values,
    mode: 'markers',
    marker: {
    size: data.samples[0].sample_values,
    color: data.samples[0].otu_ids,
    text:data.samples[0].otu_labels
    }
    };
    
    var data2 = [trace2];
    
    var layout = {
        showlegend: false,

    };
    
    Plotly.newPlot('bubble', data2, layout);
});
}

function buildInfo() {
    d3.json("samples.json").then((data) => {
        var id = data.metadata[0].id;
        var eth = data.metadata[0].ethnicity;
        var gender = data.metadata[0].gender;
        var age = data.metadata[0].age;
        var location = data.metadata[0].location;
        var bbtype= data.metadata[0].bbtype;
        var wfreq = data.metadata[0].wfreq;
    
        buildTable(id,eth,gender,age,location,bbtype,wfreq);
    });
}

        
function buildTable(id,eth,gender,age,location,bbtype,wfreq) {
    var table = d3.select("#sample-metadata").append("table");
    var tbody = table.append("tbody");
    var trow;

    
    trow = tbody.append("tr");
    trow.append("td").text(`id:${id}`);
    trow = tbody.append("tr");
    trow.append("td").text(`ethnicity:${eth}`);
    trow = tbody.append("tr");
    trow.append("td").text(`gender:${gender}`);
    trow = tbody.append("tr");
    trow.append("td").text(`age:${age}`);
    trow = tbody.append("tr");
    trow.append("td").text(`location:${location}`);
    trow = tbody.append("tr");
    trow.append("td").text(`bbtype:${bbtype}`);
    trow = tbody.append("tr");
    trow.append("td").text(`wfreq:${wfreq}`);

}

function buildGauge() {
    d3.json("samples.json").then((data) => {
        var data = [
            {
              domain: { x: [0, 1], y: [0, 1] },
              value: data.metadata[0].wfreq,
              title: { text: "Belly Button Washing Frequency" },
              type: "indicator",
              mode: "gauge",
              delta: { reference: 400 },
              gauge: { axis: { range: [0, 9] }}
            }
          ];
          
          var layout = { width: 600, height: 400 };
          Plotly.newPlot('gauge', data, layout);
    })
}
d3.json("samples.json").then((data) => {
    console.log(data);
    var idArray = data.samples.map(x=>x.id);
    console.log(idArray);

    var selectBody = d3.select("#selDataset");
    
    for(i=0;i<idArray.length;i++) {
        selectBody.append("option").text(idArray[i]);
    }
})

function init(){
    buildBar();
    buildBubble();
    buildInfo();
    buildGauge();
}



d3.selectAll("#selDataset").on("change",optionChanged);

function optionChanged() {
    d3.json("samples.json").then((data) => {
        var idArray = data.samples.map(x=>x.id);

        var dropdownMenu = d3.select("#selDataset");
        var selectedID = dropdownMenu.property("value");
        console.log(selectedID);
    
        for(i=0;i<idArray.length;i++){
            if (selectedID === idArray[i]) {
                var id = i;
            }
        }
        console.log(id);
        updateBar(id);
        updateBubble(id);
        updateInfo(id);
    });
}

function updateBar(newdata) {
    d3.json("samples.json").then((data) => {
        // console.log(data.samples[0]);
        // console.log(data.samples[0].sample_values.slice(0,10));
        // console.log(data.samples[0].otu_ids.slice(0,10));
        
        var trace1 = {
            x: data.samples[newdata].sample_values.slice(0,10).reverse(),
            y: data.samples[newdata].otu_ids.slice(0,10).map(x=>`OTU ${x}`).reverse(),
            text:data.samples[newdata].otu_labels.slice(0,10).reverse(),
            type:"bar",
            orientation:"h"
        };

        var data = [trace1];
        Plotly.newPlot("bar",data);          
    });
}

function updateBubble(newdata) {
    d3.json("samples.json").then((data) => {

        var trace2 = {
            x: data.samples[newdata].otu_ids,
            y: data.samples[newdata].sample_values,
            mode: 'markers',
            marker: {
            size: data.samples[newdata].sample_values,
            color: data.samples[newdata].otu_ids,
            text:data.samples[newdata].otu_labels
            }
        };
        
        var data2 = [trace2];
        
        var layout = {
            showlegend: false,
    
        };
        
        Plotly.newPlot('bubble', data2, layout);
    });
}

function updateInfo(newdata) {
    deletRows();
    d3.json("samples.json").then((data) => {
        var id = data.metadata[newdata].id;
        var eth = data.metadata[newdata].ethnicity;
        var gender = data.metadata[newdata].gender;
        var age = data.metadata[newdata].age;
        var location = data.metadata[newdata].location;
        var bbtype= data.metadata[newdata].bbtype;
        var wfreq = data.metadata[newdata].wfreq;
        
        
        buildTable(id,eth,gender,age,location,bbtype,wfreq);
    });
}

function deletRows() {
    var table = document.getElementsByTagName("tbody");
    while(table.rows.length > 0) {
        table.deleteRow(0);
      }
}

init();