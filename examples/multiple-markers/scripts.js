$(function() {
    var center = { lat: 40.72, lng: -74 };
    var map = new google.maps.Map($('.map-canvas')[0], {
        zoom: 14,
        center: center
    });

    var offsetCenter = function(dx, dy) {
        return { lat: center.lat + dx, lng: center.lng + dy };
    };
    var dx = 0.003;
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
            position: e.LatLng
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
