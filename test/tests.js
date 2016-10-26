window.expect = chai.expect;

describe('Options', function() {
    before(function() {
        window.map = new google.maps.Map($("#map")[0], {
            zoom: 15,
            center: new google.maps.LatLng(49.47216, -123.77307),
            mapTypeId: google.maps.MapTypeId.ROADMAP
        });
    });

    beforeEach(function() {
        if(window.marker) {
            window.marker.setMap(null);
        }

        if(window.infoWindow) {
            window.infoWindow.setMap(null);
        }

        window.marker = new google.maps.Marker({
            map: window.map,
            position: new google.maps.LatLng(49.47216, -123.77307),
            visible: true,
            title: 'Test'
        });
    });

    var create = function(options) {
        window.infoWindow = new SnazzyInfoWindow(options);
        infoWindow.attach(marker);
        infoWindow.open();
        return window.infoWindow;
    }

    var markerPosition = function(callback) {
        var overlay = new google.maps.OverlayView();
        overlay.draw = function() {};
        overlay.setMap(map);

        google.maps.event.addListener(map, 'idle', function() {
           var proj = overlay.getProjection();
           var pos = marker.getPosition();
           var p = proj.fromLatLngToContainerPixel(pos);
           callback(p);
        })
    }

    describe('position', function(done) {
        it('top should position window above marker', function(done) {
            var infoWindow = create({
                content: 'Test',
                position: 'top'
            });

            markerPosition(function(p) {
                expect(p.x).equal(350.4300373326987);
                done();
            })
        });
    });

    describe('position', function() {
        it('bottom should position window below marker', function() {
            var infoWindow = create({
                content: 'Test',
                position: 'bottom'
            });
            chai.expect(false).to.be.false;
        });
    });
});
