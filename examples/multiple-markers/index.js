$(function() {
    var center = { lat: 49.47216, lng: -123.77307 };
    var offsetCenter = function(dx, dy) {
        return { lat: center.lat + dx, lng: center.lng + dy };
    };
    var map = new google.maps.Map($('.map-canvas')[0], {
        zoom: 15,
        center: center,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    });
    var dx = 0.0015;
    var positions = [
        { type: 'top', LatLng: offsetCenter(dx, 0) },
        { type: 'right', LatLng: offsetCenter(0, dx) },
        { type: 'bottom', LatLng: offsetCenter(-dx, 0) },
        { type: 'left', LatLng: offsetCenter(0, -dx) }
    ];
    $.each(positions, function(i, e) {
        var marker = new google.maps.Marker({
            map: map,
            draggable: true,
            position: e.LatLng,
            visible: true
        });
        var info = new SnazzyInfoWindow($.extend({}, {
            marker: marker,
            position: e.type,
            content: e.type,
            panOnOpen: false
        }));
        info.open();
    });
});
