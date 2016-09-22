require(['main_src/snazzy-info-window', 'jquery'], function(SnazzyInfoWindow, $){
    
    var settings = {
        content: '<div><b>Testing</b></div><div>Snazzy Maps</div>',
        wrapperClass: 'multi-info-window',
        offset: {
            left: '20px',
            top: '40px'
        },
        backgroundColor: 'black',
        padding: '40px',
        borderRadius: '2px 20px',
        fontColor: '#eee',
        fontSize: '20px',
        pointer: '30px',
        border: {
            width: '20px'
        },
        shadow: {
            h: '10px',
            v: '10px',
            opacity: 0.5,
            color: 'black'
        }
    };

    $.each($('.map-canvas'), function(i, e){
        var map = new google.maps.Map(e, {
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
            position: $(e).data('position')
        }, settings));

        infowindow.attach(marker);
        infowindow.open();

    });
});
