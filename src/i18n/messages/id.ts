import type { Messages } from '../types';
import { productsId } from './products.id';

/**
 * Bahasa Indonesia.
 *
 * Product names stay in their Latin brand form, as imported cosmetics normally
 * do. The description lines are written for this build, not lifted from the
 * brand's marketing copy.
 *
 * Indonesian runs roughly 20–30% longer than English, and the card geometry is
 * fixed (one-line product name, a hard 44px two-line description, a 212px cart
 * pill). Strings here are kept deliberately tight so nothing clips.
 */
export const id: Messages = {
  meta: {
    title: 'MQNY — Toko Kosmetik',
    description:
      'Produk terlaris, koleksi baru, dan kupon khusus member, dikirim di hari yang sama.'
  },
  promo: {
    text: 'Daftar jadi member MQNY dan dapatkan kupon untuk pesanan pertama.',
    close: 'TUTUP'
  },
  nav: {
    login: 'Masuk',
    join: 'Daftar',
    delivery: 'Pengiriman',
    contact: 'Kontak',
    searchPlaceholder: 'Cari produk'
  },
  categories: {
    all: 'SEMUA',
    eye: 'MATA',
    lip: 'BIBIR',
    face: 'WAJAH',
    accTool: 'AKSESORI',
    alarm: 'Info event',
    event: 'EVENT',
    cs: 'CS'
  },
  hero: {
    slides: [
      {
        headline: ['DAFTAR,', 'HEMAT 5%'],
        lines: ['Member mendapat kupon diskon 5%.', 'Berlaku untuk belanja di atas {amount}.'],
        alt: 'Kupon member'
      },
      {
        headline: ['YANG PALING', 'DICARI'],
        lines: ['Sembilan produk yang paling sering dipesan ulang.', 'Stok kembali dan siap dikirim hari ini.'],
        alt: 'Produk terlaris'
      },
      {
        headline: ['BARU', 'PEKAN INI'],
        lines: ['Tiga produk baru yang baru saja tiba.', 'Dari tint segar sampai lip plumper.'],
        alt: 'Produk baru'
      }
    ]
  },
  sections: {
    best: {
      title: 'BEST ITEM',
      subtitle: 'Produk terlaris yang paling dicintai'
    },
    fresh: {
      title: 'NEW ITEM',
      subtitle: 'Produk baru terpanas dari MQNY'
    }
  },
  product: {
    // kept short on purpose: the cart pill is a fixed 212px in the spec
    addToCart: 'KE KERANJANG',
    copy: productsId
  },
  midBanner: {
    panels: [
      {
        eyebrow: 'Membership',
        headline: ['Kupon khusus', 'pesanan pertama'],
        alt: 'Kupon member'
      },
      {
        eyebrow: 'Bundle Deal',
        headline: ['Ambil dua produk,', 'ongkir kami tanggung'],
        alt: 'Penawaran paket'
      }
    ]
  },
  footer: {
    company: {
      nameLabel: 'Perusahaan',
      name: 'PLACEHOLDER COSMETICS CO., LTD.',
      ceoLabel: 'Direktur',
      ceo: 'Hong Gil-dong',
      registrationLabel: 'Nomor izin usaha',
      registration: '000-00-00000',
      businessCheck: 'Cek izin usaha',
      mailOrderLabel: 'Izin penjualan daring',
      mailOrder: '0000-Seoul-0000',
      privacyOfficerLabel: 'Penanggung jawab data',
      privacyOfficer: 'privacy@example.com [Hong Gil-dong]',
      address:
        'Alamat : 00, Example-ro 00-gil, Gangnam-gu, Seoul, Korea Selatan (00000)'
    },
    copyright: [
      'Hak cipta © PLACEHOLDER COSMETICS CO., LTD. Semua hak dilindungi.',
      'Ganti data perusahaan dan nomor rekening dengan data badan usaha yang sebenarnya.'
    ],
    policies: {
      brandStory: 'TENTANG BRAND',
      shoppingGuide: 'PANDUAN BELANJA',
      privacyPolicy: 'KEBIJAKAN PRIVASI',
      businessCheck: 'CEK IZIN USAHA'
    },
    cs: {
      title: 'CS CENTER',
      heading: 'Jam layanan pelanggan',
      phoneLabel: 'Chat dengan kami',
      hours: ['BUKA  10.00 – 17.00', 'ISTIRAHAT  12.00 – 13.00', 'SABTU, MINGGU, LIBUR TUTUP']
    },
    bank: {
      title: 'BANK INFO',
      holder: 'Atas nama : PLACEHOLDER COSMETICS',
      businessTitle: 'BUSINESS',
      partnership: 'Kerja sama & reseller',
      bulkOrder: 'Pemesanan jumlah besar',
      banks: { kb: 'KB', shinhan: 'Shinhan' }
    },
    notice: [
      'Alamat retur : 00, Example-ro 00-gil, Gangnam-gu, Seoul (00000) Pusat Retur',
      'Pertanyaan dan keluhan konsumen : 0000-0000 / help@example.com'
    ]
  },
  sideMenu: {
    loginPrompt: 'Masuk dulu untuk melanjutkan.',
    login: 'MASUK',
    join: 'DAFTAR',
    myPage: 'AKUN SAYA',
    cart: 'KERANJANG',
    order: 'PESANAN',
    delivery: 'PENGIRIMAN',
    coupon: 'KUPON',
    qna: 'TANYA JAWAB',
    myInfo: 'DATA SAYA'
  },
  search: {
    title: 'CARI',
    placeholder: 'Cari produk',
    hotKeywords: [
      'lipstik',
      'lip tint',
      'pensil alis',
      'eyeliner',
      'palet mata',
      'lip plumper',
      'multi balm',
      'krim pencerah'
    ],
    popular: 'POPULER',
    results: '{n} hasil',
    empty: 'Belum ada yang cocok.',
    seeAll: 'Lihat semua produk'
  },
  account: {
    inert: 'Hanya tampilan — formulir ini belum terhubung ke backend.',
    login: {
      tabMember: 'MASUK MEMBER',
      tabGuest: 'CEK PESANAN TAMU',
      secure: 'Koneksi aman',
      id: 'ID',
      password: 'Kata sandi',
      remember: 'Ingat ID saya',
      findId: 'Cari ID',
      findPassword: 'Lupa kata sandi',
      submit: 'MASUK',
      snsTitle: 'SNS LOGIN',
      joinHeading: 'Daftar dan nikmati keuntungan khusus member',
      joinLines: [
        'Belum jadi member MQNY?',
        'Daftar sekarang dan buka semua keuntungannya.'
      ],
      joinButton: 'DAFTAR'
    },
    join: {
      title: 'DAFTAR',
      lead: 'Isi data di bawah ini untuk membuat akun Anda.',
      name: 'Nama',
      id: 'ID',
      password: 'Kata sandi',
      passwordConfirm: 'Ulangi kata sandi',
      email: 'Email',
      phone: 'Nomor ponsel',
      agreeTerms: 'Saya menyetujui syarat penggunaan',
      agreePrivacy: 'Saya menyetujui kebijakan privasi',
      submit: 'BUAT AKUN'
    },
    delivery: {
      title: 'PENGIRIMAN',
      lead: 'Lacak pesanan dengan nomor dari email konfirmasi Anda.',
      orderNo: 'Nomor pesanan',
      name: 'Nama pemesan',
      submit: 'LACAK PESANAN',
      memberNote: 'Member dapat melihat semua pesanan di AKUN SAYA.'
    },
    contact: {
      title: 'KONTAK',
      lead: 'Kirim pertanyaan Anda, kami balas pada jam layanan.',
      subject: 'Subjek',
      email: 'Email Anda',
      message: 'Pesan',
      submit: 'KIRIM',
      csTitle: 'CS CENTER'
    }
  },
  support: {
    sending: 'Mengirim…',
    sent: 'Terima kasih — pesan Anda sudah kami terima. Kami balas pada jam layanan.',
    failed: 'Pesan gagal dikirim. Silakan coba lagi, atau hubungi nomor di bawah.',
    required: 'Mohon isi nama, email, dan pesan Anda.',
    contact: {
      name: 'Nama Anda',
      email: 'Email Anda',
      phone: 'Nomor ponsel (opsional)',
      subject: 'Subjek',
      message: 'Pesan',
      submit: 'KIRIM',
      infoTitle: 'HUBUNGI KAMI LANGSUNG',
      phoneLabel: 'Telepon',
      kakaoLabel: 'KakaoTalk',
      messengerLabel: 'Facebook Messenger',
      emailLabel: 'Email',
      addressLabel: 'Alamat'
    },
    delivery: {
      trackTitle: 'LACAK PESANAN',
      trackLead: 'Masukkan nomor pesanan dari konfirmasi Anda beserta email yang dipakai memesan.',
      orderId: 'Nomor pesanan',
      email: 'Email pada pesanan',
      track: 'LACAK PESANAN',
      notFound: 'Tidak ada pesanan yang cocok dengan nomor dan email itu.',
      searching: 'Mencari…',
      placed: 'Dipesan',
      paid: 'Dibayar',
      stage: 'Status',
      tracking: 'Resi',
      enquiryTitle: 'TANYA SOAL PENGIRIMAN',
      enquiryLead: 'Sebutkan nomor pesanan dan kebutuhan Anda, kami akan menghubungi Anda kembali.',
      message: 'Apa yang bisa kami bantu?',
      submit: 'KIRIM PERTANYAAN',
      shippingTitle: 'PENGIRIMAN',
      shippingLines: [
        'Ongkos kirim {fee}, gratis untuk belanja di atas {threshold}.',
        'Pesanan dikirim dari #9061 National Highway, Bagong Kalsada, Calamba City, 4027 Laguna.'
      ]
    }
  },
  auth: {
    checking: 'Memeriksa akun Anda…',
    signOut: 'KELUAR',
    myPage: 'AKUN SAYA',
    signedInAs: 'Masuk sebagai {email}',
    errors: {
      badCredentials: 'Email dan kata sandi itu tidak cocok dengan akun mana pun.',
      emailTaken: 'Email ini sudah terdaftar. Silakan masuk saja.',
      weakPassword: 'Gunakan minimal 8 karakter untuk kata sandi.',
      mismatch: 'Kedua kata sandi tidak sama.',
      agreeRequired: 'Mohon setujui syarat penggunaan dan kebijakan privasi.',
      unavailable: 'Fitur akun sedang tidak tersedia. Silakan coba lagi nanti.',
      generic: 'Terjadi kesalahan. Silakan coba lagi.'
    },
    confirmEmail: 'Akun dibuat. Periksa email Anda dan konfirmasi alamatnya, lalu masuk.',
    account: {
      title: 'AKUN SAYA',
      lead: 'Data diri dan pesanan Anda.',
      profileTitle: 'DATA SAYA',
      name: 'Nama',
      phone: 'Nomor ponsel',
      address: 'Alamat',
      city: 'Kota',
      postal: 'Kode pos',
      save: 'SIMPAN',
      saved: 'Tersimpan'
    },
    orders: {
      title: 'PESANAN SAYA',
      empty: 'Belum ada pesanan.',
      emptyCta: 'Mulai belanja',
      placed: 'Dipesan',
      total: 'Total',
      items: 'Barang',
      tracking: 'Resi',
      view: 'Lihat pesanan',
      status: {
        pending: 'Menunggu pembayaran',
        paid: 'Lunas',
        failed: 'Pembayaran gagal',
        cancelled: 'Dibatalkan',
        review: 'Sedang ditinjau'
      },
      fulfilment: {
        unfulfilled: 'Disiapkan',
        packing: 'Dikemas',
        shipped: 'Dikirim',
        delivered: 'Diterima',
        returned: 'Dikembalikan'
      }
    }
  },
  recover: {
    findIdTitle: 'CARI ID',
    findIdLead: 'ID Anda adalah alamat email yang dipakai saat mendaftar. Jika lupa kata sandi, atur ulang di bawah.',
    title: 'ATUR ULANG KATA SANDI',
    lead: 'Masukkan email Anda dan kami kirimkan tautan untuk membuat kata sandi baru.',
    email: 'Email',
    submit: 'KIRIM TAUTAN',
    sending: 'Mengirim…',
    sent: 'Jika email itu terdaftar, tautan pengaturan ulang sedang dikirim. Periksa kotak masuk dan folder spam.',
    newPassword: 'Kata sandi baru',
    confirmPassword: 'Ulangi kata sandi baru',
    save: 'SIMPAN KATA SANDI',
    saved: 'Kata sandi diubah. Anda sudah masuk.',
    expired: 'Tautan ini sudah kedaluwarsa atau telah dipakai. Silakan minta yang baru.',
    backToLogin: 'Kembali ke halaman masuk'
  },
  notifications: {
    title: 'PEMBERITAHUAN',
    empty: 'Belum ada pemberitahuan.',
    markAll: 'Tandai semua dibaca',
    viewOrder: 'Lihat pesanan',
    kinds: {
      order_paid: 'Pembayaran pesanan {order} diterima.',
      order_packing: 'Pesanan {order} sedang dikemas.',
      order_shipped: 'Pesanan {order} telah dikirim. {tracking}',
      order_delivered: 'Pesanan {order} telah diterima.',
      order_returned: 'Pesanan {order} dikembalikan.',
      order_failed: 'Pembayaran pesanan {order} gagal.',
      review_published: 'Ulasan Anda sudah tayang.'
    }
  },
  paymentStatus: {
    badge: 'SEGERA HADIR',
    title: 'Pembayaran online hampir siap',
    body: 'Kartu, GCash, Maya, dan QR Ph sedang disiapkan bersama penyedia pembayaran kami. Sebelum itu aktif, pesanan diselesaikan secara tunai.',
    cashTitle: 'UNTUK SEKARANG, BAYAR TUNAI',
    cashSteps: [
      'Kirimkan barang yang Anda inginkan lewat formulir kontak, Messenger, atau KakaoTalk.',
      'Layanan pelanggan mengonfirmasi total, ongkos kirim, dan perkiraan tibanya.',
      'Anda bayar tunai saat barang tiba atau di kasir, dan struk ikut bersama paket.'
    ],
    cta: 'HUBUNGI LAYANAN PELANGGAN'
  },
  guide: {
    title: 'PANDUAN BELANJA',
    lead: 'Semua tentang cara memesan di sini, sesuai urutannya.',
    steps: [
      {
        heading: '1 · Pilih produk',
        body: 'Buka produk, pilih warna bila ada, lalu masukkan ke keranjang atau beli langsung. Warna yang habis tidak bisa dipilih.'
      },
      {
        heading: '2 · Periksa keranjang',
        body: 'Ubah jumlah atau hapus barang di keranjang. Total yang tampil adalah yang Anda bayar — tidak ada tambahan di belakang.'
      },
      {
        heading: '3 · Isi data pengiriman',
        body: 'Isi nama, email, nomor ponsel, dan alamat tujuan paket. Data member sudah terisi otomatis.'
      },
      {
        heading: '4 · Bayar',
        body: 'Anda diarahkan ke halaman aman milik penyedia pembayaran, membayar, lalu kembali ke halaman pesanan sebagai bukti.'
      }
    ],
    payTitle: 'CARA PEMBAYARAN',
    payBody:
      'Kartu, GCash, Maya, GrabPay, dan QR Ph. Data kartu diketik di halaman penyedia pembayaran, tidak pernah di situs ini. Pembayaran ditagih dalam peso Filipina; harga dalam mata uang lain adalah konversi sebagai acuan.',
    shipTitle: 'PENGIRIMAN',
    shipBody:
      'Ongkos kirim {fee}, gratis untuk belanja di atas {threshold}. Pesanan dikirim dari #9061 National Highway, Bagong Kalsada, Calamba City, 4027 Laguna.',
    trackTitle: 'MELACAK PESANAN',
    trackBody:
      'Gunakan nomor pesanan dari konfirmasi beserta email yang Anda pakai memesan. Member melihat semua pesanan di AKUN SAYA, dan lonceng memberi tahu saat pesanan dikemas, dikirim, atau diterima.',
    memberTitle: 'KEUNTUNGAN MEMBER',
    memberBody:
      'Member menyimpan riwayat pesanan, alamat pengiriman, dan pemberitahuan di satu tempat, serta bisa menulis ulasan produk.',
    returnTitle: 'JIKA ADA MASALAH',
    returnBody:
      'Hubungi layanan pelanggan dengan nomor pesanan dan foto barangnya begitu Anda melihat masalahnya. Tim kami akan memandu langkah berikutnya.',
    ctaTrack: 'LACAK PESANAN',
    ctaContact: 'HUBUNGI KAMI'
  },
  cs: {
    title: 'CS CENTER',
    lead: 'Bicara dengan staf kami. Ini jalur yang sama dengan yang dilayani resor.',
    hoursTitle: 'JAM LAYANAN',
    channelsTitle: 'CARA MENGHUBUNGI',
    phoneLabel: 'Telepon',
    kakaoLabel: 'KakaoTalk',
    messengerLabel: 'Facebook Messenger',
    emailLabel: 'Email',
    addressLabel: 'Alamat',
    ctaContact: 'KIRIM PESAN',
    ctaTrack: 'LACAK PESANAN',
    ctaGuide: 'PANDUAN BELANJA',
    note: 'Pesan di luar jam layanan dibalas pada hari kerja berikutnya.'
  },
  missing: {
    title: 'HALAMAN BELUM DIBUAT',
    lead: 'Tautan ini ada di navigasi, tetapi halamannya belum dibuat.',
    back: 'Kembali belanja'
  },
  list: {
    home: 'BERANDA',
    here: 'Posisi Anda',
    count: '{n} produk',
    empty: 'Belum ada produk di kategori ini.',
    prevPage: 'Halaman sebelumnya',
    nextPage: 'Halaman berikutnya',
    sort: {
      newest: 'Terbaru',
      lowPrice: 'Harga terendah',
      popular: 'Terpopuler',
      reviews: 'Ulasan',
      views: 'Paling dilihat'
    },
    sortUnavailable: 'Perlu data ulasan dan kunjungan sebelum bisa diurutkan.'
  },
  cart: {
    title: 'KERANJANG',
    empty: 'Keranjang Anda kosong.',
    continueShopping: 'Lanjut belanja',
    product: 'Produk',
    quantity: 'Jml',
    price: 'Harga',
    remove: 'Hapus',
    shade: 'Warna',
    subtotal: 'Subtotal',
    shipping: 'Ongkir',
    free: 'Gratis',
    total: 'Total',
    toCheckout: 'CHECKOUT',
    added: 'DITAMBAHKAN ✓',
    chooseShade: 'Pilih warna dulu',
    checkoutTitle: 'CHECKOUT',
    customerHeading: 'Data pengiriman',
    summaryHeading: 'Ringkasan pesanan',
    name: 'Nama lengkap',
    email: 'Email',
    phone: 'Nomor ponsel',
    address: 'Alamat',
    city: 'Kota',
    postal: 'Kode pos',
    required: 'Mohon isi semua kolom.',
    invalidEmail: 'Mohon masukkan email yang valid.',
    pay: 'BAYAR DENGAN KARTU · GCASH · MAYA',
    paying: 'Membuka halaman pembayaran aman…',
    chargedInPhp: 'PayMongo menagih dalam peso Filipina. Total di bawah adalah jumlah yang Anda bayar.',
    methods: 'Kartu, GCash, Maya, GrabPay, dan QR Ph tersedia di halaman PayMongo berikutnya.',
    unavailable: 'Pembayaran belum terhubung — layanan checkout belum di-deploy.',
    failed: 'Checkout tidak dapat dimulai: {reason}',
    resultTitle: 'PESANAN',
    resultPaid: 'Pembayaran diterima — terima kasih!',
    resultPending: 'Mengonfirmasi pembayaran Anda…',
    resultPendingLong: 'Masih menunggu konfirmasi. Halaman ini diperbarui otomatis.',
    resultFailed: 'Pembayaran tidak berhasil.',
    resultCancelled: 'Checkout ini kedaluwarsa atau dibatalkan.',
    resultReview: 'Pembayaran diterima, tetapi jumlahnya berbeda dari pesanan. Kami akan menghubungi Anda.',
    resultNotFound: 'Pesanan tidak ditemukan.',
    orderNumber: 'No. pesanan',
    paidWith: 'Dibayar dengan',
    backToCart: 'Kembali ke keranjang'
  },
  reviews: {
    title: 'ULASAN',
    count: '{n} ulasan',
    none: 'Belum ada ulasan.',
    pending: 'Ulasan Anda menunggu untuk ditayangkan.',
    writeTitle: 'TULIS ULASAN',
    titleLabel: 'Judul (opsional)',
    bodyLabel: 'Bagaimana menurut Anda?',
    submit: 'KIRIM ULASAN',
    sending: 'Mengirim…',
    thanks: 'Terima kasih — ulasan Anda tayang setelah diperiksa.',
    tooShort: 'Mohon tulis sedikit lebih panjang.',
    failed: 'Ulasan gagal disimpan. Silakan coba lagi.',
    signInToWrite: 'Masuk untuk menulis ulasan'
  },
  detail: {
    consumerPrice: 'Harga normal',
    soldOut: 'HABIS',
    lowStock: 'Tinggal {n}',
    salePrice: 'Harga jual',
    points: 'Poin',
    shipping: 'Ongkir',
    shippingFree: 'gratis di atas {amount}',
    selectLabel: 'Warna',
    optionRequired: '[Wajib] Silakan pilih warna',
    optionPlaceholder: 'Pilih warna',
    total: 'Total belanja',
    pieces: 'item',
    buyNow: 'BELI SEKARANG',
    addToCart: 'KE KERANJANG',
    share: 'Bagikan',
    back: 'Kembali belanja',
    detailHeading: 'DETAIL PRODUK',
    detailNote: 'Gambar detail panjang masuk ke slot product_gallery.'
  },
  recent: {
    title: 'BARU DILIHAT',
    tabRecent: 'KUNJUNGAN TERBARU',
    tabMost: 'PALING SERING DILIHAT',
    empty: 'Anda belum membuka produk apa pun.',
    emptyMost: 'Belum ada kunjungan yang tercatat.',
    loading: 'Memuat…',
    views: '{n} kunjungan',
    viewsOne: '{n} kunjungan'
  },
  top: {
    label: 'ATAS'
  },
  a11y: {
    logo: 'Logo toko',
    cart: 'Keranjang',
    openMenu: 'Buka menu',
    closeMenu: 'Tutup menu',
    openSearch: 'Buka pencarian',
    closeSearch: 'Tutup pencarian',
    openRecent: 'Buka produk yang baru dilihat',
    closeRecent: 'Tutup produk yang baru dilihat',
    prevSlide: 'Slide sebelumnya',
    nextSlide: 'Slide berikutnya',
    goToSlide: 'Ke slide',
    languageSwitcher: 'Bahasa',
    switchTo: {
      en: 'Switch to English',
      id: 'Ganti ke Bahasa Indonesia',
      ko: '한국어로 전환'
    }
  }
};
