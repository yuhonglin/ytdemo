function initDrawFeatureScore(fsdata) {

    width.featureScore = $('#featurescore').width() - margin.featureScore.left - margin.featureScore.right,
    height.featureScore = $('#featurescore').height() - margin.featureScore.top - margin.featureScore.bottom;

    featureScoreSvg = d3.select("#featurescore")
	    .attr("width", width.featureScore + margin.featureScore.left + margin.featureScore.right)
	    .attr("height", height.featureScore + margin.featureScore.top + margin.featureScore.bottom);
    
    featureScoreCanvas = featureScoreSvg.append("g")
	.attr("transform", "translate(" + margin.featureScore.left + "," + margin.featureScore.top + ")");

    featureScoreXScale = d3.scale.ordinal()
	.rangeRoundBands([0, width.featureScore], .1, 1);

    featureScoreYScale = d3.scale.linear()
	.range([height.featureScore, 0]);

    featureScoreXAxis = d3.svg.axis()
	.scale(featureScoreXScale)
	.orient("bottom");

    featureScoreYAxis = d3.svg.axis()
	.scale(featureScoreYScale)
	.orient("left");

    // format the data
    generateFeatureScoreData(fsdata);

    // set the domain
    featureScoreXScale.domain(featureScoreData.map(function(d) { return d.n; }));
    featureScoreYScale.domain([d3.min([d3.min(featureScoreData, function(d) { return d.s; }), featureScoreYMinRange[0]]), d3.max([d3.max(featureScoreData, function(d) { return d.s; }), featureScoreYMinRange[1]])]);

    featureScoreCanvas.selectAll(".bar")
	.data(featureScoreData)
	.enter().append("rect")
	.attr("class", "bar")
	.attr("x", function(d) { return featureScoreXScale(d.n); })
	.attr("width", featureScoreXScale.rangeBand())
	.attr("y", function(d) { return featureScoreYScale(Math.max(0, d.s)); })
	.attr("height", function(d) { return Math.abs(featureScoreYScale(d.s)-featureScoreYScale(0)); });

    // draw x axis
    featureScoreCanvas.append("g")
      .attr("id", "featureScoreXAxis")
      .attr("transform", "translate(0," + height.featureScore + ")")
      .call(featureScoreXAxis)
	.selectAll("text")  
        .style("text-anchor", "end")
        .attr("transform", function(d) {
            return "rotate(-40)";
        });
    
    // draw y axis
    featureScoreCanvas.append("g")
	.attr("id", "featureScoreYAxis")
	.call(featureScoreYAxis)
	.append("text")
	.attr("transform", "rotate(-90)")
	.attr("y", 5)
	.attr("dy", ".5em")
	.style("text-anchor", "end")
	.text("Score in SVM");

    // add onclick
    featureScoreSvg.on('click', onFeatureScoreClick);
    
}




function onDrawFeatureScore(fsdata) {
    
    width.featureScore = $('#featurescore').width() - margin.featureScore.left - margin.featureScore.right,
    height.featureScore = $('#featurescore').height() - margin.featureScore.top - margin.featureScore.bottom;

    featureScoreSvg.attr("width", width.featureScore + margin.featureScore.left + margin.featureScore.right)
	.attr("height", height.featureScore + margin.featureScore.top + margin.featureScore.bottom);
    
    featureScoreCanvas.attr("transform", "translate(" + margin.featureScore.left + "," + margin.featureScore.top + ")");

    featureScoreXScale = d3.scale.ordinal()
	.rangeRoundBands([0, width.featureScore], .1, 1);

    featureScoreYScale = d3.scale.linear()
	.range([height.featureScore, 0]);

    featureScoreXAxis = d3.svg.axis()
	.scale(featureScoreXScale)
	.orient("bottom");

    featureScoreYAxis = d3.svg.axis()
	.scale(featureScoreYScale)
	.orient("left");

    // format the data
    generateFeatureScoreData(fsdata);

    // set the domain
    featureScoreXScale.domain(featureScoreData.map(function(d) { return d.n; }));
    featureScoreYScale.domain([d3.min([d3.min(featureScoreData, function(d) { return d.s; }), featureScoreYMinRange[0]]), d3.max([d3.max(featureScoreData, function(d) { return d.s; }), featureScoreYMinRange[1]])]);

    featureScoreCanvas.selectAll(".bar")
	.data(featureScoreData)
        .transition()
	.duration(transitionDuration)        
	.attr("class", "bar")
	.attr("x", function(d) { return featureScoreXScale(d.n); })
	.attr("width", featureScoreXScale.rangeBand())
	.attr("y", function(d) { return featureScoreYScale(Math.max(0, d.s)); })
	.attr("height", function(d) { return Math.abs(featureScoreYScale(d.s)-featureScoreYScale(0)); });

    // draw x axis
    featureScoreCanvas.select("#featureScoreXAxis")
        .transition()
	.duration(transitionDuration)        
	.attr("transform", "translate(0," + height.featureScore + ")")
	.call(featureScoreXAxis)
	.selectAll("text")  
        .style("text-anchor", "end")
        .attr("transform", function(d) {
            return "rotate(-40)";
        });
    
    // draw y axis
    featureScoreCanvas.select("#featureScoreYAxis")
        .transition()
	.duration(transitionDuration)    
	.call(featureScoreYAxis);

}


function generateFeatureScoreData(data)
{
    featureScoreData = [];
    for( var i in data)
    {
	featureScoreData.push({n:data[i][0], s:mean(data[i][1])});
    }
}

function onFeatureScoreClick()
{
    var featureScoreXScaleSorted = featureScoreXScale.domain(featureScoreData.sort(featureScoreSorted
        ? function(a, b) { featureScoreSorted = false; return d3.ascending(a.n, b.n); }
        : function(a, b) { featureScoreSorted = true; return b.s - a.s; })
        .map(function(d) { return d.n; }))
        .copy();

    featureScoreCanvas.selectAll(".bar").transition().duration(750)
        .attr("x", function(d) { return featureScoreXScaleSorted(d.n); });

    featureScoreCanvas.select("#featureScoreXAxis").transition().duration(750)
	.attr("transform", "translate(0," + height.featureScore + ")")    
        .call(featureScoreXAxis)
    	.selectAll("text")  
        .style("text-anchor", "end");

}


function mean(numbers) {
    var total = 0,
        i;
    for (i = 0; i < numbers.length; i += 1) {
        total += numbers[i];
    }
    return total / numbers.length;
}
