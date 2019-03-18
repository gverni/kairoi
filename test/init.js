/* globals QUnit, Kairoi */

QUnit.test('Version check', function (assert) {
  var timeline = new Kairoi()
  assert.equal(timeline.version, '0.0.1')
})

QUnit.test('Init SVG', function (assert) {
  const timelineDiv = document.createElement('DIV')
  timelineDiv.setAttribute('id', 'timeline')
  document.body.appendChild(timelineDiv)
  var testData = [
    {date: new Date('01 January 2019'), label: 'First milestone', color: 'green'},
    {date: new Date('05 April 2019'), label: 'First milestone', color: 'green'},
    {date: new Date('01 May 2019'), label: 'Fifth milestone', color: 'red'}
  ]
  var timeline = new Kairoi()
  timeline.data = testData
  timeline.target = '#timeline'
  timeline.draw()
  assert.ok(document.querySelector('#timeline > SVG'))
})

QUnit.test('Check axis range', function (assert) {
  assert.ok(document.querySelectorAll('SVG .axis'))
  let labels = document.querySelectorAll('SVG text')
  // Note that since we applied .nice() to the time scale, the date range is _rounded_
  // This may change in the future
  assert.equal(labels[0].innerHTML, 'Dec 30')
  assert.equal(labels[labels.length - 1].innerHTML, 'May 05')
})

QUnit.test('Check dots', function (assert) {
  let dots = document.querySelectorAll('SVG .dot circle')
  assert.equal(dots[0].attributes['cx'].value, '35.243135957657955')
  assert.equal(dots[dots.length - 1].attributes['cx'].value, '949.5137280846841')
})
