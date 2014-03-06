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
    }.observes('hslValue'),

    updateHsl: function() {
      var equiv = this.get('rgbValue.hslValue')
      this.setProperties(equiv.getProperties('h','s','l'))
    }.observes('rgbValue'),

    resolve: function() {
      if (!this.get('isRgbDefault')) {
        this.updateHsl()
      } else {
        this.updateRgb()
      }
      Ember.A(['r','g','b']).forEach(function(color) {
        Ember.oneWay(this, color, 'rgbValue.' + color)
      }, this)
      Ember.A(['h','s','l']).forEach(function(color) {
        Ember.oneWay(this, color, 'hslValue.' + color)
      }, this)
    }.on('init'),

    isRgbDefault: function() {
      coords = this.getProperties('r','g','b')
      return coords.r == 0 && coords.g == 0 && coords.b == 0
    }.property('r','g','b')
  })


  var Matcher = Ember.Object.extend({
    input: null,
    output: function() {
      var match = this.get('pattern').exec(this.get('input'))
      if (match) {
        return this.get('construct').apply(this, match.slice(1))
      }
    }.property('input', 'pattern', 'construct'),
    pattern: null
  })

  var Serializer = Ember.Object.extend({
    input: null,
    output: function() {
      var color = this.get('input')
      if (color) {
        return this.get('serialize').call(this, this.get('input'))
      }
    }.property('input', 'serialize'),

    serialize: function() {}

  })

  var Rule = Ember.Object.extend({
    input: null,
    output: null,

    matcher: function() {
      return Matcher.create({
        pattern: this.get('pattern'),
        construct: this.get('construct')
      })
    }.property('pattern', 'construct'),

    serializer: function() {
      return Serializer.create({
        serialize: this.get('serialize')
      })
    }.property('serialize'),

    pattern: {
      exec: function() {
        return null
      }
    },

    setup: function() {
      Ember.oneWay(this, "matcher.input", "input")
      Ember.oneWay(this, "input", "serializer.output")
      Ember.oneWay(this, "output", "matcher.output")
      Ember.oneWay(this, "serializer.input", "output")
    }.on("init")

  })

  var Parser = Ember.Object.extend({
    input: "",
    output: Ember.computed.alias('currentMatch.output'),
    matchingRules: Ember.computed.filter('rules.@each.output',function(rule) {
      return rule.get('output') != null
    }),
    currentMatch: Ember.computed.oneWay('matchingRules.firstObject'),
    formattedString: Ember.computed('currentMatch', 'output', function() {
      return this.get('rule').format(color)
    }),
    rules: [
      Rule.create({
        pattern: /rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)\s*/,
        construct: function(r,g,b) {
          return Color.create({r: r, g: g, b: b})
        },
        serialize: function(color) {
          coords = color.getProperties('r','g','b')
          return "rgb(" + [coords.r, coords.g, coords.b].join(',') + ")"
        },
      }),
      Rule.create({
        pattern: /hsl\(\s*(\d{1,3})\s*,\s*([0-9]*\.[0-9]+|[0-9]+)\s*,\s*(([0-9]*\.[0-9]+|[0-9]+))\s*\)\s*/,
        construct: function(h,s,l) {
          return Color.create({
            h: new Number(h).valueOf(),
            s: new Number(s).valueOf(),
            l: new Number(l).valueOf()
          })
        },
        serialize: function(color) {
          coords = color.getProperties('h', 's', 'l')
          return "hsl(" + [coords.h, coords.s, coords.l].join(',') + ")"
        }
      })
    ],
    connections: Ember.computed.map('rules', function(rule) {
      var connection = Ember.Object.create({
        parser: this,
        rule: rule
      })
      Ember.bind(connection, 'rule.input', 'parser.input')
      return connection
    }),
    bind: function() {
      this.get('connections')
    }.on('init')
  })


  Color.RGBValue = RGBValue
  Color.HSLValue = HSLValue
  Color.Parser = Parser

  this.Color = Color
}).call(this)
