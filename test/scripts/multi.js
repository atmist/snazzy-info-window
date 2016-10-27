$(function() {
    var settings = {
        content: '<div><h1>Snazzy Info Windows</h1><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque ex ipsum, porta ut felis sit amet, porttitor laoreet neque. Maecenas vel lacinia quam. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque ex ipsum, porta ut felis sit amet, porttitor laoreet neque. Maecenas vel lacinia quam. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque ex ipsum, porta ut felis sit amet, porttitor laoreet neque. Maecenas vel lacinia quam.</p></div>',
        //content: '<div>A</div>',
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
        maxHeight: '200px',
        maxWidth: '200px'
    };


    var centerLat = 49.47216;
    var centerLng = -123.77307;
    var dx = 0.003;
    var map = new google.maps.Map($('.map-canvas')[0], {
        zoom: 15,
        center: new google.maps.LatLng(centerLat, centerLng),
        mapTypeId: google.maps.MapTypeId.ROADMAP
    });

    var positions = [{
            type: 'top',
            LatLng: new google.maps.LatLng(centerLat + dx, centerLng)
        },{
            type: 'right',
            LatLng: new google.maps.LatLng(centerLat, centerLng + dx)
        },{
            type: 'bottom',
            LatLng: new google.maps.LatLng(centerLat - dx, centerLng)
        },{
            type: 'left',
            LatLng: new google.maps.LatLng(centerLat, centerLng - dx)
        }
    ];

    $.each(positions, function(i, e){
        var marker = new google.maps.Marker({
            map: map,
            draggable: true,
            position: e.LatLng,
            visible: true
        });
        var infowindow = new SnazzyInfoWindow($.extend({}, {
            marker: marker,
            position: e.type
        }, settings));

        infowindow.open();
    });
});
