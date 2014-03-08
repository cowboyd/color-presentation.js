describe 'OR Gate', ->
  beforeEach ->
    @gate = Color.OR.create()
  it 'is undefined by default', ->
    expect(@gate.get('output')).not.to.exist
  describe 'setting the B input', ->
    beforeEach ->
      @gate.set('b', 2)
    it 'has the value of the b input', ->
      expect(@gate.get('output')).to.equal 2
    describe 'setting the A input while the b input is set', ->
      beforeEach ->
        @gate.set('a', 1)
      it 'takes on the value of the a input', ->
        expect(@gate.get('output')).to.equal 1

  describe 'feeding back the output into input B', ->
    beforeEach ->
      Ember.oneWay(@gate, 'b', 'output')
    it 'starts out as undefined', ->
      expect(@gate.get('output')).to.equal this.undefined
    describe 'setting a value in the A input', ->
      beforeEach ->
        @gate.set('a', 1)
      it 'passes through to the output', ->
        expect(@gate.get('output')).to.equal 1
      describe 'unsetting the A input', ->
        beforeEach ->
          @gate.set('a', null)
        it 'still contains the old value for the output', ->
          expect(@gate.get('output')).to.equal 1
