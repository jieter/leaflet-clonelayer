function cloneLayer (layer) {
    var options = layer.options;

    // Tile layers
    if (layer instanceof L.TileLayer) {
        return L.tileLayer(layer._url, options);
    }
    if (layer instanceof L.ImageOverlay) {
        return L.imageOverlay(layer._url, layer._bounds, options);
    }

    // Marker layers
    if (layer instanceof L.Marker) {
        return L.marker(layer.getLatLng(), options);
    }
    if (layer instanceof L.circleMarker) {
        return L.circleMarker(layer.getLatLng(), options);
    }

    // Vector layers
    if (layer instanceof L.Rectangle) {
        return L.rectangle(layer.getBounds(), options);
    }
    if (layer instanceof L.Polygon) {
        return L.polygon(layer.getLatLngs(), options);
    }
    if (layer instanceof L.Polyline) {
        return L.polyline(layer.getLatLngs(), options);
    }
    // MultiPolyline is removed in leaflet 1.0.0
    if (L.MultiPolyline && layer instanceof L.MultiPolyline) {
        return L.polyline(layer.getLatLngs(), options);
    }
    // MultiPolygon is removed in leaflet 1.0.0
    if (L.MultiPolygon && layer instanceof L.MultiPolygon) {
        return L.multiPolygon(layer.getLatLngs(), options);
    }
    if (layer instanceof L.Circle) {
        return L.circle(layer.getLatLng(), layer.getRadius(), options);
    }
    if (layer instanceof L.GeoJSON) {
        return L.geoJson(layer.toGeoJSON(), options);
    }

    // layer/feature groups
    if (layer instanceof L.LayerGroup || layer instanceof L.FeatureGroup) {
        var layergroup = L.layerGroup();
        layer.eachLayer(function (inner) {
            layergroup.addLayer(cloneLayer(inner));
        });
        return layergroup;
    }

    throw 'Unknown layer, cannot clone this layer';
}

if (typeof exports === 'object') {
    module.exports = cloneLayer;
}
