glow.ready(function() {

	var url = 'http://api.flickr.com/services/rest/?method=flickr.photosets.getPhotos&api_key=d426b330cd9c56174986a8eb633b2410&photoset_id=72157620266232601&format=json&jsoncallback={callback}';

	getFlickrData(url, {
		onLoad: function(items) {

			// Intro
			glow.dom.get('.intro').append('<ul></ul>');
			var i = 5;
			while (i--) {
				glow.dom.get('.intro ul').append('<li><img src="' + items[i].thumbUrl + '" width="100" height="100" /></li>');
			}

			// Demo one
			glow.dom.get('#demo_one').append('<ul></ul>');
			var i = 5;
			while (i--) {
				glow.dom.get('#demo_one ul').append('<li><img src="' + items[i].smallUrl + '" width="240" height="159" /></li>');
			}

			// Demo two
			glow.dom.get('#demo_two').append('<ul id="myImages"></ul>');
			i = items.length;
			while (i--) {
				glow.dom.get('#myImages').append('<li><a href="foo.html"><span>' + items[i].title + '</span><img src="' + items[i].mediumUrl + '" width="500" height="332"  /></a></li>');
			}

			// Demo three
			glow.dom.get('#demo_three div').before('<ul></ul>');
			var i = items.length;
			while (i--) {
				glow.dom.get('#demo_three ul').append('<li><img src="' + items[i].mediumUrl + '" width="500" height="332"  /></li>');
			}

			// Enable demos
			flipBook(".intro ul");
			glow.dom.get('.js').each(function(){
				eval(glow.dom.get(this).html());
			});

		}
	});

});