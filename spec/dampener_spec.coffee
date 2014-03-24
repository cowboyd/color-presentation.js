describe 'ColorDampener', ->
  beforeEach ->
    @dampener = ColorDampener.create()
    @green = Color.fromRGB(0,255,0)
    @red = Color.fromRGB(255,0,0)
  describe 'with a pure green on the left', ->
    beforeEach ->
      @dampener.set('left', @green)
    it 'shows green on the right', ->
      expect(@dampener.get 'right').to.equal @green
    describe 'subsequently setting its right side to be a pure red', ->
      beforeEach ->
        @dampener.set('right', @red)
      it 'shows red on the left', ->
        expect(@dampener.get('left')).to.equal @red
  describe "with a left HSL Value without an exact RGB", ->
    beforeEach ->
      @color = Color.fromHSL(100,0.5,0.5)
    describe 'setting it on the left', ->
      beforeEach ->
        @dampener.set('left', @color)
        @dampener.set('right', Color.fromRGB(@color.get('rgb')))
      it 'has on the right a similar RGB', ->
        expect(@dampener.get('right.rgb')).to.deep.equal r: 106, g: 191, b: 64
      it 'maintains its original HSL', ->
        expect(@dampener.get('left.hsl')).to.deep.equal h: 100, s: 0.5, l: 0.5

    describe 'with a right HSL value without an exact RGB', ->
      beforeEach ->
        @dampener.set('right', @color)
        @dampener.set('left', Color.fromRGB(@color.get('rgb')))
      it 'has on the left a similar RGB', ->
        expect(@dampener.get 'left.rgb').to.deep.equal r: 106, g: 191, b: 64
      it 'maintains its original HSL value', ->
        expect(@dampener.get('right')).to.equal @color
