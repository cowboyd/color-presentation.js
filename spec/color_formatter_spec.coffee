describe 'ColorSyntax.Formatter', ->
  beforeEach ->
    @formatter = ColorSyntax.Formatter.create()
  it 'has no value without a color and format', ->
    expect(@formatter.get('output')).not.to.exist
  describe 'setting the color without a format', ->
    beforeEach ->
      @formatter.set 'color', @rgb(10,20,30)
    it 'still has an undefined output', ->
      expect(@formatter.get 'output').not.to.exist
  describe 'setting the format without a color', ->
    beforeEach ->
      @formatter.set 'format', (color)-> 'bing!'
    it 'still has an undefined output', ->
      expect(@formatter.get('output')).not.to.exist
  describe 'setting both the format and the color', ->
    beforeEach ->
      @formatter.setProperties
        color: @rgb(10,20,30)
        format: (color) =>
          @color = color
          "yah!"
    it 'formats the output', ->
      expect(@formatter.get 'output').to.equal "yah!"
      expect(@color).to.equal @rgb(10,20,30)
