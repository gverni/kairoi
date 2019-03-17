/* globals QUnit, Kairoi */

QUnit.test('Version check', function (assert) {
  var timeline = new Kairoi()
  assert.equal(timeline.version, '0.0.1')
})

QUnit.test('Create axis', function (assert) {
  const timelineDiv = document.createElement('DIV')
  timelineDiv.setAttribute('id', 'timeline')
  document.body.appendChild(timelineDiv)
  var testData = [
    {date: new Date('01 January 2019'), label: 'First milestone', color: 'green'},
    {date: new Date('01 May 2019'), label: 'Fifth milestone', color: 'red'}
  ]
  var timeline = new Kairoi()
  timeline.data = testData
  timeline.target = '#timeline'
  timeline.draw()
  let labels = document.querySelectorAll('SVG text')
  assert.equal(labels[0].innerHTML, 'Jan 06')
  assert.equal(labels[labels.length - 1].innerHTML, 'Apr 28')
})
