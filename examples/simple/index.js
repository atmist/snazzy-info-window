$(function() {
    var map = new google.maps.Map($('.map-canvas')[0], {
        zoom: 15,
        center: new google.maps.LatLng(49.47216, -123.77307),
        mapTypeId: google.maps.MapTypeId.ROADMAP
    });
    var marker = new google.maps.Marker({
        map: map,
        draggable: true,
        position: new google.maps.LatLng(49.47216, -123.77307),
        visible: true
    });
    var info = new SnazzyInfoWindow({
        marker: marker,
        position: 'top',
        content: 'Your content goes here',
        maxWidth: 200,
        maxHeight: 200
    });
    info.open();
});
