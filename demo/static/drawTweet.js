function initDrawTweet( rawdata )
{
    // get the wdith and height
    width.tweet = $('#dvitweet').width() - margin.tweet.left - margin.tweet.right;
    height.tweet = $('#dvitweet').height() - margin.tweet.top - margin.tweet.bottom;

    // select the tweet svg
    tweetSvg = d3.select("#tweet")
	    .attr("width", width.tweet + margin.tweet.left + margin.tweet.right)
	    .attr("height", height.tweet + margin.tweet.top + margin.tweet.bottom);

    // generate the clip
    tweetSvg.append("defs").append("clipPath")
	.attr("id", "tweetclip")
	.append("rect")
	.attr("width", width.tweet)
	.attr("height", height.tweet);

    
    // append the root group as the canvas
    tweetCanvas = tweetSvg.append("g")
	.attr("transform", "translate(" + margin.tweet.left + "," + margin.tweet.top + ")");

    // draw x-axis here
    dateAxis = d3.svg
	    .axis()
	    .scale(dateScale)
	    .orient("bottom")
	    .ticks(10);

    dateAxisGroup = tweetCanvas.append("g")
	.attr("id", "dateAxis")
	.attr("transform", "translate(0," + height.tweet + ")")
	.call(dateAxis);

    // get and parse the tweet data
    tweetData = rawdata['numTweet'];
    for (var i in tweetData) {
	tweetData[i].d = parseDate(tweetData[i].d);
    }

    // prepare to draw tweet path
    tweetScale = d3.scale.linear().range([height.tweet, 0]);
    tweetScale.domain([d3.min(tweetData, function(d) { return d.c; }), d3.max(tweetData, function(d) { return d.c; })]);

    tweetAxis = d3.svg
	.axis()
	.scale(tweetScale)
        .orient("left").ticks(5);

    tweetLine = d3.svg.line()
	    .x(function(d) { return dateScale(d.d); })
	    .y(function(d) { return tweetScale(d.c); });

    // draw y-axis
    tweetCanvas.append("g")
	.attr("id", "tweetAxis")
	.call(tweetAxis);

    // draw the pivot shade
    tweetPivotDate = new Date(uploadDate.getTime());
    tweetPivotDate.addDays(15);
    tweetPivotDateArea = tweetCanvas.append('rect')
	.attr("x", dateScale(uploadDate))
	.attr("y", tweetScale.range()[1])
        .attr("opacity", 0.1)
	.attr("fill", "red")
        .attr("clip-path", "url(#tweetclip)")
	.attr("width", dateScale(tweetPivotDate) - dateScale(uploadDate))
        .attr("height", tweetScale.range()[0]);

    
    // draw tweet path
    tweetCanvas.append("path")
        .attr("id", "tweetPath")
        .attr("clip-path", "url(#tweetclip)")
	.attr("d", tweetLine(tweetData));

    // draw tweet dots
    tweetDots = tweetCanvas.selectAll(".tweet-dots")
	.data(tweetData);  // using the values in the ydata array
    tweetDots.enter().append("svg:circle")  // create a new circle for each value
	.attr("class", "tweet-dots")
	.attr("cy", function (d) { return tweetScale(d.c); } ) // translate y value to a pixel
	.attr("cx", function (d) { return dateScale(d.d); } ) // translate x value
	.attr("r", 3) // radius of circle
	.attr("fill", "red")
	.style("opacity", 0); // opacity of circle

    // bind mouse moving function
    tweetSvg.on('mousemove', onMouseMove);

    // bind click
    tweetSvg.on('click', function() {
	Dajaxice.demo.get_tweetInfo_index(
	    function(data)
	    {
		updateTweet(data['tweetContent']);
	    },
	    { 'videoIndex': videoIndex, 'date': mouseDate.getFullYear()+'-'+(mouseDate.getMonth()+1)+'-'+mouseDate.getDate() }
	);
    });
    
    // draw verticalline
    var verticalLine = tweetCanvas.append('line')
	    .attr({
		'x1': 0,
		'y1': 0,
		'x2': 0,
		'y2': height.tweet
	    })
	    .attr("stroke", "black")
	    .attr('id', 'tweetverticalLine')
	    .style("stroke-dasharray", ("3, 3"));

    // draw text
    tweetCanvas.append("text")
        .attr("id", "tlabel")
        .attr("fill", "red")
        .attr("transform", "translate(" + width.tweet*0.6 + "," + height.tweet*0.6 +")")
        .text("daily tweets");    
    
}


