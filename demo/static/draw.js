function initDrawing(rawdata) {

    width = $('#viewcount').width() - margin.left - margin.right,
    height = $('#viewcount').height() - margin.top - margin.bottom;

    videoID = rawdata['videoID'];
    videoIndex = rawdata['videoIndex'];
    uploadDate = new Date(rawdata['viewcount'][0].d);
    
    updatePanel();
    
    // select the canvas svg
    canvas = d3.select("#viewcount")
	    .attr("width", width + margin.left + margin.right)
	    .attr("height", height + margin.top + margin.bottom);

    svg = canvas.append("g")
	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // draw x axis
    dateScale = d3.time.scale().range([0, width]);
    dateScale.domain(  [leftDate, rightDate]  );
    dateAxis = d3.svg
	    .axis()
	    .scale(dateScale)
	    .orient("bottom")
	    .ticks(10);

    svg.append("g")
	.attr("id", "dateAxis")
	.attr("transform", "translate(0," + height + ")")
	.call(dateAxis);

    // draw viewcount and axis
    viewcountData = rawdata['viewcount'];
    for (var i in viewcountData) {
	viewcountData[i].d = parseDate(viewcountData[i].d);
    }

    viewcountScale = d3.scale.linear().range([height, 0]);
    viewcountScale.domain([d3.min(viewcountData, function(d) { return d.c; }), d3.max(viewcountData, function(d) { return d.c; })]);
    
    viewcountAxis = d3.svg
	    .axis()
	    .scale(viewcountScale)
            .tickFormat(d3.format('.2e'))
            .orient("left").ticks(5);
    
    viewcountLine = d3.svg.line()
	    .x(function(d) { return dateScale(d.d); })
	    .y(function(d) { return viewcountScale(d.c); });
    
    svg.append("g")
	.attr("id", "viewcountAxis")
	.call(viewcountAxis);
    
    svg.append("path")
        .attr("id", "viewcountPath")
	.attr("d", viewcountLine(viewcountData));

    viewcountDots = svg.selectAll(".viewcount-dots")
	.data(viewcountData);  // using the values in the ydata array
  
    viewcountDots.enter().append("svg:circle")  // create a new circle for each value
        .attr("class", "viewcount-dots")
	.attr("cy", function (d) { return viewcountScale(d.c); } ) // translate y value to a pixel
	.attr("cx", function (d) { return dateScale(d.d); } ) // translate x value
	.attr("r", 3) // radius of circle
        .attr("fill", "steelblue")
	.style("opacity", 0); // opacity of circle

    // draw number of tweet and axis
    tweetData = rawdata['numTweet'];
    for (var j in tweetData) {
	tweetData[j].d = parseDate(tweetData[j].d);
    }

    tweetScale = d3.scale.linear().range([height, 0]);
    tweetScale.domain([0, d3.max(tweetData, function(d) { return d.c; })]);
    
    tweetAxis = d3.svg
	    .axis()
	    .scale(tweetScale)
            .orient("right").ticks(5);

    tweetLine = d3.svg.line()
	    .x(function(d) { return dateScale(d.d); })
	    .y(function(d) { return tweetScale(d.c); });
    

    svg.append("g")
	.attr("id", "tweetAxis")
        .attr("transform", "translate(" + width + ", 0)")
	.call(tweetAxis);
	
    svg.append("path")
	.attr("id", "tweetPath")
	.attr("d", tweetLine(tweetData));

  tweetDots = svg.selectAll(".tweet-dots")
     .data(tweetData);  // using the values in the ydata array
  tweetDots.enter().append("svg:circle")  // create a new circle for each value
     .attr("class", "tweet-dots")
     .attr("cy", function (d) { return tweetScale(d.c); } ) // translate y value to a pixel
     .attr("cx", function (d) { return dateScale(d.d); } ) // translate x value
     .attr("r", 3) // radius of circle
     .attr("fill", "red")
     .style("opacity", 0.0); // opacity of circle

  // draw vertical line
  var verticalLine = svg.append('line')
      .attr({
        'x1': 0,
        'y1': 0,
        'x2': 0,
        'y2': height
       })
      .attr("stroke", "black")
      .attr('class', 'verticalLine')
      .style("stroke-dasharray", ("3, 3"));

  canvas.on('mousemove', function () {
    var mouseXPos = d3.mouse(this)[0] - margin.left;
      
    if (mouseXPos > 0 && mouseXPos < width)
    {
      d3.select(".verticalLine")
	.attr("transform", "translate(" + mouseXPos + ",0)");
      
      mouseDate = dateScale.invert(mouseXPos);

	
      if (Math.ceil( (mouseDate-uploadDate) / 86400000) < 0)
	{
	    return;
	}
      
      if (mouseDate.getHours() < dotBound)
      {
	viewcountDots[0][ lastIndex ].setAttribute("r", 3);
	tweetDots[0][ lastIndex ].setAttribute("r", 3);
        viewcountDots[0][ lastIndex ].style[ "opacity" ] = 0;
        tweetDots[0][ lastIndex ].style[ "opacity" ] = 0;	  
	lastIndex = Math.ceil( (mouseDate-uploadDate) / 86400000);
	viewcountDots[0][lastIndex].setAttribute("r", 5);
	tweetDots[0][lastIndex].setAttribute("r", 5);
        viewcountDots[0][ lastIndex ].style[ "opacity" ] = 0.6;
        tweetDots[0][ lastIndex ].style[ "opacity" ] = 0.6;	  
      }
      
      if (mouseDate.getHours() > 24 - dotBound)
      {
	viewcountDots[0][ lastIndex ].setAttribute("r", 3);
	tweetDots[0][ lastIndex ].setAttribute("r", 3);
        viewcountDots[0][ lastIndex ].style[ "opacity" ] = 0;
        tweetDots[0][ lastIndex ].style[ "opacity" ] = 0;
	lastIndex = Math.ceil( (mouseDate-uploadDate) / 86400000 );
	viewcountDots[0][lastIndex].setAttribute("r", 5);
	tweetDots[0][lastIndex].setAttribute("r", 5);
        viewcountDots[0][ lastIndex ].style[ "opacity" ] = 0.6;
        tweetDots[0][ lastIndex ].style[ "opacity" ] = 0.6;
      }
    }

  });

  canvas.on('click', function() {
    Dajaxice.demo.get_tweetInfo_index(
      function(data)
      {
	updateTweet(data['tweetContent']);
      },
      { 'videoIndex': videoIndex, 'date': mouseDate.getFullYear()+'-'+(mouseDate.getMonth()+1)+'-'+mouseDate.getDate() }
    );
  });
  
}

