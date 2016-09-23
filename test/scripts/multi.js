require(['main_src/snazzy-info-window', 'jquery'], function(SnazzyInfoWindow, $){
    
    var settings = {
        content: '<div><h1>Snazzy Info Windows</h1><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque ex ipsum, porta ut felis sit amet, porttitor laoreet neque. Maecenas vel lacinia quam. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque ex ipsum, porta ut felis sit amet, porttitor laoreet neque. Maecenas vel lacinia quam. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque ex ipsum, porta ut felis sit amet, porttitor laoreet neque. Maecenas vel lacinia quam.</p></div>',
        //content: '<div>Test Test</div>',
        // wrapperClass: 'multi-info-window',
        // backgroundColor: 'black',
        // //padding: '40px',
        // //borderRadius: '2px 20px',
        // fontColor: '#eee',
        // fontSize: '16px',
        // pointer: '30px',
        // border: {
        //     width: '20px'
        // },
        // shadow: {
        //     h: '10px',
        //     v: '10px',
        //     opacity: 0.5,
        //     color: 'black'
        // }
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
