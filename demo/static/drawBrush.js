function initDrawBrush(rawdata)
{
    // get the wdith and height
    width.context = $('#context').width() - margin.context.left - margin.context.right;
    height.context = $('#context').height() - margin.context.top - margin.context.bottom;

    contextXScale = d3.time.scale()
            .range([0, width.context])
            .domain([d3.min(viewcountData, function(d) { return d.d; }), d3.max(viewcountData, function(d) { return d.d; })]);

    contextAxis = d3.svg.axis()
            .scale(contextXScale)
            .tickSize(height.context)
            .tickPadding(1)
            .orient("bottom")
            .ticks(5);
    
    brush = d3.svg.brush()
        .x(contextXScale)
        .on("brush", onBrush);

    contextSvg = d3.select("#context")
                    .attr("width", width.context + margin.context.left + margin.context.right)
                    .attr("height", height.context + margin.context.top + margin.context.bottom)
                    .on("mouseover", function(d){d3.select("#contextbackground").style({"fill": 'steelblue'});})
                    .on("mouseout", function(d){d3.select("#contextbackground").style({"fill":"#F0F0F0"});});

    
    contextCanvas = contextSvg.append("g")
        .attr("transform", "translate(" + (margin.context.left) + "," + (margin.context.top) + ")");

    contextCanvas.append("g")
        .attr("id", "contextaxis")
        .attr("transform", "translate(0,0)")
        .call(contextAxis);


    contextArea = d3.svg.area()
            .interpolate("monotone")
            .x(function(d) { return contextXScale(d.d); })
            .y0(height.context)
            .y1(0);
        


    contextCanvas.append("path")
        .attr("id", "contextbackground")
        .attr("fill", "#F0F0F0")
	.attr("d", contextArea(viewcountData));
	

    brush.extent([initLeftDate, initRightDate]);
    
    brushGroup = contextCanvas.append("g")
        .attr("id", "brush")
        .attr("stroke", "#000")
        .attr("fill-opacity", ".125")
        .attr("shape-rendering", "crispEdges")
        .call(brush)
        .selectAll("rect")
        .attr("y", 0)
        .attr("height", height.context);

    // contextCanvas.append("text")
    //     .attr("id", "contextinstructions")
    //     .attr("transform", "translate("+ width.context *.33 +"," + (height.context + 20) + ")")
    //     .text('Click and drag above to zoom / pan the data');

}


function onDrawBrush(rawdata)
{
    // get the wdith and height
    width.context = $('#context').width() - margin.context.left - margin.context.right;
    height.context = $('#context').height() - margin.context.top - margin.context.bottom;

    contextXScale.range([0, width.context])
            .domain([d3.min(viewcountData, function(d) { return d.d; }), d3.max(viewcountData, function(d) { return d.d; })]);

    contextAxis = d3.svg.axis()
            .scale(contextXScale)
            .tickSize(height.context)
            .tickPadding(1)
            .orient("bottom")
            .ticks(5);

    contextSvg = d3.select("#context")
                    .attr("width", width.context + margin.context.left + margin.context.right)
                    .attr("height", height.context + margin.context.top + margin.context.bottom);
    
    contextCanvas.attr("transform", "translate(" + (margin.context.left) + "," + (margin.context.top) + ")");

    contextCanvas.select("#contextaxis")
        .attr("transform", "translate(0,0)")
        .call(contextAxis);

    contextArea = d3.svg.area()
            .interpolate("monotone")
            .x(function(d) { return contextXScale(d.d); })
            .y0(height.context)
            .y1(0);

    contextCanvas.select("#contextbackground")
	.attr("d", contextArea(viewcountData));

    brush.extent([initLeftDate, initRightDate]);
    
    d3.select("#brush").attr("stroke", "#fff")
        .attr("fill-opacity", ".125")
        .attr("shape-rendering", "crispEdges")
        .call(brush)
        .selectAll("rect")
        .attr("y", 0)
        .attr("height", height.context);

    contextCanvas.select("#contextinstructions")
        .attr("id", "contextinstructions")
        .attr("transform", "translate("+ width.context *.33 +"," + (height.context + 20) + ")")
        .text('Click and drag above to zoom / pan the data');
}



function onBrush(){
    /* this will return a date range to pass into the chart object */
    dateScale.domain(brush.empty() ?  contextXScale.domain() : brush.extent());
    
    d3.select("#viewcountPath")
	.attr("d", viewcountLine(viewcountData));
    d3.select("#tweetPath")
	.attr("d", tweetLine(tweetData));

    d3.select("#dateAxis")
	.attr("transform", "translate(0," + height.tweet + ")")
	.call(dateAxis);


    // draw viewcount dots
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


    // draw tweet dots
    tweetDots.attr("cy", function (d) { return tweetScale(d.c); } ) // translate y value to a pixel
	.attr("cx", function (d) { return dateScale(d.d); } ) // translate x value
	.attr("r", 3) // radius of circle
        .attr("fill", "steelblue")
	.style("opacity", 0);  // opacity of circle
    tweetDots.enter().append("svg:circle")  // create a new circle for each value
        .attr("class", "tweet-dots")
	.attr("cy", function (d) { return tweetScale(d.c); } ) // translate y value to a pixel
	.attr("cx", function (d) { return dateScale(d.d); } ) // translate x value
	.attr("r", 3) // radius of circle
        .attr("fill", "red")
	.style("opacity", 0); // opacity of circle
    tweetDots.exit().remove();
    
    
}

