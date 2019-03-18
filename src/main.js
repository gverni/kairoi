/* globals d3, labella */

class Kairoi {

  constructor () {
    this._data = undefined
    this._force = undefined // Labella Force
    this._options = {
      margin: {left: 20, right: 20, top: 20, bottom: 20},
      initialWidth: 1000,
      initialHeight: 112,
      startTimeline: undefined,
      endTimeline: undefined,
      dotColor: 'black',
      dotRadius: 3,
      labella: {},
      labelPadding: {top: 0, right: 0, bottom: 0, left: 0}
    }
    this._properties = {
      innerWidth: this._options.initialWidth - this._options.margin.left - this._options.margin.right,
      innerHeight: this._options.initialHeight - this._options.margin.top - this._options.margin.bottom,
      axisScale: undefined,
      labellaNodes: undefined
    }
    this._scale = d3.scaleTime()
  }

  get version () {
    return '0.0.1'
  }

  hasData () {
    return (this._data.length > 0)
  }

  set data (newData) {
    this._data = newData
  }

  set target (newTarget) {
    this._target = newTarget
  }

  _getLayer (layerName) {
    // return a d3 selection for the specified layer
    // or create it if not exsistent
    const vis = this._vis
    let layer = d3.select('SVG g.' + layerName)
    if (layer.empty()) {
      layer = vis.append('g')
        .attr('class', layerName)
    }
    return layer
  }

  _drawAxis () {
    const options = this._options
    const properties = this._properties
    const data = this._data

    let startTimeline = options.startTimeline || d3.min(data, el => el.date)
    let endTimeline = options.endTimeline || d3.max(data, el => el.date)

    properties.axisScale = d3.scaleTime()
    .domain([startTimeline, endTimeline])
    .nice()
    .range([options.margin.left, options.initialWidth - options.margin.right])

    var axis = d3.axisBottom()
      .scale(properties.axisScale)

    this._getLayer('axis')
    .attr('width', options.initialWidth - 600)
    .attr('transform', 'translate(' + (0) + ',' + (properties.innerHeight) + ')')
    .call(axis)

    // const options = this.options();

    // let axisTransform;

    // switch(options.direction){
    //   case 'right':
    //     this.axis = axisLeft();
    //     axisTransform = 'translate('+(0)+','+(0)+')';
    //     break;
    //   case 'left':
    //     this.axis = axisRight();
    //     axisTransform ='translate('+(this.getInnerWidth())+','+(0)+')';
    //     break;
    //   case 'up':
    //     this.axis = axisBottom();
    //     axisTransform ='translate('+(0)+','+(this.getInnerHeight())+')';
    //     break;
    //   case 'down':
    //     this.axis = axisTop();
    //     axisTransform = 'translate('+(0)+','+(0)+')';
    //     break;
    // }

    // this.layers.get('main')
    //   .attr('transform', axisTransform);

    // const formatAxis = options.formatAxis || identity;

    // formatAxis(this.axis.scale(options.scale));

    // this.layers.get('main/axis').call(this.axis);

    return this
  }

  _drawDots () {
    const properties = this._properties
    const options = this._options
    const data = this._data

    // const options = this.options();
    // const timePos = d => options.scale(options.timeFn(d));
    const timePos = d => properties.axisScale(d.date)

    const sUpdate = this._getLayer('dot')
     .attr('transform', 'translate(' + (0) + ',' + (properties.innerHeight) + ')')
     .selectAll('circle.dot')
     .data(data)

    // const field = (options.direction==='left' || options.direction==='right') ? 'cy' : 'cx';

    sUpdate.enter().append('circle')
      .classed('dot', true)
      .style('fill', options.dotColor)
      .attr('r', options.dotRadius)
      .attr('cx', timePos)
    // TODO: add events handler
    //  .on('click', this.dispatchAs('dotClick'))
    //  .on('mouseover', this.dispatchAs('dotMouseover'))
    //   .on('mousemove', this.dispatchAs('dotMousemove'))
    //   .on('mouseout', this.dispatchAs('dotMouseout'))
    //   .on('mouseenter', this.dispatchAs('dotMouseenter'))
    //   .on('mouseleave', this.dispatchAs('dotMouseleave'))

    // sUpdate.transition()
    //  .style('fill', options.dotColor)
    //  .attr('r', options.dotRadius)
    //  .attr('cx', timePos)

    sUpdate.exit().remove()
    return this
  }

  _createLabellaNodes () {
    const options = this._options
    const properties = this._properties

    const timePos = d => properties.axisScale(d.date)

    const dummyText = this._getLayer('dummy').append('text')
      .classed('label-text', true)

    const data = this._data
    const nodes = data.map(d => {
      const bbox = dummyText
        .text(d.label)
        .node()
        .getBBox()
      const w = bbox.width + options.labelPadding.left + options.labelPadding.right
      const h = bbox.height + options.labelPadding.top + options.labelPadding.bottom
      const node = new labella.Node(timePos(d), w, d)
      node.w = w
      node.h = h
      return node
    })

    dummyText.remove()
    return nodes
  }

  _drawLabels () {
    const options = this._options
    this._force = new labella.Force(options.labella)
  }

  draw () {
    if (!this.hasData()) return

    let options = this._options
    this._vis = d3.select(this._target)
    .append('svg')
    .attr('width', options.initialWidth)
    .attr('height', options.initialHeight)
    // .append('g')
    // .attr('transform', 'translate(' + options.margin.left + ',' + (options.margin.top + this._innerHeight) + ')')

    // if (options.direction === 'up' || options.direction === 'down') {
    //   if (!options.labella.maxPos) {
    //     options.labella.maxPos = options.initialWidth - options.margin.left - options.margin.right
    //     if (!options.labella.density) {options.labella.density = 1}
    //   }
    // }

    // if(options.domain){
    //   options.scale.domain(options.domain);
    // }
    // else{
    //   options.scale
    //     .domain(extent(data, options.timeFn))
    //     .nice();
    // }
    // options.scale.range([0, (options.direction==='left' || options.direction==='right')
    //   ? this.getInnerHeight()
    //   : this.getInnerWidth()]
    // );
    // const labelTextStyle = helper.extend({}, options.textStyle);
    // Object.keys(labelTextStyle).forEach(key => {
    //   labelTextStyle[key] = helper.functor(labelTextStyle[key]);
    // });
    // // for backward compatibility
    // labelTextStyle.fill = labelTextStyle.fill || helper.functor(options.labelTextColor);

    // const dummyText = this.layers.get('dummy').append('text')
    //   .classed('label-text', true);

    // const timePos = d => options.scale(options.timeFn(d));
    // const nodes = data.map(d => {
    //   const bbox = dummyText
    //     .call(this.updateLabelText, labelTextStyle, d)
    //     .node()
    //     .getBBox();
    //   const w = bbox.width + options.labelPadding.left + options.labelPadding.right;
    //   const h = bbox.height + options.labelPadding.top + options.labelPadding.bottom;
    //   const node = new labella.Node(
    //     timePos(d),
    //     (options.direction==='left' || options.direction==='right') ? h : w,
    //     d
    //   );
    //   node.w = w;
    //   node.h = h;
    //   return node;
    // });

    // dummyText.remove();

    // this.force.options(options.labella)
    //   .nodes(nodes)
    //   .compute();

    // this.drawAxes();
    // this.drawDots(data);
    // this.drawLabels(this.force.nodes(), labelTextStyle);
    this._drawAxis()
    this._drawDots()
    this._drawLabels()
    return this
  }
}
