function initDrawFeatureScore(fsdata) {

    fsWidth = $('#featurescore').width() - fsMargin.left - fsMargin.right,
    fsHeight = $('#featurescore').height() - fsMargin.top - fsMargin.bottom;

    fsMin = Infinity;
    fsMax = -Infinity;

    fsdata.forEach(function(x) {
	fsRowMax = Math.max.apply(Math, x[1]);
	fsRowMin = Math.min.apply(Math, x[1]);
	if (fsRowMax > fsMax) fsMax = fsRowMax;
	if (fsRowMin < fsMin) fsMin = fsRowMin;
    });

    fsChart = d3.box()
	.whiskers(iqr(1.5))
	.height(fsHeight)	
	.domain([fsMin, fsMax])
        .showLabels(fsShowLabel);

    fsXScale = d3.scale.ordinal()
		 .domain( fsdata.map(function(d) { console.log(d[0]); return d[0]; } ) )
		 .rangeRoundBands([0 , fsWidth], 0.8, 0.1);

    fsXAxis = d3.svg.axis()
		   .scale(fsXScale)
		   .orient("bottom");

    fsYScale = d3.scale.linear()
		 .domain([fsMin, fsMax])
		 .range([fsHeight + fsMargin.top, 0 + fsMargin.top]);
 
    fsYAxis = d3.svg.axis()
		   .scale(fsYScale)
		   .orient("left");
 
    fsSvg = d3.select("#featurescore")
	.attr("width", fsWidth + fsMargin.left + fsMargin.right)
	.attr("height", fsHeight + fsMargin.top + fsMargin.bottom)
	.attr("class", "box");
    
    fsPlot = fsSvg.append("g")
	.attr("transform", "translate(" + fsMargin.left + "," + fsMargin.top + ")");
    
    fsPlot.selectAll(".box")
	.data(fsdata)
	.enter().append("g")
	.attr("transform", function(d) { return "translate(" +  fsXScale(d[0])  + "," + fsMargin.top + ")"; } )
	.call(fsChart.width(fsXScale.rangeBand()));

    // draw y axis
    fsPlot.append("g")
        .attr("class", "y axis")
        .call(fsYAxis)
	.append("text") // and text1
	.attr("transform", "rotate(-90)")
	.attr("y", -50)
        .attr("x", -80)
	.attr("dy", ".71em")
	.style("text-anchor", "end")
	.style("font-size", "16px") 
	.text("Score in SVM");
    
    // draw x axis	
    fsPlot.append("g")
	.attr("class", "x axis")
	.attr("transform", "translate(0," + (fsHeight  + fsMargin.top) + ")")
	.call(fsXAxis)
        .selectAll("text")  
            .style("text-anchor", "end")
            .attr("transform", function(d) {
                return "rotate(-40)";
                })
	.append("text")             // text label for the x axis
        .attr("x", (fsWidth / 2) )
        .attr("y",  35 )
	.attr("dy", ".71em")
        .style("text-anchor", "middle")
	.style("font-size", "16px") 
        .text("Feature Name"); 

}





function drawFeatureScore(fsdata) {

    fsWidth = $('#featurescore').width() - fsMargin.left - fsMargin.right,
    fsHeight = $('#featurescore').height() - fsMargin.top - fsMargin.bottom;

    fsMin = Infinity;
    fsMax = -Infinity;

    fsdata.forEach(function(x) {
	fsRowMax = Math.max.apply(Math, x[1]);
	fsRowMin = Math.min.apply(Math, x[1]);
	if (fsRowMax > fsMax) fsMax = fsRowMax;
	if (fsRowMin < fsMin) fsMin = fsRowMin;
    });

    fsChart = d3.box()
	.whiskers(iqr(1.5))
	.height(fsHeight)	
	.domain([fsMin, fsMax])
        .showLabels(fsShowLabel);

    fsXScale = d3.scale.ordinal()
		 .domain( fsdata.map(function(d) { console.log(d[0]); return d[0]; } ) )
		 .rangeRoundBands([0 , fsWidth], 0.8, 0.1);

    fsXAxis = d3.svg.axis()
		   .scale(fsXScale)
		   .orient("bottom");

    fsYScale = d3.scale.linear()
		 .domain([fsMin, fsMax])
		 .range([fsHeight + fsMargin.top, 0 + fsMargin.top]);
 
    fsYAxis = d3.svg.axis()
		   .scale(fsYScale)
		   .orient("left");
 
    fsSvg = d3.select("#featurescore")
	.attr("width", fsWidth + fsMargin.left + fsMargin.right)
	.attr("height", fsHeight + fsMargin.top + fsMargin.bottom)
	.attr("class", "box");

    fsPlot.remove();
    
    fsPlot = fsSvg.append("g")
	.attr("transform", "translate(" + fsMargin.left + "," + fsMargin.top + ")");
    
    fsPlot.selectAll(".box")
	.data(fsdata)
	.enter().append("g")
	.attr("transform", function(d) { return "translate(" +  fsXScale(d[0])  + "," + fsMargin.top + ")"; } )
	.call(fsChart.width(fsXScale.rangeBand()));

    // draw y axis
    fsPlot.append("g")
        .attr("class", "y axis")
        .call(fsYAxis)
	.append("text") // and text1
	.attr("transform", "rotate(-90)")
	.attr("y", -50)
        .attr("x", -80)
	.attr("dy", ".71em")
	.style("text-anchor", "end")
	.style("font-size", "16px") 
	.text("Score in SVM");
    
    // draw x axis	
    fsPlot.append("g")
	.attr("class", "x axis")
	.attr("transform", "translate(0," + (fsHeight  + fsMargin.top) + ")")
	.call(fsXAxis)
        .selectAll("text")  
            .style("text-anchor", "end")
            .attr("transform", function(d) {
                return "rotate(-40)";
                })
	.append("text")             // text label for the x axis
        .attr("x", (fsWidth / 2) )
        .attr("y",  35 )
	.attr("dy", ".71em")
        .style("text-anchor", "middle")
	.style("font-size", "16px") 
        .text("Feature Name"); 

}



 // Returns a function to compute the interquartile range.
function iqr(k) {
  return function(d, i) {
    var q1 = d.quartiles[0],
        q3 = d.quartiles[2],
        iqr = (q3 - q1) * k,
        i = -1,
        j = d.length;
    while (d[++i] < q1 - iqr);
    while (d[--j] > q3 + iqr);
    return [i, j];
  };
} 