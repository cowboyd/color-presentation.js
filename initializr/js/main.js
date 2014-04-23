Ember.Controller.reopen({
  color: Color.fromRGB(0,255,0),
  rgbFormat: function(color) {
    var rgb = color.get('rgb')
    return "rgb(" + [rgb.r,rgb.g,rgb.b].join(',') + ")"
  },
  hslFormat: function(color) {
    var hsl = color.get('hsl')
    return "hsl(" + [hsl.h,hsl.s,hsl.l].join(',') + ")"
  },
  rgbHexFormat: function(color) {
    var rgb = color.get('rgb')
    return "#" + ['r', 'g', 'b'].reduce(function(str, axis) {
      var hex = rgb[axis].toString(16)
      return str + (hex.length === 1 ? "0" + hex : hex)
    }, "").toUpperCase()
  }
})
App = Ember.Application.create()

App.Desaturator = Ember.Mixin.create({
  color: Ember.required(),
  desaturation: 0,
  desaturated: function() {
    var color = this.get('color')
    var desaturation = this.get('desaturation')
    var saturation = 1 - desaturation;
    return Color.fromHSL(color.get('h'), Math.min(saturation, color.get('s')), color.get('l'))

  }.property('desaturation', 'color')
})

App.SwatchLight = Ember.Mixin.create({
  active: false,
  onoff: function() {
    if (this.get('active')) {
      this.set('color', Color.fromRGB(0,255,0))
    } else {
      this.set('color', Color.fromRGB(0,0,0))
    }
  }.observes('active').on('init')
})

App.RGBSelector = Ember.Mixin.create({
  r: 255, g: 0, b: 0,
  composedRgbColor: function() {
    return Color.fromRGB(this.getProperties('r','g','b'))
  }.property("r", 'g', 'b'),
  setupRgbBindings: function() {
    Ember.oneWay(this, 'r', 'color.r')
    Ember.oneWay(this, 'g', 'color.g')
    Ember.oneWay(this, 'b', 'color.b')
    Ember.oneWay(this, 'color', 'composedRgbColor')
  }.on("init")
})

App.HSLSelector = Ember.Mixin.create({
  h: 0, s: 1, l: .5,
  dampener: function() {
    return ColorDampener.create()
  }.property(),
  composedHslColor: function() {
    return Color.fromHSL(this.getProperties('h','s','l'))
  }.property('h', 's', 'l'),
  setupHslBindings: function() {
    Ember.bind(this, 'dampener.right', 'color')
    Ember.oneWay(this, 'h', 'dampener.left.h')
    Ember.oneWay(this, 's', 'dampener.left.s')
    Ember.oneWay(this, 'l', 'dampener.left.l')
    Ember.oneWay(this, 'dampener.left', 'composedHslColor')
  }.on("init")
})

App.SingleSwatchController = Ember.Controller.extend(App.SwatchLight)

App.DoubleSwatchController = Ember.Controller.extend(App.SwatchLight)

App.TwoSwatchesWithDesaturationController = Ember.Controller.extend(App.Desaturator, App.SwatchLight, {
  active: true
})

App.TwoSwatchesWithDesaturationAndTextInputController = Ember.Controller.extend(App.Desaturator)
App.TwoSwatchesWithDesaturationAndTwoTextInputsController = Ember.Controller.extend(App.Desaturator)
App.IntegratedRgbSelectorController = Ember.Controller.extend(App.RGBSelector)
App.IntegratedRgbVisualizationController = Ember.Controller.extend(App.RGBSelector)
App.IntegratedHslSelectorController = Ember.Controller.extend(App.RGBSelector, App.HSLSelector)
App.IntegratedHslVisualizationController = Ember.Controller.extend(App.RGBSelector, App.HSLSelector, {
  xRotation: 90
})
App.IntegratedServerController = Ember.Controller.extend(App.RGBSelector, App.HSLSelector, {
  xRotation: 30,
  color: Color.fromRGB(255,255,255),
  server: function() {
    return App.Server.create()
  }.property(),
  setupServerBindings: function() {
    Ember.bind(this, 'server.color', 'color')
  }.on("init")
})

App.ColorSwatchComponent = Ember.Component.extend({
  classNames: ['color-swatch'],
  attributeBindings: ['style'],
  color: Color.fromRGB(),
  style: function() {
    var rgb = this.get('color.rgb')
    return "background-color: " + "rgb(" + [rgb.r,rgb.g,rgb.b].join(',') + ")"
  }.property('color'),
})

App.ColorInputComponent = Ember.Component.extend({
  tagName: 'span',
  layout: Ember.Handlebars.compile("{{input value=syntax.input}}"),
  value: Ember.computed.alias('syntax.output'),
  format: Ember.computed.alias('syntax.formatter.format'),
  syntax: function() {
    return ColorSyntax.create()
  }.property()
})

