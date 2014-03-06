App = Ember.Application.createWithMixins({
  color: Color.create(),
  colorParser: function() {
    return Color.Parser.create()
  }.property()
})

