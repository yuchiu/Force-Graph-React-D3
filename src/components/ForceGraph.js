import React from 'react'
import * as d3 from 'd3-3'
import edgesData from '../data/edges_data'
import nodesData from '../data/nodes_data'

class ForceGraph extends React.Component {
  constructor(props) {
    super(props)
    this.createForceGraph = this
      .createForceGraph
      .bind(this)
  }
  componentDidMount() {
    this.createForceGraph()
  }
  componentDidUpdate() {
    this.createForceGraph()
  }
  createForceGraph() {
    const body = this.body
    var width = window.innerWidth;
    var height = window.innerHeight;
    var linkDistance = 200;

    var colors = d3
      .scale
      .category10();

    let dataset = {
      nodes: nodesData,
      links: edgesData
    };

    var svg = d3
      .select(body)
      .append("svg")
      .attr({"width": width, "height": height});

    var force = d3
      .layout
      .force()
      .nodes(dataset.nodes)
      .links(dataset.links)
      .size([width, height])
      .linkDistance([linkDistance])
      .charge([-500])
      .theta(0.1)
      .gravity(0.05)
      .start();

    var links = svg
      .selectAll("line")
      .data(dataset.links)
      .enter()
      .append("line")
      .attr("id", function (d, i) {
        return 'edge' + i
      })
      .attr('marker-end', 'url(#arrowhead)')
      .style("stroke", "#ccc")
      .style("pointer-events", "none");

    var nodes = svg
    .selectAll("circle")
    .data(dataset.nodes)
    .enter()
    .append("circle")
    .attr({"r": 15})
    .attr("class", function(d){ return d.object})
    .style("fill", function (d, i) {
      return colors(i);
    })
    .call(force.drag)
    


  var nodelabels = svg
    .selectAll(".nodelabel")
    .data(dataset.nodes)
    .enter()
    .append("text")
    .attr({
      "x": function (d) {
        return d.x;
      },
      "y": function (d) {
        return d.y;
      }
    })
    .text(function (d) {
      return d.id;
    })

  nodes.on("mousedown", function (d) {
    svg
      .selectAll('text')
      .remove();

      nodelabels = svg
      .selectAll(".nodelabel")
      .data(dataset.nodes)
      .enter()
      .append("text")
      .attr({
        "x": function (d) {
          return d.x;
        },
        "y": function (d) {
          return d.y;
        }
      })
      .text(function (d) {
        return d.label;
      })
  }) //nodeLabel On

  nodes.on("mouseup", function (d) {
    svg
      .selectAll('text')
      .remove();
    nodelabels = svg
      .selectAll(".nodelabel")
      .data(dataset.nodes)
      .enter()
      .append("text")
      .attr({
        "x": function (d) {
          return d.x;
        },
        "y": function (d) {
          return d.y;
        }
      })
      .text(function (d) {
        return d.id;
      })

  }) //nodeLabel On
    var edgepaths = svg
      .selectAll(".edgepath")
      .data(dataset.links)
      .enter()
      .append('path')
      .attr({
        'd': function (d) {
          return 'M ' + d.source.x + ' ' + d.source.y + ' L ' + d.target.x + ' ' + d.target.y
        },
        'class': 'edgepath',
        'fill-opacity': 0,
        'stroke-opacity': 0,
        'fill': 'blue',
        'stroke': 'red',
        'id': function (d, i) {
          return 'edgepath' + i
        }
      })
      .style("pointer-events", "none");

    var edgelabels = svg
      .selectAll(".edgelabel")
      .data(dataset.links)
      .enter()
      .append('text')
      .style("pointer-events", "none")
      .attr({
        'class': 'edgelabel',
        'id': function (d, i) {
          return 'edgelabel' + i
        },
        'dx': 80,
        'dy': 0,
        'font-size': 10,
        'fill': '#aaa'
      });

    edgelabels
      .append('textPath')
      .attr('xlink:href', function (d, i) {
        return '#edgepath' + i
      })
      .style("pointer-events", "none")
      .text(function (d, i) {
        return d.label
      });

    svg
      .append('defs')
      .append('marker')
      .attr({
        'id': 'arrowhead', 'viewBox': '-0 -5 10 10', 'refX': 25, 'refY': 0,
        'orient': 'auto',
        'markerWidth': 10,
        'markerHeight': 10,
        'xoverflow': 'visible'
      })
      .append('svg:path')
      .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
      .attr('fill', '#ccc')
      .attr('stroke', '#ccc');

    force.on("tick", function () {

      links.attr({
        "x1": function (d) {
          return d.source.x;
        },
        "y1": function (d) {
          return d.source.y;
        },
        "x2": function (d) {
          return d.target.x;
        },
        "y2": function (d) {
          return d.target.y;
        }
      });

      nodes.attr({
        "cx": function (d) {
          return d.x;
        },
        "cy": function (d) {
          return d.y;
        }
      });

      nodelabels.attr("x", function (d) {
        return d.x;
      })
        .attr("y", function (d) {
          return d.y;
        });

      edgepaths.attr('d', function (d) {
        var path = 'M ' + d.source.x + ' ' + d.source.y + ' L ' + d.target.x + ' ' + d.target.y;
        return path
      });

      edgelabels.attr('transform', function (d, i) {
        if (d.target.x < d.source.x) {
          let bbox = this.getBBox();
          let rx = bbox.x + bbox.width / 2;
          let ry = bbox.y + bbox.height / 2;
          return 'rotate(180 ' + rx + ' ' + ry + ')';
        } else {
          return 'rotate(0)';
        }
      });
    });
  }
  render() {
    return <svg ref={body => this.body = body} width={'100%'} height={'1200'}></svg>
  }
}

export default ForceGraph;
