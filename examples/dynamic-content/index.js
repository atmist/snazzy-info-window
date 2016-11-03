$(function() {
    var map = new google.maps.Map($('.map-canvas')[0], {
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

    // Setup handle bars
    Handlebars.registerHelper('formatDate', function(date) {
        return date && date.toLocaleTimeString();
    });
    var template = Handlebars.compile($('#marker-content-template').html());

    var interval = null;
    var info = new SnazzyInfoWindow({
        marker: marker,
        position: 'top',
        maxWidth: 300,
        maxHeight: 400,
        callbacks: {
            beforeOpen: function() {
                this.setContent('loading...');
            },
            afterOpen: function() {
                var me = this;
                interval = setInterval(function() {
                    me.setContent(template({
                        date: new Date()
                    }));
                }, 1000);
            },
            afterClose: function() {
                if (interval) {
                    clearInterval(interval);
                }
            }
        }
    });
    info.open();
});
