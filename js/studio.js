$(document).ready(function(){

	resizeCanvas(getSize()[0],getSize()[1]);

	$(window).resize(function() {
		resizeCanvas(getSize()[0],getSize()[1]);
	});

	$(".tools--title").click(function(){
		$(".tools--container").toggleClass("show");

		// get the size from the config and trigger resizeCanvas()
		resizeCanvas(getSize()[0],getSize()[1]);
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
});

// Functions

function getSize() {
	var size = $(".config--list-size.current").data("size"),
		sizes = splitDataSize(size);

	return sizes;
}

function getCanvasWrapSize() {
	var cWidth = $(".section--canvas-wrapper").width() - 12,
		cHeight = $(".section--canvas-wrapper").height() - 12,
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

	console.log("wwh = " + getCanvasWrapSize()[0] + " - " + getCanvasWrapSize()[1]);
	console.log("ratio = " + ratio);
	console.log("WrapRatio = " + wrapRatio);

	if (wrapRatio > ratio) {
		// height wins
		console.log("height wins");
		// Therefore height should be wrapHeight

		height = wrapHeight;
		width = height*ratio;

	} else if (wrapRatio < ratio) {
		// width wins
		console.log("width wins");
		// Therefore width should be wrapWidth

		width = wrapWidth;
		height = width*(1/ratio);
	}

	// resize the canvas
	$(".section--canvas").width(width).height(height);
}
