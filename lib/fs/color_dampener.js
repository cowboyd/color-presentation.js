this.ColorDampener = Ember.Object.extend({
  left: null,
  right: null,


  cpl: function() {
    if (Color.fromRGB(this.get('left.rgb')) !== Color.fromRGB(this.get('right.rgb'))) {
      this.set('right', this.get('left'))
    }
  }.observes('left'),
  cpr: function() {
    if (Color.fromRGB(this.get('left.rgb')) !== Color.fromRGB(this.get('right.rgb'))) {
      this.set('left', this.get('right'))
    }
  }.observes('right')
})
