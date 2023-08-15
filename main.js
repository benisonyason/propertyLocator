import "./style.css";
import { Map, Overlay, View } from "ol";
import LayerGroup from "ol/layer/Group";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import VectorImageLayer from "ol/layer/VectorImage";
import OSM from "ol/source/OSM";
import GeoJSON from "ol/format/GeoJSON.js";
import VectorSource from "ol/source/Vector";
import Style from "ol/style/Style";
import Fill from "ol/style/Fill";
import Stroke from "ol/style/Stroke";
import CircleStyle from "ol/style/Circle.js";


const container = document.getElementById('popup');
const content = document.getElementById('popup-name');
const contentArea = document.getElementById('popup-area');
const contentState = document.getElementById('popup-state');
const contentLat = document.getElementById('popup-lat');
const contentLon = document.getElementById('popup-lon');
const contentStatus = document.getElementById('popup-status');
const closer = document.getElementById('popup-closer');

/**
 * Create an overlay to anchor the popup to the map.
 */
const overlay = new Overlay({
  element: container,
  autoPan: {
    animation: {
      duration: 250,
    },
  },
});


closer.onclick = function () {
  overlay.setPosition(undefined);
  closer.blur();
  return false;
};

const map = new Map({
  target: "map",
  overlays: [overlay],
  view: new View({
    center: [863698.3136129358, 1037160.8248312974],
    zoom: 6.5,
    maxZoom: 16,
    minZoom: 4,
  }),
});



//layer groups
const openstreetMap = new TileLayer({
  source: new OSM(),
  title: "OSMMap",
  visible: true,
});

const openstreetMap2 = new TileLayer({
  source: new OSM(),
  title: "OSMMap2",
  visible: true,
});

const fillStyle = new Fill({
  color: [84, 118, 255, 0.1],
}),
strokeStyle = new Stroke({
  color: [46, 45, 45, 0.8],
}),
circleStyle = new CircleStyle({
  fill: new Fill({
    color: [245, 49, 5, 1],
  }),
  radius: 7,
  stroke: strokeStyle,
});

//vector layers
const myVectorLayerGeojson = new VectorImageLayer({
source: new VectorSource({
  url: "./data/vector/vectordata.geojson",
  format: new GeoJSON(),
}),
visible: true,
title: "VectorData",
style: new Style({
  fill: fillStyle,
  stroke: strokeStyle,
  image: circleStyle,
}),
});


const baseLayerGroup = new LayerGroup({
  layers: [openstreetMap, openstreetMap2],
});

map.addLayer(baseLayerGroup);
map.addLayer(myVectorLayerGeojson)

//layer switcher

const baseLayerElements = document.querySelectorAll(
  ".sidebar > input[type=radio]"
);

for (let baseLayerElement of baseLayerElements) {
  baseLayerElement.addEventListener("change", function () {
    let baseLayerElementValue = this.value;
    baseLayerGroup.getLayers().forEach(function (element, index, array) {
      let baseLayerTitle = element.get("title");
      element.setVisible(baseLayerTitle === baseLayerElementValue);
      // console.log('baseLayerTitle:' + baseLayerTitle, 'baseLayerElementValue:' + baseLayerElementValue);
      console.log(baseLayerTitle === baseLayerElementValue);
    });
  });
}


//my Vector Info Popup


const overlayFeatureName = document.getElementById('featureName');
const overlayFeatureArea = document.getElementById('featureArea');

map.on("singleclick", function (evt) {
  map.forEachFeatureAtPixel(evt.pixel, function (feature, layer) {
    let clickedCoordinates = evt.coordinate;

    let clickedFeatureName = feature.get("name");
    let clikedFeaturetype = feature.get("geometry");
    let clickedFeatureArea = feature.get("Area");
    let clickedFeatureState = feature.get("State");
    let clickedFeatureLat = feature.get("LAT");
    let clickedFeatureLon = feature.get("Lon");
    let clickedFeatureStatus = feature.get("Status");

      overlay.setPosition(clickedCoordinates);
      content.innerHTML = '<b>Name:</b> '+ clickedFeatureName;
      contentArea.innerHTML = '<b>Area:</b> '+clickedFeatureArea + 'm<sup>2</sup>';
      contentState.innerHTML = '<b>State:</b> '+ clickedFeatureState;
      contentLat.innerHTML = '<b>Lat:</b> '+ clickedFeatureLat;
      contentLon.innerHTML = '<b>Lon:</b> '+ clickedFeatureLon;
      contentStatus.innerHTML = '<b>Status:</b> '+ clickedFeatureStatus;

      // console.log(clickedFeatureStatus);
  


  });
});
