#target photoshop
/*
addSliceArea.jsx
Copyright (c) 2014 Toshiyuki Takahashi
Released under the MIT license
http://opensource.org/licenses/mit-license.php
http://www.graphicartsunit.com/
*/
//==================================================
// 初期値
//==================================================
var settings = {
	prefix : 'SliceArea',
	deselectAfterRun : false,
	fillColor : [255,255,255]
};

//定数とグローバル変数
const SCRIPT_TITLE = "addSliceArea";
const SCRIPT_VERSION = "0.5.0";

var startRulerUnits = app.preferences.rulerUnits;
var startResolution;

// 塗りつぶし色を設定
var RGBColor = new SolidColor();
RGBColor.red = settings.fillColor[0];
RGBColor.green = settings.fillColor[1];
RGBColor.blue = settings.fillColor[2];

// ドキュメントの取得
var doc;
try {
	doc = app.activeDocument;
} catch (e) {
	doc = undefined;
}

//==================================================
// 実行
//==================================================
if(doc) {
	// 定規の単位を変更app.preferences.resolution
	app.preferences.rulerUnits =  Units.PIXELS;
	startResolution = doc.resolution;
	if(doc.resolution != 72) {
		doc.resizeImage(doc.width, doc.height, 72);
	}
	// 実行
	try {
		doc.suspendHistory(SCRIPT_TITLE, 'addSliceArea()');
	} catch (e) {
		alert(e);
		executeAction( charIDToTypeID('undo'), undefined, DialogModes.NO );
	}
	// 定規の単位を戻す
	if(startResolution != 72) {
		doc.resizeImage(doc.width, doc.height, startResolution);
	}
	app.preferences.rulerUnits =  startRulerUnits;
} else {
	alert("有効なドキュメントがありません");
}

//==================================================
// 実行用関数
//==================================================
function addSliceArea() {

	// 選択範囲の取得
	try {
		var selectionBounds = doc.selection.bounds;
	} catch (e) {
		throw "選択範囲が取得できませんでした";
	}
	if (!doc.selection.solid) {
		throw "有効な選択範囲ではありません\n選択範囲が長方形でないか、選択範囲の境界にぼかしが入っている可能性があります";
		return false;
	}
	var selectionSize = {w:selectionBounds[2]-selectionBounds[0], h:selectionBounds[3]-selectionBounds[1]};

	// 選択範囲コーナーの座標を取得
	var cornerPosition = [
		{x:selectionBounds[0], y:selectionBounds[1]},
		{x:selectionBounds[2], y:selectionBounds[1]},
		{x:selectionBounds[2], y:selectionBounds[3]},
		{x:selectionBounds[0], y:selectionBounds[3]}
	];

	// コーナーを選択してピクセルを描画
	for (var i=0; i<cornerPosition.length; i++){
		var isAdd = true;
		if(i == 0) isAdd = !isAdd;
	 	var bounds = getBounds(cornerPosition[i].x, cornerPosition[i].y, i);
		var boundsLayer = addShape(bounds, isAdd);
		boundsLayer.fillOpacity = 20;
		boundsLayer.opacity = 1;
		boundsLayer.name = settings.prefix + '_W' + selectionSize.w.as('px') +':H'+ selectionSize.h.as('px');
	}

	// 描画終了後の処理
	if(settings.deselectAfterRun) {
		doc.selection.deselect();
	} else {
		doc.selection.select([[cornerPosition[0].x,cornerPosition[0].y], [cornerPosition[1].x,cornerPosition[1].y], [cornerPosition[2].x,cornerPosition[2].y], [cornerPosition[3].x,cornerPosition[3].y]]);
	}
}

