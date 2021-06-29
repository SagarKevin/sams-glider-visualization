function fetchErrdapData(erddapURL, datasetID, columns, startDate, endDate){
    
    var columnList =  columns.join('%2C')

    var url = erddapURL+
              '/tabledap/'+
              datasetID+
              '.json?'+
              columnList+
              '&time%3E='+
              startDate+
              'T00%3A00%3A00Z'+
              '&time%3C='+
              endDate+
              'T00%3A00%3A00Z'
    
    var jsonData;

    console.log(url);

    $.ajax({
        async:false,
        url: url,
        datatype: "json",
        success: function(data) {
            jsonData = data.table.rows;
        }
    }).error(function() {
        console.log("Error Fetching Data!")
    })
    
    return jsonData;
}

function jsonToGeoJson(jsonData){
    
    var lineCoordinates = [],
        timeList = []

    //0: "time"
    //1: "longitude"
    //2: "latitude"
    //3: "depth"
    //4: "temperature"
    //5: "salinity"
    
    jsonData.forEach(function (row) {
        var time = '"'+row[0]+'"';
        timeList.push(time);
        var latLng = '['+row[1]+','+row[2]+']';
        lineCoordinates.push(latLng);
    })

    var geoJSON = '{"type": "Feature",'+
                '"properties": {'+
                '"name": "Glider Track",'+
                '"times":['+
                timeList+
                ']},'+
                '"geometry": {"type": "LineString",'+
                '"coordinates":['+
                lineCoordinates+
                ']}}'
    
    return JSON.parse(geoJSON);;
    
}
