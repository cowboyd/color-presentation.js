App = Ember.Application.create()

App.ApplicationController = Ember.Controller.extend({
  color: Color.fromRGB(255,0,0),
  swatchStyle: function() {
    var rgb = this.get('color.rgb')
    return "background-color: " + "rgb(" + [rgb.r,rgb.g,rgb.b].join(',') + ")"
  }.property('color.rgb'),
})

App.ColorInputComponent = Ember.Component.extend({
  tagName: 'span',
  layout: Ember.Handlebars.compile("{{input value=syntax.input}}"),
  value: Ember.computed.alias('syntax.output'),
  syntax: function() {
    return ColorSyntax.create()
  }.property()
})

App.XSliderComponent = Ember.Component.extend({
  classNames: ['x-slider'],
  tagName: ['input'],
  attributeBindings: ['min', 'max', 'step', 'type'],
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
  attributeBindings: ['height', 'width'],
  height: 400,
  width: 400,
  xRotation: 45,


  repaint: function() {
    var viz = this.getProperties('renderer', 'scene', 'camera', 'cylinder')
    viz.cylinder.rotation.y = this.get('color.h') * Math.PI / 180
    viz.cylinder.rotation.x = this.get('xRotation') * Math.PI / 180
    viz.renderer.render(viz.scene, viz.camera)
  }.observes("xRotation", "color").on('didInsertElement'),

  setup: function() {
    var renderer = new THREE.WebGLRenderer({
      canvas: this.get('element')
    });
    renderer.setSize(this.get('height'), this.get('width'));

    // camera
    var camera = new THREE.PerspectiveCamera(45, 1, 1, 1000);
    camera.position.z = 700;

    // scene
    var scene = new THREE.Scene();


    var material = new THREE.MeshBasicMaterial({
      vertexColors: THREE.VertexColors,
      emissive: new THREE.Color(0xffffff)
    });
    var geometryBottom = new THREE.CylinderGeometry(100, 100, 200, 720, 1, false)
    geometryBottom.faces.forEach(function(face) {
      //logFace(geometryBottom, face);
      ['a','b','c'].forEach(function(vertexName) {
        var vertex = geometryBottom.vertices[face[vertexName]]
        if (vertex.y < 0) {
          face.vertexColors.push(new THREE.Color(0x000000));
        } else {
          var h = Math.asin(vertex.x / 100) * 180 / Math.PI
          var s = vertex.z / 100
          var color = new THREE.Color()
          color.setHSL(h / 360, s, 0.5)
          face.vertexColors.push(color);
        }
      })
    })
    var bottom = new THREE.Mesh(geometryBottom, material);
    bottom.translateY(-100)


    var geometryTop = new THREE.CylinderGeometry(100, 100, 200, 720, 1, false)
    geometryTop.faces.forEach(function(face) {
      //logFace(geometryTop, face);
      ['a','b','c'].forEach(function(vertexName) {
        var vertex = geometryTop.vertices[face[vertexName]]
        if (vertex.y > 0) {
          face.vertexColors.push(new THREE.Color(0xffffff));
        } else {
          var h = Math.asin(vertex.x / 100) * 180 / Math.PI
          var s = vertex.z / 100
          var color = new THREE.Color()
          color.setHSL(h / 360, s, 0.5)
          face.vertexColors.push(color);
        }
      })
    })
    var top = new THREE.Mesh(geometryTop, material);
    top.translateY(100)

    var cylinder = new THREE.Object3D()
    cylinder.add(top);
    cylinder.add(bottom);
    scene.add(cylinder);

    // start animation
    //animate();

    this.setProperties({
      renderer: renderer,
      scene: scene,
      camera: camera,
      cylinder: cylinder
    })
    
  }.on('didInsertElement'),

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
  color: Color.create(),
  setupBindings: function() {
    Ember.oneWay(this, 'r', 'color.r')
    Ember.oneWay(this, 'g', 'color.g')
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
  attributeBindings: ['height', 'width'],
  color: Color.create(),

  paint: function() {
    var canvas = this.get('element')
    var context = this.get('element').getContext('2d');
    var height = this.get('height')
    var width = this.get('width')
    var radius = .2 * height
    var rgb = this.get('color.rgb')

    canvas.width = width
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
