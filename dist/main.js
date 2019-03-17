"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/* globals d3 */
var Kairoi =
/*#__PURE__*/
function () {
  function Kairoi() {
    _classCallCheck(this, Kairoi);

    this._options = {
      margin: {
        left: 20,
        right: 20,
        top: 20,
        bottom: 20
      },
      initialWidth: 1000,
      initialHeight: 112,
      startTimeline: undefined,
      endTimeline: undefined
    };
    this._properties = {
      innerWidth: this._options.initialWidth - this._options.margin.left - this._options.margin.right,
      innerHeight: this._options.initialHeight - this._options.margin.top - this._options.margin.bottom
    };
  }

  _createClass(Kairoi, [{
    key: "_drawAxis",
    value: function _drawAxis() {
      var options = this._options;
      var vis = this._vis;
      var data = this._data;
      var startTimeline = options.startTimeline || d3.min(data, function (el) {
        return el.date;
      });
      var endTimeline = options.endTimeline || d3.max(data, function (el) {
        return el.date;
      });
      var axisScale = d3.scaleTime().domain([startTimeline, endTimeline]).range([options.margin.left, options.initialWidth - options.margin.right]);
      var axis = d3.axisBottom().scale(axisScale);
      vis.append('g').attr('class', 'axis').attr('width', options.initialWidth - options.margin.left - options.margin.right).call(axis);
    }
  }, {
    key: "draw",
    value: function draw() {
      var options = this._options;
      this._vis = d3.select(this._target).append('svg').attr('width', options.initialWidth).attr('height', options.initialHeight); // .append('g')
      // .attr('transform', 'translate(' + options.margin.left + ',' + (options.margin.top + this._innerHeight) + ')')

      this._drawAxis();
    }
  }, {
    key: "version",
    get: function get() {
      return '0.0.1';
    }
  }, {
    key: "data",
    set: function set(newData) {
      this._data = newData;
    }
  }, {
    key: "target",
    set: function set(newTarget) {
      this._target = newTarget;
    }
  }]);

  return Kairoi;
}();