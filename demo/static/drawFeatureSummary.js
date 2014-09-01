function initDrawActiveFeatureSummary(fsdata) {

    width.activeFeature = $('#activefeature').width() - margin.activeFeature.left - margin.activeFeature.right,
    height.activeFeature = $('#activefeature').height() - margin.activeFeature.top - margin.activeFeature.bottom;

    var min = Infinity;
    var max = -Infinity;

    var rowmax = 0;
    var rowmin = 0;
    fsdata.forEach(function(x) {
	rowmax = Math.max.apply(Math, x[1]);
	rowmin = Math.min.apply(Math, x[1]);
	if (rowmax > max) max = rowmax;
	if (rowmin < min) min = rowmin;
    });

    activeFeatureBox = d3.box()
	.whiskers(iqr(1.5))
	.height(height.activeFeature)	
	.domain([0.9, max])
        .tickFormat(function(d) { return Math.round(d-1);})
	.showLabels(activeFeatureIsShowLabel);    

    activeFeatureXScale = d3.scale.ordinal()
		 .domain( fsdata.map(function(d) { return d[0]; } ) )
		 .rangeRoundBands([0 , width.activeFeature], 0.8, 0.1);

    activeFeatureXAxis = d3.svg.axis()
		   .scale(activeFeatureXScale)
		   .orient("bottom");

    activeFeatureYScale = d3.scale.log()
                 .base(10)
		 .domain([min, max])
		 .range([height.activeFeature + margin.activeFeature.top, 0 + margin.activeFeature.top]);
 
    activeFeatureYAxis = d3.svg.axis()
	           .tickFormat(function(d){ if (d%3==0) {return Math.round(d-1);} else{return "";}; })
		   .scale(activeFeatureYScale)
		   .orient("left");
 
    activeFeatureSvg = d3.select("#activefeature")
	.attr("width", width.activeFeature + margin.activeFeature.left + margin.activeFeature.right)
	.attr("height", height.activeFeature + margin.activeFeature.top + margin.activeFeature.bottom)
	.attr("class", "box");
    
    activeFeaturePlot = activeFeatureSvg.append("g")
        .attr("id", "activefeatureplot")
	.attr("transform", "translate(" + margin.activeFeature.left + "," + margin.activeFeature.top + ")");
    
    activeFeaturePlot.selectAll(".box")
	.data(fsdata)
	.enter().append("g")
	.attr("transform", function(d) { return "translate(" +  activeFeatureXScale(d[0])  + "," + margin.activeFeature.top + ")"; } )
	.call(activeFeatureBox.width(activeFeatureXScale.rangeBand()));

    activeFeaturePlot.append("g")
	.attr("id", "activefeaturexxaxis")
        .attr("stroke-width", 1)
        .attr("transform", "translate(0," + (height.activeFeature + margin.activeFeature.top) +  ")")
	.call(activeFeatureXAxis);
    
    activeFeaturePlot.append("g")
	.attr("id", "activefeaturexyaxis")
	.call(activeFeatureYAxis);
    
}

function onDrawActiveFeatureSummary(fsdata) {
    activeFeaturePlot.remove();
    initDrawActiveFeatureSummary(fsdata);
}



function initDrawGraphFeatureSummary(fsdata) {
    
    width.graphFeature = $('#graphfeature').width() - margin.graphFeature.left - margin.graphFeature.right,
    height.graphFeature = $('#graphfeature').height() - margin.graphFeature.top - margin.graphFeature.bottom;

    var min = Infinity;
    var max = -Infinity;

    var rowmax = 0;
    var rowmin = 0;
    fsdata.forEach(function(x) {
	rowmax = Math.max.apply(Math, x[1]);
	rowmin = Math.min.apply(Math, x[1]);
	if (rowmax > max) max = rowmax;
	if (rowmin < min) min = rowmin;
    });

    graphFeatureBox = d3.box()
	.whiskers(iqr(1.5))
	.height(height.graphFeature)	
	.domain([0.9, max])
        .tickFormat(function(d) { return Math.round(d-1);})
	.showLabels(graphFeatureIsShowLabel);    

    graphFeatureXScale = d3.scale.ordinal()
		 .domain( fsdata.map(function(d) { return d[0]; } ) )
		 .rangeRoundBands([0 , width.graphFeature], 0.8, 0.1);

    graphFeatureXAxis = d3.svg.axis()
		   .scale(graphFeatureXScale)
		   .orient("bottom");

    graphFeatureYScale = d3.scale.log()
                 .base(10)
		 .domain([min, max])
		 .range([height.graphFeature + margin.graphFeature.top, 0 + margin.graphFeature.top]);
 
    graphFeatureYAxis = d3.svg.axis()
	           .tickFormat(function(d){ if (d%3==0) {return Math.round(d-1);} else{return "";}; })
		   .scale(graphFeatureYScale)
		   .orient("left");
 
    graphFeatureSvg = d3.select("#graphfeature")
	.attr("width", width.graphFeature + margin.graphFeature.left + margin.graphFeature.right)
	.attr("height", height.graphFeature + margin.graphFeature.top + margin.graphFeature.bottom)
	.attr("class", "box");
    
    graphFeaturePlot = graphFeatureSvg.append("g")
        .attr("id", "graphfeatureplot")
	.attr("transform", "translate(" + margin.graphFeature.left + "," + margin.graphFeature.top + ")");
    
    graphFeaturePlot.selectAll(".box")
	.data(fsdata)
	.enter().append("g")
	.attr("transform", function(d) { return "translate(" +  graphFeatureXScale(d[0])  + "," + margin.graphFeature.top + ")"; } )
	.call(graphFeatureBox.width(graphFeatureXScale.rangeBand()));
	

    graphFeaturePlot.append("g")
	.attr("id", "graphfeaturexxaxis")
        .attr("stroke-width", 1)
        .attr("transform", "translate(0," + (height.graphFeature + margin.graphFeature.top) +  ")")
	.call(graphFeatureXAxis);
    
    graphFeaturePlot.append("g")
	.attr("id", "graphfeaturexyaxis")
	.call(graphFeatureYAxis);
    
}

function onDrawGraphFeatureSummary(fsdata) {
    graphFeaturePlot.remove();
    initDrawGraphFeatureSummary(fsdata);
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



