function decideInitDateDomain(rawdata)
{
    uploadDate = new Date(rawdata['viewcount'][0].d);

    initLeftDate = new Date("2009-07-31");

    if (initLeftDate < uploadDate)
    {
	initLeftDate = uploadDate;
    }

    initLeftDate.setHours(0);

    initRightDate = new Date(initLeftDate.getTime());
    initRightDate.addDays(90);
}

function initDateRange(rawdata)
{
    // get width of the svg
    width.viewcount = $('#viewcount').width() - margin.viewcount.left - margin.viewcount.right;

    // generate the datescale
    dateScale = d3.time.scale().range([0, width.viewcount]);

    // set domain
    decideInitDateDomain(rawdata);
    
    dateScale.domain(  [initLeftDate, initRightDate]  );

    dateAxis = d3.svg
	.axis()
	.scale(dateScale)
	.orient("bottom")
	.ticks(10);
}


function onMouseMove() {

    mouseXPos = d3.mouse(this)[0] - margin.viewcount.left; // margin.viewcount.left = margin.tweet.left

    if (mouseXPos > 0 && mouseXPos < width.viewcount)
    {
	
	mouseDate = dateScale.invert(mouseXPos);
	
	if (Math.ceil( (mouseDate-uploadDate) / 86400000) < 0)
	{
	    return;
	}

	d3.select("#viewcountverticalLine")
	    .attr("transform", "translate(" + mouseXPos + ",0)");

	d3.select("#tweetverticalLine")
	    .attr("transform", "translate(" + mouseXPos + ",0)");


	if (mouseDate > tweetRightDate && lastIndex >= tweetDots[0].length)
	{
	    return;
	}
	
	if (mouseDate.getHours() <= dotBound)
	{
	    viewcountDots[0][ lastIndex ].setAttribute("r", 3);
            viewcountDots[0][ lastIndex ].style[ "opacity" ] = 0;

	    tweetDots[0][ lastIndex ].setAttribute("r", 3);
	    tweetDots[0].forEach(function(d){ d.style[ "opacity" ] = 0; });
	    
	    lastIndex = Math.min(tweetDots[0].length-1, Math.ceil( (mouseDate-uploadDate) / 86400000));
	    
	    viewcountDots[0][lastIndex].setAttribute("r", 5);
	    viewcountDots[0][ lastIndex ].style[ "opacity" ] = 0.6;

	    tweetDots[0][ lastIndex ].setAttribute("r", 5);
	    tweetDots[0][ lastIndex ].style[ "opacity" ] = 0.6;

	}
	
	if (mouseDate.getHours() > 24 - dotBound)
	{
	    viewcountDots[0][ lastIndex ].setAttribute("r", 3);
            viewcountDots[0][ lastIndex ].style[ "opacity" ] = 0;

	    tweetDots[0][ lastIndex ].setAttribute("r", 3);
	    tweetDots[0].forEach(function(d){ d.style[ "opacity" ] = 0; });
	    
	    lastIndex = Math.min(tweetDots[0].length-1, Math.ceil( (mouseDate-uploadDate) / 86400000));
	    
	    viewcountDots[0][lastIndex].setAttribute("r", 5);
	    viewcountDots[0][ lastIndex ].style[ "opacity" ] = 0.6;

	    tweetDots[0][lastIndex].setAttribute("r", 5);
	    tweetDots[0][ lastIndex ].style[ "opacity" ] = 0.6;

	}
    }
    
}


Date.prototype.addDays = function(days) {
    this.setDate(this.getDate() + days);
    return this;
};


function updateTweet(data) {
    console.log(data);
    $('#divviewcounttitle').html("<p id='tweeton'> Tweets on " + mouseDate.getFullYear() + '-' + (mouseDate.getMonth()+1) + '-' + mouseDate.getDate() + "</p>");
    var html = '';
    for (var i in data)
    {
	html = html + "<ul class='tweetlist'>";
	html = html + "<li class='tweetauthor'>" +  parseTwitter("<i>by</i> @" + data[i]['author']) + ' <i>at</i> ' + data[i]['time'] + '</li>';
	html = html + "<li class='tweetcontent'>" + parseTwitter(data[i]['tweet']) + '</li>';
	html = html + '</ul>';
	html = html + "<hr class='tweethr'>";
    }
    $("#divtweetcontent").html(html);
}