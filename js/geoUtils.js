function getLatLong(address) {
    var geo = new google.maps.Geocoder;
    if (address == null || address == 'undefined' || address == '') {
        return null;
    }
    geo.geocode({ 'address': address }, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            return results[0].geometry.location;
        } else {
            return null;
        }
    });
};

var styledMapType = {
    id: "style1",
    options: {
        name: "Style 1"
    },
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
};
function populateInfoWindow(mapContainer, infoWindow, marker, context) {
    var customerLocation = $('#location-customer-location').val();
    setInfoWindowWithDistance(mapContainer, infoWindow, marker, { "data": context.data, "id": context.id }, customerLocation);
}
function initMap(latLngValues, mapOptionsCenter) {
    $('#map-canvas').gmap3('destroy');
    var mapPbject = $("#map-canvas").gmap3();

    try {   
        mapPbject.gmap3({
            map: {
                options: {
                    center: mapOptionsCenter,
                    zoom: 11,
                    mapTypeControl: false,
                    navigationControl: false,
                    scrollwheel: false,
                    panControl: true,
                    streetViewControl: false,
                    mapTypeId: "style1"
                }
            },
            styledmaptype: styledMapType,
            marker: {
                values: latLngValues,
                options: {
                    icon: "../../../img/map-pin.png"
                },
                events: {
                    mouseover: function (marker, event, context) {

                        if (context == null || context == "undefined" || context.address != null) {
                            return;
                        }

                        var map = $(this).gmap3("get"),
                            infowindow = $(this).gmap3({ get: { name: "infowindow" } });

                        if (infowindow) {
                            infowindow.open(map, marker);
                        }
                    
                        populateInfoWindow($(this), infowindow, marker, context);
                    },
                }
            },
            autofit: { maxZoom: 14 }
        });
    } catch (ex) {

    }

    return mapPbject;
}