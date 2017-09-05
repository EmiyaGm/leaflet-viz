// import '../common/css/Control.Geocoder.css';
// import 'leaflet-control-geocoder';
import L from 'leaflet';
import "../common/css/Control.OSMGeocoder.css";
import "../common/leaflet-plugin/Control.OSMGeocoder.js";
import MiniMap from 'leaflet-minimap';
import $ from 'jquery';
import {Location} from './location.js';
import '../common/leaflet-plugin/svg-icon.js';

import '../common/css/Leaflet.LinearMeasurement.scss';
import '../common/Leaflet.LinearMeasurement';
//import 'leaflet.zoomslider';





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
attribution.addAttribution(new Location().init('高德地图',map.getCenter()));
attribution.addTo(map);
let old_center = new Location().init('高德地图',map.getCenter());
map.on('zoomend',function (e) {
    attribution.removeAttribution(old_center);
    attribution.addAttribution(new Location().init('高德地图',map.getCenter()));
    old_center = new Location().init('高德地图',map.getCenter());
    attribution.addTo(map);
});
map.on('moveend',function (e) {
    attribution.removeAttribution(old_center);
    attribution.addAttribution(new Location().init('高德地图',map.getCenter()));
    old_center = new Location().init('高德地图',map.getCenter());
    attribution.addTo(map);
});

var cost_underground = 12.55,
    cost_above_ground = 17.89,
    html = [
        '<table>',
        ' <tr><td class="cost_label">Cost Above Ground:</td><td class="cost_value">${total_above_ground}</td></tr>',
        ' <tr><td class="cost_label">Cost Underground:</td><td class="cost_value">${total_underground}</td></tr>',
        '</table>'
    ].join(''),
    numberWithCommas = function(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };

var Ruler = L.Control.LinearMeasurement.extend({
    layerSelected: function(e){

        /* cost should be in feet */

        var distance = e.total.scalar;

        if(e.total.unit === 'mi'){
            distance *= e.sub_unit;

        } else if(e.total.unit === 'km'){
            distance *= 3280.84;

        } else if(e.total.unit === 'm'){
            distance *= 3.28084;
        }

        var data = {
            total_above_ground: numberWithCommas(L.Util.formatNum(cost_above_ground * distance, 2)),
            total_underground: numberWithCommas(L.Util.formatNum(cost_underground * distance, 2))
        };

        var content = L.Util.template(html, data),
            popup = L.popup().setContent(content);

        //e.total_label.bindPopup(popup, { offset: [45, 0] });
        //e.total_label.openPopup();
    }
});

map.addControl(new Ruler({
    unitSystem: 'metric',
    color: '#FF0080'
}));



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
