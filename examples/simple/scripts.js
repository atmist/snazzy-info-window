$(function() {
    var map = new google.maps.Map($('.map-canvas')[0], {
        zoom: 14,
        center: new google.maps.LatLng(40.72, -74)
    });
    var marker = new google.maps.Marker({
        map: map,
        position: new google.maps.LatLng(40.72, -74)
    });
    var info = new SnazzyInfoWindow({
        marker: marker,
        content: 'Your snazzy content.'
    });
    info.open();
});
