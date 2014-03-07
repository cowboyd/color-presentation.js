describe "Colors", ->
  beforeEach ->
    @chocolate = Color.fromRGB r: 210, g: 30, b: 105

  describe "referential integrity", ->
    it 'is upheld in rgb space', ->
      expect(@chocolate).to.equal Color.fromRGB(r: 210, g: 30, b: 105)
    it 'is upheld in hsl space', ->
      expect(@chocolate).to.equal Color.fromHSL(h: 335, s: .75, l: 0.471)

  describe "normalization", ->
    beforeEach ->
      @rgb = Color.fromRGB.bind Color
      @hsl = Color.fromHSL.bind Color
    it 'parses and rounds rgb values', ->
      expect(@rgb r: "210.1", g: "29.6", b: 0).to.equal @rgb r: 210, g: 30, b: 0
      expect(@rgb r: 800, g: -300).to.equal @rgb r: 255, g: 0, b: 0
    it 'treats ordinal arguments as r,g, and b respectively', ->
      expect(@rgb 10,20,30).to.equal @rgb r: 10, g: 20, b: 30
  # beforeEach ->
    
  #   @RGB = Color.RGBValue
  #   @HSL = Color.HSLValue
  #   @chocolateRGB = @RGB.create r: 210, g: 30, b: 105
  #   @chocolateHSL = @HSL.create h: 335, s: .75, l:0.471
  # describe "RGBValue", ->
  #   describe "default values", ->
  #     beforeEach ->
  #       @rgb = @RGB.create()
  #     it "defaults its values to zero", ->
  #       expect(@rgb.getProperties 'r', 'g', 'b').to.deep.equal
  #         r: 0, g: 0, b: 0

  #   it "reuses instances for same values of rgb", ->
  #     expect(@RGB.create r: 1, g: 2: b: 3).to.equal @RGB.create
  #       r: 1, g: 2: b: 3
  #   it "has different instances for different values of rgb", ->
  #     expect(@RGB.create r: 1, g: 2, b: 3).not.to.equal @RGB.create
  #       r: 3, g: 2, b: 1
  #   describe "conversion", ->
  #     it "has an equivalent HSL value", ->
  #       expect(@chocolateRGB.get('hslValue')).to.equal @chocolateHSL

  # describe "HSLValues", ->
  #   it "defaults to reasonable values", ->
  #     expect(@HSL.create().getProperties('h', 's', 'l')).to.deep.equal
  #       h: 0, s: .5, l: 0
  #   it "re-uses instances for like values", ->
  #     expect(@HSL.create h: 110, s: .22, l: 1).to.equal @HSL.create
  #       h: 110, s: .22, l: 1
  #   describe 'conversion', ->
  #     it "has an equivalent RGB value", ->
  #       expect(@chocolateHSL.get('rgbValue')).to.equal @chocolateRGB

  # describe "Color Models", ->
  #   beforeEach ->
  #     @color = Color.create()
  #   it 'has an rgb value', ->
  #     expect(@color.get('rgbValue')).to.exist
  #   it 'has an hsl value', ->
  #     expect(@color.get('hslValue')).to.exist
  #   it 'has equivalent rgb and hsl values', ->
  #     expect(@color.get('rgbValue')).to.equal @color.get('hslValue.rgbValue')

  #   describe 'setting the hsl coordinates', ->
  #     beforeEach ->
  #       @color.setProperties({h: 335, s: .75, l: 0.471})
  #     it 'adjust the hsl value', ->
  #       expect(@color.get('hslValue')).to.equal @chocolateHSL
  #     it 'adjusts the rgb value', ->
  #       expect(@color.get('rgbValue')).to.equal @chocolateRGB

  #   describe 'setting the rgb coordinates', ->
  #     beforeEach ->
  #       @color.setProperties(r: 210, g: 30, b: 105)
  #     it "reflects the change in the HSL value", ->
  #       expect(@color.get('hslValue')).to.equal @chocolateHSL
