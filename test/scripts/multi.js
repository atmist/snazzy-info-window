$(function(){
	var center = {lat: 40.72, lng: -74};
    var offsetCenter = function(dx, dy){
    	return {lat: center.lat + dx, lng: center.lng + dy};
    };
    var map = new google.maps.Map($('.map-canvas')[0], {
        zoom: 14,
        center: center,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        clickableIcons: false
    });
    var dx = 0.003;
    var placements = [
        { type: 'top', LatLng: offsetCenter(dx, 0) },
        { type: 'right', LatLng: offsetCenter(0, dx) },
        { type: 'bottom', LatLng: offsetCenter(-dx, 0) },
        { type: 'left', LatLng: offsetCenter(0, -dx) }
    ];
    window.infos = [];
    $.each(placements, function(i, e){
        var marker = new google.maps.Marker({
            map: map,
            draggable: true,
            position: e.LatLng,
            visible: true
        });
        var info = new SnazzyInfoWindow($.extend({}, {
            marker: marker,
            placement: e.type,
            content: '<div><h1>Snazzy Info Windows</h1><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque ex ipsum, porta ut felis sit amet, porttitor laoreet neque. Maecenas vel lacinia quam. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque ex ipsum, porta ut felis sit amet, porttitor laoreet neque. Maecenas vel lacinia quam. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque ex ipsum, porta ut felis sit amet, porttitor laoreet neque. Maecenas vel lacinia quam.</p></div>',
            maxHeight: 200,
            maxWidth: 200,
            panOnOpen: false
        }));
        info.open();
        window.infos.push(info);
    });
});
