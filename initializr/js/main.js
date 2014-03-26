App = Ember.Application.create()

App.ApplicationController = Ember.Controller.extend({
  color: Color.fromRGB(),
  swatchStyle: function() {
    var rgb = this.get('color.rgb')
    return "background-color: " + "rgb(" + [rgb.r,rgb.g,rgb.b].join(',') + ")"
  }.property('color.rgb'),
  syntax: function() {
    return ColorSyntax.create()
  }.property(),
  syntax2: function() {
    return ColorSyntax.create()
  }.property(),

  setupBindings: function() {
    Ember.bind(this, 'syntax.output', 'color')
    Ember.bind(this, 'syntax2.output', 'color')
  }.on('init'),

  observeColor: function() {
    //console.log(this._previousColor.get('rgb'), ' -> ', this.get('color.rgb'))
  }.observes("color"),
  observeSyntaxOutput: function() {
    //console.log('syntax.output', this.get('syntax.output.rgb'))
  }.observes("syntax.output.rgb"),
  recordColorHistory: function() {
    this._previousColor = this.get('color')
  }.observesBefore('color')
})

App.RgbBlendComponent = Ember.Component.extend({
  tagName: "canvas",
  height: 200,
  width: 200,
  attributeBindings: ['height', 'width'],
  color: null,

  paint: function() {
    var canvas = this.get('element')
    var context = this.get('element').getContext('2d');
    var height = this.get('height')
    var width = this.get('width')
    var radius = .2 * height
    var rgb = this.get('color.rgb')

    canvas.width = width
    with (context) {
      restore()
      globalCompositeOperation = "lighter";
      strokeStyle = "#fff"
      fillStyle = "#000"
      fillRect(0, 0, width, height)

      beginPath()
      arc(.375 * width, .375 * height, radius, 0, Math.PI * 2)
      stroke()
      setAlpha(rgb.r / 255)
      fillStyle = "#ff0000"
      fill()
      closePath()
      setAlpha(1)
      beginPath()
      arc(.625 * width, .375 * height, radius, 0, Math.PI*2)
      stroke()
      setAlpha(rgb.g / 255)
      fillStyle = "#00ff00"
      fill()
      closePath()
      setAlpha(1)
      beginPath()
      arc(.5 * width, .6 * height, radius, 0, Math.PI*2)
      stroke()
      setAlpha(rgb.b / 255)
      fillStyle = '#0000ff'
      fill()
      closePath()
      save()
    }
  }.observes("height", "width", "color.rgb", "element").on("didInsertElement"),

  alphaValues: function() {
    var rgb = this.get('color.rgb')
    return ['r','g','b'].reduce(function(values, axis) {
      values[axis] = rgb[axis] / 255
    }, {})
  }.property('color.rgb')
})
