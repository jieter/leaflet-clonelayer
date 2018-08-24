if (typeof window === 'undefined') {
    try {
        var L = require('leaflet-headless');
    } catch (e) {
        console.log(e);
        throw 'Package leaflet-headless needs to be installed: npm install leaflet-headless';
    }
    var chai = require('chai');
    require('chai-leaflet');

    var cloneLayer = require('../index.js');
}

/*
 * Clones `layer` and
 * - tests if the cloned layer is instanceof `expected_class`
 * - checks if _leaflet_id's are not the same.
 * - checks if options are the same.
 */
function testCloneLayer (expectedClass, layer) {
    var cloned = cloneLayer(layer);

    it('should clone to specified expectedClass', function () {
        cloned.should.be.an.instanceof(expectedClass);
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
    console.log(L.version);
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
        var options = {
            color: '#f00',
            fillColor: '#0f0',
            radius: 400
        };

        var layer = L.circle(latlng, options);
        var cloned = testCloneLayer(L.Circle, layer);

        it('should have the same latlng', function () {
            cloned.getLatLng().should.be.near(latlng);
        });
    });

    describe('L.CircleMarker', function () {
        var latlng = [52, 4];
        var radius = 400;
        var options = {
            color: '#f00',
            fillColor: '#0f0',
            radius: radius
        };

        var layer = L.circleMarker(latlng, options);
        var cloned = testCloneLayer(L.CircleMarker, layer);

        it('should have the same latlng', function () {
            cloned.getLatLng().should.be.near(latlng);
        });
    });

    describe('L.GeoJSON', function () {
        var geojson = JSON.parse(
            '{"type":"FeatureCollection","features":[' +
            '{"type":"Feature","properties":{"foo":"bar"},"geometry":{"type":"Point","coordinates":[2.636718,65.874724]}},' +
            '{"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[-14.765625,-3.864254]}},' +
            '{"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[4.746093,45.706179]}},' +
            '{"type":"Feature","properties":{},"geometry":{"type":"LineString","coordinates":[[-13.183593,46.437856],[-8.964843,49.837982],[-5.097656,43.834526],[-30.410156,38.272688],[-32.34375,55.875310],[-42.011718,54.977613],[-62.226562,30.751277]]}},' +
            '{"type":"Feature","properties":{},"geometry":{"type":"Polygon","coordinates":[[[-13.007812,12.039320],[-13.007812,39.368279],[16.523437,29.993002],[9.492187,12.039320],[-13.007812,12.039320]]]}}' +
            ']}'
        );

        var layer = L.geoJson(geojson);
        var cloned = testCloneLayer(L.GeoJSON, layer);

        it('should convert to equal geojson', function () {
            cloned.toGeoJSON().should.deep.equal(geojson);
        });
    });

    describe('L.LayerGroup', function () {
        var layer = L.layerGroup([L.marker([52, 4])]);
        var cloned = testCloneLayer(L.LayerGroup, layer);

        it('should contain a marker', function () {
            var inner = cloned.getLayers()[0];

            inner.should.be.an.instanceof(L.Marker);
            inner.getLatLng().lat.should.equal(52);
            inner.getLatLng().lng.should.equal(4);
        });
    });

    describe('L.FeatureGroup', function () {
        var layer = L.featureGroup([L.marker([52, 4])]);
        var cloned = testCloneLayer(L.FeatureGroup, layer);

        it('should contain a marker', function () {
            var inner = cloned.getLayers()[0];

            inner.should.be.an.instanceof(L.Marker);
            inner.getLatLng().lat.should.equal(52);
            inner.getLatLng().lng.should.equal(4);;
        });
    });


    // do not run the renderer tests in node. The renderers return null there.
    var IS_NODE = (typeof process !== 'undefined') && (typeof process.versions.node !== 'undefined');
    if (!IS_NODE) {
        describe('L.svg', function () {
            var layer = L.svg({padding: 2});
            var cloned = testCloneLayer(L.SVG, layer);

            it('should have the defined padding', function () {
                cloned.options.padding.should.equal(2);
            });
        });

        describe('L.canvas', function () {
            var layer = L.canvas({padding: 4});
            var cloned = testCloneLayer(L.Canvas, layer);

            it('should have the defined padding', function () {
                cloned.options.padding.should.equal(4);
            });
        });

        describe('L.Polyline with canvas renderer', function () {
            var latlngs = [[52, 4], [52, 5], [51, 5]];
            var layer = L.polyline(latlngs, {
                renderer: L.canvas({padding: 4})
            });

            var cloned = cloneLayer(layer);

            it('should have a cloned renderer', function () {
                L.stamp(layer.options.renderer).should.not.equal(
                    L.stamp(cloned.options.renderer)
                );
            });
            it('should have a renderer with the correct options', function () {
                cloned.options.renderer.options.padding.should.equal(4);
            });
        });
    }
});
