$(function() {
    // Snazzy Map Style - https://snazzymaps.com/style/6618/cladme
    var mapStyle = [{'featureType': 'administrative', 'elementType': 'labels.text.fill', 'stylers': [{'color': '#444444'}]}, {'featureType': 'landscape', 'elementType': 'all', 'stylers': [{'color': '#f2f2f2'}]}, {'featureType': 'poi', 'elementType': 'all', 'stylers': [{'visibility': 'off'}]}, {'featureType': 'road', 'elementType': 'all', 'stylers': [{'saturation': -100}, {'lightness': 45}]}, {'featureType': 'road.highway', 'elementType': 'all', 'stylers': [{'visibility': 'simplified'}]}, {'featureType': 'road.arterial', 'elementType': 'labels.icon', 'stylers': [{'visibility': 'off'}]}, {'featureType': 'transit', 'elementType': 'all', 'stylers': [{'visibility': 'off'}]}, {'featureType': 'water', 'elementType': 'all', 'stylers': [{'color': '#4f595d'}, {'visibility': 'on'}]}];

    // Create the map
    var map = new google.maps.Map($('.map-canvas')[0], {
        zoom: 14,
        styles: mapStyle,
        center: new google.maps.LatLng(40.72, -74)
    });

    // Add a marker
    var marker = new google.maps.Marker({
        map: map,
        position: new google.maps.LatLng(40.72, -74)
    });

    // Add a Snazzy Info Window to the marker
    var info = new SnazzyInfoWindow({
        marker: marker,
        content: '<h1>Styling with SCSS</h1>' +
                 '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce id urna eu sem fringilla ultrices.</p>' +
                 '<hr>' +
                 '<em>Snazzy Info Window</em>',
        closeOnMapClick: false
    });
    info.open();
});
