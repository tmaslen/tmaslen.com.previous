window.onload = function () {


	// FOR CODE EXAMPLES
	arrCodes = $('code.parse');
	for (var x = 0, len = arrCodes.length; x < len; x++) {
		eval(arrCodes[x].innerHTML);
	}


	// PRETTIFY DEMOS
	prettyPrint();


	// MAKE SURE ANY ANCHOR LINKS ARE KEPT IN THE VIEWPORT AFTER JAVASCRIPT HAS FINISHED ADDING CONTENT
	var anchor = window.location.toString().split('#');
	if (anchor.length > 1)
	{
		setTimeout(function() {
			window.location = '#' + anchor[1];
		}, 500);
	}

	// DIDN'T WANT TO DO THIS, SHOULD HAVE USED A RESET CSS.  BUT...
	if ($.browser.msie) {
		$('html').addClass('ie');
	}
	else if ($.browser.opera) {
		$('html').addClass('opera');
	}
}