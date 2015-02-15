function getFlickrData(dataUrl, opts) {

	var imgUrl = "http://farm{farm}.static.flickr.com/{server}/{id}_{secret}",
		items = [];

	opts.onLoad = opts.onLoad || function(){};
	opts.onError = opts.onError || function(){};

	glow.net.loadScript(dataUrl, {
		timeout: 10,
		onLoad: function(data) {

			// we've got a response from flickr
			var photoData;
			if (data.stat == "ok") {
				// flickr understood the request
				var photoData;
				// get the returned photodata (the object structure is different depending on which flickr api method we used)
				if (data.photoset) {
					photoData = data.photoset.photo;
				} else if (data.photos.photo) {
					photoData = data.photos.photo;
				}

				// process the data
				processImageData(photoData);

				// run onLoad event
				opts.onLoad(items);

			}
			else {
				// flickr didn't understand the request, fire our error event
				alert('Error: there was a problem.  Please try refreshing the page.');
				throw Error('Flickr didn\'t understand the request');
			}

		},
		onError: function() {
			// the request timed out. Fire our error event
			alert('Error: the request timed out.');
			opts.onError();
		}
	});

	function processImageData(data) {

		var photos = data, // photo data
			i = photos.length, // number of photos
			item, // individual item
			url; // image url
		
		while (i--) {
			item = photos[i];
			// build image url from template
			url = glow.lang.interpolate( imgUrl, {
				farm: item.farm,
				server: item.server,
				id: item.id,
				secret: item.secret
			});
			
			// add image data
			items[i] = {
				imageId: item.id,
				thumbUrl: url + "_t.jpg",
				smallUrl: url + "_m.jpg",
				mediumUrl: url + ".jpg",
				title: item.title
			}
		}

	}

}