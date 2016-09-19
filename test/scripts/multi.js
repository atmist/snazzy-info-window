require(['main_src/snazzy-info-window', 'jquery'], function(SnazzyInfoWindow, $){


    var icon = {
        path: "M40,40L0,40L0,0L40,0L40,40ZM38,2L2,2L2,38L38,38L38,2ZM13.085,28.316C14.188,28.316 15.085,29.212 15.085,30.316C15.085,31.42 14.188,32.316 13.085,32.316C11.981,32.316 11.085,31.42 11.085,30.316C11.085,29.212 11.981,28.316 13.085,28.316Z",
        fillColor: '#FF0000',
        fillOpacity: .6,
        anchor: new google.maps.Point(13,30),
        strokeWeight: 0,
        scale: 2
    };

    var icons = [
        $.extend({}, icon, {scale: 0.5}),
        $.extend({}, icon, {scale: 0.5}),
        $.extend({}, icon, {scale: 1}),
        $.extend({}, icon, {scale: 2})
    ];

    var infoSettings = [
        {
            position: 'top'
        },
        {
            position: 'bottom',
            pointer: {
                enabled: true,
                length: '50px'
            },
            backgroundColor: 'rgba(50, 50, 50, 1)',
            contentPadding: '5rem',
            borderRadius: '10px',
            border: 'black dotted 20px'
        },
        {
            position: 'left',
            wrapperClass: 'info-two',
            pointer: {
                enabled: true,
                length: '41.12398123     px'
            },
            backgroundColor: '#345345',
            contentPadding: '5em',
            borderRadius: '0',
            border: 'red solid'
        },
        {
            position: 'right',
            pointer: {
                enabled: true,
                length: '20pt'
            },
            backgroundColor: 'green',
            contentPadding: '100pt',
            borderRadius: '30pt',
            border: 'none'
        },
    ];

    for (var i = 0; i < $('.map-canvas').length; i++){
       var map = new google.maps.Map($('#map-canvas-' + (i + 1))[0], {
            zoom: 15,
            center: new google.maps.LatLng(49.47216, -123.77307),
            mapTypeId: google.maps.MapTypeId.ROADMAP
        });
        var marker = new google.maps.Marker({
            map: map,
            draggable: true,
            position: new google.maps.LatLng(49.47216, -123.77307),
            visible: true,
            //icon: icons[i]
        });
        var infowindow = new SnazzyInfoWindow($.extend({}, {
            content: 'Cookies',
            hasShadow: true
        }, infoSettings[i]));

        infowindow.attach(marker);
        infowindow.open();
    }
});
