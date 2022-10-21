
var _isDistanceArrayInitialized = false;

var drivingDurations = {}; // Holds distance and durations for drive mode.
var walkDurations = {}; // Holds distance and durations for walk mode.
var bicycleDurations = {}; // Holds distance and durations for bicycle mode.
var googleLatLng = [];
var origins = [];
var service = null; // Holds reference to google's DistanceMatrixService.
// var drivingIndex = 0,bicycleIndex = 0,walkIndex = 0;
var driveCallbackRec = false, walkCallbackRec = false, bicycleCallbackRec = false; // All will be set to true when response received for one origing and one destination.
var isCalForExtraElement = false;
var infoItems; // Current Provider info such as title and address.
var _infoWindow; // Info window object.
var _mapContainer, _marker;
var _providerId; // Current provider's id.

function calculateDistanceDurationForSingleProider(providerId, origin, destination) {
    isCalForExtraElement = true; // Distance/duration not calculated for this provider.
    driveCallbackRec = walkCallbackRec = bicycleCallbackRec = false; // Will be set to true in respective call back functions.
    _providerId = providerId;
    // alert("info: " + providerId + ", origin: " + origin + "dest: " + destination[0] + ",dest: " + destination[1]);
    var googleLatLng = [new google.maps.LatLng(destination[0], destination[1])]; // Initialize google LatLng.
    calculateDistanceDuration(service, google.maps.TravelMode.DRIVING, [origin], googleLatLng, drivingCallback); // Drive mode.
    calculateDistanceDuration(service, google.maps.TravelMode.WALKING, [origin], googleLatLng, walkingCallback); // Walk mode.
    calculateDistanceDuration(service, google.maps.TravelMode.BICYCLING, [origin], googleLatLng, bicycleCallback); // Bicycle mode.
}

function getDistanceDuration(id, latLng, customerLocation) {
    var durations = [];
    var distance = {};
    if (drivingDurations[id] == null && walkDurations[id] == null && bicycleDurations[id] == null) {
        calculateDistanceDurationForSingleProider([id], customerLocation, latLng);
        return null;
    } else {

        if (drivingDurations[id] == "undefined" || drivingDurations[id] == null) {
            durations.push({ "value": "NA", "text": "NA" });
        } else {
            durations.push(drivingDurations[id].durations);
        }
        if (walkDurations[id] == "undefined" || walkDurations[id] == null) {
            durations.push({ "value": "NA", "text": "NA" });
        } else {
            durations.push(walkDurations[id].durations);
            distance = walkDurations[id].distance;
        }
        if (bicycleDurations[id] == "undefined" || bicycleDurations[id] == null) {
            durations.push({ "value": "NA", "text": "NA" });
        } else {
            durations.push(bicycleDurations[id].durations);
        }

        return { "distance": distance, "durations": durations };
    }
}

function getInfoWindowContentString(title, address, distance, durations) {

    var carDuration = "NA";
    var bicycleDuration = "NA";
    var walkDuration = "NA";
    var distanceInMiles = "NA";
    var disatnceInKmsText = "NA";
    if (durations[0] != null && durations[0] != "undefined") {
        carDuration = durations[0].text;
    }

    if (durations[1] != null && durations[1] != "undefined") {
        walkDuration = durations[1].text;
    }

    if (durations[2] != null && durations[2] != "undefined") {
        bicycleDuration = durations[2].text;
    }
    
    if (distance != null && distance != "undefined" && distance.value != "NA") {
        distanceInMiles = distance.text;
        if (!isNaN(distance.value)) {
            var distanceInKms = Math.round(distance.value * 0.001);
            disatnceInKmsText = distanceInKms.toLocaleString() + " km";
        }
    }
    
    var contentString = '<div class="map-info-window">' +
        '<div id="bodyContent">' +
        '<p class="map-info-title">' + title + '</p>' +
      '<p style="text-align:center;">' + address + '</p>' +
      '</div>' +
      '<div>' +
      '<div style="float: left;height:75px;width: 62%;padding:2px;">' +
      '<p> <img src="/img/map/car.png" alt="" style="height:15px;width:15px">&nbsp;' + carDuration + '</p>' +
      '<p> <img src="/img/map/bike.png" alt="" style="height:15px;width:15px">&nbsp;' + bicycleDuration + '</p>' +
      '<p> <img src="/img/map/walk.png" alt="" style="height:15px;width:15px">&nbsp;' + walkDuration + '</p>' +
      '</div>' +
      '<div class="map-info-window-right-col">&nbsp;<span style="height:30px">' + distanceInMiles + '</span><br/>&nbsp;<span style="height:30px">' + disatnceInKmsText + '</span></div></div>' +
      '</div>';

    return contentString;
}

function getInfoWindow(title, address) {
    if (address == "undefined" || address == null) {
        address = "";
    }
    var contentString = '<div class="map-info-window">' +
        '<div id="bodyContent">' +
        '<p class="map-info-title">' + title + '</p>' +
      '<p style="text-align:center;">' + address + '</p>' +
      '</div>' +
      '</div>';

    return contentString;
}

function handleResults(resDurations, distance, duration, identifier) {
    
    if (isCalForExtraElement) {
        resDurations[identifier] = { distance: distance, durations: duration };
        if (driveCallbackRec && walkCallbackRec && bicycleCallbackRec) {
            
            var distanceDuration = getDistanceDuration(identifier);
            if (distanceDuration != null) {
                var contentString = getInfoWindowContentString(infoItems[0], infoItems[1], distanceDuration.distance, distanceDuration.durations);
                setInfoWindow(_infoWindow, _mapContainer, contentString);
            }
        }
    } else {
        resDurations[identifier] = { distance: distance, durations: duration };
    }
}

