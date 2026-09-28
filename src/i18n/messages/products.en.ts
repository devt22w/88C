import type { ProductCopy, ProductId } from '../types';

/**
 * English product copy.
 *
 * Names and prices follow the real catalogue; the two description lines are
 * written for this build rather than lifted from the brand's marketing copy.
 * Keep the second line under about 40 characters or the card's 44px two-line
 * clamp will cut it at the 1263px minimum width.
 */
export const productsEn: Record<ProductId, ProductCopy> = {
  // ---- home: BEST ----------------------------------------------------------
  b1: {
    name: 'Glow Melting Lipstick',
    desc: ['#Glossy #Moisturising', 'Melts on contact for a glazed shine.']
  },
  b2: {
    name: 'My Strong Auto Eyebrow',
    desc: ['#AutoPencil #HairStroke', 'Slim tip draws brows hair by hair.']
  },
  b3: {
    name: 'Waterproof Pen Eyeliner',
    desc: ['#PenLiner #Waterproof', 'One stroke, a crisp line that stays.']
  },
  b4: {
    name: 'Waterproof Tattoo Pen Eyeliner',
    desc: ['#TattooPen #LongWear', 'Tint-like hold that lasts all day.']
  },
  b5: {
    name: 'Powder Matte Lipstick',
    desc: ['#MatteLip #Airy', 'Soft blur matte, weightless on lips.']
  },
  b6: {
    name: '1001 Tone on Tone Shadow Palette Pro 9',
    desc: ['#EyePalette #NudeMood', 'Nine nude tones in one palette.']
  },
  b7: {
    name: 'Dewy Water Glow Lip Tint',
    desc: ['#WaterTint #GlassyGlow', 'Water-light tint with a glassy shine.']
  },
  b8: {
    name: 'Collagen Vita Wrinkle Multi Balm',
    desc: ['#WrinkleCare #BalmStick', 'A collagen stick for firmer-looking skin.']
  },
  b9: {
    name: 'My Gyeolfit Tattoo Eyebrow',
    desc: ['#BrowTint #TattooEffect', 'Tinted brows with a natural grain.']
  },

  // ---- home: NEW -----------------------------------------------------------
  n1: {
    name: 'Juicy Fit Tint',
    desc: ['#JuicyTint #FreshColour', 'Bursts with fresh, juicy colour.']
  },
  n2: {
    name: 'Dark Spot Zero Brightening Cream',
    desc: ['#Brightening #DarkSpots', 'Targets dark spots and uneven tone.']
  },
  n3: {
    name: 'Vegan Spicule Shot Lip Plumper',
    desc: ['#LipPlumper #Vegan', 'Cooling plump with a glassy finish.']
  },

  // ---- EYE -----------------------------------------------------------------
  e1: {
    name: 'Extreme Volume Potenca Mascara',
    desc: ['#Mascara #Volume', 'Builds volume without clumping.']
  },
  e2: {
    name: 'My Strong Eyebrow Pencil Hard Powder',
    desc: ['#BrowPencil #PowderFinish', 'A firm tip for clean, powdery brows.']
  },
  e3: {
    name: 'Jewel Poten Eye Glitter',
    desc: ['#Glitter #Sparkle', 'Dense sparkle that stays put.']
  },
  e4: {
    name: 'Waterproof Pencil Gel Eyeliner Big Size',
    desc: ['#GelPencil #BigSize', 'Glides on soft, sets waterproof.']
  },
  e5: {
    name: 'Shade Mood Eye Palette 9 #Muted Potion',
    desc: ['#EyePalette #MutedMood', 'Nine muted tones for daily looks.']
  },

  // ---- LIP -----------------------------------------------------------------
  l1: {
    name: 'Loving You Tint Glow Lip Balm',
    desc: ['#TintBalm #Glow', 'A balm that tints as it softens.']
  },
  l2: {
    name: 'Better Than Kiss Lip Balm',
    desc: ['#LipBalm #Daily', 'Everyday care with a sheer wash.']
  },
  l3: {
    name: 'Powder Blur Tint',
    desc: ['#BlurTint #Powdery', 'Blurs the lip line as it dries down.']
  },
  l4: {
    name: 'Dewy Over Lip Gloss',
    desc: ['#LipGloss #Dewy', 'Plumping shine, never sticky.']
  },
  l5: {
    name: 'Dewy Water Blur Tint',
    desc: ['#WaterTint #Blur', 'Water-light colour with a soft edge.']
  },
  l6: {
    name: 'Taper Candle Melting Balm',
    desc: ['#MeltingBalm #Nourishing', 'Melts into lips and stays comfortable.']
  },
  l7: {
    name: 'One Coat Fixing Tint',
    desc: ['#FixingTint #OneCoat', 'Full colour in a single pass.']
  },
  l8: {
    name: 'Melting Blur Tint',
    desc: ['#BlurTint #Melting', 'Melts on, sets to a soft blur.']
  },

  // ---- FACE ----------------------------------------------------------------
  f1: {
    name: 'UV Daily Sun Cream SPF50+ PA+++',
    desc: ['#SunCream #Daily', 'Light daily UV care, no white cast.']
  },
  f2: {
    name: 'Fake Up 3 Shade Contour',
    desc: ['#Contour #ThreeShades', 'Sculpt, shade and blend in one pan.']
  },
  f3: {
    name: 'Microfit Powder Pact',
    desc: ['#PowderPact #FineFinish', 'Fine powder that sets without cake.']
  },
  f4: {
    name: 'Yuja Vita C Clear Toner Pad 100ea',
    desc: ['#TonerPad #VitaC', 'Daily wipe-off care, 100 pads.']
  },
  f5: {
    name: 'Fake Up Hair Cover Stick',
    desc: ['#HairCover #Roots', 'Covers the hairline in a few strokes.']
  },
  f6: {
    name: '100% French Collagen Lifting Serum',
    desc: ['#Collagen #Lifting', 'Firming serum for tired skin.']
  },
  f7: {
    name: 'Set : Fake Up 3 Shade Contour + Brush',
    desc: ['#Set #ContourBrush', 'The contour pan with its own brush.']
  },
  f8: {
    name: 'UV Daily Moisture Sun Stick SPF50+',
    desc: ['#SunStick #Moisture', 'Moist finish, reapply over makeup.']
  },
  f9: {
    name: 'UV Daily Airy Sun Stick SPF50+',
    desc: ['#SunStick #Airy', 'Dry-touch finish, never sticky.']
  },
  f10: {
    name: 'Collagen Vita Wrinkle Multi BB Cream',
    desc: ['#BBCream #WrinkleCare', 'Coverage and care in one tube.']
  },

  // ---- ACC & TOOL ----------------------------------------------------------
  a1: {
    name: 'Rubycell Puff Set',
    desc: ['#Puff #BaseTool', 'Even base application, easy to wash.']
  },
  a2: {
    name: 'Cheek & Contour Brush',
    desc: ['#Brush #CheekContour', 'Angled head for blush and shading.']
  },
  a3: {
    name: 'Eyeshadow Brush',
    desc: ['#Brush #Eyeshadow', 'Packs colour and blends the edge.']
  },
  a4: {
    name: 'Eyelash Curler',
    desc: ['#Curler #LashTool', 'Curls without pinching the lid.']
  }
};
