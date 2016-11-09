$(function() {
    var map = new google.maps.Map($('.map-canvas')[0], {
        zoom: 14,
        center: new google.maps.LatLng(40.72, -74)
    });
    var marker = new google.maps.Marker({
        map: map,
        position: new google.maps.LatLng(40.72, -74),
        draggable: true
    });

    // Setup handle bars
    Handlebars.registerHelper('formatDate', function(date) {
        return date && date.toLocaleTimeString();
    });
    var template = Handlebars.compile($('#marker-content-template').html());

    var interval = null;
    var info = new SnazzyInfoWindow({
        marker: marker,
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
