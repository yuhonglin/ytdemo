function initDrawViewcount( rawdata )
{
    // get the wdith and height
    width.viewcount = $('#dviviewcount').width() - margin.viewcount.left - margin.viewcount.right;
    height.viewcount = $('#dviviewcount').height() - margin.viewcount.top - margin.viewcount.bottom;

    // update some meta data
    videoID = rawdata['videoID'];
    videoIndex = rawdata['videoIndex'];
    uploadDate = new Date(rawdata['viewcount'][0].d);
    uploadDate.setHours(0);
    viewcountRank = rawdata['viewcountRank'] + 1;
    predictedTarget = rawdata['predictedTarget'];

    // update rankInPredictor
    $('#fslegend').html('Predicted rank ' + pt_name[predictedTarget]  + ' top 5%');
    $('#vtlegend').html('Viewcount and Tweets (real rank : ' + viewcountRank  + '/30k)');
    
    // update video link
    $('#youtubevideoembed').html('<object width="' + $('#videofieldset').width()  +  'px" height="' + ($('#videofieldset').height()-15)  + 'px"><param name="movie" value="//www.youtube.com/v/' + videoID + '?hl=en_GB&amp;version=3"></param><param name="allowFullScreen" value="true"></p\
aram><param name="allowscriptaccess" value="always"></param><embed src="//www.youtube.com/v/' + videoID + '?hl=en_GB&amp;version=3" type="application/x-shockwave-flash" width="' + $('#videofieldset').width()  +  'px" height="' + ($('#videofieldset').height()-15) + 'px" allowscriptacc\
ess="always" allowfullscreen="true"></embed></object>');
    
    // select the viewcount svg
    viewcountSvg = d3.select("#viewcount")
	    .attr("width", width.viewcount + margin.viewcount.left + margin.viewcount.right)
	    .attr("height", height.viewcount + margin.viewcount.top + margin.viewcount.bottom);

    // generate the clip
    viewcountSvg.append("defs").append("clipPath")
	.attr("id", "viewcountclip")
	.append("rect")
	.attr("width", width.viewcount)
	.attr("height", height.viewcount);
    
    // append the root group as the canvas
    viewcountCanvas = viewcountSvg.append("g")
	.attr("transform", "translate(" + margin.viewcount.left + "," + margin.viewcount.top + ")");

    // do not need to draw x-axis here

    // get and parse the viewcount data
    viewcountData = rawdata['viewcount'];
    for (var i in viewcountData) {
	viewcountData[i].d = parseDate(viewcountData[i].d);
    }

    // prepare to draw viewcount path
    viewcountScale = d3.scale.linear().range([height.viewcount, 0]);
    viewcountScale.domain(
	[
	    d3.min(viewcountData, function(d) { return d.c; }),
	    d3.max([d3.max(viewcountData, function(d) { return d.c; }), viewcountYMinRange[1]])
	]);
		  
    viewcountAxis = d3.svg
	.axis()
	.scale(viewcountScale)
//        .tickFormat(d3.format('.1e'))
        .orient("left").ticks(5);
    
    viewcountLine = d3.svg.line()
	    .x(function(d) { return dateScale(d.d); })
	    .y(function(d) { return viewcountScale(d.c); });

    // draw y-axis
    viewcountCanvas.append("g")
	.attr("id", "viewcountAxis")
	.call(viewcountAxis);


    // draw bound line
    viewcountBoundLine = viewcountCanvas.append('line')
	.attr({
	    'x1': dateScale(dateScale.domain()[0]),
	    'y1': viewcountScale(18910),
	    'x2': dateScale(dateScale.domain()[1]),
	    'y2': viewcountScale(18910)
	})
	.attr("stroke", "black")
	.attr('id', 'viewcountBoundLine')
	.style("stroke-dasharray", ("5, 10"));

    // draw pivot date line
    pivotDate = new Date(uploadDate.getTime());
    pivotDate.addDays(90);
    viewcountPivotDateLine = viewcountCanvas.append('line')
	.attr({
	    'x1': dateScale(pivotDate),
	    'y1': 0,
	    'x2': dateScale(pivotDate),
	    'y2': viewcountScale.range()[0]
	})
	.attr("stroke", "black")
	.attr('id', 'viewcountPivotDateLine')
	.attr("clip-path", "url(#viewcountclip)")
	.style("stroke-dasharray", ("5, 10"));



    // draw viewcount path
    viewcountCanvas.append("path")
        .attr("id", "viewcountPath")
        .attr("clip-path", "url(#viewcountclip)")
	.attr("d", viewcountLine(viewcountData));

    // draw viewcount dots
    viewcountDots = viewcountCanvas.selectAll(".viewcount-dots")
	.data(viewcountData);  // using the values in the ydata array
    viewcountDots.enter().append("svg:circle")  // create a new circle for each value
        .attr("class", "viewcount-dots")
	.attr("cy", function (d) { return viewcountScale(d.c); } ) // translate y value to a pixel
	.attr("cx", function (d) { return dateScale(d.d); } ) // translate x value
	.attr("r", 3) // radius of circle
        .attr("fill", "steelblue")
	.style("opacity", 0); // opacity of circle

    // draw verticalline
    var verticalLine = viewcountCanvas.append('line')
	    .attr({
		'x1': 0,
		'y1': 0,
		'x2': 0,
		'y2': height.viewcount
	    })
	    .attr("stroke", "black")
	    .attr('id', 'viewcountverticalLine')
	    .style("stroke-dasharray", ("3, 3"));

    // draw text
    viewcountCanvas.append("text")
        .attr("id", "vclabel")
	.attr("fill", "steelblue")
        .attr("transform", "translate(" + width.viewcount*0.6 + "," + height.viewcount*0.6 +")")
        .text("cumulated viewcount");
    
}



