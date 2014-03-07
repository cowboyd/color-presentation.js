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

  var cache = {}
  Color.reopenClass({
    fromRGB: function(r,g,b) {
      var values = null
      if (Ember.typeOf(r) == "number") {
        values = {r: r, g: g, b: b}
      } else {
        values = r
      }
      var value = RGBValue.create({
        r: rgbCoord(values.r),
        g: rgbCoord(values.g),
        b: rgbCoord(values.b)
      })
      var key = JSON.stringify(value.get('rgb'))
      return cache[key] || (cache[key] = Color.create({rgbValue: value}))
    },
    fromHSL: function(h,s,l) {
      var values = null
      if (Ember.typeOf(h) == "number") {
        values = {h: h, s: s, l: l}
      } else {
        values = h
      }
      var value = HSLValue.create({
        h: hCoord(values.h),
        s: SLCoord(values.s),
        l: SLCoord(values.l)
      })
      return this.fromRGB(value.get('rgbValue.rgb'))
    }
  })

  this.Color = Color
  var RGBValue = Ember.Object.extend({
    r: 0, g: 0, b: 0,

    rgb: function() {
      return this.getProperties('r','g','b')
    }.property('r','g','b'),

    hslValue: function() {
      return HSLValue.create(tinycolor(this.get('rgb')).toHsl())
    }.property('rgb')
  })


  var HSLValue = Ember.Object.extend({
    h: 0, s: 0.5, l: 0,

    hsl: function() {
      return this.getProperties('h','s','l')
    }.property('h','s','l'),

    rgbValue: function() {
      return RGBValue.create(tinycolor(this.get('hsl')).toRgb())
    }.property('hsl'),
  })

  function rgbCoord(value) {
    return Math.min(Math.max(Math.round(parseFloat(value) || 0), 0), 255)
  }

  function hCoord(value) {
    return new Number(((parseFloat(value) || 0) % 360).toFixed(2)).valueOf()
  }

  function SLCoord(value) {
    return new Number((parseFloat(value) || 0).toFixed(3)).valueOf()
  }
}).call(this)
