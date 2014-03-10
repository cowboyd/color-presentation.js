describe 'color matcher', ->
  beforeEach ->
    @matcher = ColorSyntax.Matcher.create()
  it 'has no output by default', ->
    expect(@matcher.get('output')).not.to.exist
  describe 'matching rgb rules', ->
    beforeEach ->
      @matcher.set('input', 'rgb(100,200,300)')
    it 'is results in a match', ->
      expect(@matcher.get('output')).to.exist
      expect(@matcher.get('output.color.rgb')).to.deep.equal r:100,g:200,b:255
    describe 'then setting the input to nonsense', ->
      beforeEach ->
        @matcher.set('input', 'notheuob$$')
      it 'reverts to no match', ->
        expect(@matcher.get('output')).not.to.exist

