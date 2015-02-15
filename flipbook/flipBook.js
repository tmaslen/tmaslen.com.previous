/*
	to do:
	1) Apply widget to one node or a nodelist?
	2) Not sure about borderleft style
	4) Take height from shortest image or from options object
*/


function flipBook(elm, opts, glow) {

	// Set some short cuts and make sure we have an instance of glow
	glow = glow || window.glow;
	var $ = glow.dom.get;

	// Check the element
	elm = (elm instanceof glow.dom.NodeList == false) ?	elm = glow.dom.get(elm) : elm;
	if (elm.length == 0) {
		throw "Please use a valid element to build the flipBook with.";
	}

	// Set some defaults
	opts = opts || {};
	opts.height = opts.height || getShortestHeight();


	// Add CSS for the flipBook - do this first to ensure correct dimensions on the UL when calculating blade positions.
	elm.addClass('flipBook');
	elm.css({
		'list-style': 'none outside none',
		margin:		'0',
		overflow:	'hidden',
		padding:	'0',
		position:	'relative',
		zoom:		'1'
	});
	elm.get('li').css({
		'border-left': '1px solid #fff', 
		left:		'0', 
		margin:		'0',
		overflow:	'hidden',
		padding:	'0',
		position:	'absolute',
		top:		'0',
		width:		elm.get('img').width(),
		zoom:		'1'
	});
	$(elm.get('li').item(0)).css('border-left', 'none');
	elm.get('li img').css('display', 'block');

	// Set vars and values
	var r = {},
		nodeListImg = elm.get('img'),
		bladeWidth = (elm.width() - $(nodeListImg.item(0)).width()) / (nodeListImg.length-1),
		pos = [],
		nodeListLi = elm.get('li'),
		height = getHeightFromHighestElm();
	r.length = nodeListLi.length;
	r.position = 0;
	elm.height(height);

function getHeightFromHighestElm() {

	var elm = $(nodeListImg.item(0)),
		cssProps = [
			elm.css('margin-top'), 
			elm.css('border-top-width'),
			elm.css('padding-top'),
			elm.css('padding-bottom'), 
			elm.css('border-bottom-width'),
			elm.css('margin-bottom')
		],
		x = cssProps.length,
		heightTotal = elm.height(),
		cssProp = null;
	while(x--) {
		cssProp = parseInt(cssProps[x]);
		if (!isNaN(cssProp)) {
			heightTotal += cssProp;
		}
	}
	
	return heightTotal;

}


	/*
		The pos array holds all the blade positions.  So for example:
		pos[0][0] is blade one's position on the left, while pos[0][1]
		is blade one's position on the right.
	*/
	// First make an array large enough for all the blades.
	for (var x = 0; x < nodeListImg.length; x++){
		pos.push([0,0]);
	}
	// Starting from the begining of the array, give each blade a position from zero, with each blade increase the left position by the width of a blade (bladeWidth var).
	for  (x = 1, len = pos.length; x < len; x++){
		pos[x][0] = Math.floor(x*bladeWidth);
	}
	// Starting from the end of the array, give each blade a position from the width of the widget, with each blade decrease the right position by the width of a blade (bladeWidth var).
	for  (var y = 1, x = (pos.length-1); x > 0; x--){
		pos[x][1] = Math.floor(elm.width() - (y*bladeWidth));
		y++;
	}






	function getShortestHeight() {
		var imgList = elm.get('li img'),
			shortestHeight = imgList.height();
		imgList.each(function(){
			if ($(this).height() < shortestHeight) {
				shortestHeight = $(this).height();
			}
		});
		return shortestHeight;
	}
	
	// Moves individual images using a tween
	function moveImage(elm, index, leftOrRight) {
		glow.anim.css(
			$(elm),
			0.25,
			{
				"margin-left": (pos[index][leftOrRight]+"px")
			},
			{
				tween: glow.tweens.easeOut()
			}
		).start();
	}
	
	// Moves all the images to the correct position
	function moveMultipleImages(start, leftOrRight) {
		for(var y = start; y < r.length; y++) {
			moveImage(nodeListLi[y], y, leftOrRight);
		}
	}

	// Takes a single value, will move the flip book to this value
	r.move = function(index) {
		if (
			(index > -1) &&
			(index < r.length)
		) {
			if (index != 0) {
					moveMultipleImages(0, 0);
			}
			moveMultipleImages((index+1), 1);

			r.position = index;

			if (
				(opts.onChange) &&
				(typeof opts.onChange == 'function')
			) {
				opts.onChange();
			}
		}
	}

	// Add mouseover event to each image
	// Add event delegation to this
	nodeListLi.each(function(i){

		var card = $(this);

		// Make the card focusable if there are no focusable elements in it
		if (card.get('a').length == 0) {
			card.item(0).tabIndex = 0;
		}

		// POSITION IMAGE
		card.css("margin-left", (pos[i][1]+"px"));
		
		// ADD EVENT LISTENERS
		glow.events.addListener($(nodeListLi[i]), "mouseover", function(){
			r.move(i);
		});
		glow.events.addListener($(nodeListLi[i]), "focus", function(){
			r.move(i);
		});

	});


	return r;
}