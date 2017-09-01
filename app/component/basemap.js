// import '../common/css/Control.Geocoder.css';
// import 'leaflet-control-geocoder';
import L from 'leaflet';
import "../common/css/Control.OSMGeocoder.css";
import "../common/leaflet-plugin/Control.OSMGeocoder.js";
import MiniMap from 'leaflet-minimap';
import $ from 'jquery';



let map = L.map('map',{
	crs:L.CRS.EPSG3857, //默认墨卡托投影 ESPG：3857
    attributionControl: false
}).setView([30, 104], 5); 
let osm = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {});
osm.addTo(map);
L.control.scale().addTo(map); //比例尺
let osm2 = new L.TileLayer(
    'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
    {
        minZoom: 0,
        maxZoom: 13
    });
new MiniMap(osm2, { toggleDisplay: true }).addTo(map);//小地图
let editableLayers = new L.FeatureGroup();
let drawnItems = editableLayers.addTo(map);
let osmGeocoder = new L.Control.OSMGeocoder({
    collapsed: false,
    position: 'topright',
    text: 'Search',
});
let attribution = L.control.attribution();
attribution.setPrefix('中心地址');
attribution.addAttribution(map.getCenter());
attribution.addTo(map);
let old_center = map.getCenter();
map.on('zoom',function (e) {
    attribution.removeAttribution(old_center);
    attribution.addAttribution(map.getCenter());
    old_center = map.getCenter();
    attribution.addTo(map);
});
map.on('move',function (e) {
    attribution.removeAttribution(old_center);
    attribution.addAttribution(map.getCenter());
    old_center = map.getCenter();
    attribution.addTo(map);
});
/**
map.on('baselayerchange', function(e) {
    $('.leaflet-control-minimap').remove();
    switch (e.name){

    }
    let osm2 = L.tileLayer.chinaProvider('GaoDe.Normal.Map', {
        maxZoom: 13,
        minZoom: 0
    });

    new MiniMap(osm2, { toggleDisplay: true }).addTo(map);//小地图
});
 **/
osmGeocoder.addTo(map);



export { map, osm, editableLayers, drawnItems };