App.XSliderComponent = Ember.Component.extend({
  classNames: ['x-slider'],
  tagName: ['input'],
  attributeBindings: ['min', 'max', 'step', 'type', 'name'],
  type: "range",
  setup: function() {
    var component = this
    Ember.oneWay(this, 'element.value', 'value')
    this.$().on('input.x-slider', function() {
      component.set('value', new Number(this.value).valueOf())
    })
  }.on('didInsertElement'),
  teardown: function() {
    this.$().off('input.x-slider')
  }.on('willDestroyElement')
})

App.HslVisualizationComponent = Ember.Component.extend({
  classNames: ['hsl-visualization'],
  xRotation: 45,
  dampener: function() {
    return ColorDampener.create()
  }.property(),
  setupBindings: function() {
    Ember.oneWay(this, 'h', 'color.h')
    Ember.oneWay(this, 's', 'color.s')
    Ember.oneWay(this, 'l', 'color.l')
    Ember.bind(this, 'color', 'dampener.left')
  }.on('init'),

  changeColor: function() {
    this.set('dampener.right', Color.fromHSL(this.getProperties('h','s','l')))
  }.observes("h", "s", "l"),
})

App.HslCylinderComponent = Ember.Component.extend({
  classNames: ['hsl-cylinder'],
  tagName: "canvas",
  attributeBindings: ['height', 'width', 'style'],
  style: "border-radius: 10px",
  height: 400,
  width: 400,
  xRotation: 45,


  scene: function() {
    var scene = new THREE.Scene()
    scene.add(this.get('apparatus'))
    return scene
  }.property('apparatus'),

  apparatus: function() {
    var apparatus = new THREE.Object3D()
    apparatus.add(this.get('cylinder'))
    apparatus.add(this.get('dot'))
    return apparatus
  }.property('cylinder', 'dot'),

  camera: function() {
    var camera = new THREE.PerspectiveCamera(45, 1, 1, 1000);
    camera.position.z = 550;
    return camera
  }.property(),

  renderer: function() {
    var renderer = new THREE.WebGLRenderer({
      canvas: this.get('element')
    })
    renderer.setSize(this.get('height'), this.get('width'))
    return renderer
  }.property('element', 'height', 'width'),


  material: function() {
    return new THREE.MeshBasicMaterial({
      vertexColors: THREE.VertexColors,
      emissive: new THREE.Color(0xffffff)
    });
  }.property(),

  dot: function() {
    var geometry = new THREE.SphereGeometry(5);
    var material = new THREE.MeshBasicMaterial({
      color: new THREE.Color(0x000000)
    })
    var sphere = new THREE.Mesh(geometry, material);
    sphere.position.y = 200
    sphere.position.z = 100
    return sphere
  }.property(),

  bottom: function() {
    var geometryBottom = new THREE.CylinderGeometry(100, 0, 200, 100, 1, false)
    var bottom = new THREE.Mesh(geometryBottom, this.get('material'));
    bottom.translateY(-100)
    return bottom
  }.property('material'),

  top: function() {
    var material = this.get('material')
    var maxHeight = 200
    var height = Math.max(0, (this.get('color.l') - 0.5) * 400)
    var truncation = 200 - height
    var geometryTop = new THREE.CylinderGeometry(0, 100, 200, 100, 1, false)
    var top = new THREE.Mesh(geometryTop, material);
    top.position.y = 100
    return top
  }.property('material'),

  cylinder: function() {
    var cylinder = new THREE.Object3D()
    cylinder.add(this.get('top'))
    cylinder.add(this.get('bottom'))
    return cylinder
  }.property('top', 'bottom'),


  draw: function() {
    var s = this.get('color.s')
    var vertices = this.get('top.geometry.vertices')
    this.get('top.geometry.faces').forEach(function(face) {
      face.vertexColors.clear();
      ['a','b','c'].forEach(function(vertexName) {
        var vertex = vertices[face[vertexName]]
        if (vertex.y > 0) {
          face.vertexColors.push(new THREE.Color(0xffffff));
        } else {
          var h;
          if (vertex.x === 0 && vertex.z === 0) {
            h = 0
          } else {
            if (vertex.z === 0) {
              h = Math.atan(vertex.x) + Math.PI / 2
            } else if (vertex.z < 0) {
              h = Math.atan(vertex.x / vertex.z) + 3 * Math.PI / 2
            } else {
              h = Math.atan(vertex.x / vertex.z) + Math.PI / 2
            }
          }
          var color = new THREE.Color()
          color.setHSL(h / (2 * Math.PI), s, 0.5)
          face.vertexColors.push(color);
        }
      })
    })
    vertices = this.get('bottom.geometry.vertices');
    this.get('bottom.geometry.faces').forEach(function(face) {
      face.vertexColors.clear();
      ['a','b','c'].forEach(function(vertexName) {
        var vertex = vertices[face[vertexName]]
        if (vertex.y < 0) {
          face.vertexColors.push(new THREE.Color(0x000000));
        } else {
          var h;
          if (vertex.x === 0 && vertex.z === 0) {
            h = 0
          } else {
            if (vertex.z === 0) {
              h = Math.atan(vertex.x) + Math.PI / 2
            } else if (vertex.z < 0) {
              h = Math.atan(vertex.x / vertex.z) + 3 * Math.PI / 2
            } else {
              h = Math.atan(vertex.x / vertex.z) + Math.PI / 2
            }
          }
          var color = new THREE.Color()
          color.setHSL(h / (2 * Math.PI), s, 0.5)
          face.vertexColors.push(color);
        }
      })
    })
    this.set('top.geometry.colorsNeedUpdate', true);
    this.set('bottom.geometry.colorsNeedUpdate', true)
    this.set('cylinder.scale.x', this.get('color.s'))
    this.set('cylinder.scale.z', this.get('color.s'))
    this.set('cylinder.rotation.y', -1 * this.get('color.h') * Math.PI / 180 + Math.PI / 2)
    this.set('dot.position.y', this.get('color.l') * 400 - 200)
    this.set('apparatus.rotation.x', this.get('xRotation') * Math.PI / 180)
    this.get('renderer').render(this.get('scene'), this.get('camera'))

  }.observes("xRotation", "color", "scene", "renderer", "camera").on('didInsertElement'),

})


