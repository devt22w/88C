import type { Messages } from '../types';

/**
 * SYARAT PENGGUNAAN and KEBIJAKAN PRIVASI — Indonesian. A translation of
 * legal.en.ts, section for section; the English text governs where the two
 * differ.
 */
export const legalId: Messages['legal'] = {
  effective: 'Berlaku sejak {date}',
  contents: 'DAFTAR ISI',
  governingLanguage:
    'Dokumen ini tersedia dalam beberapa bahasa. Jika terjemahan berbeda dari versi bahasa Inggris, versi bahasa Inggris yang berlaku.',
  print: 'Cetak',
  accept: 'SETUJU',
  scrollToAccept: 'Gulir sampai akhir untuk menyetujui.',
  readDone: 'Anda telah sampai di akhir.',
  close: 'Tutup',
  seeTerms: 'Baca Syarat Penggunaan',
  seePrivacy: 'Baca Kebijakan Privasi',

  // -------------------------------------------------------------------------
  // SYARAT PENGGUNAAN
  // -------------------------------------------------------------------------
  terms: {
    title: 'SYARAT PENGGUNAAN',
    lead: 'Perjanjian antara Anda dan {operator} saat Anda menggunakan toko ini.',
    intro: [
      'Syarat Penggunaan ini ("Syarat") mengatur akses dan penggunaan Anda atas {site} dan toko daringnya ("Toko"), yang dioperasikan oleh {operator} ("kami"). Dengan membuat akun, melakukan pemesanan, atau menggunakan Toko dengan cara lain, Anda menyetujui Syarat ini dan Kebijakan Privasi kami. Jika Anda tidak setuju, mohon jangan gunakan Toko.'
    ],
    sections: [
      {
        id: 'operator',
        heading: '1. Tentang kami',
        body: [
          'Toko dioperasikan oleh {operator}, usaha yang berkedudukan di Calamba City, Laguna, Filipina. Anda dapat menghubungi kami melalui:',
          ['Email: {email}', 'Telepon: {phone}', 'Alamat: {address}']
        ]
      },
      {
        id: 'eligibility',
        heading: '2. Syarat usia dan akun Anda',
        body: [
          'Anda harus berusia minimal 18 tahun untuk membuat akun atau melakukan pemesanan. Jika Anda lebih muda, Anda hanya boleh menggunakan Toko dengan keterlibatan dan persetujuan orang tua atau wali yang sah.',
          'Saat membuat akun, Anda setuju untuk:',
          [
            'memberikan informasi yang benar, akurat, dan lengkap, serta selalu memperbaruinya;',
            'menjaga kerahasiaan kata sandi dan tidak membagikan akun Anda kepada siapa pun;',
            'segera memberi tahu kami jika Anda menduga orang lain telah menggunakan akun Anda;',
            'bertanggung jawab atas aktivitas di akun Anda, kecuali jika disebabkan oleh kelalaian kami dalam melindunginya.'
          ],
          'Alamat email Anda adalah ID login Anda. Anda dapat memperbarui data Anda kapan saja di MY PAGE, dan dapat meminta kami menutup akun Anda kapan saja (lihat Bagian 15).'
        ]
      },
      {
        id: 'products',
        heading: '3. Produk dan informasi produk',
        body: [
          'Kami menjual kosmetik, perawatan kulit, dan aksesori kecantikan. Kami berupaya mendeskripsikan setiap produk dengan akurat, namun perlu diperhatikan:',
          [
            'contoh warna dan foto hanya sebagai panduan — warna dapat berbeda tergantung layar, pencahayaan, dan warna kulit;',
            'daftar bahan dan petunjuk pada kemasan lebih diutamakan daripada deskripsi di Toko;',
            'kosmetik dapat menimbulkan reaksi. Baca daftar bahan, lakukan uji tempel sebelum pemakaian pertama, dan hentikan penggunaan jika terjadi iritasi. Jika Anda memiliki kondisi kulit atau alergi, konsultasikan dengan dokter sebelum digunakan;',
            'tidak ada konten di Toko yang merupakan saran medis.'
          ],
          'Produk ditawarkan selama persediaan masih ada. Produk atau warna yang ditandai habis tidak dapat dipesan.'
        ]
      },
      {
        id: 'prices',
        heading: '4. Harga dan biaya',
        body: [
          'Harga dalam peso Filipina (PHP) dan sudah termasuk PPN yang berlaku kecuali dinyatakan lain. Harga yang ditampilkan dalam mata uang lain hanya konversi sebagai referensi; Anda selalu ditagih dalam PHP.',
          'Ongkos kirim ditambahkan saat checkout kecuali pesanan Anda memenuhi syarat gratis ongkir. Total yang tertera di halaman checkout sebelum Anda membayar adalah jumlah penuh yang akan ditagihkan.',
          'Jika suatu produk tercantum dengan harga yang jelas keliru karena kesalahan teknis atau pengetikan, kami dapat membatalkan pesanan dan mengembalikan seluruh pembayaran Anda. Kami akan memberi tahu Anda sebelum melakukannya.'
        ]
      },
      {
        id: 'orders',
        heading: '5. Melakukan pemesanan',
        body: [
          'Melakukan pemesanan berarti Anda menawarkan untuk membeli produk di keranjang Anda. Kontrak antara Anda dan kami terbentuk ketika kami mengonfirmasi pembayaran Anda (atau, untuk pesanan tunai, ketika layanan pelanggan mengonfirmasi pesanan kepada Anda).',
          'Kami dapat menolak atau membatalkan pesanan — misalnya jika produk tidak lagi tersedia, pembayaran tidak selesai, alamat pengiriman tidak terjangkau, atau kami secara wajar menduga adanya penipuan atau pembelian grosir untuk dijual kembali. Jika kami membatalkan pesanan yang sudah Anda bayar, kami mengembalikan dana Anda sepenuhnya.',
          'Nomor pesanan dan konfirmasi dikirim ke alamat email yang Anda berikan. Simpan keduanya: Anda memerlukan keduanya untuk melacak pesanan tanpa akun.'
        ]
      },
      {
        id: 'payment',
        heading: '6. Pembayaran',
        body: [
          'Pembayaran daring diproses oleh penyedia pembayaran kami, PayMongo, melalui kartu, GCash, Maya, GrabPay, atau QR Ph. Anda memasukkan data pembayaran di halaman aman PayMongo; kami tidak pernah melihat atau menyimpan nomor kartu lengkap Anda.',
          'Sampai pembayaran daring aktif, pesanan diatur melalui layanan pelanggan dan dibayar tunai saat pengiriman atau di konter kami. Kami akan mengonfirmasi total, termasuk ongkos kirim, sebelum Anda membayar.',
          'Pesanan dianggap lunas hanya setelah penyedia pembayaran mengonfirmasinya kepada kami, atau setelah kami menerima uang tunai.'
        ]
      },
      {
        id: 'delivery',
        heading: '7. Pengiriman',
        body: [
          'Pesanan dikirim dari Calamba City, Laguna, ke alamat di wilayah Filipina. Waktu pengiriman yang disebutkan di Toko atau oleh layanan pelanggan adalah perkiraan, bukan jaminan, dan dapat lebih lama saat hari libur, masa promo, atau cuaca buruk.',
          'Pastikan nama, nomor ponsel, dan alamat Anda benar. Jika paket tidak dapat diantar karena data salah atau tidak ada yang menerima, kami dapat menagih biaya pengiriman ulang.',
          'Risiko kehilangan beralih kepada Anda saat paket diterima di alamat yang Anda berikan. Anda dapat melacak pesanan di MY PAGE atau di halaman DELIVERY.'
        ]
      },
      {
        id: 'returns',
        heading: '8. Pengembalian, penukaran, dan pengembalian dana',
        body: [
          'Hak Anda berdasarkan Undang-Undang Konsumen Filipina (RA 7394) dan peraturan lain yang berlaku tidak terpengaruh oleh bagian ini.',
          'Barang rusak, cacat, atau salah kirim. Jika produk tiba dalam keadaan rusak, cacat, kedaluwarsa, atau berbeda dari pesanan Anda, hubungi layanan pelanggan dalam 7 hari sejak diterima dengan menyertakan nomor pesanan serta foto barang dan kemasannya. Kami akan menggantinya atau mengembalikan dana Anda sepenuhnya, termasuk ongkos kirim, sesuai pilihan Anda.',
          'Berubah pikiran. Karena kosmetik adalah produk perawatan pribadi, pengembalian karena berubah pikiran hanya dapat diterima jika barang belum dibuka, belum dipakai, masih dalam segel aslinya, dan Anda menghubungi kami dalam 7 hari sejak diterima. Dalam hal ini, biaya pengiriman kembali ditanggung oleh Anda.',
          'Pengembalian dana dilakukan ke metode pembayaran semula (atau melalui transfer bank atau tunai untuk pesanan tunai) dalam waktu yang wajar setelah kami menerima dan memeriksa barang yang dikembalikan. Kecepatan dana sampai kepada Anda dapat bergantung pada bank atau dompet digital Anda.',
          'Jangan mengirim barang kembali sebelum layanan pelanggan mengonfirmasi pengembalian; paket yang dikembalikan tanpa kesepakatan mungkin tidak dapat diterima.'
        ]
      },
      {
        id: 'promotions',
        heading: '9. Kupon, promosi, dan poin hadiah',
        body: [
          'Kupon, diskon, dan poin hadiah tunduk pada ketentuan yang tercantum pada setiap penawaran. Kecuali dinyatakan lain:',
          [
            'kupon selamat datang untuk anggota baru dan dapat digunakan satu kali, pada pesanan pertama yang memenuhi minimum yang ditentukan;',
            'kupon tidak dapat digabung, ditukar dengan uang tunai, atau dialihkan ke akun lain;',
            'poin hadiah tidak memiliki nilai tunai dan dibatalkan jika pesanan yang menghasilkannya dibatalkan atau dikembalikan dananya;',
            'kami dapat mencabut kupon atau poin yang diperoleh melalui penipuan, dengan membuat beberapa akun, atau karena kesalahan.'
          ]
        ]
      },
      {
        id: 'reviews',
        heading: '10. Ulasan dan konten lain yang Anda kirim',
        body: [
          'Anda dapat menulis ulasan untuk produk yang telah Anda beli dan mengirim pertanyaan kepada kami. Anda tetap memiliki tulisan Anda, namun Anda memberi kami lisensi non-eksklusif tanpa biaya untuk menerbitkan, menampilkan, dan menerjemahkan ulasan Anda di Toko dan dalam promosi Toko kami.',
          'Ulasan harus jujur dan tentang produk. Kami dapat menolak, menyembunyikan, atau menghapus ulasan yang palsu atau menyesatkan, menyinggung, melanggar hukum, memuat data pribadi orang lain, mengiklankan sesuatu, atau melanggar hak orang lain. Ulasan diperiksa sebelum diterbitkan.'
        ]
      },
      {
        id: 'use',
        heading: '11. Penggunaan yang dilarang',
        body: [
          'Saat menggunakan Toko, Anda tidak boleh:',
          [
            'melanggar hukum, atau menggunakan Toko untuk penipuan, termasuk memakai metode pembayaran tanpa izin;',
            'mencoba mengakses akun orang lain, sistem kami, atau data yang bukan milik Anda;',
            'mengganggu keamanan atau operasional Toko, atau menyebarkan virus atau kode berbahaya;',
            'menyalin, mengikis, atau mengumpulkan konten atau data dari Toko secara otomatis tanpa izin tertulis kami;',
            'membeli produk untuk dijual kembali secara komersial tanpa persetujuan kami (silakan gunakan formulir pesanan grosir).'
          ]
        ]
      },
      {
        id: 'ip',
        heading: '12. Hak kekayaan intelektual',
        body: [
          'Toko dan isinya — teks, desain, grafis, foto, dan logo — adalah milik kami atau pemberi lisensi kami, termasuk merek-merek yang produknya kami jual, dan dilindungi oleh Kode Kekayaan Intelektual Filipina (RA 8293). Anda boleh melihat dan mencetak halaman untuk penggunaan pribadi. Penggunaan lain memerlukan izin tertulis kami.'
        ]
      },
      {
        id: 'third-parties',
        heading: '13. Layanan dan tautan pihak ketiga',
        body: [
          'Beberapa layanan di Toko disediakan oleh pihak ketiga, seperti pemrosesan pembayaran oleh PayMongo dan pengiriman oleh kurir. Syarat dan kebijakan privasi mereka juga berlaku saat Anda menggunakannya. Tautan ke situs lain, seperti halaman media sosial kami, disediakan untuk kemudahan; kami tidak bertanggung jawab atas isi situs tersebut.'
        ]
      },
      {
        id: 'liability',
        heading: '14. Tanggung jawab kami',
        body: [
          'Kami menyediakan Toko dengan kehati-hatian dan keahlian yang wajar, namun kami tidak dapat menjamin Toko selalu tersedia atau bebas dari kesalahan. Sebagian layanan dapat dihentikan sementara untuk pemeliharaan atau karena hal di luar kendali kami.',
          'Sejauh diizinkan oleh hukum, kami tidak bertanggung jawab atas kerugian yang tidak dapat diperkirakan secara wajar, kerugian akibat peristiwa di luar kendali kami yang wajar, atau kerugian usaha. Tanggung jawab total kami atas suatu pesanan terbatas pada jumlah yang Anda bayarkan untuk pesanan tersebut.',
          'Tidak ada ketentuan dalam Syarat ini yang membatasi atau mengecualikan tanggung jawab kami yang menurut hukum tidak dapat dibatasi, termasuk tanggung jawab atas kematian atau cedera akibat kelalaian kami, penipuan, atau berdasarkan Undang-Undang Konsumen.'
        ]
      },
      {
        id: 'termination',
        heading: '15. Penangguhan atau penutupan akun',
        body: [
          'Anda dapat menutup akun kapan saja dengan menghubungi layanan pelanggan. Pesanan yang sudah dibuat tetap diselesaikan, dan kami menyimpan catatan yang dijelaskan dalam Kebijakan Privasi selama diwajibkan oleh hukum.',
          'Kami dapat menangguhkan atau menutup akun yang melanggar Syarat ini, digunakan untuk penipuan, atau keamanannya telah dibobol. Kecuali hukum atau penyelidikan melarangnya, kami akan memberi tahu alasannya kepada Anda.'
        ]
      },
      {
        id: 'changes',
        heading: '16. Perubahan Syarat',
        body: [
          'Kami dapat memperbarui Syarat ini untuk menyesuaikan perubahan hukum atau cara kerja Toko. Tanggal berlaku di bagian atas halaman ini menunjukkan kapan terakhir diubah. Jika perubahan berdampak material bagi Anda, kami akan memberi tahu di Toko atau melalui email sebelum perubahan berlaku. Syarat yang berlaku saat Anda memesan berlaku untuk pesanan tersebut.'
        ]
      },
      {
        id: 'law',
        heading: '17. Hukum yang berlaku dan pengaduan',
        body: [
          'Syarat ini diatur oleh hukum Republik Filipina.',
          'Jika terjadi masalah, hubungi layanan pelanggan terlebih dahulu — sebagian besar masalah dapat diselesaikan dengan cepat. Jika kami tidak dapat menyelesaikan pengaduan Anda, Anda dapat mengajukannya ke Department of Trade and Industry (DTI) atau instansi pemerintah lain yang berwenang. Gugatan pengadilan diajukan ke pengadilan yang berwenang di Calamba City, Laguna, tanpa mengurangi hak Anda sebagai konsumen untuk mengajukannya di tempat lain.'
        ]
      },
      {
        id: 'contact',
        heading: '18. Hubungi kami',
        body: [
          'Pertanyaan tentang Syarat ini dapat dikirim ke {email}, atau ke layanan pelanggan di {phone}, Senin–Jumat, 10.00–17.00 (istirahat 12.00–13.00, libur akhir pekan dan hari libur).'
        ]
      }
    ]
  },

  // -------------------------------------------------------------------------
  // KEBIJAKAN PRIVASI
  // -------------------------------------------------------------------------
  privacy: {
    title: 'KEBIJAKAN PRIVASI',
    lead: 'Data pribadi apa yang kami kumpulkan, mengapa, dan hak Anda atas data tersebut.',
    intro: [
      '{operator} ("kami") menghormati privasi Anda dan berkomitmen melindungi data pribadi Anda sesuai dengan Data Privacy Act of 2012 Filipina (Republic Act No. 10173), peraturan pelaksanaannya, dan ketentuan National Privacy Commission (NPC).',
      'Kebijakan Privasi ini menjelaskan cara kami mengumpulkan, menggunakan, membagikan, menyimpan, dan melindungi data pribadi saat Anda mengunjungi {site}, membuat akun, memesan, menulis ulasan, atau menghubungi kami. Kebijakan ini hanya berlaku untuk toko daring.'
    ],
    sections: [
      {
        id: 'controller',
        heading: '1. Pihak yang bertanggung jawab atas data Anda',
        body: [
          '{operator} adalah pengendali informasi pribadi (personal information controller) atas data yang dijelaskan dalam Kebijakan ini.',
          ['Alamat: {address}', 'Petugas Perlindungan Data (DPO): {privacyEmail}', 'Telepon: {phone}']
        ]
      },
      {
        id: 'collect',
        heading: '2. Data pribadi yang kami kumpulkan',
        body: [
          'Kami hanya mengumpulkan data yang diperlukan untuk menjalankan toko. Tergantung cara Anda menggunakannya, data tersebut meliputi:',
          [
            'Data akun — nama, alamat email, nomor ponsel (opsional), dan kata sandi. Kata sandi hanya disimpan dalam bentuk hash; kami tidak dapat membacanya.',
            'Data pengiriman — alamat, kota, dan kode pos yang Anda simpan di MY PAGE atau masukkan saat checkout.',
            'Data pesanan — produk, warna, dan jumlah yang Anda beli, jumlah yang ditagihkan, tanggal dan status pesanan, serta data kurir dan nomor resi.',
            'Data pembayaran — metode pembayaran, nomor referensi pembayaran, serta jumlah dan biaya yang dilaporkan oleh penyedia pembayaran kami. Nomor kartu, CVC, dan login dompet digital atau bank Anda dimasukkan di halaman PayMongo dan tidak pernah sampai kepada kami.',
            'Pertanyaan — nama, email, nomor telepon, dan pesan yang Anda kirim melalui formulir kontak atau pengiriman.',
            'Ulasan — penilaian, judul, dan teks yang Anda kirim, terhubung dengan akun Anda.',
            'Notifikasi — kabar pesanan dan ulasan yang ditampilkan kepada Anda di ikon lonceng.',
            'Catatan persetujuan — tanggal dan versi Syarat Penggunaan dan Kebijakan Privasi yang Anda setujui saat mendaftar.',
            'Data penggunaan — produk yang dilihat, dicatat dengan nomor pengunjung acak yang tidak terhubung dengan nama atau akun Anda, serta bahasa yang Anda pilih.'
          ],
          'Kami tidak mengumpulkan informasi pribadi sensitif (seperti data kesehatan, nomor identitas pemerintah, atau agama) melalui Toko, dan kami meminta Anda untuk tidak mengirimkannya dalam pertanyaan atau ulasan.'
        ]
      },
      {
        id: 'how',
        heading: '3. Cara kami mengumpulkannya',
        body: [
          [
            'Langsung dari Anda, saat Anda membuat akun, checkout, memperbarui MY PAGE, menulis ulasan, atau mengirim pertanyaan.',
            'Dari penyedia pembayaran kami, PayMongo, yang memberi tahu apakah pembayaran berhasil dan bagaimana dilakukan.',
            'Dari kurir, yang memberikan nomor resi dan status pengiriman.',
            'Secara otomatis dari browser Anda saat Anda melihat produk (lihat Bagian 9).'
          ]
        ]
      },
      {
        id: 'use',
        heading: '4. Tujuan dan dasar penggunaan',
        body: [
          'Berdasarkan Pasal 12 Data Privacy Act, kami hanya memproses data pribadi atas dasar yang sah. Kami menggunakan data Anda:',
          [
            'untuk membuat dan mengelola akun Anda serta memungkinkan Anda login — untuk melaksanakan kontrak dengan Anda;',
            'untuk menerima, menagih, mengemas, mengirim, dan melacak pesanan Anda, serta mengirim konfirmasi dan kabar status pesanan — untuk melaksanakan kontrak dengan Anda;',
            'untuk menjawab pertanyaan dan menangani pengembalian, pengembalian dana, dan pengaduan — untuk melaksanakan kontrak dengan Anda, dan demi kepentingan sah kami melayani pelanggan dengan baik;',
            'untuk menerbitkan ulasan Anda setelah diperiksa — dengan persetujuan yang Anda berikan saat mengirim ulasan;',
            'untuk menyimpan faktur, tanda terima, dan catatan akuntansi, serta menanggapi permintaan sah dari pihak berwenang — untuk memenuhi kewajiban hukum kami, termasuk hukum pajak;',
            'untuk mencegah penipuan dan penyalahgunaan serta menjaga keamanan Toko — demi kepentingan sah kami;',
            'untuk menghitung jumlah tampilan produk dan meningkatkan Toko — demi kepentingan sah kami, menggunakan data yang tidak mengidentifikasi Anda.'
          ],
          'Kami hanya mengirim email atau pesan pemasaran jika Anda telah menyetujuinya secara terpisah, dan Anda dapat menarik persetujuan itu kapan saja. Kami tidak menggunakan data Anda untuk pengambilan keputusan otomatis atau pembuatan profil yang berdampak hukum atau berdampak signifikan serupa bagi Anda.'
        ]
      },
      {
        id: 'share',
        heading: '5. Pihak yang menerima data Anda',
        body: [
          'Kami tidak menjual atau menyewakan data pribadi Anda. Kami hanya membagikannya kepada pihak berikut, sebatas yang dibutuhkan masing-masing:',
          [
            'PayMongo — untuk memproses pembayaran daring;',
            'mitra kurir dan pengiriman — nama, nomor ponsel, dan alamat pengiriman Anda, agar paket dapat diantar;',
            'Supabase — yang menyimpan basis data dan login akun kami;',
            'Vercel — yang menyimpan situs web kami;',
            'Resend — yang mengirim email pesanan dan akun kami;',
            'instansi pemerintah, pengadilan, atau regulator — jika diwajibkan hukum, atau untuk menetapkan, melaksanakan, atau membela klaim hukum.'
          ],
          'Penyedia layanan di atas memproses data sesuai instruksi kami berdasarkan perjanjian yang mewajibkan mereka melindunginya, dan tidak boleh menggunakannya untuk kepentingan mereka sendiri.'
        ]
      },
      {
        id: 'transfer',
        heading: '6. Data yang disimpan di luar Filipina',
        body: [
          'Sebagian penyedia layanan kami menyimpan data di server di luar Filipina. Dalam hal ini kami tetap bertanggung jawab atas data Anda, sebagaimana diwajibkan Data Privacy Act, dan kami menggunakan penyedia yang menerapkan langkah keamanan setidaknya setara dengan yang diwajibkan hukum Filipina.'
        ]
      },
      {
        id: 'retention',
        heading: '7. Lama penyimpanan',
        body: [
          [
            'Data akun — selama akun Anda aktif. Saat Anda menutupnya, kami menghapus atau menganonimkannya dalam 30 hari, kecuali data yang wajib kami simpan karena alasan di bawah ini.',
            'Catatan pesanan, pembayaran, dan faktur — selama diwajibkan hukum pajak dan akuntansi (saat ini setidaknya lima tahun sejak transaksi), lalu dihapus.',
            'Pertanyaan — hingga dua tahun setelah urusan selesai.',
            'Ulasan — sampai Anda meminta penghapusan atau akun Anda ditutup; setelah penutupan, ulasan yang telah terbit dapat tetap tampil tanpa nama Anda.',
            'Catatan tampilan produk — hanya disimpan dalam bentuk yang tidak mengidentifikasi Anda.'
          ],
          'Data yang tidak lagi diperlukan dihapus atau dianonimkan secara aman sehingga tidak dapat lagi mengidentifikasi Anda.'
        ]
      },
      {
        id: 'security',
        heading: '8. Cara kami melindunginya',
        body: [
          'Kami menerapkan langkah organisasi, fisik, dan teknis untuk melindungi data Anda dari kehilangan, penyalahgunaan, dan akses tanpa izin, antara lain:',
          [
            'koneksi terenkripsi (HTTPS) untuk setiap halaman dan formulir;',
            'kata sandi hanya disimpan sebagai hash yang aman;',
            'aturan basis data yang membuat setiap anggota hanya dapat melihat akun, pesanan, dan notifikasinya sendiri;',
            'akses ke data pelanggan dibatasi bagi staf yang memerlukannya untuk pekerjaan, dan terikat kewajiban kerahasiaan;',
            'data kartu dan dompet digital hanya ditangani oleh PayMongo, tidak pernah oleh server kami.'
          ],
          'Jika terjadi pelanggaran data pribadi yang berpotensi menimbulkan risiko nyata kerugian serius bagi Anda, kami akan memberi tahu National Privacy Commission dan pihak yang terdampak dalam 72 jam sejak kami mengetahuinya, sesuai ketentuan NPC.'
        ]
      },
      {
        id: 'storage',
        heading: '9. Penyimpanan browser dan cookie',
        body: [
          'Toko tidak menggunakan cookie iklan atau cookie pelacak pihak ketiga. Toko hanya menyimpan beberapa item kecil di penyimpanan lokal browser Anda agar situs berfungsi:',
          [
            'sesi login Anda, agar Anda tetap masuk;',
            'keranjang Anda, agar tetap ada saat Anda kembali;',
            'produk yang baru Anda lihat, yang hanya tersimpan di perangkat Anda;',
            'pilihan bahasa Anda;',
            'nomor pengunjung acak yang hanya digunakan untuk menghitung tampilan produk.'
          ],
          'Anda dapat menghapusnya kapan saja melalui pengaturan browser. Jika dihapus, Anda akan keluar dari akun, dan keranjang serta daftar produk yang baru dilihat akan dikosongkan.'
        ]
      },
      {
        id: 'rights',
        heading: '10. Hak Anda',
        body: [
          'Berdasarkan Data Privacy Act, Anda berhak untuk:',
          [
            'mendapat informasi tentang cara data pribadi Anda diproses;',
            'mengakses data pribadi Anda yang kami simpan;',
            'menolak pemrosesan dan menarik persetujuan yang telah Anda berikan;',
            'memperbaiki data yang salah atau tidak lengkap;',
            'meminta penghapusan atau pemblokiran data yang tidak lagi diperlukan atau diproses secara melanggar hukum;',
            'menerima data Anda dalam format elektronik yang umum digunakan (portabilitas data);',
            'memperoleh ganti rugi atas kerugian akibat data yang tidak akurat, palsu, atau diperoleh maupun digunakan secara melanggar hukum;',
            'mengajukan pengaduan ke National Privacy Commission.'
          ],
          'Sebagian besar data dapat Anda perbarui sendiri di MY PAGE. Untuk hal lain, kirim email ke Petugas Perlindungan Data kami di {privacyEmail}. Kami dapat meminta Anda mengonfirmasi identitas terlebih dahulu, dan kami akan menanggapi dalam 30 hari. Pelaksanaan hak-hak ini tidak dikenakan biaya.',
          'Jika Anda tidak puas dengan tanggapan kami, Anda dapat menghubungi National Privacy Commission di www.privacy.gov.ph atau complaints@privacy.gov.ph.'
        ]
      },
      {
        id: 'children',
        heading: '11. Anak-anak',
        body: [
          'Toko tidak ditujukan untuk anak di bawah 18 tahun, dan kami tidak dengan sengaja mengumpulkan data pribadi mereka tanpa persetujuan orang tua atau wali. Jika Anda yakin seorang anak telah memberikan data pribadi kepada kami, hubungi kami dan kami akan menghapusnya.'
        ]
      },
      {
        id: 'changes',
        heading: '12. Perubahan Kebijakan',
        body: [
          'Kami dapat memperbarui Kebijakan ini jika praktik kami atau hukum berubah. Tanggal berlaku di bagian atas menunjukkan kapan terakhir diubah. Jika ada perubahan material, kami akan memberi tahu Anda di Toko atau melalui email, dan jika diwajibkan hukum, kami akan meminta persetujuan Anda kembali.'
        ]
      },
      {
        id: 'contact',
        heading: '13. Hubungi kami',
        body: [
          'Untuk pertanyaan tentang Kebijakan ini atau data pribadi Anda, hubungi Petugas Perlindungan Data kami:',
          ['{operator}', 'Email: {privacyEmail}', 'Telepon: {phone}', 'Alamat: {address}']
        ]
      }
    ]
  }
};
