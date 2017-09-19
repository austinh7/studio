$(document).ready(function(){

	// resizeCanvas(getSize()[0],getSize()[1]);

	// $(window).resize(function() {
	// 	resizeCanvas(getSize()[0],getSize()[1]);
	// });

	// $(".tools--title").click(function(){
	// 	$(".tools--container").toggleClass("show");

	// 	// get the size from the config and trigger resizeCanvas()
	// 	resizeCanvas(getSize()[0],getSize()[1]);
	// });


	// Load in the json file
	getDesigns('design.json');

	// load in the layouts file
	getLayouts('layouts.json');

	// console.log(jsonL);
	// loop through designs and print out menu
	$(json['creations']).each(function(){
		var $creations = $(this)[0];
		// console.log($creations['name']);
		$(".config--list-designs").append("<li class='config--list-design' data-creation-id='" + $creations['creationId'] + "'>" + $creations['name'] + "</li>");
	});

	// loop through layouts and print out menu
	$(jsonL['layouts']).each(function(){
		var $layouts = $(this)[0];
		// console.log($layouts);
		$(".config--list-layouts").append("<li class='config--list-layout' data-layout-id='" + $layouts['id'] + "'>" + $layouts['id'] + "</li>");
	});

	$(".config--title").click(function(){
		$(".config--container").toggleClass("show");
		resizeCanvas(getSize()[0],getSize()[1]);
	});

	$(".config--list-size").click(function(){
		var size = $(this).data("size");
		$(".config--list-size").removeClass("current");
		$(this).addClass("current");
		resizeCanvas(getSize()[0],getSize()[1]);
	});

	$(".config--list-design").click(function(){
		// console.log($(this).data("creation-id"));

		// get the creation we are loading in
		var creation = selectDesign($(this).data("creation-id"));
		// console.log(creation);
		$(".config--list-design").removeClass("current");
		$(this).addClass("current");

		// Remove old html
		$(".section--canvas").html("");

		
		// apply the background
		applyBG(creation);

		// build the layout
		buildLayout(creation[0]['components'][0]['lid']);

		// apply the decorations
		applyDecs(creation);

	});

	$(".config--list-layout").click(function(){
		$(".config--list-layout").removeClass("current");
		$(this).addClass("current");

		// remove the old layout
		$(".section--canvas .box").remove();

		var layoutId = ($(this).attr("data-layout-id"));

		// add in new layout
		buildLayout(layoutId);
	});



	$(".outer-padding-lr").on("change", function() {
		var oP = $(this).val();
		$(".section--canvas").css({"padding-left": oP + "px", "padding-right": oP + "px"});
	});

	$(".outer-padding-tb").on("change", function() {
		var oPtr = $(this).val();
		$(".section--canvas").css({"padding-top": oPtr + "px", "padding-bottom": oPtr + "px"});
	});	

	$(".inner-padding").on("change", function() {
		var iP = $(this).val();
		$(".section--canvas").css({"grid-gap": iP + "px"});
	});
});

// Functions

function toPerCent(value){
	var out = value * 100 + '%';
	return out;
}

function applyDecs(creation){

	var gridSize = $(".section--canvas").attr("style");

	$(".section--canvas").append("<div class='design-decs' style='"+gridSize+"'><div class='design--inner'></div></div>");

	var decorations = getObjects(creation[0]['components'][0]['layers'], 'role', 'decorations');

	if(decorations.length > 0){
		$(decorations[0]['elements']).each(function(){

			var bg = $(this),
				bgz = bg[0]['z'],
				// sizes & positions need to be converted to %.
				bgx = toPerCent(bg[0]['x']),
				bgy = toPerCent(bg[0]['y']),
				bgw = toPerCent(bg[0]['w']),
				bgh = toPerCent(bg[0]['h']),
				bgr = bg[0]['r'],
				bgsrc = bg[0]['src'],
				bgstyles = 'z-index: ' + bgz + '; left: ' + bgx + '; top: ' + bgy + '; width: ' + bgw + '; height: ' + bgh + ';';

				if (bgsrc ==''){

				} else if (bgsrc.match("^#")) {
					bgstyles += ' background-color: ' + bgsrc + '; ';
				} else {
					bgstyles += 'background-image: url(' + bgsrc + '); ';
				}

				$(".design-decs .design--inner").append("<div class='design--item' style='" + bgstyles + "'></div>");

		});
	}

}

function applyBG(creation){
	// replicate the width / height of the container
	var gridSize = $(".section--canvas").attr("style");

	$(".section--canvas").append("<div class='design-bg' style='"+gridSize+"'><div class='design--inner'></div></div>");
	
	var backgrounds = getObjects(creation[0]['components'][0]['layers'], 'role', 'background');

	// check to see if there is background layer
	if(backgrounds.length > 0){
		// each element
		$(backgrounds[0]['elements']).each(function(){
			// get position & sizes
			var bg = $(this),
				bgz = bg[0]['z'],
				// sizes & positions need to be converted to %.
				bgx = toPerCent(bg[0]['x']),
				bgy = toPerCent(bg[0]['y']),
				bgw = toPerCent(bg[0]['w']),
				bgh = toPerCent(bg[0]['h']),
				bgr = bg[0]['r'],
				bgsrc = bg[0]['src'],
				bgstyles = 'z-index: ' + bgz + '; left: ' + bgx + '; top: ' + bgy + '; width: ' + bgw + '; height: ' + bgh + ';';

				if (bgsrc ==''){

				} else if (bgsrc.match("^#")) {
					bgstyles += ' background-color: ' + bgsrc + '; ';
				} else {
					bgstyles += 'background-image: url(' + bgsrc + '); ';
				}

			$(".design-bg .design--inner").append("<div class='design--item' style='" + bgstyles + "'></div>");
			
		});
	}
}

