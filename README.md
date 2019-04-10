[![Build Status](https://travis-ci.org/gverni/kairoi.svg?branch=master)](https://travis-ci.org/gverni/kairoi)
[![Maintainability](https://api.codeclimate.com/v1/badges/84e9c5a07361bba6e623/maintainability)](https://codeclimate.com/github/gverni/kairoi/maintainability)

# Kairoi

Project Timelines made easy....

This project is a fork of the excellent [d3kit-timeline](https://github.com/kristw/d3kit-timeline) with the following differences:
* Removal of `d3kit` (last commit on this project was Feb 2017)
* Update of D3 version to 5
* Working with IE10 / IE11 (limited testing)

## Add it to your project 

Kairoi depends on `d3` and `labella`. These dependencies needs to be loaded separately. For example you can use the following to import kairoi and the dependencies in your HTML:

```html
<script src="https://d3js.org/d3.v5.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/labella/1.1.4/labella.min.js"></script>
<script src="https://cdn.jsdelivr.net/gh/gverni/kairoi@latest/dist/kairoi.js"></script>
```

## Simple usage

Make sure your HTML page contains a target element for the SVG, e.g.: 

```html
<div id="timeline"></div>
```

Initalize the data

```javascript
var testData = [
    {date: new Date('01 January 2019'), label: 'First / green', labelBgColor: 'green'},
    {date: new Date('06 January 2019'), label: 'Second / green', labelBgColor: 'green'},
    {date: new Date('05 April 2019'), label: 'Third / red', labelBgColor: 'red'},
    {date: new Date('01 May 2019'), label: 'Fourth / red', labelBgColor: 'red'}
]
```

Create a new Kaiori object passing the selector for the target element. 

```javascript
var timeline = new Kairoi('#timeline')
```

Add the data to the newly created object: 

```javascript 
timeline.data(testData)
```

Finally, draw the timeline

```javascript
timeline.draw()
```

## Data initalization 

Each label must have at least these two values: 

* `date`: This is the date of the label on the timeline. Note that in `d3kit-timeline` this was called `time`. The name can be customized using the `timeFn` option. 
*  `label`: This is the caption of the label. Note that in `d3kit-timeline` this was called `text`. The name can be customized using the `textFn` option.

Optionally you can specify: 

* `labelBgColor`: this specify the bakground color of the label. You can use any CSS value for this. 

See more at API documentation

## Demo 

Simple front-end demo using this project can be found [here](https://gverni.github.io/kairoi/)

## Migrating from d3kit-timeline

If you are migrating from `d3kit-timeline` please note: 

* The default key for the date in the data is now `date` (instead of `time`)
* The default key for the label caption in the data is now `label` (instead of `text`)
* The `visualize` method is now called `draw`
* The default value for `direction` is `up` (instead of `right`)
* The `data` method does not trigger a re-draw of the timeline. This needs to be called esplicitely using `draw()` (in  roadmap for implementation)
* No `chart.on()` doesn't work (in roadmap for implementation)
* The method `options()` has been replaced by 'setOptions()`
* The method `resizeToFit()` is not implemented
