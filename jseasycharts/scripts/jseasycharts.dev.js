var jsEasyCharts;

(function() {



	var genericChart = function(attachTo, values, opts, chartSubTypes, chartType, additionalPairValues) {

		opts = (opts || {});
		chartSubTypes = (chartSubTypes || '');
		var url = '',
			labels = '',
			axisLabels = '',
			labelOrientation = '';

		// required
			// attachTo
				attachTo = getElementFromAttachTo(attachTo);
			// Data
				var parseDataObject = parseData(values);
				data = parseDataObject.data;
				labels = parseDataObject.labels.substr(4);


		// optional
			// Size
				var size = 'chs=' + (opts.size || '100x100');
			// Type
				opts.type = (convert_type_names(opts.type) || chartSubTypes[0]);
				// If user defined name not in array of accepted names then error
				if( ('|' + chartSubTypes.toString() + '|').replace(/,/g, '|').indexOf('|' + opts.type + '|') == -1  ) {
					throw new Error("Bar chart type unrecognised");
				}
				// If data has two tracks (divided by a pipe) then change the user defined type automatically
				if (data.indexOf('|') > -1) {
					opts.type = convert_type_names_for_multi_tracks(opts.type);
				}
				var type = 'cht=' + opts.type;

			// Label

				// dataSourced labels
					if (opts.graphAxis == 'horizontal') {
						if (labels.indexOf('|') > -1) {
							labels = labels.split('|').reverse().join('|');
						}
					}
				
				// option defined labels
					if(isArray(opts.labels)) {
						
						// Fix an odd behaviour in Google Charts, labels appear in wrong order if bar chart is set to horizontal.
						if (opts.graphAxis == 'horizontal') {
							opts.labels.reverse();
						}

						// if a labels property is passed in through the options object, then overwrite any label data we have
						// form label array into Google Charts friendly string and add it to a querystring pair
						labels = opts.labels.toString().replace(/,/g, '|');
					}


			// Colour
				var colour = 'chco=' + (opts.colour || '');
			// Alt text
				opts.altText = (opts.altText || '');
			// Legend
				if (typeof opts.legend != "undefined")
				{
					additionalPairValues += "&amp;chdl=" + opts.legend.replace(/,/g, "|");
				}
			// url + protocol
				if (opts.https === true) {
					url = 'https://www.google.com/chart?';
				}
				else {
					url = 'http://chart.apis.google.com/chart?';
				}



		// Chart type specific code - this is none generic code 
		// (couldn't fit it in the 'inherited' objects below 
		// because the labelling logic needs to be applied first)
			switch (chartType)
			{

				case 'pie' :
					opts.showLabels = (typeof opts.showLabels == 'undefined') ? true : opts.showLabels;
					if (opts.showLabels == false) {
						labels = '';
					}
					else {
						labels = 'chl=' + labels;
					}
					break;

				// Bar chart
				case 'bar' :
				case 'line' :

					// axisLabels
						// decide whether or not to show axis labels
							opts.showAxisLabels = (function() {
								// has user specificied no axis labels...
								if (opts.showAxisLabels === false) {
									return false;
								}
								// if user has defined axis label values then show axis labels...
								if (opts.axisLabels) {
									return true;
								}
								// otherwise consider axis labels to be off by default
								return false;
							})();

						// Add axis label data?
							if (opts.showAxisLabels === true) {
								axisLabels = opts.axisLabels.toString().replace(/,/g, '|');
							}
					
					// labels
						// if user has set the labels not to be shown then remove them
							if (opts.showLabels == false) {
								labels = '';
							}
						// if there are no labels but there are axisLabels, then we need to 
						// PASS IN EMPTY VALUES to stop google chart giving each track a 
						// numeric label
							if (
								   (labels == '')
								&& (axisLabels != '')
							) {
								// *** IMPORTANT ***	I thought this bit should check for multiple tracks, then use the track with the most data
								//						to get the length from.  But Google Charts will stretch "short" tracks to the same length
								//						as the longest.  So I'm not sure if we should check for the longest here, or tell the user
								//						that the tracks need to be the same length?
								// *** UPDATE ***		Google Charts forum says this is on purpose as you can enter null values in data tracks.
								//labels = new Array(data.substr(6).split(",").length+1).join("|");
							}


					// This value is used to decide if we want to add the chxt and chxl pairs
						var combinedLengths = labels.length + axisLabels.length;


					// label orientation
						// this take the chxt param, and tells google 
						// charts which track should appear on which side of the chart.
						// It does this by looking by checking to see if the graph is a 
						// 'vertical' or 'horizontal' type.

						var labelOrientation = '';
						// Only apply the chxt pair if there is data to add
						if (combinedLengths > 0) {
							labelOrientation = 'chxt=';
							if (opts.graphAxis == 'vertical') {
								labelOrientation += buildLabelOrientation('x','y', labels.length, axisLabels.length);
							} else {
								labelOrientation += buildLabelOrientation('y','x', labels.length, axisLabels.length);
							}
						}



					// combine labels together under chxl
						
						// Only apply the chxl pair if there is data to add
						if (combinedLengths > 0) {
							
							// IF labels...
							if (
								   (labels.length > 0)
								&& (axisLabels.length == 0)
							) {
								labels = 'chxl=0:|' + labels;
							}

							// IF labels AND axisLabels...
							if (
								   (labels.length > 0)
								&& (axisLabels.length > 0)
							) {
								labels = 'chxl=0:|' + labels + '|1:|' + axisLabels;
							}

							// IF axisLabels...
							if (
								   (labels.length == 0)
								&& (axisLabels.length > 0)
							) {
								labels = 'chxl=0:|' + axisLabels;
							}

						}


					// Manual data scaling
						if (
							   (typeof opts.dataScaling == 'object')
							&& (typeof opts.dataScaling.top == 'number')
							&& (typeof opts.dataScaling.bottom == 'number')
						) {
							additionalPairValues += '&amp;chds=' + opts.dataScaling.bottom + ',' + opts.dataScaling.top;
						}

					// Automatic data scaling
					// This doesn't work very well when labels are turned on but not customised.  Probably need to
					// roll this into the axisLabels functionality somehow?
//						else if (typeof opts.dataScaling == 'undefined') {
//							var splitData = data.slice(6).split(/[\,|]/),
//								max = Math.max.apply(null, splitData),
//								min = Math.min.apply(null, splitData);
//							if (
//								   (max > 100)
//								|| (min < 0)
//							) {
//								console.log(attachTo.id + ": automatic data scaling turned on");
//								console.log(max);
//								console.log(min);
//								additionalPairValues += '&amp;chds=' + min + ',' + max;
//							}
//						}
						

					// Grouped data
						// Only want to do this bit for bars - this section of code is messy, need to refactor
						// If opts.grouped == true then show a group of bars instead of a single one
						if (
							   (chartType == 'bar')
							&& (opts.grouped == true)	
						) {
								type = type.slice(0,-1)+"g";
						}


					break;
			}
				

		// Add img
			var img_src = url + size + '&amp;' + data + '&amp;' + type + '&amp;' + colour + '&amp;' + labels + '&amp;' + labelOrientation + additionalPairValues;
			attachTo.innerHTML += '<img src="' + img_src + '" alt="' + opts.altText + '" height="' + size.substr(4).split('x')[1] + '" width="' + size.substr(4).split('x')[0] + '" />';

	}











	jsEasyCharts = {


		// =================
		// Line chart object
		// =================
		line: function(attachTo, values, opts) {
		
			var additionalPairValues = '';
			opts = (opts || {});

			// Graph is always vertical (is this true? - seems v and h have been mixed up)
			opts.graphAxis = 'vertical';

			// Call the generic chart object
			return new genericChart(attachTo, values, opts, ["lc", "ls", "lxy"], 'line', additionalPairValues);

		},


		// ================
		// Bar chart object
		// ================
		bar: function(attachTo, values, opts) {

			var additionalPairValues = '&amp;chds=,140'; // why does the bar chart need these additional values?  I can't remember!
			opts = (opts || {});

			// Added this on so sideBySide chart can pass in additional pair values
			if (opts.additionalPairValues)
			{
				additionalPairValues += opts.additionalPairValues;
			}

			// Work out which way the graph is pointing
			opts.graphAxis = ( opts.type == 'vertical' ) ? 'vertical' : 'horizontal';

			// Bar width and spacing - http://code.google.com/apis/chart/styles.html#bar_width
			if (
				   (typeof opts.barWidth   != 'undefined')
				|| (typeof opts.barSpacing != 'undefined')
			) {

				// Add a value for the barWidth, default is 'r' which tells GC to ignore it
				additionalPairValues += (typeof opts.barWidth == 'number') ? '&amp;chbh=' + opts.barWidth : '&amp;chbh=r';

				// Add a value for barSpacing if a numeric is passed in
				if (typeof opts.barSpacing == 'number')
				{
					additionalPairValues += ',' + opts.barSpacing;
				}

			}

			// Call the generic chart object
			return new genericChart(attachTo, values, opts, ["bhs", "bvs", "bhg", "bvg"], 'bar', additionalPairValues);
		
		},


		// ================
		// Pie chart object
		// ================
		pie: function(attachTo, values, opts) {

			opts = (opts || {});
		
			var additionalPairValues = '';

			return new genericChart(attachTo, values, opts, ["p", "pc", "p3"], 'pie', additionalPairValues);

		},


		// =========================
		// Side-By-Side chart object
		// =========================
		sideBySide: function(attachTo, values, opts) {

			opts = (opts || {});


			// Sort the data.  The data for the left side will actually need to be negative values.

				// Fetch the data using parseData, this returns the data as a googlecharts friendly string,
				// but we actually need it as an array...
				var parseDataResults = parseData(values);
				var data = parseDataResults.data.substr(6).split("|");

				// DataSet needs to have two tracks
				if (data.length != 2)
				{
					throw new Error("jsEasyCharts.sideBySide chart requires two data tracks only.  You have supplied " + data.length);
				}
				// Split strings into arrays
				data[0] = data[0].split(",");
				data[1] = data[1].split(",");
				
				// Set first track into minus numbers
				for (var z = 0, length = data[0].length; z < length ; z++)
				{
					data[0][z] = negativeNumber(data[0][z])
				}
			
			// Now we need to play with the dataScaling.

				// Set default value
				opts.dataScaling = opts.dataScaling || {top: 100, bottom: 0};

				// Can't let in negative values (yet)
				if (
					   (opts.dataScaling.top < 0)
					|| (opts.dataScaling.bottom < 0)
				) {
					throw new Error("jsEasyCharts.sideBySide chart cannot handle dataScaling with values less than 0");
				}

				// store current dataScaling values so we can reapply them for the right side of the chart
				var originalDataScaling = {top: 0, bottom: 100};
				originalDataScaling.top = opts.dataScaling.top;
				originalDataScaling.bottom = opts.dataScaling.bottom;

				// set dataScaling to negative values for the left side of the chart
				opts.dataScaling.top = negativeNumber(originalDataScaling.bottom);
				opts.dataScaling.bottom = negativeNumber(originalDataScaling.top);


			// Labels - if no labels are passed through then add labels from parsed data source (JSON or table)
				if (!isArray(opts.labels)) {
					opts.labels = parseDataResults.labels.substr(4).split('|');
				}


			// Chart size, we need to set the width to be half of what is set by the user.
				
				// give it a default value first
				opts.size = opts.size || '300x300'

				// Cut the width value in half
				var originalSize = opts.size
				opts.size = (originalSize.substr(0, originalSize.indexOf('x')) / 2) + originalSize.substr(originalSize.indexOf('x'));


			// Make sure a legend has not been passed in
				if (typeof opts.legend != "undefined") {
					delete opts.legend;
				}

			// Give the two images a parent element that will stop them from line breaking
				var parentDiv = document.createElement('DIV');
				parentDiv.id = 'jsEasyChartSideBySide';
				parentDiv.style.width = originalSize.substr(0, originalSize.indexOf('x')) + "px";
				attachTo = getElementFromAttachTo(attachTo);
				attachTo.appendChild(parentDiv);
				attachTo = document.getElementById('jsEasyChartSideBySide');


			// Add grid lines if user sets them
				if (opts.gridLines == true)
				{
					opts.additionalPairValues = '&chg=10,100';
				}

			// Left chart
				var originalLabels = '';
				if (opts.labels)
				{
					originalLabels = opts.labels.slice(0);
					opts.labels = '';
				}

				// axis labels need to be reversed like all the data on the left side
				reverseAxisLabels(opts);

				// call bar()
				this.bar(attachTo, data[0], opts);

			// Reset dataScaling to its original value
				opts.dataScaling = originalDataScaling;


			// Right chart
				if (originalLabels != '')
				{
					opts.labels = originalLabels;
				}
				// put the axis labels back in the correct order
				reverseAxisLabels(opts);
				// remove the value from additionalParValues as we don't require them for the right side
				opts.additionalPairValues += '&chm=r,FFFFFF,0,-0.01,0.001,1|r,000000,0,0.998,1,1|R,000000,0,0.999,1,1';
				// call bar()
				this.bar(attachTo, data[1], opts);

			// PROBABLY WON'T NEED THIS
			// Bit of css to make the images align nicely
				arrImg = attachTo.getElementsByTagName('IMG');
				for(var p = 0, arrLen = arrImg.length; p < arrLen; p++) {
					arrImg[p].style.display = 'inline';
					arrImg[p].style.float = 'left';
					arrImg[p].style.border = 'none';
					arrImg[p].style.padding = '0';
					arrImg[p].style.margin = '0';
				}


			// last thing is to remove the id from parentDiv (we can't have two elements on the page with the same id).
				attachTo.id = '';
				attachTo.className = 'jsEasyChartSideBySide';

		}


	}


	// Creates the value for the chxt name in the Google Chart querystring.
	// Potential outcomes are: x,y | y,x | x | y
	// This tells Google Charts where to put the labels and axisLabels
	function buildLabelOrientation(first, second, labelsLength, axisLabelsLength) {
		var r = '';
		if (labelsLength > 0) {
			r += first;
		}
		if (
			   (labelsLength > 0)
			&& (axisLabelsLength > 0)
		) {
			r += ',';
		}
		if (axisLabelsLength > 0) {
			r += second;
		}
		return r;
	}

	// Checks param 'obj' is an array
	function isArray(obj) {
		if (
			   (typeof obj == 'object')
			&& (typeof obj.length == 'number')
		) {
			return true;
		}
		else {
			return false;
		}
	}

	// If an options object has an axisLabels property then it reverses the values of the array.
	// Should this check to see if the property is an array?
	function reverseAxisLabels(opts) {
		if (opts.axisLabels) {
			opts.axisLabels.reverse();
		}
		return opts;
	}

	// pass in attachTo param, if a string this is changed into the DOM elm of the id.
	// should always return a DOM elm.
	function getElementFromAttachTo(attachTo) {
		if (typeof attachTo == 'string') {
			attachTo = document.getElementById(attachTo);
		}
		if (attachTo == null) {
			throw new Error("You must define an element to append the chart to");
		}
		return attachTo;
	}


	// returns a negative equivalent of any number passed in.
	function negativeNumber(num) {
		if (isNaN(num)) {
			throw new Error("The data source for the chart must be numeric.");
			return false;
		}
		return parseInt("-" + num);
	}


	// This is the most important part of jsEasyCharts.
	// It takes the dataSource (values) which could be a table,
	// JSON or an array and processes it into a googleCharts
	// friendly string of chart values
	function parseData(values) {
		var data = '',
			labels = '';
		if (typeof values == 'undefined') {
			// Nothing passed in
			throw new Error("No data entered to make a pie chart");
		} else {
			if (typeof values.length == 'undefined') {
				// json object passed in
				data = 'chd=t:' + mapJsonToChartValues(values);
				labels = 'chl=' + mapJsonToChartLabels(values);
			} else {
				if (
						(document.getElementById(values) != null) &&
						(document.getElementById(values).nodeName.toLowerCase() == "table")
				) {
					// table passed in...
					// Get a ref for the Table elm
					values = document.getElementById(values);
					// table_check returns array telling us how to process table data.
					// E.g. ['vertical', 3] = data tracks run down the table, and there are 3 columns of data.
					// E.g. ['horizontal', 1] = data tracks run left to right across the table, and there is 1 row of data
					var checkedTable = table_check(values);
					if (checkedTable[0] == 'vertical') {
						data = 'chd=t:' + mapVerticalTableToChartValues(values, checkedTable[1]);
						labels = 'chl=' + mapVerticalTableToChartLabels(values);
					} else {
						data = 'chd=t:' + mapHorizontalTableToChartValues(values, checkedTable[1]);
						labels = 'chl=' + mapHorizontalTableToChartLabels(values);
					}
				} else {
					// array passed in
					data = 'chd=t:' + arrayToData(values);
				}
			}
		}
		return {"data" : data, "labels" : labels};

	}



	// Converts array into googleCharts friendly data string
	function arrayToData(values) {
		// Are we dealing with multi-dimensional array
		// If so then we need to convert array to a string, but with a 
		// pipe seperating each array dimension
		if (typeof values[0] == "object") {
			var r = '';
			// Loop through dimensions
			for (var i = 0, len = values.length; i < len; i++) {
				// If we are onto another dimension then add a pipe character (marks seperation)
				if (i > 0) r = r.slice(0, -1) + '|';
				// Loop through values of array
				for (var x = 0, ilen = values[i].length; x < ilen; x++) {
					r+= values[i][x] + ',';
				}
			}
			// Return formatted string
			return r.slice(0, -1);
		}
		// Else normal single dimensional array, so just return as is
		else { 
			return values;
		}
	}

	// Converts 2 dimensional Json object into an array of values to pass into google charts
	function mapJsonToChartValues(values) {
		var r = [];
		for (value in values) {
			// If first value of JSON is an object, then user has passed in multiple tracked data...
			if (typeof values[value] == "object") {
				// Return this the output of this function instead of building up and returning an array.
				return mapJsonWithMultipleTracksToChartValues(values);
			}
			// Otherwise continue building return value
			r.push(values[value]);
		}
		return r;
	}

	//
	function mapJsonWithMultipleTracksToChartValues(values) {
		var r = '';
		for (track in values) {
			for (value in values[track])
			{
				r += values[track][value] + ",";
			}
			r = r.slice(0,-1) + '|';
		}
		return r.slice(0,-1);
	}

	// Converts 2 dimensional Json object into an array of labels to pass into google charts
	function mapJsonToChartLabels(labels) {
		var r = '';
		for (label in labels) {
			r += label + "|";
		}
		return r.slice(0, -1);
	}

	// Does a quick check of the table to see if it can be used vertically or horizontally, and makes sure there are numeric values where there should be
	function table_check(values) {
		var flag = true,
			counter = 0,
			finalCount = 0,
			arrTR = values.getElementsByTagName('TR'),
			lenTR = arrTR.length,
			x,
			y,
			arrTD,
			arrTD_len;

		// Check to see if we can use the table vertically...
			for(x = 0; x < lenTR; x++) {
				counter = 0;
				arrTD = arrTR[x].getElementsByTagName('TD');
				for(y = 1, arrTD_len = arrTD.length; y < arrTD_len; y++) {
					if(isNaN(Number(arrTD[y].innerHTML))) {
						flag = false;
					}
					if(flag == false) {
						break;
					}
					counter++
				}
				finalCount = counter;
				if(flag == false) {
					break;
				}
				
			}
			if (finalCount > 0) {
				//console.log(['vertical', finalCount]);
				return ['vertical', finalCount];	
			}

		// Check to see if we can use the table horizontally...
			flag = true;
			counter = 0;
			for(x = 1, arrTR = values.getElementsByTagName('TR'), lenTR = arrTR.length; x < lenTR; x++) {
				arrTD = arrTR[x].getElementsByTagName('TD');
				for(y = 0, arrTD_len = arrTD.length; y < arrTD_len; y++) {
					if(isNaN(Number(arrTD[y].innerHTML))) {
						flag = false;
					}
					if(flag == false) {
						break;
					}
				}
				if(flag == false) {
					break;
				}
				counter++;
				
			}
			if (counter > 0) {
				//console.log(['horizontal', counter]);
				return ['horizontal', counter];	
			}

		// If we get this far this means the table isn't two dimensional and we can't use it.
			throw new Error("The submitted table element does not have data that can be used with a chart");
	}

	// Converts 2 dimensional html table into an array of values to pass into google charts
	function mapVerticalTableToChartValues(values, dataDepth) {

		var arrTR = values.getElementsByTagName('TR'),
			arr_values = '';

		for (var j = 1; j <= dataDepth; j++) {

			if (j > 1) {
				arr_values = arr_values.slice(0,-1)+"|";
			}
			
			for(var i = 0, arr_len = arrTR.length; i < arr_len; i++) {
				arr_values += parseInt(arrTR[i].getElementsByTagName('TD')[j].innerHTML) + ",";
			}

		}

		return arr_values.slice(0,-1);

}

	// Converts 2 dimensional html table into an array of values to pass into google charts
	function mapHorizontalTableToChartValues(values, dataDepth) {
		var arrTD,
			arr_values = "";
		for (var j = 1; j <= dataDepth; j++) {
			if (j > 1) {
				arr_values = arr_values.slice(0,-1)+"|";
			}
			arrTD = values.getElementsByTagName('TR')[j].getElementsByTagName('TD');
			for(var i = 0, arr_len = arrTD.length; i < arr_len; i++) {
				arr_values += parseInt(arrTD[i].innerHTML) + ",";
			}
		}
		return arr_values.slice(0,-1);
	}

	// Converts 2 dimensional html table into an array of labels to pass into google charts
	function mapVerticalTableToChartLabels(values) {
		var arrTR = values.getElementsByTagName('TR');
		var arr_values = []
		for(var i = 0, arr_len = arrTR.length; i < arr_len; i++) {
			arr_values.push(arrTR[i].getElementsByTagName('TD')[0].innerHTML);
		}
		return arr_values.toString().replace(/,/g, '|');
	}

	// Converts 2 dimensional html table into an array of labels to pass into google charts
	function mapHorizontalTableToChartLabels(values) {
		var arrTD = values.getElementsByTagName('TR')[0].getElementsByTagName('TD');
		var arr_values = []
		for(var i = 0, arr_len = arrTD.length; i < arr_len; i++) {
			arr_values.push(arrTD[i].innerHTML);
		}
		return arr_values.toString().replace(/,/g, '|');
	}
	
	function convert_type_names(type) {
		switch(type) {
			case 'horizontal': 
				return 'bhs';
				break;
			case 'vertical': 
				return 'bvs';
				break;
			case '3d': 
				return 'p3';
				break;
		}
		return type;
	}
	
	function convert_type_names_for_multi_tracks(type) {
		switch(type) {
/*
 			case 'lc':
			case 'ls':
			case 'lxy': 
				return 'bhg';
				break;
 			case 'bhs':
				return 'bhg';
				break;
			case 'bvs':
				return 'bvg';
				break;
*/
			case 'p3':
			case 'p':
				return 'pc';
				break;
		}
		return type;
	}

	return jsEasyCharts;

})();