function onDraw(rawdata) {

    videoID = rawdata['videoID'];
    videoIndex = rawdata['videoIndex'];
    uploadDate = new Date(rawdata['viewcount'][0].d);

    updatePanel();
    
    width = $('#viewcount').width() - margin.left - margin.right;
    height = $('#viewcount').height() - margin.top - margin.bottom;
    

    // select the canvas svg
    canvas.attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom);
    
    svg.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // draw x axis
    dateScale.range([0, width]);
    dateScale.domain(  [leftDate, rightDate]  );
    dateAxis.scale(dateScale)
	    .orient("bottom")
	    .ticks(8);
    
    svg.select("#dateAxis")
        .transition()
	.duration(transitionDuration)
	.attr("transform", "translate(0," + height + ")")
	.call(dateAxis);

    // draw viewcount and axis
    viewcountData = rawdata['viewcount'];
    for (var i in viewcountData) {
	viewcountData[i].d = parseDate(viewcountData[i].d);
    }

    viewcountScale.range([height, 0]);
    viewcountScale.domain([d3.min(viewcountData, function(d) { return d.c; }), d3.max(viewcountData, function(d) { return d.c; })]);
    
    viewcountAxis.scale(viewcountScale)
        .tickFormat(d3.format('.2e'))
        .orient("left").ticks(5);
    
    svg.select("#viewcountAxis")
        .transition()
	.duration(transitionDuration)
	.call(viewcountAxis);
    
    svg.select("#viewcountPath")
        .transition()
	.duration(transitionDuration)
	.attr("d", viewcountLine(viewcountData));
    viewcountDots = svg.selectAll(".viewcount-dots")
	.data(viewcountData);
    viewcountDots.transition()
        .duration(transitionDuration)
	.attr("cy", function (d) { return viewcountScale(d.c); } ) // translate y value to a pixel
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

    
    
    // draw number of tweet and axis
  
    tweetData = rawdata['numTweet'];
    for (var j in tweetData) {
	tweetData[j].d = parseDate(tweetData[j].d);
    }

    tweetScale.range([height, 0]);
    tweetScale.domain([0, d3.max(tweetData, function(d) { return d.c; })]);
    
    tweetAxis.scale(tweetScale)
        .orient("right").ticks(5);
  
    svg.select("id", "tweetAxis")
        .transition()
	.duration(transitionDuration)
        .attr("transform", "translate(" + width + ", 0)")
	.call(tweetAxis);

  svg.select("#tweetAxis")
     .transition()
     .duration(transitionDuration)
     .call(tweetAxis);
  
    svg.select("#tweetPath")
        .transition()
	.duration(transitionDuration)
	.attr("d", tweetLine(tweetData));

    tweetDots = svg.selectAll(".tweet-dots")
		   .data(tweetData);  // using the values in the ydata array
    tweetDots.attr("class", "tweet-dots")
             .transition()
             .duration(transitionDuration)
	     .attr("cy", function (d) { return tweetScale(d.c); } ) // translate y value to a pixel
	     .attr("cx", function (d) { return dateScale(d.d); } ) // translate x value
	     .attr("r", 3) // radius of circle
	     .attr("fill", "red")
	     .style("opacity", 0); // opacity of circle
    tweetDots.enter().append("svg:circle")  // create a new circle for each value
	     .attr("class", "tweet-dots")
	     .attr("cy", function (d) { return tweetScale(d.c); } ) // translate y value to a pixel
	     .attr("cx", function (d) { return dateScale(d.d); } ) // translate x value
	     .attr("r", 3) // radius of circle
	     .attr("fill", "red")
	     .style("opacity", 0); // opacity of circle
    tweetDots.exit().remove();

  
}


function updateTweet(data) {

    $('#divviewcounttitle').html("<p id='tweeton'> Tweets on " + mouseDate.getFullYear() + '-' + (mouseDate.getMonth()+1) + '-' + mouseDate.getDate() + "</p>");
    tmp = data;
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


function updatePanel() {
    $("#videoID").val(videoID);
    $("#videoIndex").val(videoIndex);
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