require(['main_src/snazzy-info-window', 'jquery'], function(SnazzyInfoWindow, $){

    //Custom info settings per map
    var infoSettings = [
        {
            position: 'top'
        },
        {
            position: 'bottom'
        },
        {
            position: 'left'
        },
        {
            position: 'right'
        }
    ];
    for (var i = 0; i < infoSettings.length; i++){
       var map = new google.maps.Map($('#map-canvas-' + (i + 1))[0], {
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
        var infowindow = new SnazzyInfoWindow($.extend({}, {
            content: 'Cookies',
            hasShadow: true
        }, infoSettings[i]));

        infowindow.attach(marker);
        infowindow.open();
    }
});
