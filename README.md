# leaflet-clonelayer

Leaflet layer instances cannot be added to different maps in one javascript runtime.
`leaflet-clonelayer` clones layers to allow reuse.

## Example

```JavaScript
var cloneLayer = require('leaflet-clonelayer');

var layer = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map1);
console.log(L.stamp(layer));  // 1

var cloned = cloneLayer(layer);
console.log(L.stamp(cloned));  // 2

// Different _leaflet_id, so now we can safely add it to another map
cloned.addTo(map2);
```

## Used in
 - https://github.com/jieter/Leaflet.layerscontrol-minimap
