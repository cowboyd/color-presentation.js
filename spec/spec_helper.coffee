beforeEachWithoutEmberRun = this.beforeEach
this.beforeEach = (fn)->
  beforeEachWithoutEmberRun -> Ember.run => fn.call this
afterEachWithoutEmberRun = this.afterEach
this.afterEach = (fn)->
  afterEachWithoutEmberRun -> Ember.run => fn.call this
beforeEach ->
  @rgb = Color.fromRGB.bind Color
  @hsl = Color.fromHSL.bind Color
