if (typeof window === 'undefined') {
	try {
		var L = require('leaflet-headless');
	} catch(e) {
		throw 'Package leaflet-headless needs to be installed: npm install leaflet-headless';
	}
	var chai = require('chai');
	require('chai-leaflet');

	var cloneLayer = require('../index.js');
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
		var orig = L.tileLayer(url, options);
		var cloned = cloneLayer(orig);

		it('should be a L.TileLayer', function () {
			cloned.should.be.an.instanceof(L.TileLayer);
		});
		it('should have the same url and options', function () {
			cloned._url.should.equal(url);
			orig.options.should.deep.equal(cloned.options);
		});
		it('should not have the same _leaflet_id', function () {
			L.stamp(orig).should.not.equal(L.stamp(cloned));
		});
	});

	describe('L.Marker', function () {
		var latlng = [52, 4];
		var options = {
			clickable: false
		};
		var orig = L.marker(latlng, options);
		var cloned = cloneLayer(orig);

		it('should be a L.Marker', function () {
			cloned.should.be.an.instanceof(L.Marker);
		});
		it('should have the same latlng and options', function () {
			cloned._latlng.should.be.near(latlng);

			orig.options.should.deep.equal(cloned.options);
		});
		it('should not have the same _leaflet_id', function () {
			L.stamp(orig).should.not.equal(L.stamp(cloned));
		});
	});

	describe('L.PolyLine', function () {
		var latlngs = [[52, 4], [52, 5], [51, 5]];
		var options = {
			color: '#f00',
			fillColor: '#0f0'
		};

		var orig = L.polyline(latlngs, options);
		var cloned = cloneLayer(orig);

		it('should be a L.Polyline', function () {
			cloned.should.be.an.instanceof(L.Polyline);
		});
		it('should have the same latlngs and options', function () {
			cloned._latlngs.should.be.deep.equal(orig._latlngs);

			orig.options.should.deep.equal(cloned.options);
		});
		it('should not have the same _leaflet_id', function () {
			L.stamp(orig).should.not.equal(L.stamp(cloned));
		});
	});
});
