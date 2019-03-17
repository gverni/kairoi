/* globals d3 */

class Kairoi {

  constructor () {
    this._options = {
      margin: {left: 20, right: 20, top: 20, bottom: 20},
      initialWidth: 1000,
      initialHeight: 112,
      startTimeline: undefined,
      endTimeline: undefined
    }
    this._properties = {
      innerWidth: this._options.initialWidth - this._options.margin.left - this._options.margin.right,
      innerHeight: this._options.initialHeight - this._options.margin.top - this._options.margin.bottom
    }
  }

  get version () {
    return '0.0.1'
  }

  set data (newData) {
    this._data = newData
  }

  set target (newTarget) {
    this._target = newTarget
  }

  _drawAxis () {
    let options = this._options
    let vis = this._vis
    let data = this._data

    let startTimeline = options.startTimeline || d3.min(data, el => el.date)
    let endTimeline = options.endTimeline || d3.max(data, el => el.date)

    var axisScale = d3.scaleTime()
    .domain([startTimeline, endTimeline])
    .range([options.margin.left, options.initialWidth - options.margin.right])

    var axis = d3.axisBottom()
      .scale(axisScale)

    vis.append('g')
    .attr('class', 'axis')
    .attr('width', options.initialWidth - options.margin.left - options.margin.right)
    .call(axis)
  }

  draw () {
    let options = this._options
    this._vis = d3.select(this._target)
    .append('svg')
    .attr('width', options.initialWidth)
    .attr('height', options.initialHeight)
    // .append('g')
    // .attr('transform', 'translate(' + options.margin.left + ',' + (options.margin.top + this._innerHeight) + ')')

    this._drawAxis()
  }
}