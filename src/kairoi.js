// TODO: remove these import
// import { axisLeft, axisRight, axisBottom, axisTop } from 'd3-axis'
// import { scaleTime } from 'd3-scale'
// import 'd3-transition'
// import { max, extent } from 'd3-array'
// import { SvgChart, helper } from 'd3kit'
// import labella from 'labella'
/* globals d3, labella */

const rectWidth = d => d.w
const rectHeight = d => d.h
const identity = d => d

class Kairoi {
  constructor (element, options) {
    options = this.setOptions(options)

    // In d3-kit this is automatically created by SvgChart
    // Here we are doing it manually
    this._vis = d3.select(element)
      .append('svg')
      .attr('width', options.initialWidth)
      .attr('height', options.initialHeight)
      .append('g')
      .attr('transform', `translate(${options.margin.left + 0.5}, ${options.margin.top + 0.5})`) // 0.5 was a constant added by svgchart

    ;['dummy', 'main', 'main/axis', 'main/link', 'main/label', 'main/dot'].forEach(layerName => {
      this._createLayer(layerName)
    })
    this._getLayer('main/axis').classed('axis', true)

    this.updateLabelText = this.updateLabelText.bind(this)
    this.draw = this.draw.bind(this)
    this._vis.on('data', this.draw)
    this._vis.on('options', this.draw)
    this._vis.on('resize', this.draw)

    // Private properties
    this._data = []
  }

  setOptions (newOptions) {
    // TODO: merging options with default
    const options = this.options()

    const mergeObjects = function (dest, source) {
      Object.keys(source).forEach(key => {
        if (dest[key]) { dest[key] = (typeof source[key] === 'object' ? mergeObjects(dest[key], source[key]) : source[key]) }
      })
      return dest
    }

    if (newOptions) {
      mergeObjects(options, newOptions)
    }
    return options
  }

  options () {
    if (!this._options) {
      // Default options
      this._options = {
        margin: {left: 40, right: 20, top: 20, bottom: 20},
        initialWidth: 1200,
        initialHeight: 80,
        scale: d3.scaleTime(),
        domain: undefined,
        // direction: 'up', // By default we only do 'up' timeline. After all this is a different project...
        dotRadius: 3,
        formatAxis: identity,
        layerGap: 60,
        labella: {},
        keyFn: undefined,
        timeFn: d => d.date,
        textFn: d => d.label,
        dotColor: '#222',
        linkColor: '#222',
        labelTextStyle: { },
        labelBgColor: '#222',
        labelTextColor: '#fff',
        labelPadding: {left: 4, right: 4, top: 3, bottom: 2},
        textYOffset: '0.85em'
      }
      this._options.labelTextStyle.fill = this._options.labelTextColor
    }
    return this._options
  }

  getInnerWidth () {
    const options = this.options()
    return options.initialWidth - options.margin.right - options.margin.left
  }

  getInnerHeight () {
    const options = this.options()
    return options.initialHeight - options.margin.top - options.margin.bottom
  }

  // TODO: re-enable events
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

  get version () {
    return '0.0.1'
  }

  _createLayer (layerName) {
    // TODO: Allow a grater depth than two layers only...
    let parent = this._vis
    layerName = layerName.split('/')
    if (layerName.length > 1) {
      parent = parent.select('g.' + layerName[0] + '-layer')
      layerName = layerName[1]
    }
    var layer = parent.append('g')
    .classed(layerName + '-layer', true)
    return layer
  }

  _getLayer (layerName) {
    const vis = this._vis
    var layerNames = []
    if (layerName.indexOf('/') > 0) {
      layerNames = layerName.split('/')
    } else {
      layerNames.push(layerName)
    }
    let layer = vis.select('g.' + layerNames[0] + '-layer' + (layerNames[1] ? ' g.' + layerNames[1] + '-layer' : ''))
    return layer
  }

  hasData () {
    return this._data.length > 0
  }

  data (data) {
    if (!data) {
      return this._data
    } else {
      this._data = data
    }
  }

  updateLabelText (selection, textStyle, accessor) {
    const options = this.options()

    // Polyfill for the implemetation of d3.functor(). This was deperacted in version 4.x
    // See more at https://github.com/d3/d3/blob/f797dfe883ee510f32acadf3ab8be736146e5927/CHANGES.md#internals
    function constant (x) {
      return function () {
        return x
      }
    }
    accessor = typeof accessor === 'function' ? accessor : constant(accessor)

    selection
      .text(d => options.textFn(accessor(d)))
      .attr('dy', options.textYOffset)
      .attr('x', options.labelPadding.left)
      .attr('y', options.labelPadding.top)

    Object.keys(textStyle).forEach(key => {
      selection.style(key, textStyle[key])
    })

    return selection
  }

  drawAxes () {
    const options = this.options()

    let axisTransform
    this.axis = d3.axisBottom()
    axisTransform = 'translate(' + (0) + ',' + (this.getInnerHeight()) + ')'

    this._getLayer('main')
      .attr('transform', axisTransform)

    // TODO: We may want to get rid of it?
    const formatAxis = options.formatAxis || identity
    formatAxis(this.axis.scale(options.scale))

    this._getLayer('main/axis').call(this.axis)

    return this
  }

