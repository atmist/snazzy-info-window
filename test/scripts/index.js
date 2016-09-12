require(['main_src/snazzy-info-window', 'jquery'], function(SnazzyInfoWindow, $){

    var map = new google.maps.Map($("#map-canvas")[0], {
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
    var infowindow = new SnazzyInfoWindow({
        content: 'cookies'
    });
    infowindow.attach(marker);
    infowindow.open();
});
