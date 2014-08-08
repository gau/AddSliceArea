#target photoshop
/*
addSliceArea.jsx
Copyright (c) 2014 Toshiyuki Takahashi
Released under the MIT license
http://opensource.org/licenses/mit-license.php
http://www.graphicartsunit.com/
*/
(function() {

	// Settings
	var settings = {
		prefix : 'SliceArea',
		deselectAfterRun : false,
		fillColor : [255,255,255]
	};

	// Constant & Global variable
	const SCRIPT_TITLE = "addSliceArea";
	const SCRIPT_VERSION = "0.5.1";
	var startRulerUnits;
	var startResolution;
	var RGBColor = new SolidColor();
	RGBColor.red = settings.fillColor[0];
	RGBColor.green = settings.fillColor[1];
	RGBColor.blue = settings.fillColor[2];

	// Get document
	var doc;
	try {
		doc = app.activeDocument;
	} catch (e) {
		doc = undefined;
	}

	// Process Dialog
	function ProcessDialog() {
		this.init();
		return this;
	};
	ProcessDialog.prototype.init = function() {
		this.dlg = new Window("palette", SCRIPT_TITLE + " - ver." + SCRIPT_VERSION);
		this.dlg.maximumSize = [650, 600];
		this.dlg.margins = [100, 20, 100, 20];
		this.dlg.message = this.dlg.add("statictext", undefined, "処理中です...");
	};
	ProcessDialog.prototype.showDialog = function() {
		this.dlg.show();
	};
	ProcessDialog.prototype.closeDialog = function() {
		this.dlg.close();
	};

	// Process start
	if(doc) {
		// Change ruler unit & resolution
		startResolution = doc.resolution;
		startRulerUnits = app.preferences.rulerUnits;
		app.preferences.rulerUnits =  Units.PIXELS;
		if(doc.resolution != 72) doc.resizeImage(doc.width, doc.height, 72);
		// run
		try {
			doc.suspendHistory(SCRIPT_TITLE, 'addSliceArea()');
		} catch (e) {
			alert(e);
			executeAction( charIDToTypeID('undo'), undefined, DialogModes.NO );
		}
		// Restore ruler unit & resolution
		if(startResolution != 72) doc.resizeImage(doc.width, doc.height, startResolution);
		app.preferences.rulerUnits =  startRulerUnits;
	} else {
		alert("有効なドキュメントがありません");
	}

	// Function for main process
	function addSliceArea() {
		// Get selection bounds
		try {
			var selectionBounds = doc.selection.bounds;
		} catch (e) {
			throw "選択範囲が取得できませんでした\n長方形選択ツールでスライスしたい範囲を選択してください";
		}
		if (!doc.selection.solid) {
			throw "有効な選択範囲ではありません\n選択範囲が長方形でないか、選択範囲の境界にぼかしが入っている可能性があります";
			return false;
		}
		var selectionSize = {w:selectionBounds[2]-selectionBounds[0], h:selectionBounds[3]-selectionBounds[1]};
		// Show ProcessDialog
		var processDialog = new ProcessDialog();
		processDialog.showDialog();
		// Get corner positions from bounds
		var cornerPosition = [
		{x:selectionBounds[0], y:selectionBounds[1]},
		{x:selectionBounds[2], y:selectionBounds[1]},
		{x:selectionBounds[2], y:selectionBounds[3]},
		{x:selectionBounds[0], y:selectionBounds[3]}
		];
		// Add Shape to corners
		for (var i=0; i<cornerPosition.length; i++){
			var isAdd = true;
			if(i == 0) isAdd = !isAdd;
			var bounds = getBounds(cornerPosition[i].x, cornerPosition[i].y, i);
			var boundsLayer = addShape(bounds, isAdd);
			boundsLayer.fillOpacity = 20;
			boundsLayer.opacity = 1;
			boundsLayer.name = settings.prefix + '_W' + selectionSize.w.as('px') +':H'+ selectionSize.h.as('px');
		}
		// Process after run
		if(settings.deselectAfterRun) {
			doc.selection.deselect();
		} else {
			doc.selection.select([[cornerPosition[0].x,cornerPosition[0].y], [cornerPosition[1].x,cornerPosition[1].y], [cornerPosition[2].x,cornerPosition[2].y], [cornerPosition[3].x,cornerPosition[3].y]]);
		}
		// Close ProcessDialog
		processDialog.closeDialog();
	}

	// Get bounds from corner positions
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

	// Add shape layer
	function addShape(bounds, isAdd) {
		var desc1 = new ActionDescriptor();
		var desc2 = new ActionDescriptor();
		var desc3 = new ActionDescriptor();
		var ref1 = new ActionReference();
		var add = charIDToTypeID( "Mk  " );
		if(!isAdd) {
			ref1.putClass( stringIDToTypeID( "contentLayer" ) );
			desc1.putReference( charIDToTypeID( "null" ), ref1 );
			desc2.putClass( charIDToTypeID( "Type" ), stringIDToTypeID( "solidColorLayer" ) );
			desc3.putUnitDouble( charIDToTypeID( "Left" ), charIDToTypeID( "#Rlt" ), bounds[0] );
			desc3.putUnitDouble( charIDToTypeID( "Top " ), charIDToTypeID( "#Rlt" ), bounds[1] );
			desc3.putUnitDouble( charIDToTypeID( "Rght" ), charIDToTypeID( "#Rlt" ), bounds[2] );
			desc3.putUnitDouble( charIDToTypeID( "Btom" ), charIDToTypeID( "#Rlt" ), bounds[3] );
			desc2.putObject( charIDToTypeID( "Shp " ), charIDToTypeID( "Rctn" ), desc3 );
			desc1.putObject( charIDToTypeID( "Usng" ), stringIDToTypeID( "contentLayer" ), desc2 );
		} else {
			add = charIDToTypeID( "AddT" )
			ref1.putEnumerated( charIDToTypeID( "Path" ), charIDToTypeID( "Ordn" ), charIDToTypeID( "Trgt" ) );
			desc1.putReference( charIDToTypeID( "null" ), ref1 );
			desc2.putUnitDouble( charIDToTypeID( "Left" ), charIDToTypeID( "#Rlt" ), bounds[0] );
			desc2.putUnitDouble( charIDToTypeID( "Top " ), charIDToTypeID( "#Rlt" ), bounds[1] );
			desc2.putUnitDouble( charIDToTypeID( "Rght" ), charIDToTypeID( "#Rlt" ), bounds[2] );
			desc2.putUnitDouble( charIDToTypeID( "Btom" ), charIDToTypeID( "#Rlt" ), bounds[3] );
			desc1.putObject( charIDToTypeID( "T   " ), charIDToTypeID( "Rctn" ), desc2 );
			executeAction( charIDToTypeID( "AddT" ), desc1, DialogModes.NO );
		}
		executeAction( add, desc1, DialogModes.NO );
		var desc4 = new ActionDescriptor();
		var desc5 = new ActionDescriptor();
		var desc6 = new ActionDescriptor();
		var ref2 = new ActionReference();
		ref2.putEnumerated( stringIDToTypeID( "contentLayer" ), charIDToTypeID( "Ordn" ), charIDToTypeID( "Trgt" ) );
		desc4.putReference( charIDToTypeID( "null" ), ref2 );
		desc6.putDouble( charIDToTypeID( "Rd  " ), 0.000000 );
		desc6.putDouble( charIDToTypeID( "Grn " ), 0.000000 );
		desc6.putDouble( charIDToTypeID( "Bl  " ), 0.000000 );
		desc5.putObject( charIDToTypeID( "Clr " ), charIDToTypeID( "RGBC" ), desc6 );
		desc4.putObject( charIDToTypeID( "T   " ), stringIDToTypeID( "solidColorLayer" ), desc5 );
		executeAction( charIDToTypeID( "setd" ), desc4, DialogModes.NO );
		return doc.activeLayer;
	}
})();