function buildLayout(creation){

	// Should loop through components and fire for each, (page)
	// then go through each layer and then each element
	// Only layout layer needs grid
	// Need to load in the layout

	// console.log(creation[0]['components'][0]['lid']);

	console.log(jsonL);

	// find the correct layoutId
	var layout = getObjects(jsonL['layouts'], 'id', creation);

	console.log(layout[0]['width']);

	// Add html

	var gridW = layout[0]['width'],
		gridH = layout[0]['height'];

	// console.log(gridW);

	// need to add grid-template-columns & grid-template-rows to section--canvas
	// loop through to make sure that we get the right number of frs.
	// IE for a four x four col layout we would need grid-template-columns: 1fr 1fr 1fr 1fr
	// This is one less than the gridW & gridH values

	var iw = 1,
		ih = 1,
		gtc = '',
		gtr = '';

	while (gridW > iw){
		gtc += "1fr ";
		iw ++;
	}

	while (gridH > ih){
		gtr += "1fr ";
		ih ++;
	}

	$(".section--canvas").css({"grid-template-columns": gtc, "grid-template-rows": gtr});

	$(layout[0]['elements']).each(function(){
		// console.log($(this)[0]['id']);

		// grid-column: start / end ==> x / x+w
		// grid-row: start / end ==> y / y+h
		var x = $(this)[0]['x'],
			y = $(this)[0]['y'],
			w = $(this)[0]['w'],
			h = $(this)[0]['h'],
			xw = x + w,
			yh = y + h,
			gc = x + ' / ' + xw,
			gr = y + ' / ' + yh;

			console.log("gc " + gc + ", gr" + gr);

		// gc = $(this)[0]['x'] + ' / ' + parseInt($(this)[0]['x']) + parseInt($(this)[0]['w']);
		
		$(".section--canvas").append("<div class='box box-image box-image-" + $(this)[0]['id'] + "' style='grid-column: " + gc + "; grid-row: " + gr + "'>id -> " + $(this)[0]['id'] + " type -> " + $(this)[0]['type'] + "</div>");
	});
}

function getDesigns(file){
	json = (function () {
	    var jsonD = null;
	    $.ajax({
	        'async': false,
	        'global': false,
	        'url': file,
	        'dataType': "json",
	        'success': function (data) {
	            jsonD = data;
	        }
	    });
	    return jsonD;
	})();
}

function getLayouts(file){
	jsonL = (function () {
	    var jsonL = null;
	    $.ajax({
	        'async': false,
	        'global': false,
	        'url': file,
	        'dataType': "json",
	        'success': function (data) {
	            jsonL = data;
	        }
	    });
	    return jsonL;
	})();
}

function selectLayout(layoutId){
	var layout = getObjects(jsonL['layouts'], 'id', layoutId);

	return layout;
}

function selectDesign(creationId){
	// console.log(json['creations']);
	// console.log(getObjects(json['creations'], 'creationId', creationId));

	var creation = getObjects(json['creations'], 'creationId', creationId);

	// console.log(creation);

	return creation;
}

function getSize() {
	var size = $(".config--list-size.current").data("size"),
		sizes = splitDataSize(size);

	return sizes;
}

function getCanvasWrapSize() {
	var cWidth = $(".section--canvas-wrapper").width() - 12,
		cHeight = $(".section--canvas-wrapper").height() - 12
		wrapSize = [cWidth, cHeight];

	return  wrapSize;
}

function splitDataSize(concatSize) {
	// return the width, height & ratio
	var wh = concatSize.split("x");
	var sizeArray = [wh[0], wh[1], wh[0]/wh[1]];

	return sizeArray;
}

function resizeCanvas(width, height) {
	// return largest possible size for the canvas
	var wrapWidth = getCanvasWrapSize()[0],
		wrapHeight = getCanvasWrapSize()[1],
		wrapRatio = wrapWidth/wrapHeight,
		ratio = width/height;

	// console.log("wwh = " + getCanvasWrapSize()[0] + " - " + getCanvasWrapSize()[1]);
	// console.log("ratio = " + ratio);
	// console.log("WrapRatio = " + wrapRatio);

	if (wrapRatio > ratio) {
		// height wins
		// console.log("height wins");
		// Therefore height should be wrapHeight

		height = wrapHeight;
		width = height*ratio;

	} else if (wrapRatio < ratio) {
		// width wins
		// console.log("width wins");
		// Therefore width should be wrapWidth

		width = wrapWidth;
		height = width*(1/ratio);
	}

	// resize the canvas
	$(".section--canvas").width(width).height(height);
}

function getObjects(obj, key, val) {
    var objects = [];
    for (var i in obj) {
        if (!obj.hasOwnProperty(i)) continue;
        if (typeof obj[i] == 'object') {
            objects = objects.concat(getObjects(obj[i], key, val));
        } else if (i == key && obj[key] == val) {
            objects.push(obj);
        }
    }
    return objects;
}
