$(document).ready(function(){

  var womenParliament = function(){
    var margin = {
      top: 30,
      right: 10,
      bottom: 30,
      left: 50
    };

    // women in Parliament form 2000 to 2013
    var chartdata = [10.4, 10.4, 10.4, 10.4, 10.5, 10.5, 10.4, 16.8, 17, 17.8, 17.8, 17.8, 23.8, 26.2],
        // size of graphci
        height = 400 - margin.top - margin.bottom,
        width = 720 - margin.left - margin.right,
        barWidth = 40,
        barOffset = 20;

    var dates = [2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013];

    var yScale = d3.scale.linear()
          .domain([0, d3.max(chartdata)])
          .range([0, height]);

    var xScale = d3.scale.ordinal()
          .domain(d3.range(0, chartdata.length))
          .rangeBands([0, width]);

    var dynamicColor;
    var colors = d3.scale.linear()
          .domain([0, chartdata.length * 0.33, chartdata.length * 0.66, chartdata.length])
          .range(['#d6e9c6', '#bce8f1', '#faebcc', '#ebccd1']);

    var chart = d3.select('#women-parliament').append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .style('background', '#fff')
      .append('g')
      .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')')
      .selectAll('rect').data(chartdata)
      .enter().append('rect')
      .style({
        'fill': function(data, i){
          return '#2b908f'; //colors(i);
        }, 'stroke': '#fff', 'stroke-width': '1'
      })
      .attr('width', xScale.rangeBand())
      .attr('height', 0)
      .attr('x', function (data, i) {
        return xScale(i);
      })
      .attr('y', function (data) {
        return height - yScale(data);
      })
      .attr('height', 0)
      .attr('y', height)
      .on('mouseover', function(data) {
        dynamicColor = this.style.fill;
        d3.select(this)
          .style('fill', function(i){
            return colors(i);
          });
      })
      .on('mouseout', function(data) {
        d3.select(this)
          .style('fill', dynamicColor);
      });

    // animation and transformation
    chart.transition()
      .attr('height', function(data){
        return yScale(data);
      })
      .attr('y', function(data){
        return height - yScale(data);
      })
      .delay(function(data, i){
        return i * 40;
      })
      .duration(2000)
      .ease('elastic-in');

    // lines
    var verticalGuideScale = d3.scale.linear()
      .domain([0, d3.max(chartdata)])
      .range([height, 0]);
   
    var vAxis = d3.svg
        .axis()
          .scale(verticalGuideScale)
          .orient('left')
          .ticks(10)
          .tickFormat(function(i){
            return i + '%';
          });

    var verticalGuide = d3.select('svg').append('g');

    vAxis(verticalGuide);
    verticalGuide.attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');
    verticalGuide.selectAll('path')
      .style({fill: 'none', stroke: "#3c763d"});
    verticalGuide.selectAll('line')
      .style({stroke: "#3c763d"});

    var hAxis = d3.svg.axis()
      .scale(xScale)
      .orient('bottom')
      .tickFormat(function(i){
        return dates[i];
      });

    var horizontalGuide = d3.select('svg').append('g');

    hAxis(horizontalGuide);
    horizontalGuide.attr('transform', 'translate(' + margin.left + ', ' + (height + margin.top) + ')');
    horizontalGuide.selectAll('path')
      .style({fill: 'none', stroke: "#3c763d"});

    horizontalGuide.selectAll('line')
      .style({stroke: "#3c763d"});
  };

  // maternal mortality
  function mm() {

    var margin = {top: 20, right: 20, bottom: 30, left: 40},
        width = 720 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    var x = d3.scale.ordinal()
        .rangeRoundBands([0, width], 0.1);

    var y = d3.scale.linear()
        .range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    var colors = d3.scale.linear()
        .domain([0, 10 * 0.33, 10 * 0.66, 10])
        .range(['#37bc9b', '#ed5565', '#4a89dc', '#f6bb42']);

    var xLine = d3.scale.linear().range([0, width]),
        yLine = d3.scale.linear().range([height, 0]);

    var line = d3.svg.line()
          .x(function(d) { return x(d.year); })
          .y(function(d) { return y(d.pm); });

    var lineAnimation = d3.svg.line()
          .x(function(d) { return x(d.year); })
          .y(function(d) { return y(0); });

    var svg = d3.select("#maternal-mortality").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    d3.tsv("women-parliament.tsv", type, function(error, data) {
      x.domain(data.map(function(d) { return d.year; }));
      y.domain([0, d3.max(data, function(d) { return d.pm; })]);

      svg.append("g")
          .attr("class", "axis axis--x")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis)
          .append("text")
            .attr("y", 19)
            .attr("x", width - 10)
            .text("year");

      var detailBox = svg.append("svg:text")
            .attr("class", "text")
            .attr("dx", "20px")
            .attr("dy", "-5px");

      svg.append("g")
          .attr("class", "axis axis--y")
          .call(yAxis)
        .append("text")
          .attr("y", -15)
          .attr("x", -10)
          .attr("dy", ".71em")
          .style("text-anchor", "end")
          .text("‰"); // per mille == ‰

      // add line
      svg.append('path')
        .datum(data)
        .attr('class', 'line')
        .style({ 'stroke-dasharray': '5'})
        .attr('d', lineAnimation)
        .transition()
          .duration(2000)
          .attr('d', line)
          .ease('easeOutQuad');

      svg.selectAll(".bar")
          .data(data)
        .enter().append("rect")
          .attr("class", "bar")
          .style({'fill': function(data, i){
            return '#ccc';// colors(i);
          }, 'opacity': '0.66'})
          .attr("height", function(data) {
            return height - y(data.pm);
          })
          .attr("x", function(d) { return x(d.year); })
          .attr("width", x.rangeBand())
          .attr("y", function(d) { return y(d.pm) - 500; })
          .attr("height", function(d) { return height - y(d.pm); })
          .on("mouseover", function(d, i, j) {
            detailBox.attr("x", x(d.year))
              .attr("y", y(d.pm))
              .text((d.pm))
              .style({"visibility": "visible", "opacity": 1});
        
          }).on("mouseout", function() {
            detailBox.style({"visibility": "hidden", "opacity": 0});
          })
        .transition()
          .attr("y", function(d) { return y(d.pm); })
          .delay(function(data, i){
            return i * 80;
          })
          .duration(1500)
          .ease('elastic-out-in');
    });

    function type(d) {
      d.pm = +d.pm;
      return d;
    }

  }

  // The distribution of the daily time stock
  function createDayilyTimeStock(){

    var width = 800,
    height = 450,
    radius = Math.min(width, height) / 2;

    var color = d3.scale.category10();

    var pie = d3.layout.pie()
        .value(function(d) { return d.women; })
        .sort(null);

    var arc = d3.svg.arc()
        .innerRadius(radius - 100)
        .outerRadius(radius - 20);

    var svg = d3.select("#daily-time-stock").append("svg")
        .attr("width", width)
        .attr("height", height)
      .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
    
    var outerArc = d3.svg.arc()
      .innerRadius(radius * 0.9)
      .outerRadius(radius * 0.9);

    d3.tsv("daily-time-stock.tsv", type, function(error, data) {
      var path = svg.datum(data).selectAll("path")
          .data(pie)
        .enter().append("path")
          .attr("fill", function(d, i) {
            console.log(color(i));
            return color(i); })
          .attr("d", arc)
          .attr("data-legend", function(d){
            return d.data.title;
          })
          .each(function(d) { this._current = d; }); // store the initial angles

      d3.selectAll("input")
        .on("change", change);

      svg.append("g")
        .attr("class", "labels");

      svg.append("g")
        .attr("class", "lines");

      function change() {
        var value = this.value;
        pie.value(function(d) { return d[value]; }); // change the value function
        path = path.data(pie); // compute the new angles
        path.transition().duration(750).attrTween("d", arcTween); // redraw the arcs
        updateAfterChange(data);
      }

    updateAfterChange(data, 'women');
    function updateAfterChange(data){
        var text = svg.select(".labels").selectAll("text")
              .data(pie(data));

        text.enter()
          .append("text")
          .attr("dy", ".35em")
          .text(function(d, i) {
            return d.data.title;
          });

        function midAngle(d){
          return d.startAngle + (d.endAngle - d.startAngle)/2;
        }
        text.transition().duration(1000)
          .attrTween("transform", function(d) {
            this._current = this._current || d;
            var interpolate = d3.interpolate(this._current, d);
            this._current = interpolate(0);
            return function(t) {
              var d2 = interpolate(t);
              var pos = outerArc.centroid(d2);
              pos[0] = radius * (midAngle(d2) < Math.PI ? 1 : -1);
              return "translate("+ pos +")";
            };
          })
          .styleTween("text-anchor", function(d){
            this._current = this._current || d;
            var interpolate = d3.interpolate(this._current, d);
            this._current = interpolate(0);
            return function(t) {
              var d2 = interpolate(t);
              return midAngle(d2) < Math.PI ? "start":"end";
            };
          });

        text.exit()
          .remove();

        var polyline = svg.select(".lines").selectAll("polyline")
            .data(pie(data));
          
        polyline.enter()
          .append("polyline");

        polyline.transition().duration(1000)
          .attrTween("points", function(d){
            this._current = this._current || d;
            var interpolate = d3.interpolate(this._current, d);
            this._current = interpolate(0);
            return function(t) {
              var d2 = interpolate(t);
              var pos = outerArc.centroid(d2);
              pos[0] = radius * 0.95 * (midAngle(d2) < Math.PI ? 1 : -1);
              return [arc.centroid(d2), outerArc.centroid(d2), pos];
            };
          });
        
        polyline.exit()
          .remove();
      }
    });
  

    function type(d) {
      d.men = +d.men;
      d.women = +d.women;
      d.title = d.title;
      return d;
    }

    // Store the displayed angles in _current.
    // Then, interpolate from _current to the new angles.
    // During the transition, _current is updated in-place by d3.interpolate.
    function arcTween(a) {
      var i = d3.interpolate(this._current, a);
      this._current = i(0);
      return function(t) {
        return arc(i(t));
      };
    }

  }

  // init functions
  womenParliament();
  mm();
  createDayilyTimeStock();

});