$(function() {
    var map = new google.maps.Map($(".map-canvas")[0], {
        zoom: 14,
        center: new google.maps.LatLng(40.72, -74),
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        clickableIcons: false
    });

    var marker = new google.maps.Marker({
        map: map,
        draggable: true,
        position: new google.maps.LatLng(40.72, -74),
        visible: true
    });

    var infowindow = new SnazzyInfoWindow({
        marker: marker,
        placement: 'top',
        //content: 'Testing',
        content: '<div><h1>Snazzy Info Windows</h1><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque ex ipsum, porta ut felis sit amet, porttitor laoreet neque. Maecenas vel lacinia quam. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque ex ipsum, porta ut felis sit amet, porttitor laoreet neque. Maecenas vel lacinia quam. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque ex ipsum, porta ut felis sit amet, porttitor laoreet neque. Maecenas vel lacinia quam.</p></div>',
        maxWidth: 400,
        maxHeight: 200
    });

    window.info = infowindow;
    info.open();
});
