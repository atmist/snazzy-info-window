require(['main_src/snazzy-info-window', 'jquery'], function(SnazzyInfoWindow, $){

    var map = new google.maps.Map($("#map-canvas")[0], {
        zoom: 15,
        center: new google.maps.LatLng(49.47216, -123.76307),
        mapTypeId: google.maps.MapTypeId.ROADMAP
    });

});
