require(['main_src/snazzy-info-window', 'jquery'], function(SnazzyInfoWindow, $){

    var map = new google.maps.Map($("#map-canvas")[0], {
        zoom: 15,
        center: new google.maps.LatLng(49.47216, -123.77307),
        mapTypeId: google.maps.MapTypeId.ROADMAP
    });

    var icon = {
        path: "M20.719 4.641c0.375 0.375 0.375 1.031 0 1.406l-8.953 8.953-2.766-2.766 8.953-8.953c0.375-0.375 1.031-0.375 1.406 0zM6.984 14.016c1.641 0 3 1.359 3 3 0 2.203-1.781 3.984-3.984 3.984-1.5 0-3.047-0.797-3.984-2.016 0.844 0 1.969-0.656 1.969-1.969 0-1.641 1.359-3 3-3z",
        fillColor: '#FF0000',
        fillOpacity: .6,
        anchor: new google.maps.Point(4,20),
        strokeWeight: 0,
        scale: 2
    }

    var marker = new google.maps.Marker({
        map: map,
        draggable: true,
        position: new google.maps.LatLng(49.47216, -123.77307),
        visible: true
    });

    var infowindow = new SnazzyInfoWindow({
        content: 'Cookies',
        position: 'top', // top | left | bottom | right
        offset: {
            //top: '-40px'
        },
        hasShadow: true 
    });

    infowindow.attach(marker);
    infowindow.open();
});