function handleCallbackResoinse(origins, destinations, response, resultDurations) {

    var distance = 'NA'; // TEX
    var duration = { "value": "NA", "text": "NA" }; // DURATION OBJECT.

    for (var i = 0; i < origins.length; i++) {
        var results = response.rows[i].elements;
        var identifier = "";

        if (isCalForExtraElement) {
            identifier = _providerId;
        }

        for (var j = 0; j < results.length; j++) {
            var element = results[j];

            // SAMPLE ELE<MENT: "duration": {"value": 44476,"text": "12 hours 21 mins"},"distance": {"value": 1262780,"text": "785 mi"}
            if (element.status == "OK") {
                distance = element.distance;
                duration = element.duration; // DURATION OBJECT.
            } else {
                console.log(element.status + "=> Origin: " + origins[0] + ", Destination:" + destinations[j]);
                distance = { "value": "NA", "text": "NA" };
                duration = { "value": "NA", "text": "NA" }; // DURATION OBJECT.
            }

            if (identifier == "" || isCalForExtraElement==false) {
                identifier = _providers[j];
            }

            handleResults(resultDurations, distance, duration, identifier);

        }

    }
}

function drivingCallback(response, status) {
    if (isCalForExtraElement) {
        driveCallbackRec = true;
    }
    if (status != google.maps.DistanceMatrixStatus.OK) {
        console.log('Error was: ' + status);
    }
    else if (status == google.maps.DistanceMatrixStatus.OK) {
        var origins = response.originAddresses;
        var destinations = response.destinationAddresses;
        handleCallbackResoinse(origins, destinations, response, drivingDurations);
    }
}

function walkingCallback(response, status) {

    if (isCalForExtraElement) {
        walkCallbackRec = true;
    }
    if (status != google.maps.DistanceMatrixStatus.OK) {
        console.log('Error was: ' + status);
    }
    else if (status == google.maps.DistanceMatrixStatus.OK) {
        var origins = response.originAddresses;
        var destinations = response.destinationAddresses;
        handleCallbackResoinse(origins, destinations, response, walkDurations);
    }
}

function bicycleCallback(response, status) {
    if (isCalForExtraElement) {
        bicycleCallbackRec = true;
    }
    if (status != google.maps.DistanceMatrixStatus.OK) {
        console.log('Error was: ' + status);
    }
    else if (status == google.maps.DistanceMatrixStatus.OK) {
        var origins = response.originAddresses;
        var destinations = response.destinationAddresses;
        handleCallbackResoinse(origins, destinations, response, bicycleDurations);
    }
}

var _providers = [];

function calculateDistanceDuration(service, travelMode, origins, destinations, callback) {

    service.getDistanceMatrix({
        origins: origins,
        destinations: destinations,
        travelMode: travelMode,
        unitSystem: google.maps.UnitSystem.IMPERIAL,   // METRIC : KM
        avoidHighways: false,
        avoidTolls: false
    }, callback);

}

function calculateDistances(providerIds, customerLocation, destinations) {
    
    if (customerLocation == "" || customerLocation == "undefined" || customerLocation == null) {
        return; // NO CUSTOMER LOCATION. NO NEED TO CALCULATE DISTANCE.
    }
    isCalForExtraElement = false;
    _isDistanceArrayInitialized = false; // Will be used while setting duration with travel mode set to Walking.
    origins.push(customerLocation);

    var itemCount = 0;
    var index = 0;
    for (var i = 0; i < destinations.length; i++) {

        if (itemCount == 0) {
            googleLatLng[index] = new Array();
        }
        googleLatLng[index][itemCount] = new google.maps.LatLng(destinations[i][0], destinations[i][1]);
        itemCount++;
        if (itemCount > 24) {
            itemCount = 0;
            index = index + 1;
        }
    }
    _providers = providerIds;

    //for (var j = 0; j < googleLatLng.length; j++) {
    var googleLatLngItems = googleLatLng[0];
    service = new google.maps.DistanceMatrixService();
    calculateDistanceDuration(service, google.maps.TravelMode.DRIVING, origins, googleLatLngItems, drivingCallback);
    calculateDistanceDuration(service, google.maps.TravelMode.WALKING, origins, googleLatLngItems, walkingCallback);
    calculateDistanceDuration(service, google.maps.TravelMode.BICYCLING, origins, googleLatLngItems, bicycleCallback);
    //}
}

function setInfoWindow(infoWindow, mapContainer, contentString) {
    if (infoWindow) {
        infoWindow.setContent(contentString);
    } else {
        mapContainer.gmap3({
            infowindow: {
                anchor: _marker,
                options: { content: contentString }
            }
        });
    }
}

function setInfoWindowWithDistance(mapContainer, infoWindow, marker, context, customerLocation) {

    var contentString = "";
    infoItems = context.data.split("||");
    isCalForExtraElement = false; // Assuming distance/duration already calculated for the current provider.
    _infoWindow = infoWindow;
    _mapContainer = mapContainer;
    _marker = marker;
    
    if (customerLocation == "" || customerLocation == "undefined" || customerLocation == null || isNaN(context.id)) {
        contentString = getInfoWindow(infoItems[0], infoItems[1]);
        setInfoWindow(_infoWindow, mapContainer, contentString);
    } else {
        var latLng = marker.position;
        var distanceDuration = getDistanceDuration(context.id, [latLng.lat(), latLng.lng()], customerLocation);
        if (distanceDuration != null) {
            contentString = getInfoWindowContentString(infoItems[0], infoItems[1], distanceDuration.distance, distanceDuration.durations);
            setInfoWindow(_infoWindow, mapContainer, contentString);
        }
    }
}


