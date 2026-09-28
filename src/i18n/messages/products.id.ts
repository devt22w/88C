import type { ProductCopy, ProductId } from '../types';

/**
 * Indonesian product copy.
 *
 * Product names keep their Latin brand form, as imported cosmetics normally do.
 * Indonesian runs long, so the second description line is kept under about 38
 * characters to survive the card's 44px two-line clamp.
 */
export const productsId: Record<ProductId, ProductCopy> = {
  // ---- home: BEST ----------------------------------------------------------
  b1: {
    name: 'Glow Melting Lipstick',
    desc: ['#Glossy #Melembapkan', 'Meleleh di bibir, kilau bening.']
  },
  b2: {
    name: 'My Strong Auto Eyebrow',
    desc: ['#PensilOtomatis #Presisi', 'Ujung tipis, alis helai demi helai.']
  },
  b3: {
    name: 'Waterproof Pen Eyeliner',
    desc: ['#PenLiner #TahanAir', 'Sekali tarik, garis tegas bertahan.']
  },
  b4: {
    name: 'Waterproof Tattoo Pen Eyeliner',
    desc: ['#TattooPen #TahanLama', 'Daya tahan seharian tanpa luntur.']
  },
  b5: {
    name: 'Powder Matte Lipstick',
    desc: ['#LipMatte #Ringan', 'Matte blur lembut, terasa ringan.']
  },
  b6: {
    name: '1001 Tone on Tone Shadow Palette Pro 9',
    desc: ['#PaletMata #NudeMood', 'Sembilan warna nude, satu palet.']
  },
  b7: {
    name: 'Dewy Water Glow Lip Tint',
    desc: ['#WaterTint #Glossy', 'Tint ringan dengan kilau bening.']
  },
  b8: {
    name: 'Collagen Vita Wrinkle Multi Balm',
    desc: ['#PerawatanKerut #Balm', 'Stik kolagen untuk kulit kencang.']
  },
  b9: {
    name: 'My Gyeolfit Tattoo Eyebrow',
    desc: ['#BrowTint #EfekTato', 'Alis bertinta dengan serat alami.']
  },

  // ---- home: NEW -----------------------------------------------------------
  n1: {
    name: 'Juicy Fit Tint',
    desc: ['#JuicyTint #WarnaSegar', 'Warna segar yang langsung merekah.']
  },
  n2: {
    name: 'Dark Spot Zero Brightening Cream',
    desc: ['#Mencerahkan #NodaHitam', 'Merawat noda hitam dan warna tak rata.']
  },
  n3: {
    name: 'Vegan Spicule Shot Lip Plumper',
    desc: ['#LipPlumper #Vegan', 'Sensasi dingin, kilau seperti kaca.']
  },

  // ---- EYE -----------------------------------------------------------------
  e1: {
    name: 'Extreme Volume Potenca Mascara',
    desc: ['#Maskara #Volume', 'Menambah volume tanpa menggumpal.']
  },
  e2: {
    name: 'My Strong Eyebrow Pencil Hard Powder',
    desc: ['#PensilAlis #Powdery', 'Ujung padat untuk alis rapi.']
  },
  e3: {
    name: 'Jewel Poten Eye Glitter',
    desc: ['#Glitter #Berkilau', 'Kilau padat yang tidak rontok.']
  },
  e4: {
    name: 'Waterproof Pencil Gel Eyeliner Big Size',
    desc: ['#GelPensil #UkuranBesar', 'Lembut ditarik, kuat menempel.']
  },
  e5: {
    name: 'Shade Mood Eye Palette 9 #Muted Potion',
    desc: ['#PaletMata #Muted', 'Sembilan warna muted untuk harian.']
  },

  // ---- LIP -----------------------------------------------------------------
  l1: {
    name: 'Loving You Tint Glow Lip Balm',
    desc: ['#TintBalm #Glow', 'Balm yang merawat sambil memberi warna.']
  },
  l2: {
    name: 'Better Than Kiss Lip Balm',
    desc: ['#LipBalm #Harian', 'Perawatan harian dengan warna tipis.']
  },
  l3: {
    name: 'Powder Blur Tint',
    desc: ['#BlurTint #Powdery', 'Menyamarkan garis bibir saat kering.']
  },
  l4: {
    name: 'Dewy Over Lip Gloss',
    desc: ['#LipGloss #Dewy', 'Kilau berisi tanpa rasa lengket.']
  },
  l5: {
    name: 'Dewy Water Blur Tint',
    desc: ['#WaterTint #Blur', 'Warna ringan dengan tepi lembut.']
  },
  l6: {
    name: 'Taper Candle Melting Balm',
    desc: ['#MeltingBalm #Nutrisi', 'Meleleh di bibir, terasa nyaman.']
  },
  l7: {
    name: 'One Coat Fixing Tint',
    desc: ['#FixingTint #SekaliOles', 'Warna penuh hanya dengan sekali oles.']
  },
  l8: {
    name: 'Melting Blur Tint',
    desc: ['#BlurTint #Meleleh', 'Meleleh lembut, hasil blur halus.']
  },

  // ---- FACE ----------------------------------------------------------------
  f1: {
    name: 'UV Daily Sun Cream SPF50+ PA+++',
    desc: ['#SunCream #Harian', 'Proteksi harian tanpa white cast.']
  },
  f2: {
    name: 'Fake Up 3 Shade Contour',
    desc: ['#Contour #TigaWarna', 'Bentuk, bayangi, baurkan dalam satu pan.']
  },
  f3: {
    name: 'Microfit Powder Pact',
    desc: ['#BedakPadat #Halus', 'Bedak halus yang tidak menumpuk.']
  },
  f4: {
    name: 'Yuja Vita C Clear Toner Pad 100pcs',
    desc: ['#TonerPad #VitaC', 'Perawatan harian isi 100 lembar.']
  },
  f5: {
    name: 'Fake Up Hair Cover Stick',
    desc: ['#HairCover #Akar', 'Menutup garis rambut dalam sekejap.']
  },
  f6: {
    name: '100% French Collagen Lifting Serum',
    desc: ['#Kolagen #Lifting', 'Serum pengencang untuk kulit lelah.']
  },
  f7: {
    name: 'Set : Fake Up 3 Shade Contour + Brush',
    desc: ['#Paket #KuasContour', 'Contour lengkap dengan kuasnya.']
  },
  f8: {
    name: 'UV Daily Moisture Sun Stick SPF50+',
    desc: ['#SunStick #Lembap', 'Hasil lembap, bisa dioles ulang.']
  },
  f9: {
    name: 'UV Daily Airy Sun Stick SPF50+',
    desc: ['#SunStick #Ringan', 'Hasil kering, tidak lengket.']
  },
  f10: {
    name: 'Collagen Vita Wrinkle Multi BB Cream',
    desc: ['#BBCream #PerawatanKerut', 'Coverage dan perawatan jadi satu.']
  },

  // ---- ACC & TOOL ----------------------------------------------------------
  a1: {
    name: 'Rubycell Puff Set',
    desc: ['#Spons #AlatBase', 'Base rata dan mudah dicuci.']
  },
  a2: {
    name: 'Cheek & Contour Brush',
    desc: ['#Kuas #BlushContour', 'Kepala miring untuk blush dan shading.']
  },
  a3: {
    name: 'Eyeshadow Brush',
    desc: ['#Kuas #Eyeshadow', 'Mengisi warna dan membaurkan tepi.']
  },
  a4: {
    name: 'Eyelash Curler',
    desc: ['#Penjepit #BuluMata', 'Lentik tanpa menjepit kelopak.']
  }
};
