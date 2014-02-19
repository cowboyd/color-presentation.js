(function() {

  var RGBValue = Ember.Object.extend({
    r: 0, g: 0, b: 0,

    hslValue: function() {
      return HSLValue.create(tinycolor(this.getProperties('r','g','b')).toHsl())
    }.property('r', 'g', 'b'),

    normalizeColorValues: function() {
      ['r', 'g', 'b'].forEach(function(color) {
        normal = Math.round(this.get(color))
        normal = Math.max(0, normal)
        normal = Math.min(normal, 255)
        this.set(color, normal)
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
      this.set('h', new Number(v.h.toFixed(2)).valueOf())
      this.set('s', new Number(v.s.toFixed(3)).valueOf())
      this.set('l', new Number(v.l.toFixed(3)).valueOf())
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
    rgbValue: RGBValue.create(),
    hslValue: null,

    _bind: function() {
      Ember.oneWay(this, 'hslValue', 'rgbValue.hslValue')
      Ember.oneWay(this, 'rgbValue', 'hslValue.rgbValue')
    }.on('init')
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
