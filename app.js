function buildBar(){
    d3.json("data/samples.json").then((incomingData) => {
            // console.log(data.samples[0]);
            // console.log(data.samples[0].sample_values.slice(0,10));
            // console.log(data.samples[0].otu_ids.slice(0,10));
            var data = incomingData;
            console.log(data);
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
    d3.json("data/samples.json").then((incomingData) => {
    var data = incomingData;
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
    d3.json("data/samples.json").then((incomingData) => {
        var data = incomingData;
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
    deletRows();
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
    
    
// Trig to calc meter point
    function gaugePointer(value){
	
	    var degrees = 180 - value,
	     radius = .5;
        var radians = degrees * Math.PI / 180;
        var x = radius * Math.cos(radians);
        var y = radius * Math.sin(radians);


// Path: may have to change to create a better triangle
        var mainPath = 'M -.0 -0.035 L .0 0.035 L ',
            pathX = String(x),
            space = ' ',
            pathY = String(y),
            pathEnd = ' Z';
        var path = mainPath.concat(pathX,space,pathY,pathEnd);
            
            return path;

        }
    d3.json("data/samples.json").then((incomingData) => {
        var level = incomingData.metadata[0].wfreq*20;
        var data = [
                    { 
                    type: 'scatter',
                    x: [0], y:[0],
                    marker: {size: 18, color:'850000'},
                    showlegend: false,
                    name: 'Scrub per Week',
                    text: level,
                    hoverinfo: 'name'
                    },
                    {values: [50/9,50/9,50/9,50/9,50/9,50/9,50/9,50/9,50/9,50],
                    rotation: 90,
                    text: ['8-9', '7-8', '6-7', '5-6',
                            '4-5', '3-4', '2-3','1-2','0-1',''],
                    textinfo: 'text',
                    textposition:'inside',	  
                    marker: {colors:['rgba(22,212,141, .5)', 'rgba(44,215,117, .5)',
                                        'rgba(68,218,101, .5)', 'rgba(92,221,94, .5)',
                                        'rgba(136,224,116, .5)', 'rgba(175,227,142, .5)',
                                        'rgba(205,230,168, .5)','rgba(225,233,194, .5)','rgba(237, 237, 222, .5)',
                                        'rgba(255, 255, 255, 0)']},
                    labels: ['8-9', '7-8', '6-7', '5-6',
                    '4-5', '3-4', '2-3','1-2','0-1',''],
                    hoverinfo: 'label',
                    hole: .5,
                    type: 'pie',
                    showlegend: false
                    }
                    ];

        var layout = {
                        shapes:[{
                        type: 'path',
                        path: gaugePointer(level),
                        fillcolor: '850000',
                        line: {
                            color: '850000'
                              }
                         }],
                        title: '<b>Belly Button Washing Frequency</b> <br> Scrubs per Week',
                        autosize:true,
        //height: 1000,
        //width: 1000,
                        xaxis: {zeroline:false, showticklabels:false,
                                    showgrid: false, range: [-1, 1]},
                        yaxis: {zeroline:false, showticklabels:false,
                                showgrid: false, range: [-1, 1]}
                    };


        Plotly.newPlot('gauge', data, layout);
    })
}
d3.json("data/samples.json").then((incomingData) => {
    var data = incomingData;
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
    d3.json("data/samples.json").then((incomingData) => {
        var data = incomingData;
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
        updateGauge(id);
    });
}

function updateBar(newdata) {
    d3.json("data/samples.json").then((incomingData) => {
        var data = incomingData;
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
    d3.json("data/samples.json").then((incomingData) => {
        var data = incomingData;

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
    
    d3.json("data/samples.json").then((incomingData) => {
        var data = incomingData;
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
    var table = d3.select("#sample-metadata");
    table.html("");
}

function updateGauge(newdata) {
    // Trig to calc meter point
    function gaugePointer(value){
	
	    var degrees = 180 - value,
	     radius = .5;
        var radians = degrees * Math.PI / 180;
        var x = radius * Math.cos(radians);
        var y = radius * Math.sin(radians);


// Path: may have to change to create a better triangle
        var mainPath = 'M -.0 -0.035 L .0 0.035 L ',
            pathX = String(x),
            space = ' ',
            pathY = String(y),
            pathEnd = ' Z';
        var path = mainPath.concat(pathX,space,pathY,pathEnd);
            
            return path;

        }
    d3.json("data/samples.json").then((incomingData) => {
        var level = incomingData.metadata[newdata].wfreq*20;
        var data = [
                    { 
                    type: 'scatter',
                    x: [0], y:[0],
                    marker: {size: 18, color:'850000'},
                    showlegend: false,
                    name: 'Scrub per Week',
                    text: level,
                    hoverinfo: 'name'
                    },
                    {values: [50/9,50/9,50/9,50/9,50/9,50/9,50/9,50/9,50/9,50],
                    rotation: 90,
                    text: ['8-9', '7-8', '6-7', '5-6',
                            '4-5', '3-4', '2-3','1-2','0-1',''],
                    textinfo: 'text',
                    textposition:'inside',	  
                    marker: {colors:['rgba(22,212,141, .5)', 'rgba(44,215,117, .5)',
                                        'rgba(68,218,101, .5)', 'rgba(92,221,94, .5)',
                                        'rgba(136,224,116, .5)', 'rgba(175,227,142, .5)',
                                        'rgba(205,230,168, .5)','rgba(225,233,194, .5)','rgba(237, 237, 222, .5)',
                                        'rgba(255, 255, 255, 0)']},
                    labels: ['8-9', '7-8', '6-7', '5-6',
                    '4-5', '3-4', '2-3','1-2','0-1',''],
                    hoverinfo: 'label',
                    hole: .5,
                    type: 'pie',
                    showlegend: false
                    },
                    
                    ];

        var layout = {
                        shapes:[{
                        type: 'path',
                        path: gaugePointer(level),
                        fillcolor: '850000',
                        line: {
                            color: '850000'
                              }
                         }],
                        title: '<b>Belly Button Washing Frequency</b> <br> Scrubs per Week',
                        autosize:true,
                        // height: 1000,
                        // width: 1000,
                        xaxis: {zeroline:false, showticklabels:false,
                                    showgrid: false, range: [-1, 1]},
                        yaxis: {zeroline:false, showticklabels:false,
                                showgrid: false, range: [-1, 1]}
                    };


        Plotly.newPlot('gauge', data, layout);
    })
}


init();