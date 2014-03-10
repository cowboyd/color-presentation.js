(function() {
  var ColorSyntax = this.ColorSyntax = Ember.Object.extend({
    matcher: function() {
      return Color.Matcher.create()
    }.property(),
    formatter: function() {
      return ColorSyntax.Formatter.create()
    }.property(),
    lastMatch: function() {
      return Color.OR.create()
    }.property(),
    formattedString: function() {
      return Color.OR.create()
    }.property(),
    setupBindings: function() {
      Ember.oneWay(this, "matcher.input", "input")
      Ember.oneWay(this, "lastMatch.a", "matcher.output")
      Ember.oneWay(this, "lastMatch.b", "lastMatch.output")
      Ember.oneWay(this, "output", "lastMatch.output.color")
      Ember.oneWay(this, "formatter.color", "output")
      Ember.oneWay(this, "formatter.format", "lastMatch.output.format")
      Ember.oneWay(this, "formattedString.a", "formatter.output")
      Ember.oneWay(this, "formattedString.b", "input")
      Ember.oneWay(this, "input", "formattedString.output")
    }.on("init")
  })

  ColorSyntax.Formatter = Ember.Object.extend({
    output: function() {
      var color = this.get('color')
      var format = this.get('format')
      if (color && format) {
        return format(color)
      }
    }.property('color', 'format'),
  })
}).call(this)
