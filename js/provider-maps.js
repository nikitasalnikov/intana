
var geocoder;
var map;
var marker;
function setDefaultMapPosition(placePin) {
    if (typeof placePin === "undefined" || placePin === null) {
        placePin = false;
    }
    if (($('#Provider_Latitude').val() == "" && $('#Provider_Longitude').val() == "") || placePin) {
        var targetZoom = 3;
        var address1 = $('#Provider_Address_Line1').val();
        var cityName = $('#Provider_Address_City').val();
        var zipCode = $('#Provider_Address_ZipCode').val();
        var countryName = $("#Provider_CountryId option:selected").text();
        var searchString = "";
        if (address1 != "") { searchString += address1 + ", "; targetZoom = 10 }
        if (cityName != "") { searchString += cityName + ", "; targetZoom = 10 }
        if (zipCode != "") { searchString += zipCode + ", "; targetZoom = 10 }
        if (countryName != "") { searchString += countryName; }

        geocoder.geocode({ 'address': searchString }, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                map.setCenter(results[0].geometry.location);
                map.setZoom(targetZoom);
                if (placePin) {
                    if (marker) {
                        marker.setPosition(results[0].geometry.location);
                    }
                    else {
                        marker = new google.maps.Marker({
                            position: results[0].geometry.location,
                            map: map
                        });
                    }
                    $('#Provider_Latitude').val(results[0].geometry.location.lat());
                    $('#Provider_Longitude').val(results[0].geometry.location.lng());
                }
            } else {
                alert('Geocode was not successful for the following reason: ' + status);
            }
        });
    }
}

var getMapOptions = function (center, zoom) {

    return {
        center: center,
        zoom: zoom,
        streetViewControl: false,
        styles: [
        {
            "featureType": "landscape",
            "stylers": [
                {
                    "saturation": -100
                },
                {
                    "lightness": 65
                },
                {
                    "visibility": "on"
                }
            ]
        },
        {
            "featureType": "poi",
            "stylers": [
                {
                    "saturation": -100
                },
                {
                    "lightness": 51
                },
                {
                    "visibility": "simplified"
                }
            ]
        },
        {
            "featureType": "road.highway",
            "stylers": [
                {
                    "saturation": -100
                },
                {
                    "visibility": "simplified"
                }
            ]
        },
        {
            "featureType": "road.arterial",
            "stylers": [
                {
                    "saturation": -100
                },
                {
                    "lightness": 30
                },
                {
                    "visibility": "on"
                }
            ]
        },
        {
            "featureType": "road.local",
            "stylers": [
                {
                    "saturation": -100
                },
                {
                    "lightness": 40
                },
                {
                    "visibility": "on"
                }
            ]
        },
        {
            "featureType": "transit",
            "stylers": [
                {
                    "saturation": -100
                },
                {
                    "visibility": "simplified"
                }
            ]
        },
        {
            "featureType": "administrative.province",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "water",
            "elementType": "labels",
            "stylers": [
                {
                    "visibility": "on"
                },
                {
                    "lightness": -25
                },
                {
                    "saturation": -100
                }
            ]
        },
        {
            "featureType": "water",
            "elementType": "geometry",
            "stylers": [
                {
                    "hue": "#ffff00"
                },
                {
                    "lightness": -25
                },
                {
                    "saturation": -97
                }
            ]
        }
        ]
    }
}

$(document).ready(function ($) {
    initmap = function (center, zoom, placePinAtCenter) {
        geocoder = new google.maps.Geocoder();
        mapOptions = getMapOptions(center, zoom);
        map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
        if (placePinAtCenter) {
            if (marker) {
                marker.setPosition(center);
            }
            else {
                marker = new google.maps.Marker({
                    position: center,
                    map: map
                });
            }
        }
        google.maps.event.addListener(map, 'click', function (event) {
            $('#Provider_Latitude').val(event.latLng.lat());
            $('#Provider_Longitude').val(event.latLng.lng());
            if (marker) {
                marker.setPosition(event.latLng);
            }
            else {
                marker = new google.maps.Marker({
                    position: event.latLng,
                    map: map
                });
            }
        });
    }
    var lat, lng;
    var placePin = false;
    if ($('#Provider_Latitude').val() !== "") { lat = $('#Provider_Latitude').val(); placePin = true; } else { lat = 54.0 }
    if ($('#Provider_Longitude').val() !== "") { lng = $('#Provider_Longitude').val(); placePin = true; } else { lng = -1.4 }

    var center = new google.maps.LatLng(lat, lng);
    var zoom = 2;
    if (placePin) { zoom = 12; }
    initmap(center, zoom, placePin);


    $('#addressColumn .editor-field select').change(function () {
        setDefaultMapPosition(true);
    });
    $('#addressColumn .editor-field input:not(:checkbox)').change(function () { setDefaultMapPosition(false); });

    $("#map-auto-pin").click(function () { setDefaultMapPosition(true); });
});
