(function() {
  var ColorSyntax = this.ColorSyntax = Ember.Object.extend({
    matcher: function() {
      return ColorSyntax.Matcher.create()
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

  ColorSyntax.Matcher = Ember.Object.extend({
    input: null,
    output: function() {
      var match = null
      var input = this.get('input')
      if (match = /rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)\s*/.exec(input)) { 
        return Ember.Object.create({
          color: Color.fromRGB({r: match[1], g: match[2], b: match[3]}),
          format: function(color) {
            var rgb = color.get('rgb')
            return "rgb(" + [rgb.r,rgb.g,rgb.b].join(",") + ")"
          }
        })
      } else if (match = /hsl\(\s*(\d{1,3})\s*,\s*([0-9]*\.[0-9]+|[0-9]+)\s*,\s*(([0-9]*\.[0-9]+|[0-9]+))\s*\)\s*/.exec(input)) {
        return Ember.Object.create({
          color: Color.fromHSL({h: match[1], s: match[2], l: match[3]}),
          format: function(color) {
            var hsl = color.get('hsl')
            return "hsl(" + [hsl.h,hsl.s,hsl.l].join(',') +")"
          }
        })
      } else {
        return null
      }
    }.property('input'),
  })
}).call(this)