  drawDots (data) {
    const options = this.options()
    const timePos = d => options.scale(options.timeFn(d))

    const sUpdate = this._getLayer('main/dot').selectAll('circle.dot')
      .data(data, options.keyFn)

    const field = 'cx'

    sUpdate.enter().append('circle')
      .classed('dot', true)
      // TODO: re-enable events
      // .on('click', this.dispatchAs('dotClick'))
      // .on('mouseover', this.dispatchAs('dotMouseover'))
      // .on('mousemove', this.dispatchAs('dotMousemove'))
      // .on('mouseout', this.dispatchAs('dotMouseout'))
      // .on('mouseenter', this.dispatchAs('dotMouseenter'))
      // .on('mouseleave', this.dispatchAs('dotMouseleave'))
      .style('fill', options.dotColor)
      .attr('r', options.dotRadius)
      .attr(field, timePos)

    sUpdate.transition()
      .style('fill', options.dotColor)
      .attr('r', options.dotRadius)
      .attr(field, timePos)

    sUpdate.exit().remove()

    return this
  }

  drawLabels (nodes, labelTextStyle) {
    const options = this.options()
    let nodeHeight
    nodeHeight = d3.max(nodes, rectHeight)

    // Calculate layerGap for labella renderer
    var numLayers = 0
    var maxRectHeight = 0
    nodes.map((node) => {
      if (numLayers < node.layerIndex) { numLayers = node.layerIndex }
      if (node.h > maxRectHeight) { maxRectHeight = node.h }
    })
    numLayers++
    options.layerGap = (this.getInnerHeight() - (numLayers * maxRectHeight)) / numLayers

    const renderer = new labella.Renderer({
      nodeHeight,
      layerGap: options.layerGap,
      direction: 'up' // Set direction as constant. Original implmentation had this as options
    })

    renderer.layout(nodes)

    function nodePos (d) {
      return 'translate(' + (d.x - d.dx / 2) + ',' + (d.y) + ')'
    }

    const labelBgColor = function (data) {
      // TODO: make this field customizable
      return data.labelBgColor ? data.labelBgColor : options.labelBgColor
    }

    const linkColor = function () {
      return options.linkColor
    }

    // Draw label rectangles
    const selection = this._getLayer('main/label').selectAll('g.label-g')
      .data(nodes, options.keyFn ? d => options.keyFn(d.data) : undefined)

    const sEnter = selection.enter().append('g')
      .classed('label-g', true)
      // TODO: re-enable events
      // .on('click', this.dispatchAs('labelClick'))
      // .on('mouseover', this.dispatchAs('labelMouseover'))
      // .on('mousemove', this.dispatchAs('labelMousemove'))
      // .on('mouseenter', this.dispatchAs('labelMouseenter'))
      // .on('mouseleave', this.dispatchAs('labelMouseleave'))
      // .on('mouseout', this.dispatchAs('labelMouseout'))
      .attr('transform', nodePos)

    sEnter
      .append('rect')
      .classed('label-bg', true)
      .attr('rx', 2)
      .attr('ry', 2)
      .attr('width', rectWidth)
      .attr('height', rectHeight)
      .style('fill', d => labelBgColor(d.data))

    sEnter.append('text')
      .classed('label-text', true)
      .call(this.updateLabelText, labelTextStyle, d => d.data)

    const sTrans = selection.transition()
      .attr('transform', nodePos)

    sTrans.select('rect')
      .attr('width', rectWidth)
      .attr('height', rectHeight)
      .style('fill', d => labelBgColor(d.data))

    sTrans.select('text.label-text')
      .call(this.updateLabelText, labelTextStyle, d => d.data)

    selection.exit().remove()

    // Draw path from point on the timeline to the label rectangle
    const paths = this._getLayer('main/link').selectAll('path.link')
      .data(nodes, options.keyFn ? d => options.keyFn(d.data) : undefined)

    paths.enter().append('path')
      .classed('link', true)
      .attr('d', d => renderer.generatePath(d))
      .style('stroke', d => linkColor(d.data))
      .style('fill', 'none')

    paths.transition()
      .attr('d', d => renderer.generatePath(d))
      .style('stroke', d => linkColor(d.data))

    paths.exit().remove()

    return this
  }

  _createNodes () {
    const options = this.options()
    const dummyText = this._getLayer('dummy').append('text')
      .classed('label-text', true)

    const timePos = d => options.scale(options.timeFn(d))
    const nodes = this._data.map(d => {
      const bbox = dummyText
        .call(this.updateLabelText, options.labelTextStyle, d)
        .node()
        .getBBox()
      const w = bbox.width + options.labelPadding.left + options.labelPadding.right
      const h = bbox.height + options.labelPadding.top + options.labelPadding.bottom
      const node = new labella.Node(
        timePos(d),
        (options.direction === 'left' || options.direction === 'right') ? h : w,
        d
      )
      node.w = w
      node.h = h
      return node
    })

    dummyText.remove()

    this._force.options(options.labella)
      .nodes(nodes)
      .compute()
  }

  draw () {
    if (!this.hasData()) return

    const data = this.data() || []
    const options = this.options()

    if (!options.labella.maxPos) {
      options.labella.maxPos = options.initialWidth - options.margin.left - options.margin.right
      if (!options.labella.density) { options.labella.density = 1 }
    }
    this._force = new labella.Force(options.labella)

    if (options.domain) {
      options.scale.domain(options.domain)
    } else {
      options.scale
        .domain(d3.extent(data, options.timeFn))
        .nice()
    }
    options.scale.range([0, this.getInnerWidth()])

    this._createNodes()
    this.drawAxes()
    this.drawDots(data)
    this.drawLabels(this._force.nodes(), options.labelTextStyle)

    return this
  }
}