function onDrawViewcount( rawdata )
{
    // get the wdith and height
    width.viewcount = $('#dviviewcount').width() - margin.viewcount.left - margin.viewcount.right;
    height.viewcount = $('#dviviewcount').height() - margin.viewcount.top - margin.viewcount.bottom;
    
    // update some meta data
    videoID = rawdata['videoID'];
    videoIndex = rawdata['videoIndex'];
    uploadDate = new Date(rawdata['viewcount'][0].d);
    uploadDate.setHours(0);
    viewcountRank = rawdata['viewcountRank'] + 1;
    predictedTarget = rawdata['predictedTarget'];

    // update rankInPredictor
    // $('#fslegend').html('Feature Scores (prediction:' + predictedTarget + ')');
    $('#fslegend').html('Predicted rank ' + pt_name[predictedTarget]  + ' top 5%');
    $('#vtlegend').html('Viewcount and Tweets (real rank : ' + viewcountRank  + '/30k)');
      
    // update video link
    $('#youtubevideoembed').html('<object width="' + $('#videofieldset').width()  +  'px" height="' + ($('#videofieldset').height()-15)  + 'px"><param name="movie" value="//www.youtube.com/v/' + videoID + '?hl=en_GB&amp;version=3"></param><param name="allowFullScreen" value="true"></p\
aram><param name="allowscriptaccess" value="always"></param><embed src="//www.youtube.com/v/' + videoID + '?hl=en_GB&amp;version=3" type="application/x-shockwave-flash" width="' + $('#videofieldset').width()  +  'px" height="' + ($('#videofieldset').height()-15) + 'px" allowscriptacc\
ess="always" allowfullscreen="true"></embed></object>');
    
    // select the viewcount svg
    viewcountSvg.attr("width", width.viewcount + margin.viewcount.left + margin.viewcount.right)
	    .attr("height", height.viewcount + margin.viewcount.top + margin.viewcount.bottom);

    // append the root group as the canvas
    viewcountCanvas.attr("transform", "translate(" + margin.viewcount.left + "," + margin.viewcount.top + ")");

    // do not need to draw x-axis here

    // get and parse the viewcount data
    viewcountData = rawdata['viewcount'];
    for (var i in viewcountData) {
	viewcountData[i].d = parseDate(viewcountData[i].d);
    }

    // prepare to draw viewcount path
    viewcountScale = d3.scale.linear().range([height.viewcount, 0]);
    viewcountScale.domain(
	[
	    d3.min(viewcountData, function(d) { return d.c; }),
	    d3.max([d3.max(viewcountData, function(d) { return d.c; }), viewcountYMinRange[1]])
	]);

    viewcountAxis.scale(viewcountScale)
//        .tickFormat(d3.format('.1e'))
        .orient("left").ticks(5);

    // draw y-axis
    viewcountCanvas.select("#viewcountAxis")
        .transition()
	.duration(transitionDuration)    
	.call(viewcountAxis);
    
    // draw viewcount path
    viewcountLine = d3.svg.line()
	    .x(function(d) { return dateScale(d.d); })
	    .y(function(d) { return viewcountScale(d.c); });

    // draw bound line
    viewcountBoundLine
	.attr({
	    'x1': dateScale(dateScale.domain()[0]),
	    'y1': viewcountScale(18910),
	    'x2': dateScale(dateScale.domain()[1]),
	    'y2': viewcountScale(18910)
	});

    // draw pivot date line    
    pivotDate = new Date(uploadDate.getTime());
    pivotDate.addDays(90);
    viewcountPivotDateLine
	.attr({
	    'x1': dateScale(pivotDate),
	    'y1': 0,
	    'x2': dateScale(pivotDate),
	    'y2': viewcountScale.range()[0]
	});
    
    viewcountCanvas.select("#viewcountPath")
        .transition()
	.duration(transitionDuration)
	.attr("d", viewcountLine(viewcountData));

    // draw viewcount dots
    viewcountDots = viewcountCanvas.selectAll(".viewcount-dots")
	.data(viewcountData);  // using the values in the ydata array
    viewcountDots.attr("cy", function (d) { return viewcountScale(d.c); } ) // translate y value to a pixel
	.attr("cx", function (d) { return dateScale(d.d); } ) // translate x value
	.attr("r", 3) // radius of circle
        .attr("fill", "steelblue")
	.style("opacity", 0);  // opacity of circle
    viewcountDots.enter().append("svg:circle")  // create a new circle for each value
        .attr("class", "viewcount-dots")
	.attr("cy", function (d) { return viewcountScale(d.c); } ) // translate y value to a pixel
	.attr("cx", function (d) { return dateScale(d.d); } ) // translate x value
	.attr("r", 3) // radius of circle
        .attr("fill", "steelblue")
	.style("opacity", 0); // opacity of circle
    viewcountDots.exit().remove();

    
}

