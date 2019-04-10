"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

// TODO: remove these import
// import { axisLeft, axisRight, axisBottom, axisTop } from 'd3-axis'
// import { scaleTime } from 'd3-scale'
// import 'd3-transition'
// import { max, extent } from 'd3-array'
// import { SvgChart, helper } from 'd3kit'
// import labella from 'labella'

/* globals d3, labella */
var rectWidth = function rectWidth(d) {
  return d.w;
};

var rectHeight = function rectHeight(d) {
  return d.h;
};

var identity = function identity(d) {
  return d;
};

var Kairoi =
/*#__PURE__*/
function () {
  function Kairoi(element, options) {
    var _this = this;

    _classCallCheck(this, Kairoi);

    options = this.setOptions(options); // In d3-kit this is automatically created by SvgChart
    // Here we are doing it manually

    this._vis = d3.select(element).append('svg').attr('width', options.initialWidth).attr('height', options.initialHeight).append('g').attr('transform', "translate(".concat(options.margin.left + 0.5, ", ").concat(options.margin.top + 0.5, ")")) // 0.5 was a constant added by svgchart
    ;
    ['dummy', 'main', 'main/axis', 'main/link', 'main/label', 'main/dot'].forEach(function (layerName) {
      _this._createLayer(layerName);
    });

    this._getLayer('main/axis').classed('axis', true);

    this.updateLabelText = this.updateLabelText.bind(this);
    this.draw = this.draw.bind(this);

    this._vis.on('data', this.draw);

    this._vis.on('options', this.draw);

    this._vis.on('resize', this.draw); // Private properties


    this._data = [];
  }

  _createClass(Kairoi, [{
    key: "setOptions",
    value: function setOptions(newOptions) {
      // TODO: merging options with default
      var options = this.options();

      var mergeObjects = function mergeObjects(dest, source) {
        Object.keys(source).forEach(function (key) {
          if (dest[key]) {
            var sourceValue = source[key];

            if (_typeof(sourceValue) === 'object') {
              sourceValue = mergeObjects(dest[key], sourceValue);
            }

            dest[key] = sourceValue;
          }
        });
        return dest;
      };

      if (newOptions) {
        mergeObjects(options, newOptions);
      }

      return options;
    }
  }, {
    key: "options",
    value: function options() {
      if (!this._options) {
        // Default options
        this._options = {
          margin: {
            left: 40,
            right: 20,
            top: 20,
            bottom: 20
          },
          initialWidth: 1200,
          initialHeight: 80,
          scale: d3.scaleTime(),
          domain: undefined,
          direction: 'up',
          dotRadius: 3,
          formatAxis: identity,
          layerGap: 60,
          labella: {},
          keyFn: undefined,
          timeFn: function timeFn(d) {
            return d.date;
          },
          textFn: function textFn(d) {
            return d.label;
          },
          dotColor: '#222',
          linkColor: '#222',
          labelTextStyle: {},
          labelBgColor: '#222',
          labelTextColor: '#fff',
          labelPadding: {
            left: 4,
            right: 4,
            top: 3,
            bottom: 2
          },
          textYOffset: '0.85em'
        };
        this._options.labelTextStyle.fill = this._options.labelTextColor;
      }

      return this._options;
    }
  }, {
    key: "getInnerWidth",
    value: function getInnerWidth() {
      var options = this.options();
      return options.initialWidth - options.margin.right - options.margin.left;
    }
  }, {
    key: "getInnerHeight",
    value: function getInnerHeight() {
      var options = this.options();
      return options.initialHeight - options.margin.top - options.margin.bottom;
    } // TODO: re-enable events
    // static getCustomEventNames () {
    //   return [
    //     'dotClick',
    //     'dotMouseover',
    //     'dotMousemove',
    //     'dotMouseout',
    //     'dotMouseenter',
    //     'dotMouseleave',
    //     'labelClick',
    //     'labelMouseover',
    //     'labelMousemove',
    //     'labelMouseenter',
    //     'labelMouseleave',
    //     'labelMouseout'
    //   ]
    // }

  }, {
    key: "_createLayer",
    value: function _createLayer(layerName) {
      // TODO: Allow a grater depth than two layers only...
      var parent = this._vis;
      layerName = layerName.split('/');

      if (layerName.length > 1) {
        parent = parent.select('g.' + layerName[0] + '-layer');
        layerName = layerName[1];
      }

      var layer = parent.append('g').classed(layerName + '-layer', true);
      return layer;
    }
  }, {
    key: "_getLayer",
    value: function _getLayer(layerName) {
      var vis = this._vis;
      var layerNames = [];

      if (layerName.indexOf('/') > 0) {
        layerNames = layerName.split('/');
      } else {
        layerNames.push(layerName);
      }

      var layer = vis.select('g.' + layerNames[0] + '-layer' + (layerNames[1] ? ' g.' + layerNames[1] + '-layer' : ''));
      return layer;
    }
  }, {
    key: "hasData",
    value: function hasData() {
      return this._data.length > 0;
    }
  }, {
    key: "data",
    value: function data(_data) {
      if (!_data) {
        return this._data;
      } else {
        this._data = _data;
      }
    }
  }, {
    key: "updateLabelText",
    value: function updateLabelText(selection, textStyle, accessor) {
      var options = this.options(); // Polyfill for the implemetation of d3.functor(). This was deperacted in version 4.x
      // See more at https://github.com/d3/d3/blob/f797dfe883ee510f32acadf3ab8be736146e5927/CHANGES.md#internals

      function constant(x) {
        return function () {
          return x;
        };
      }

      accessor = typeof accessor === 'function' ? accessor : constant(accessor);
      selection.text(function (d) {
        return options.textFn(accessor(d));
      }).attr('dy', options.textYOffset).attr('x', options.labelPadding.left).attr('y', options.labelPadding.top);
      Object.keys(textStyle).forEach(function (key) {
        selection.style(key, textStyle[key]);
      });
      return selection;
    }
  }, {
    key: "drawAxes",
    value: function drawAxes() {
      var options = this.options();
      var axisTransform;

      switch (options.direction) {
        case 'right':
          this.axis = d3.axisLeft();
          axisTransform = 'translate(' + 0 + ',' + 0 + ')';
          break;

        case 'left':
          this.axis = d3.axisRight();
          axisTransform = 'translate(' + this.getInnerWidth() + ',' + 0 + ')';
          break;

        case 'up':
          this.axis = d3.axisBottom();
          axisTransform = 'translate(' + 0 + ',' + this.getInnerHeight() + ')';
          break;

        case 'down':
          this.axis = d3.axisTop();
          axisTransform = 'translate(' + 0 + ',' + 0 + ')';
          break;
      }

      this._getLayer('main').attr('transform', axisTransform); // TODO: We may want to get rid of it?


      var formatAxis = options.formatAxis || identity;
      formatAxis(this.axis.scale(options.scale));

      this._getLayer('main/axis').call(this.axis);

      return this;
    }
  }, {
    key: "drawDots",
    value: function drawDots(data) {
      var options = this.options();

      var timePos = function timePos(d) {
        return options.scale(options.timeFn(d));
      };

      var sUpdate = this._getLayer('main/dot').selectAll('circle.dot').data(data, options.keyFn);

      var field = 'cx';
      sUpdate.enter().append('circle').classed('dot', true) // TODO: re-enable events
      // .on('click', this.dispatchAs('dotClick'))
      // .on('mouseover', this.dispatchAs('dotMouseover'))
      // .on('mousemove', this.dispatchAs('dotMousemove'))
      // .on('mouseout', this.dispatchAs('dotMouseout'))
      // .on('mouseenter', this.dispatchAs('dotMouseenter'))
      // .on('mouseleave', this.dispatchAs('dotMouseleave'))
      .style('fill', options.dotColor).attr('r', options.dotRadius).attr(field, timePos);
      sUpdate.transition().style('fill', options.dotColor).attr('r', options.dotRadius).attr(field, timePos);
      sUpdate.exit().remove();
      return this;
    }
  }, {
    key: "drawLabels",
    value: function drawLabels(nodes, labelTextStyle) {
      var options = this.options();
      var nodeHeight;

      if (options.direction === 'left' || options.direction === 'right') {
        nodeHeight = d3.max(nodes, rectWidth);
      } else {
        nodeHeight = d3.max(nodes, rectHeight);
      } // Calculate layerGap for labella renderer


      if (options.direction === 'up' || options.direction === 'down') {
        var numLayers = 0;
        var maxRectHeight = 0;
        nodes.map(function (node) {
          if (numLayers < node.layerIndex) {
            numLayers = node.layerIndex;
          }

          if (node.h > maxRectHeight) {
            maxRectHeight = node.h;
          }
        });
        numLayers++;
        options.layerGap = (this.getInnerHeight() - numLayers * maxRectHeight) / numLayers;
      }

      var renderer = new labella.Renderer({
        nodeHeight: nodeHeight,
        layerGap: options.layerGap,
        direction: options.direction
      });
      renderer.layout(nodes);

      function nodePos(d) {
        switch (options.direction) {
          case 'right':
            return 'translate(' + d.x + ',' + (d.y - d.dy / 2) + ')';

          case 'left':
            return 'translate(' + (d.x + nodeHeight - d.w) + ',' + (d.y - d.dy / 2) + ')';

          case 'up':
            return 'translate(' + (d.x - d.dx / 2) + ',' + d.y + ')';

          case 'down':
            return 'translate(' + (d.x - d.dx / 2) + ',' + d.y + ')';
        }
      }

      var labelBgColor = function labelBgColor(data) {
        // TODO: make this field customizable
        return data.labelBgColor ? data.labelBgColor : options.labelBgColor;
      };

      var linkColor = function linkColor() {
        return options.linkColor;
      }; // Draw label rectangles


      var selection = this._getLayer('main/label').selectAll('g.label-g').data(nodes, options.keyFn ? function (d) {
        return options.keyFn(d.data);
      } : undefined);

      var sEnter = selection.enter().append('g').classed('label-g', true) // TODO: re-enable events
      // .on('click', this.dispatchAs('labelClick'))
      // .on('mouseover', this.dispatchAs('labelMouseover'))
      // .on('mousemove', this.dispatchAs('labelMousemove'))
      // .on('mouseenter', this.dispatchAs('labelMouseenter'))
      // .on('mouseleave', this.dispatchAs('labelMouseleave'))
      // .on('mouseout', this.dispatchAs('labelMouseout'))
      .attr('transform', nodePos);
      sEnter.append('rect').classed('label-bg', true).attr('rx', 2).attr('ry', 2).attr('width', rectWidth).attr('height', rectHeight).style('fill', function (d) {
        return labelBgColor(d.data);
      });
      sEnter.append('text').classed('label-text', true).call(this.updateLabelText, labelTextStyle, function (d) {
        return d.data;
      });
      var sTrans = selection.transition().attr('transform', nodePos);
      sTrans.select('rect').attr('width', rectWidth).attr('height', rectHeight).style('fill', function (d) {
        return labelBgColor(d.data);
      });
      sTrans.select('text.label-text').call(this.updateLabelText, labelTextStyle, function (d) {
        return d.data;
      });
      selection.exit().remove(); // Draw path from point on the timeline to the label rectangle

      var paths = this._getLayer('main/link').selectAll('path.link').data(nodes, options.keyFn ? function (d) {
        return options.keyFn(d.data);
      } : undefined);

      paths.enter().append('path').classed('link', true).attr('d', function (d) {
        return renderer.generatePath(d);
      }).style('stroke', function (d) {
        return linkColor(d.data);
      }).style('fill', 'none');
      paths.transition().attr('d', function (d) {
        return renderer.generatePath(d);
      }).style('stroke', function (d) {
        return linkColor(d.data);
      });
      paths.exit().remove();
      return this;
    }
  }, {
    key: "_createNodes",
    value: function _createNodes() {
      var _this2 = this;

      var options = this.options();

      var dummyText = this._getLayer('dummy').append('text').classed('label-text', true);

      var timePos = function timePos(d) {
        return options.scale(options.timeFn(d));
      };

      var nodes = this._data.map(function (d) {
        var bbox = dummyText.call(_this2.updateLabelText, options.labelTextStyle, d).node().getBBox();
        var w = bbox.width + options.labelPadding.left + options.labelPadding.right;
        var h = bbox.height + options.labelPadding.top + options.labelPadding.bottom;
        var node = new labella.Node(timePos(d), options.direction === 'left' || options.direction === 'right' ? h : w, d);
        node.w = w;
        node.h = h;
        return node;
      });

      dummyText.remove();

      this._force.options(options.labella).nodes(nodes).compute();
    }
  }, {
    key: "draw",
    value: function draw() {
      if (!this.hasData()) return;
      var data = this.data() || [];
      var options = this.options();

      if (options.direction === 'up' || options.direction === 'down') {
        if (!options.labella.maxPos) {
          options.labella.maxPos = options.initialWidth - options.margin.left - options.margin.right;

          if (!options.labella.density) {
            options.labella.density = 1;
          }
        }
      }

      this._force = new labella.Force(options.labella);

      if (options.domain) {
        options.scale.domain(options.domain);
      } else {
        options.scale.domain(d3.extent(data, options.timeFn)).nice();
      }

      options.scale.range([0, options.direction === 'left' || options.direction === 'right' ? this.getInnerHeight() : this.getInnerWidth()]);

      this._createNodes();

      this.drawAxes();
      this.drawDots(data);
      this.drawLabels(this._force.nodes(), options.labelTextStyle);
      return this;
    }
  }, {
    key: "version",
    get: function get() {
      return '0.0.1';
    }
  }]);

  return Kairoi;
}();