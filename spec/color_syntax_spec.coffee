describe 'Color Syntax', ->
  beforeEach ->
    @syntax = ColorSyntax.create()
  it 'has no output to start out with', ->
    expect(@syntax.get('output')).not.to.exist
  describe 'setting in a valid rgb string', ->
    beforeEach ->
      @syntax.set 'input', 'rgb(10,20,30)'
    it 'outputs the corresponding color', ->
      expect(@syntax.get('output.rgb')).to.deep.equal r: 10, g: 20, b: 30
    describe 'changing the output to another color', ->
      beforeEach ->
        @syntax.set 'output', @rgb(15, 25, 35)
      it 'formats the input to correspond to its output', ->
        expect(@syntax.get('input')).to.equal "rgb(15,25,35)"
    describe 'then setting the input to nonsense', ->
      beforeEach ->
        @syntax.set('input', 'xyz')
      it 'retains the original value', ->
        expect(@syntax.get('output.rgb')).to.deep.equal r: 10, g: 20, b: 30
    describe 'then changing its output to another color specified with HSL', ->
      beforeEach ->
        @syntax.set('output', @hsl(250, .47, .78))
      it 'formats according to rgb', ->
        expect(@syntax.get('input')).to.equal 'rgb(181,173,225)'
  describe 'setting in a valid hsl string', ->
    beforeEach ->
      @syntax.set('input', 'hsl(250,.47,.78)')
    it 'outputs the corresponding color', ->
      expect(@syntax.get('output')).to.equal @hsl(250,.47,.78)
    describe 'changing the color', ->
      beforeEach ->
        @syntax.set 'output', @rgb(10,20,30)
      it 'formats the input using hsl rules', ->
        expect(@syntax.get('input')).to.equal 'hsl(210,0.5,0.078)'
  describe 'setting a valid HEX string', ->
    beforeEach ->
      @syntax.set('input', "#Af0d1B")
    it 'outputs the corresponding color', ->
      expect(@syntax.get('output')).to.equal @rgb(175,13,27)
    describe 'changing the collor', ->
      beforeEach ->
        @syntax.set 'output', @rgb(255,16,33)
      it 'formats the input in hexidecimal', ->
        expect(@syntax.get('input')).to.equal '#FF1021'
