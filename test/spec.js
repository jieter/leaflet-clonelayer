if (typeof window === 'undefined') {
    try {
        var L = require('leaflet-headless');
    } catch (e) {
        throw 'Package leaflet-headless needs to be installed: npm install leaflet-headless';
    }
    var chai = require('chai');
    require('chai-leaflet');

    var cloneLayer = require('../index.js');
}

/*
 * Clones `layer` and
 * - tests if the cloned layer is instanceof `instance`
 * - checks if _leaflet_id's are not the same.
 * - checks if options are the same.
 */
function testCloneLayer (instance, layer) {
    var cloned = cloneLayer(layer);

    it('should clone to specified instance', function () {
        cloned.should.be.an.instanceof(instance);
    });
    it('should not have the same _leaflet_id', function () {
        L.stamp(layer).should.not.equal(L.stamp(cloned));
    });
    it('should have the same options', function () {
        layer.options.should.deep.equal(cloned.options);
    });

    return cloned;
}

/* globals describe: true, it: true */
describe('leaflet-cloneLayer', function () {
    chai.should();

    describe('L.TileLayer', function () {
        var url = 'http://example.com/layer/{z}/{x}/{y}.png';
        var options = {
            minZoom: 1,
            maxZoom: 18
        };
        var layer = L.tileLayer(url, options);
        var cloned = testCloneLayer(L.TileLayer, layer);

        it('should have the same url', function () {
            cloned._url.should.equal(url);
        });
    });

    describe('L.Marker', function () {
        var latlng = [52, 4];
        var options = {
            clickable: false
        };
        var layer = L.marker(latlng, options);
        var cloned = testCloneLayer(L.Marker, layer);

        it('should have the same latlng', function () {
            cloned.getLatLng().should.be.near(latlng);
        });
    });

    describe('L.PolyLine', function () {
        var latlngs = [[52, 4], [52, 5], [51, 5]];
        var options = {
            color: '#f00',
            fillColor: '#0f0'
        };

        var layer = L.polyline(latlngs, options);
        var cloned = testCloneLayer(L.Polyline, layer);

        it('should have the same latlngs', function () {
            cloned.getLatLngs().should.be.deep.equal(layer.getLatLngs());
        });
    });

    describe('L.Polygon', function () {
        var latlngs = [[52, 4], [52, 5], [51, 5]];
        var options = {
            color: '#f00',
            fillColor: '#0f0'
        };

        var layer = L.polygon(latlngs, options);
        var cloned = testCloneLayer(L.Polygon, layer);

        it('should have the same latlngs', function () {
            cloned.getLatLngs().should.be.deep.equal(layer.getLatLngs());
        });
    });

    describe('L.Rectangle', function () {
        var bounds = [[4, 51], [5, 52]];
        var options = {
            color: '#f00',
            fillColor: '#0f0'
        };

        var layer = L.rectangle(bounds, options);
        var cloned = testCloneLayer(L.Rectangle, layer);

        it('should have the same bounds', function () {
            cloned.getBounds().should.be.deep.equal(layer.getBounds());
        });
    });

    describe('L.Circle', function () {
        var latlng = [52, 4];
        var radius = 400;
        var options = {
            color: '#f00',
            fillColor: '#0f0'
        };

        var layer = L.circle(latlng, radius, options);
        var cloned = testCloneLayer(L.Circle, layer);

        it('should have the same latlng and radius', function () {
            cloned.getLatLng().should.be.near(latlng);
            cloned.getRadius().should.be.equal(radius);
        });
    });

    describe('L.GeoJSON', function () {
        var geojson = JSON.parse('{"type":"FeatureCollection","features":[{"type":"Feature","properties":{"foo":"bar"},"geometry":{"type":"Point","coordinates":[2.63671875,65.87472467098549]}},{"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[-14.765625,-3.864254615721396]}},{"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[4.74609375,45.706179285330855]}},{"type":"Feature","properties":{},"geometry":{"type":"LineString","coordinates":[[-13.18359375,46.437856895024225],[-8.96484375,49.83798245308484],[-5.09765625,43.83452678223684],[-30.41015625,38.272688535980976],[-32.34375,55.87531083569679],[-42.01171875,54.97761367069625],[-62.22656249999999,30.751277776257812]]}},{"type":"Feature","properties":{},"geometry":{"type":"Polygon","coordinates":[[[-13.0078125,12.039320557540584],[-13.0078125,39.36827914916014],[16.5234375,29.99300228455108],[9.4921875,12.039320557540584],[-13.0078125,12.039320557540584]]]}}]}');

        var layer = L.geoJson(geojson);
        var cloned = testCloneLayer(L.GeoJSON, layer);

        it('should convert to equal geojson', function () {
            cloned.toGeoJSON().should.deep.equal(geojson);
        });
    });


});
