(function() {
  var Color = Ember.Object.extend({
    rgb: Ember.computed.alias('rgbValue.rgb'),

    rgbValue: function() {
      return this.get('hslValue.rgbValue')
    }.property('hslValue'),

    hsl: Ember.computed.alias('hslValue.hsl'),

    hslValue: function() {
      return this.get('rgbValue.hslValue')
    }.property('rgbValue'),
  })

  var rgbSpace = {}
  var hslSpace = {}
  Color.reopenClass({
    fromRGB: function(r,g,b) {
      var values = null
      if (Ember.typeOf(r) == "number") {
        values = {r: r, g: g, b: b}
      } else {
        values = r || {}
      }
      var value = RGBValue.create(roundRGB(values))
      var key = JSON.stringify(value.get('rgb'))
      var hslKey = JSON.stringify(value.get('hslValue.hsl'))
      return rgbSpace[key] || hslSpace[hslKey] || (rgbSpace[key] = Color.create({rgbValue: value}))
    },
    fromHSL: function(h,s,l) {
      var values = null
      if (Ember.typeOf(h) == "number") {
        values = {h: h, s: s, l: l}
      } else {
        values = h || {}
      }
      var value = HSLValue.create(roundHSL(values))
      var key = JSON.stringify(value.get('hsl'))
      var rgbKey = JSON.stringify(value.get('rgbValue.rgb'))
      return rgbSpace[rgbKey] || hslSpace[key] || (hslSpace[key] = Color.create({hslValue: value}))
    }
  })

  Color.OR = Ember.Object.extend({
    output: function() {
      return this.get('a') || this.get('b')
    }.property('a', 'b'),
  })

  this.Color = Color
  var RGBValue = Ember.Object.extend({
    r: 0, g: 0, b: 0,

    rgb: function() {
      return this.getProperties('r','g','b')
    }.property('r','g','b'),

    hslValue: function() {
      var rgb = Ember.copy(this.get('rgb'))
      return HSLValue.create(roundHSL(tinycolor(rgb).toHsl()))
    }.property('rgb')
  })


  var HSLValue = Ember.Object.extend({
    h: 0, s: 0.5, l: 0,

    hsl: function() {
      return this.getProperties('h','s','l')
    }.property('h','s','l'),

    rgbValue: function() {
      var hsl = Ember.copy(this.get('hsl'))
      return RGBValue.create(roundRGB(tinycolor(hsl).toRgb()))
    }.property('hsl'),
  })

  function rgbCoord(value) {
    return Math.min(Math.max(Math.round(parseFloat(value) || 0), 0), 255)
  }

  function hCoord(value) {
    return new Number(((parseFloat(value) || 0) % 360).toFixed(2)).valueOf()
  }

  function SLCoord(value) {
    return new Number(Math.min(Math.max(0,(parseFloat(value) || 0)), 1).toFixed(3)).valueOf()
  }

  function roundRGB(values) {
    return {
      r: rgbCoord(values.r),
      g: rgbCoord(values.g),
      b: rgbCoord(values.b)
    }
  }

  function roundHSL(values) {
    return {
      h: hCoord(values.h),
      s: SLCoord(values.s),
      l: SLCoord(values.l)
    }
  }
}).call(this)
