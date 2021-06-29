var erddapURL = 'https://erddap.digitalocean.ie/erddap';
var datasetID = 'sams_p545_rem';
var columns = ['time', 'longitude', 'latitude', 'depth', 'temperature', 'salinity', 'density', 'aanderaa4330_dissolved_oxygen']
var startDate = '2021-03-03';
var endDate = '2021-04-01';

var fullData = fetchErrdapData(erddapURL, datasetID, columns, startDate, endDate);

var mymap;

function filterData (data, startDate, endDate) {
    var sd = new Date(startDate);
    var ed = new Date(endDate);  
    
    var filteredData  = []
    data.forEach(function (row) {
        var rowDate = new Date(row[0]);
        if (rowDate >= sd && rowDate <= ed){
            filteredData.push(row);
        }
    });

    return filteredData;
}

$(function() {
    $('input[name="daterange"]').daterangepicker({
        "startDate": "03/03/2021",
        "endDate": "04/01/2021",
        "minDate": "03/03/2021",
        "maxDate": "04/01/2021",
        "drops": "up"
    }, function(start, end) {
        console.log('New date range selected: ' + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD'));
        var sd = start.format('YYYY-MM-DD');
        var ed = end.format('YYYY-MM-DD');
        var fData = filterData (fullData,sd,ed);

        var fJsonData = jsonToGeoJson(fData);
        geoJSONLayer.clearLayers();
        geoJSONLayer.addData(fJsonData).addTo(mymap);

        console.log(fJsonData.properties.times);

        var timeInterval = fJsonData.properties.times.map(function(d){return new Date(d)});//timeRange.filter(a => a > startDate && a < endDate);

        //console.log(timeInterval);
        mymap.timeDimension.setAvailableTimes(timeInterval, 'replace');
        mymap.timeDimension.setCurrentTime(startDate);
        getCharts(fData);
    });
  });


mymap = L.map('map', {
    zoom: 8,
    center: [56.192953, -7.643738],
    fullscreenControl: true,
    timeDimension: true,
    timeDimensionOptions: {
        period: "PT5M"
    },
    timeDimensionControl:true,
    timeDimensionControlOptions: {
        position:      'bottomleft',
        autoPlay:      true,
        minSpeed:      1,
        speedStep:     6,
        maxSpeed:      15,
        timeSliderDragUpdate: true,
        playerOptions: {
            transitionTime: 100, 
            loop: false,
            startOver:true
        }
    }
});

var Esri_WorldImagery = L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}",
        {
        attribution:
            "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, " +
            "AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
        }).addTo(mymap);

var geoJsonData = jsonToGeoJson(fullData);

var icon = L.icon({
    iconUrl: 'glider.png',
    iconSize: [40, 40],
    iconAnchor: [11, 11]
});

var geoJSONLayer = L.geoJSON(geoJsonData, {
    pointToLayer: function (feature, latLng) {
        if (feature.properties.hasOwnProperty('last')) {
            return new L.Marker(latLng, {
                icon: icon
            });
        }
        return L.circleMarker(latLng);
    }
}); 

var geoJSONTDLayer = L.timeDimension.layer.geoJson(geoJSONLayer, {
    updateTimeDimension: true,
    addlastPoint: true,
    waitForReady: true
});

geoJSONLayer.addTo(mymap);
geoJSONTDLayer.addTo(mymap);

getCharts(fullData);