function onDrawTweet( rawdata )
{
    // get the wdith and height
    width.tweet = $('#dvitweet').width() - margin.tweet.left - margin.tweet.right;
    height.tweet = $('#dvitweet').height() - margin.tweet.top - margin.tweet.bottom;

    // select the tweet svg
    tweetSvg.attr("width", width.tweet + margin.tweet.left + margin.tweet.right)
	    .attr("height", height.tweet + margin.tweet.top + margin.tweet.bottom);

    // append the root group as the canvas
    tweetCanvas.attr("transform", "translate(" + margin.tweet.left + "," + margin.tweet.top + ")");

    // draw x-axis here
    dateAxis = d3.svg
	    .axis()
	    .scale(dateScale)
	    .orient("bottom")
	    .ticks(10);

    tweetCanvas.select("#dateAxis")
        .transition()
	.duration(transitionDuration)
	.attr("transform", "translate(0," + height.tweet + ")")
	.call(dateAxis);

    // get and parse the tweet data
    tweetData = rawdata['numTweet'];
    for (var i in tweetData) {
	tweetData[i].d = parseDate(tweetData[i].d);
    }

    // prepare to draw tweet path
    tweetScale = d3.scale.linear().range([height.tweet, 0]);
    tweetScale.domain([d3.min(tweetData, function(d) { return d.c; }), d3.max(tweetData, function(d) { return d.c; })]);

    tweetAxis.scale(tweetScale)
        .orient("left").ticks(5);

    // draw y-axis
    tweetCanvas.select("#tweetAxis")
        .transition()
	.duration(transitionDuration)
	.call(tweetAxis);


    // draw the pivot shade
    tweetPivotDate = new Date(uploadDate.getTime());
    tweetPivotDate.addDays(15);
    tweetPivotDateArea
	.attr("x", dateScale(uploadDate))
	.attr("y", tweetScale.range()[1])
	.attr("width", dateScale(tweetPivotDate) - dateScale(uploadDate))
        .attr("height", tweetScale.range()[0]);

    
    // draw tweet path
    tweetLine = d3.svg.line()
	    .x(function(d) { return dateScale(d.d); })
	    .y(function(d) { return tweetScale(d.c); });
    
    tweetCanvas.select("#tweetPath")
        .transition()
	.duration(transitionDuration)    
	.attr("d", tweetLine(tweetData));

    // draw tweet dots
    tweetDots = tweetCanvas.selectAll(".tweet-dots")
	.data(tweetData);  // using the values in the ydata array
    tweetDots.attr("cy", function (d) { return tweetScale(d.c); } ) // translate y value to a pixel
	.attr("cx", function (d) { return dateScale(d.d); } ) // translate x value
	.attr("r", 3) // radius of circle
        .attr("fill", "red")
	.style("opacity", 0);  // opacity of circle
    tweetDots.enter().append("svg:circle")  // create a new circle for each value
        .attr("class", "tweet-dots")
	.attr("cy", function (d) { return tweetScale(d.c); } ) // translate y value to a pixel
	.attr("cx", function (d) { return dateScale(d.d); } ) // translate x value
	.attr("r", 3) // radius of circle
        .attr("fill", "red")
	.style("opacity", 0); // opacity of circle
    tweetDots.exit().remove();

    // bind mouse moving function
    tweetSvg.on('mousemove', onMouseMove);
    
}


function parseTwitter(text) {
    // Parse URIs
    text = text.replace(/[A-Za-z]+:\/\/[A-Za-z0-9-_]+\.[A-Za-z0-9-_:%&\?\/.=]+/, function(uri) {
	return uri.link(uri);
    });
    
    // Parse Twitter usernames
    text = text.replace(/[@]+[A-Za-z0-9-_]+/, function(u) {
	var username = u.replace("@","");
	return u.link("http://twitter.com/"+username);
    });
    
    // Parse Twitter hash tags
    text = text.replace(/[#]+[A-Za-z0-9-_]+/, function(t) {
	var tag = t.replace("#","%23");
	return t.link("http://search.twitter.com/search?q="+tag);
    });
    return text;
}