function logFace(geometry, face) {
  var a = geometry.vertices[face.a]
  var b = geometry.vertices[face.b]
  var c = geometry.vertices[face.c]
  function coords(vertex) {
    return {x: vertex.x, y: vertex.y, z: vertex.z}
  }
  console.log('a', coords(a), 'b', coords(b), 'c', coords(c))
}

App.RgbVisualizationComponent = Ember.Component.extend({
  color: Color.fromRGB(),
  setupBindings: function() {
    Ember.oneWay(this, 'h', 'color.r')
    Ember.oneWay(this, 's', 'color.g')
    Ember.oneWay(this, 'b', 'color.b')
  }.on('init'),

  changeColor: function() {
    this.set('color', Color.fromRGB(this.getProperties('r','g','b')))
  }.observes("r", "g", "b"),
})

App.RgbBlendComponent = Ember.Component.extend({
  tagName: "canvas",
  height: 200,
  width: 200,
  attributeBindings: ['height', 'width', 'style'],
  style: "border-radius: 10px;",

  paint: function() {
    var canvas = this.get('element')
    var context = this.get('element').getContext('2d');
    var height = this.get('height')
    var width = this.get('width')
    var radius = .2 * height
    var rgb = this.get('color.rgb')
    canvas.width = width
    if (!rgb) { return }
    with (context) {
      restore()
      globalCompositeOperation = "lighter";
      strokeStyle = "#fff"
      fillStyle = "#000"
      fillRect(0, 0, width, height)

      beginPath()
      arc(.375 * width, .375 * height, radius, 0, Math.PI * 2)
      stroke()
      setAlpha(rgb.r / 255)
      fillStyle = "#ff0000"
      fill()
      closePath()
      setAlpha(1)
      beginPath()
      arc(.625 * width, .375 * height, radius, 0, Math.PI*2)
      stroke()
      setAlpha(rgb.g / 255)
      fillStyle = "#00ff00"
      fill()
      closePath()
      setAlpha(1)
      beginPath()
      arc(.5 * width, .6 * height, radius, 0, Math.PI*2)
      stroke()
      setAlpha(rgb.b / 255)
      fillStyle = '#0000ff'
      fill()
      closePath()
      save()
    }
  }.observes("height", "width", "color.rgb", "element").on("didInsertElement"),

  alphaValues: function() {
    var rgb = this.get('color.rgb')
    return ['r','g','b'].reduce(function(values, axis) {
      values[axis] = rgb[axis] / 255
    }, {})
  }.property('color.rgb')
})


App.Server = Ember.Object.extend({
  url: 'galadriel.local:3000/websocket',
  version: 0,
  dispatcher: function() {
    return new WebSocketRails(this.get('url'))
  }.property('url'),
  subscribeToColorsFromServer: function() {
    var self = this
    var dispatcher = this.get('dispatcher')
    dispatcher.bind("color", function(color) {
      var version = color.version || 0
      if (version > self.get('version')) {
        self.set('version', version)
        self.set('color', Color.fromRGB(color))
      }
    })
  }.observes("dispatcher").on("init"),
  broadcastColorToServer: function() {
    var nextVersion = this.get('version') + 1
    var message = Ember.merge({version: nextVersion}, this.get('color.rgb'))
    this.set('version', nextVersion)
    this.get('dispatcher').trigger('color', message)
  }.observes('color')
})
