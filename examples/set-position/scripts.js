$(function() {
    var map = new google.maps.Map($('.map-canvas')[0], {
        zoom: 14,
        center: new google.maps.LatLng(40.72, -74),
        clickableIcons: false
    });
    var info = new SnazzyInfoWindow({
        map: map,
        position: new google.maps.LatLng(40.72, -74),
        closeOnMapClick: false,
        content: 'Click anywhere on the map to change my position!'
    });

    map.addListener('click', function(e) {
        info.setPosition(e.latLng);
        if (!info.isOpen()) {
            info.open();
        }
    });
    info.open();
});
