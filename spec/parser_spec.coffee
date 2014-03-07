describe 'The Color.Parser', ->
  # beforeEach ->
  #   @parser = Color.Parser.create()

  # describe "nonsense input", ->
  #   beforeEach ->
  #     @parser.set "input", "xyz"
  #   it 'does not match', ->
  #     expect(@parser.get("output")).to.not.be.defined

  # describe 'input in the form rgb($r,$g,$b)', ->
  #   beforeEach ->
  #     @parser.set "input", "rgb(210,30,105)"
  #   it "matches", ->
  #     expect(@parser.get("output")).to.exist
  #     expect(@parser.get("output").getProperties('r','g','b')).to.deep.equal
  #       r: 210, g: 30, b: 105

  #   describe 'but with some spaces thrown in', ->
  #     beforeEach ->
  #       @parser.set "input", "rgb(210, 30 ,105 )"
  #     it "matches", ->
  #       expect(@parser.get("output")).to.exist
  #       expect(@parser.get("output").getProperties('r','g','b')).to.deep.equal
  #         r: 210, g: 30, b: 105

  #   describe '. Then setting the parser output to another color ', ->
  #     beforeEach ->
  #       @parser.set "output", Color.create({h: 216, s: 0.6, l: 0.245})
  #     it 'serializes through the rgb rule', ->
  #       expect(@parser.get("input")).to.equal "rgb(25,55,100)"


  #   describe 'input in the form hsl($h,$s,$l)', ->
  #     beforeEach ->
  #       @parser.set 'input', "hsl(110, .22, 1)"
  #     it "matches", ->
  #       expect(@parser.get("output")).to.exist
  #       expect((@parser.get("output")).getProperties('h','s', 'l')).to.deep.equal
  #         h: 110, s: .22, l: 1

  #     describe '. Then setting the parser output to another color', ->
  #       beforeEach ->
  #         @parser.set "output", Color.create({r: 25, g: 55, b: 100})
  #       it "serializes through the hsl rule", ->
  #         expect(@parser.get("input")).to.equal "hsl(216,0.6,0.245)"
