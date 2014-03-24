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
    console.log(this._previousColor.get('rgb'), ' -> ', this.get('color.rgb'))
  }.observes("color"),
  observeSyntaxOutput: function() {
    console.log('syntax.output', this.get('syntax.output.rgb'))
  }.observes("syntax.output.rgb"),
  recordColorHistory: function() {
    this._previousColor = this.get('color')
  }.observesBefore('color')
})

