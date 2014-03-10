(function() {

  function bindOneWay(object, to, from) {
    function sync() {
      var value = object.get(from)
      if (value != object.get(to)) {
        object.set(to, value)
      }
    }
    sync()
    object.addObserver(from, sync)

  }

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
    setupBindings: function() {
      bindOneWay(this, "matcher.input", "input")
      bindOneWay(this, "lastMatch.a", "matcher.output")
      bindOneWay(this, "lastMatch.b", "lastMatch.output")
      bindOneWay(this, "output", "lastMatch.output.color")
      bindOneWay(this, "formatter.color", "output")
      bindOneWay(this, "formatter.format", "lastMatch.output.format")
      bindOneWay(this, "input", "formatter.output")
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
