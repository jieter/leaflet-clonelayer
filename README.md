# leaflet-clonelayer

Leaflet layer instances cannot be added to different maps in one javascript runtime.
`leaflet-clonelayer` clones layers to allow reuse.

## Example

```JavaScript
var cloneLayer = require('leaflet-clonelayer');

var layer = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map1);

var clonedLayer = cloneLayer(layer);
// Now we can safely add it to another map
cloneLayer.addTo(map2);
```

## Used in
 - https://github.com/jieter/Leaflet.layerscontrol-minimap
