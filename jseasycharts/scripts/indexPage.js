window.onload = function () {

	// CHART DEMO CONTENTS ROLLOVER
	// ****************************

	// LINES
	$('ul#line_demos li:eq(0)').hover(function() {$('img#line_charts_img').attr('src', 'http://chart.apis.google.com/chart?chs=200x150&chd=t:80,15,45,11,70,55&cht=lc&&chco=&');});
	$('ul#line_demos li:eq(1)').hover(function() {$('img#line_charts_img').attr('src', 'http://chart.apis.google.com/chart?chs=200x150&chd=t:70,54,51,60,33,30&cht=lc&chco=ff0000&chxl=0:|Jan|Feb|Mar|Apr|May|Jun&chxt=x');});
	$('ul#line_demos li:eq(2)').hover(function() {$('img#line_charts_img').attr('src', 'http://chart.apis.google.com/chart?chs=200x150&chd=t:36,42,53,40,39,30,36,45,50&cht=lc&chxl=0:|1st|2nd|3rd|4th|5th|6th|7th|8th|9th|1:|0%|25%|50%|75%|100%&chco=&chxt=x,y');});
	$('ul#line_demos li:eq(3)').hover(function() {$('img#line_charts_img').attr('src', 'http://chart.apis.google.com/chart?chs=200x150&chd=t:20,17,13,8,4,-1,1,0,-1,-3,-6,-5,-2,2&cht=lc&chxl=0:|01|02|03|04|05|06|07|08|09|10|11|12|13|14|1:|-10|-6|-2|0|2|6|10|14|18|20&chco=&chxt=x,y&chds=-10,20');});
	$('ul#line_demos li:eq(4)').hover(function() {$('img#line_charts_img').attr('src', 'http://chart.apis.google.com/chart?chs=200x150&chd=t:86,75,82,69,50,34|29,22,25,40,49,55&cht=lc&&chco=99cc00,cc9900&');});

	// BARS
	$('ul#bar_demos li:eq(0)').hover(function() {$('img#bar_charts_img').attr('src', 'http://chart.apis.google.com/chart?chs=200x150&chd=t:60,40,10&cht=bhs&&chco=&&chds=,140');});
	$('ul#bar_demos li:eq(1)').hover(function() {$('img#bar_charts_img').attr('src', 'http://chart.apis.google.com/chart?chs=200x150&chd=t:10,20,30,40&cht=bhs&chxl=0:|Apricots|Walnuts|Hazelnut|Almond&chco=99cc00&chxt=y,x&chds=,140');});
	$('ul#bar_demos li:eq(2)').hover(function() {$('img#bar_charts_img').attr('src', 'http://chart.apis.google.com/chart?chs=200x150&chd=t:33,16,20&cht=bhg&chxl=0:|Lib%20Dem|Lab|Con|1:|0%|25%|50%|75%|100%&chco=&chxt=y,x&chds=,140');});
	$('ul#bar_demos li:eq(3)').hover(function() {$('img#bar_charts_img').attr('src', 'http://chart.apis.google.com/chart?chs=200x150&chd=t:30,10,40,20&cht=bvs&chxl=0:|Hazelnut|Apricots|Almond|Walnuts&chco=&chxt=x,y&chds=,140&chbh=20,30');});
	$('ul#bar_demos li:eq(4)').hover(function() {$('img#bar_charts_img').attr('src', 'http://chart.apis.google.com/chart?chs=200x150&chd=t:80,-70,120,-40&cht=bvs&chxl=0:|Nov|Dec|Jan|Feb|1:|-80|-60|-40|-20|0|20|40|60|80|100|120|140&chco=&chxt=x,y&chds=,140&chbh=40,5&chds=-80,140');});
	$('ul#bar_demos li:eq(5)').hover(function() {$('img#bar_charts_img').attr('src', 'http://chart.apis.google.com/chart?chs=200x150&chd=t:10,20,30|40,50,60|70,80,90&cht=bhs&chxl=0:|january|february|march&chco=99cc00,cc9900,0099cc&chxt=y,x&chds=,140&chds=0,300');});

	// PIES
	$('ul#pie_demos li:eq(0)').hover(function() {$('img#pie_charts_img').attr('src', 'http://chart.apis.google.com/chart?chs=200x150&chd=t:10,10,10&cht=p&&chco=&undefined');});
	$('ul#pie_demos li:eq(1)').hover(function() {$('img#pie_charts_img').attr('src', 'http://chart.apis.google.com/chart?chs=200x150&chd=t:10,20,30,40&cht=p&chl=Apricots|Walnuts|Hazelnut|Almond&chco=&undefined');});
	$('ul#pie_demos li:eq(2)').hover(function() {$('img#pie_charts_img').attr('src', 'http://chart.apis.google.com/chart?chs=200x150&chd=t:33,16,20&cht=p3&chco=0000ff,ff0000,ffff00&undefined');});
	$('ul#pie_demos li:eq(3)').hover(function() {$('img#pie_charts_img').attr('src', 'http://chart.apis.google.com/chart?chs=200x150&chd=t:21,14,5,47,5,3,2&cht=p&chl=IE7|IE6|IE8|FF|CH|SF|OTHERS&chco=99cc00&undefined');});
	$('ul#pie_demos li:eq(4)').hover(function() {$('img#pie_charts_img').attr('src', 'http://chart.apis.google.com/chart?chs=200x150&chd=t:25,15,20,30,10|15,20,30,10,25&cht=pc&&chco=0099cc');});

	// SIDE-BY-SIDES
	$('ul#sideBySide_demos li:eq(0)').hover(function() {$('img#sideBySide_charts_img').attr('src', 'img/sideBySide_1.gif');});
	$('ul#sideBySide_demos li:eq(1)').hover(function() {$('img#sideBySide_charts_img').attr('src', 'img/sideBySide_2.gif');});
	$('ul#sideBySide_demos li:eq(2)').hover(function() {$('img#sideBySide_charts_img').attr('src', 'img/sideBySide_3.gif');});
	$('ul#sideBySide_demos li:eq(3)').hover(function() {$('img#sideBySide_charts_img').attr('src', 'img/sideBySide_4.gif');});
			
}