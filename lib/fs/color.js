(function() {

  function bounded(value, lower, upper) {
    low = Math.max(lower, value)
    return Math.min(low, upper)
  }

  function bounded01(value) {
    return bounded(value, 0, 1)
  }

  function bounded0255(value) {
    return bounded(value, 0, 255)
  }

  var RGBValue = Ember.Object.extend({
    r: 0, g: 0, b: 0,

    hslValue: function() {
      return HSLValue.create(tinycolor(this.getProperties('r','g','b')).toHsl())
    }.property('r', 'g', 'b'),

    normalizeColorValues: function() {
      ['r', 'g', 'b'].forEach(function(color) {
        this.set(color, Math.round(bounded0255(this.get(color))))
      }, this)
    }.on('init')
  })

  var rgbSpace = {}
  RGBValue.reopenClass({
    create: function create(attrs) {
      var value = this._super(attrs)
      var key = JSON.stringify(value.getProperties('r','g','b'))
      return rgbSpace[key] || (rgbSpace[key] = value)
    }
  })

  var HSLValue = Ember.Object.extend({
    h: 0, s: 0.5, l: 0,

    rgbValue: function() {
      return RGBValue.create(tinycolor(this.getProperties('h','s','l')).toRgb())
    }.property('h', 's', 'l'),

    roundOut: function() {
      var v = this.getProperties('h', 's', 'l')
      this.set('h', new Number(v.h.toFixed(2)).valueOf() % 360)
      this.set('s', new Number(bounded01(v.s).toFixed(3)).valueOf())
      this.set('l', new Number(bounded01(v.l).toFixed(3)).valueOf())
    }.on('init')
  })

  var hslSpace = {}
  HSLValue.reopenClass({
    create: function create(attrs) {
      var value = this._super(attrs)
      var key = JSON.stringify(value.getProperties('h', 's', 'l'))
      return hslSpace[key] || (hslSpace[key] = value)
    }
  })

  var Color = Ember.Object.extend({
    r: 0, g: 0, b:0, h: 0, s: 0.5, l: 0,
    rgbValue: function() {
      return RGBValue.create(this.getProperties('r', 'g', 'b'))
    }.property('r', 'g', 'b'),

    hslValue: function() {
      return HSLValue.create(this.getProperties('h', 's', 'l'))
    }.property('h', 's', 'l'),

    updateRgb: function() {
      var equiv = this.get('hslValue.rgbValue')
      this.setProperties(equiv.getProperties('r', 'g', 'b'))
    }.observes('hslValue').on('init'),

    updateHsl: function() {
      var equiv = this.get('rgbValue.hslValue')
      this.setProperties(equiv.getProperties('h','s','l'))
    }.observes('rgbValue').on('init')

  })

  var Parser = Ember.Object.extend({
    input: "",
    output: Ember.computed.alias('rule.output'),
    matchingRules: Ember.computed.filter('rules',function(rule) {
      return rule.get('output') != null
    }),
    rule: Ember.computed.oneWay('matchingRules.firstObject'),
    formattedString: Ember.computed('rule', 'output', function() {
      return this.get('rule').format(color)
    })
  })

  Color.RGBValue = RGBValue
  Color.HSLValue = HSLValue

  this.Color = Color
}).call(this)
