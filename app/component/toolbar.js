import './toolbar.scss';

// import L from 'leaflet';
import $ from 'jquery';
import config from './gConfig.js';
import {map} from './basemap.js';
import leafletImage from 'leaflet-image';
import 'leaflet-responsive-popup';
import {Location} from './location.js';
// import  'leaflet-easyprint';

//import mControl from '../common/plugin/measureControl.js';//距离量算库,依赖于leaflet-draw
//import mAreaControl from '../common/plugin/measureAreaControl.js';//面积量算库
import {addClickListenerToPrint} from '../common/plugin/easyPrint.js';//打印成pdf
import {editableLayers} from './basemap.js';

class Toolbar{
	init(){
		this._handlePan();
		this._handleZoomToall();
		this._handlePosition();
		this._handlePrint();
		this._handleView();
		this._handleMark();

		//L.control.measureControl().addTo(map);
		//L.control.measureAreaControl().addTo(map);
	}
	_handlePrint(){
		//生成图片  不支持绘制的图层
		$('#mapbar').on('click', '#print2img', (event)=> {
			// console.log(leafletImage);
			leafletImage(map, function(err, canvas) {
    			var iframe = document.createElement('iframe');//或者img
    			var dimensions = map.getSize();
    			iframe.width = dimensions.x;
    			iframe.height = dimensions.y;
    			iframe.src = canvas.toDataURL();
    			// iframe.crossOrigin = "Anonymous";
    			window.open(iframe.src);
    			// document.getElementById('snapshot').innerHTML = '';
    			// document.getElementById('snapshot').appendChild(img);
			});
		});
		$('#mapbar').on('click', '#print2pdf', (event)=> {
			addClickListenerToPrint({
				map:map,
				elementsToHide: 'p, h2,.leaflet-control-layers,.leaflet-control-container,#mapbar'
			})
		});
	}
	_handlePan(){
		$('#mapbar').on('click', '#pan', (event)=> {
			console.log("平移");
		});
	}
	_handleZoomToall(){
		$('#mapbar').on('click', '#zoomtoall', (event)=> {
			let mapOpt = config.mapOpt;
			map.flyTo(mapOpt.center||[30, 104],mapOpt.zoom||5);
		});
	}
	_handlePosition(){
		$('#mapbar').on('click', '#myposition', (event)=> {
			console.log("定位");
			function onLocationFound(e) {  
                var radius = e.accuracy / 2;  
                console.log(e.latlng);
				map.flyTo(e.latlng,15);
                L.marker(e.latlng).addTo(map)  
                    .bindPopup("距离您" + radius + "米").openPopup();  
  				L.circle(e.latlng, radius).addTo(map);  
         	}  
         	map.on('locationfound', onLocationFound);  
         	map.on('locationerror ', ()=>{
         		console.warn("定位失败");
         	});
         	map.locate({watch: true,timeout:1000});  
		});
	}
    _handleView(){

	}
	_handleMark(){
        $('#mapbar').on('click', '#mark', (event)=> {
        	map.on('click',function addPopup(e) {
        		let popoptions = {
        			maxWidth : 500,
					maxHeight : 800
				};
                let popup = L.responsivePopup().setContent('<div class="add_mark card-div-border" style="display: block">' +
                    '<div class="col-md-12" style="color: #999999;margin-bottom:10px;">添加地图兴趣点</div>' +
                    '<div class="mauna-form-parent" data-form-name="type"><label class="lava-label" title="所属分类">所属分类</label><div class="mauna-panel-parent"></div></div>' +
                    '<div class="mauna-form-parent" data-form-name="marker_name"><label class="lava-label" title="兴趣点名称">兴趣点名称</label><div class="mauna-panel-parent"><input type="text" class="form-control " id="" size="" name="marker_name" value=""></div></div>' +
                    '<div class="mauna-form-parent" data-form-name="icon"><label class="lava-label" title="地图图标">地图图标</label><div class="mauna-panel-parent"></div></div>' +
                    '<div class="mauna-form-parent" data-form-name="lng_lat"><label class="lava-label" title="经纬度">经纬度</label><div class="mauna-panel-parent"><span id="" class="mauna-form-text user_marker_lnglat">'+e.latlng+'</span></div></div>' +
                    '<div class="mauna-form-parent" data-form-name="region"><label class="lava-label" title="所在区域">所在区域</label><div class="mauna-panel-parent"><span id="region" class="mauna-form-text user_marker_detailaddress">'+new Location().init('高德地图',e.latlng)+'</span></div></div>' +
                    '<div class="mauna-form-parent" data-form-name="detail_address"><label class="lava-label" title="详细地址">详细地址</label><div class="mauna-panel-parent"><input type="text" class="form-control " id="" size="" name="detail_address" value=""></div></div>' +
                    '<div class="mauna-form-parent" data-form-name="radius_range"><label class="lava-label" title="半径范围">半径范围</label><div class="mauna-panel-parent after"><input type="number" class="form-control " id="" max="" min="1" name="radius_range" value="1000">米</div></div>' +
                    '<div class="mauna-form-parent" data-form-name="display_level"><label class="lava-label" title="显示级别">显示级别</label><div class="mauna-panel-parent"></div></div>' +
                    '<div class="mauna-form-parent" data-form-name="undefined"> <button id="marker_submit_button" class="btn btn-primary btn-sm center-block">保存</button></div>' +
                    '</div>',popoptions);
                L.marker(e.latlng,{icon:new L.DivIcon.SVGIcon()}).addTo(map).bindPopup(popup,popoptions).openPopup();
                map.on('popupopen',function () {
                    $('#marker_submit_button').click(function() {
                        console.log('保存');
                    });
                });
                $('#marker_submit_button').click(function() {
                    console.log('保存');
                });
                map.off({click: addPopup});
            });
        });
	}

}

export {Toolbar};