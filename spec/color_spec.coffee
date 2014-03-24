describe "Colors", ->
  beforeEach ->
    @chocolate = Color.fromRGB r: 210, g: 30, b: 105
    @crimson = Color.fromHSL(h: 348, s: 0.833, l: 0.471) # 220,20,60
  describe "referential integrity", ->
    it 'is upheld in rgb space', ->
      expect(@chocolate).to.equal @rgb r: 210, g: 30, b: 105
    it 'is upheld in hsl space and rgb space', ->
      expect(@hsl h: 348, s: 0.833, l: 0.471).to.equal @crimson

  describe "normalization", ->
    it 'parses and rounds rgb values', ->
      expect(@rgb r: "210.1", g: "29.6", b: 0).to.equal @rgb r: 210, g: 30, b: 0
      expect(@rgb r: 800, g: -300).to.equal @rgb r: 255, g: 0, b: 0
    it 'parses and rounds hsl values', ->
      expect(@hsl(h: "500.6", s: -10, l: ".0788").get('hsl')).to.deep.equal
        h: 140.6, s: 0, l: 0.079
    it 'treats ordinal arguments as r,g, and b respectively', ->
      expect(@rgb 10,20,30).to.equal @rgb r: 10, g: 20, b: 30
    it 'treats ordinal arguments as h,s, and l respectively', ->
      expect(@hsl 10,.7,.8).to.equal @hsl h: 10, s: .7, l: .8
