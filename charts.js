function getCharts(data){
    var tempData = []; //[['Date','Depth',column]];
    var tempPalette = [[0, "#042335"],[0.25, "#593c9b"],[0.5, "#be637b"],[0.75, "#f78d44"],[1, "#eaf557"]];
    var salData = [];
    var salPalette = [[0, "#2a1972"],[0.25, "#0d5791"],[0.5, "#3c9486"],[0.75, "#60be73"],[1, "#f8ec93"]];
    var densData = [];
    var densPalette = [[0, "#e2efef"],[0.25, "#7caee3"],[0.5, "#757ddc"],[0.75, "#723693"],[1, "#370e25"]];
    var oxyData = [];
    var oxyPalette = [[0, "#430505"],[0.24, "#8c1508"],[0.26, "#545353"],[0.5, "#9a9a99"],[0.74, "#ececeb"],[0.76, "#f3fb61"],[1, "#ddb11a"]];
    
    //0: "time"
    //1: "longitude"
    //2: "latitude"
    //3: "depth"
    //4: "temperature"
    //5: "salinity"
    //6: "density"
    //7: "oxy"

    data.forEach(function (row){
        var date = new Date (row[0]).getTime();
        var depth =  row[3];//depthList[i];
        var temp = row[4];//columnList[i];
        var sal = row[5];
        var dens = row[6];
        var oxy = row[7];
        var tempRow = [date,depth,temp];
        var salRow = [date,depth,sal];
        var densRow = [date,depth,dens];
        var oxyRow = [date,depth,oxy];
        tempData.push(tempRow);
        salData.push(salRow);
        densData.push(densRow);
        oxyData.push(oxyRow);
    }) 

    chart("Temperature", tempData,7,10, "(C)", tempPalette);
    chart("Salinity", salData, 33, 36, "(PSU)", salPalette);
    chart("Density", densData, 1026, 1028, "(d/m^3)", densPalette); 
    chart("Disolved Oxygen", oxyData, 250, 308, "(micromoles/kg)", oxyPalette); 
}

function chart(title, data, min, max, units, palette){
    Highcharts.chart(title, {
    
        chart: {
            type: 'heatmap',
            width: 640,
            height:480
            /*margin: [60, 50, 80, 100]*/
        },
    
        title: {
            text: 'Sea Water '+ title ,
            align: 'left',
            x: 40
        },
    
        subtitle: {
            text: '',
            align: 'left',
            x: 40
        },
    
        xAxis: {
            type: 'datetime',
            //min: 1527244478500,
            //max: 1528799894080,
            /*min: Date.UTC(2018, 05, 25),
            max: Date.UTC(2018, 16, 12 23, 59, 59),*/
            dateTimeLabelFormats: {
              day: "%e. %b",
              month: "%b '%y",
              year: "%Y"
            },
            /*labels: {
                align: 'left',
                x: 5,
                y: 14,
                format: '{value:%B}' // long month
            },*/
            showLastLabel: true,        
            tickLength: 16
        },
    
        yAxis: {
            title: {
                text: null
            },
            labels: {
                format: '{value}m'
            },
            minPadding: 0,
            maxPadding: 0,
            startOnTick: false,
            endOnTick: false,
            //tickPositions: [200, 400,600,800],
            tickWidth: 1,
            //min: 5,
            //max: 960,
            reversed: true
        },
    
        colorAxis: {
            stops: palette, 
            min: min,
            max: max,
            startOnTick: false,
            endOnTick: false,
            labels: {
                format: '{value}'
            },
             /*tickInterval: 2.5*/
        },
    
        series: [{
            data: data,
            boostThreshold: 100,
            borderWidth: 0,
            nullColor: '#EFEFEF',
            colsize: 24*36e5, // one day
            rowsize:3,
            tooltip: {
                headerFormat: title+'<br/>',
                pointFormat: '{point.x:%e %b, %Y} : <b>{point.value:.2f}'+units+'</b>'
            },
            turboThreshold: Number.MAX_VALUE // #3404, remove after 4.0.5 release
        }]
    
    });
}