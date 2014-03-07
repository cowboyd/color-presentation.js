(function() {
  var Coordinate = Ember.Object.extend({
    deserialize: Ember.required(),
    output: function() {
      return this.get('deserialize').call(this, parseFloat(this.get('input')) || 0)
    }.property('input', 'deserialize'),
  })

  var RGBCoordinate = Coordinate.extend({
    deserialize: function(input) {
      return Math.min(Math.max(Math.round(input), 0), 255)
    },
  })

  var HCoordinate = Coordinate.extend({
    deserialize: function(input) {
      return Math.round(input) % 360
    }
  })

  var RatioCoordinate = Coordinate.extend({
    deserialize: function(input) {
      return new Number(input.toFixed(3)).valueOf()
    }
  })

  var Color = Ember.Object.extend({
    r: 0, g: 0, b: 0, h: 0, s: .5, l: 0,

    rgb: function() {
      return this.getProperties('r','g','b')
    }.property('r','g','b'),

    rgbValue: function() {
      return window.Color.RGBValue.create(this.get('rgb'))
    }.property('rgb'),

    hslValue: function() {
      return window.Color.RGBValue.create(this.get('hsl'))
    }.property('hsl'),

    hsl: function() {
      return this.getProperties('h','s','l')
    }.property('h','s','l'),

    bind: function() {
      ['r','g','b'].forEach(function(axis) {
        var binding = Ember.Object.create({
          coordinate: RGBCoordinate.create(),
          color: this
        })
        Ember.oneWay(binding, 'coordinate.input', 'color.' + axis)
        Ember.oneWay(binding, 'color.' + axis, 'coordinate.output')
      }, this)
      var hslBinding = Ember.Object.create({
        coordinate: HCoordinate.create(),
        color: this
      })
      Ember.oneWay(hslBinding, 'coordinate.input', 'color.h')
      Ember.oneWay(hslBinding, 'color.h', 'coordinate.output')
      Ember.A(['s','l']).forEach(function(axis) {
        var binding = Ember.Object.create({
          coordinate: RatioCoordinate.create(),
          color: this
        })
        Ember.oneWay(binding, 'coordinate.input', 'color.' + axis)
        Ember.oneWay(binding, 'color.' + axis, 'coordinate.output')
      }, this)
    }.on('init')
  })
  window.c = Color.create({r: "600", g: 2.6, h: "500", s: "0.78965553"})
  console.log(window.c.get('rgb'), window.c.get('hsl'))
}).call(this)