//==================================================
// ピクセル描画用選択範囲の取得
//==================================================
function getBounds(oX, oY, origin) {
	var size = {w:1, h:1};
	switch (origin) {
		case 0 :
			break;
		case 1 :
			oX -= size.w;
			break;
		case 2 :
			oX -= size.w;
			oY -= size.h;
			break;
		case 3 :
			oY -= size.h;
			break;
		default :
			break;
	}
	return [oX, oY, oX + size.w, oY + size.h];
}

//==================================================
// シェイプレイヤー追加（選択レイヤーの1つ上に追加する）
//==================================================
function addShape(bounds, isAdd) {

	var desc13 = new ActionDescriptor();
	var desc14 = new ActionDescriptor();
	var desc15 = new ActionDescriptor();
	var ref5 = new ActionReference();

	var add = charIDToTypeID( "Mk  " );

	if(!isAdd) {
		ref5.putClass( stringIDToTypeID( "contentLayer" ) );
		desc13.putReference( charIDToTypeID( "null" ), ref5 );
		desc14.putClass( charIDToTypeID( "Type" ), stringIDToTypeID( "solidColorLayer" ) );
		desc15.putUnitDouble( charIDToTypeID( "Left" ), charIDToTypeID( "#Rlt" ), bounds[0] );
		desc15.putUnitDouble( charIDToTypeID( "Top " ), charIDToTypeID( "#Rlt" ), bounds[1] );
		desc15.putUnitDouble( charIDToTypeID( "Rght" ), charIDToTypeID( "#Rlt" ), bounds[2] );
		desc15.putUnitDouble( charIDToTypeID( "Btom" ), charIDToTypeID( "#Rlt" ), bounds[3] );
		desc14.putObject( charIDToTypeID( "Shp " ), charIDToTypeID( "Rctn" ), desc15 );
		desc13.putObject( charIDToTypeID( "Usng" ), stringIDToTypeID( "contentLayer" ), desc14 );
	} else {
		add = charIDToTypeID( "AddT" )
		ref5.putEnumerated( charIDToTypeID( "Path" ), charIDToTypeID( "Ordn" ), charIDToTypeID( "Trgt" ) );
		desc13.putReference( charIDToTypeID( "null" ), ref5 );
		desc14.putUnitDouble( charIDToTypeID( "Left" ), charIDToTypeID( "#Rlt" ), bounds[0] );
		desc14.putUnitDouble( charIDToTypeID( "Top " ), charIDToTypeID( "#Rlt" ), bounds[1] );
		desc14.putUnitDouble( charIDToTypeID( "Rght" ), charIDToTypeID( "#Rlt" ), bounds[2] );
		desc14.putUnitDouble( charIDToTypeID( "Btom" ), charIDToTypeID( "#Rlt" ), bounds[3] );
		desc13.putObject( charIDToTypeID( "T   " ), charIDToTypeID( "Rctn" ), desc14 );
		executeAction( charIDToTypeID( "AddT" ), desc13, DialogModes.NO );
	}

	executeAction( add, desc13, DialogModes.NO );

	var desc16 = new ActionDescriptor();
	var desc17 = new ActionDescriptor();
	var desc18 = new ActionDescriptor();
	var ref7 = new ActionReference();
	ref7.putEnumerated( stringIDToTypeID( "contentLayer" ), charIDToTypeID( "Ordn" ), charIDToTypeID( "Trgt" ) );
	desc16.putReference( charIDToTypeID( "null" ), ref7 );
	desc18.putDouble( charIDToTypeID( "Rd  " ), 0.000000 );
	desc18.putDouble( charIDToTypeID( "Grn " ), 0.000000 );
	desc18.putDouble( charIDToTypeID( "Bl  " ), 0.000000 );
	desc17.putObject( charIDToTypeID( "Clr " ), charIDToTypeID( "RGBC" ), desc18 );
	desc16.putObject( charIDToTypeID( "T   " ), stringIDToTypeID( "solidColorLayer" ), desc17 );
	executeAction( charIDToTypeID( "setd" ), desc16, DialogModes.NO );

	return doc.activeLayer;

}