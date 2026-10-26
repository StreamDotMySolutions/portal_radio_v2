export const metadata = {
  title: 'Dasar Privasi — PortalRadio RTM',
  description: 'Maklumat yang dikumpul oleh Portal Radio RTM, bagaimana ia digunakan dan hak anda.',
};

const UPDATED = '26 Oktober 2026';

const h2 = { fontSize: '1.3rem', fontWeight: 700, marginTop: '2.5rem', marginBottom: '0.75rem', color: 'var(--color-text)' };
const h3 = { fontSize: '1.05rem', fontWeight: 600, marginTop: '1.25rem', marginBottom: '0.5rem', color: 'var(--color-text)' };
const p = { color: 'var(--color-muted)', lineHeight: 1.8, marginBottom: '0.75rem' };
const ul = { color: 'var(--color-muted)', lineHeight: 1.8, paddingLeft: '1.25rem', marginBottom: '0.75rem' };

export default function DasarPrivasiPage() {
  return (
    <main style={{ minHeight: '60vh', padding: '6rem 1.5rem 4rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1 className="section-heading" style={{ marginTop: '50px', marginBottom: '1rem' }}>Dasar Privasi</h1>
      <p style={{ ...p, fontSize: '0.9rem' }}>Kemas kini terakhir: {UPDATED}</p>

      <p style={p}>
        Portal Radio RTM (<strong>radio.rtm.gov.my</strong>) dikendalikan oleh Jabatan Penyiaran Malaysia (RTM).
        Dasar ini menerangkan maklumat yang kami kumpul apabila anda menggunakan portal ini, termasuk ciri Sembang
        Langsung dan log masuk dengan Google, bagaimana maklumat itu digunakan, dan pilihan yang anda ada.
      </p>

      <h2 style={h2}>1. Maklumat yang kami kumpul</h2>

      <h3 style={h3}>a. Semasa melayari portal (tanpa akaun)</h3>
      <ul style={ul}>
        <li>ID sesi rawak yang disimpan dalam pelayar anda, bukan nama atau emel anda.</li>
        <li>Halaman yang dilawati, stesen radio yang didengar, carian dalam portal, jenis peranti (telefon, tablet atau desktop) dan laman rujukan.</li>
        <li>Alamat IP diproses oleh pelayan kami untuk keselamatan dan untuk mengehadkan penyalahgunaan (had kadar permintaan).</li>
      </ul>
      <p style={p}>Maklumat ini digunakan untuk statistik pendengar dan menambah baik portal sahaja.</p>

      <h3 style={h3}>b. Akaun Sembang Langsung</h3>
      <ul style={ul}>
        <li>Username, alamat emel dan kata laluan. Kata laluan disimpan dalam bentuk cincang (hash), bukan teks asal.</li>
        <li>Mesej yang anda hantar dalam sembang, bersama masa ia dihantar.</li>
        <li>Maklumat profil yang anda pilih untuk isi: nama penuh, jantina, lokasi, hobi, keterangan diri, gambar profil dan pautan media sosial.</li>
      </ul>

      <h3 style={h3}>c. Log masuk dengan Google</h3>
      <p style={p}>
        Jika anda memilih &quot;Teruskan dengan Google&quot;, Google berkongsi dengan kami <strong>alamat emel</strong> anda,
        <strong> ID akaun Google</strong> anda dan status pengesahan emel tersebut. Kami hanya meminta skop asas
        (openid, email, profile). Kami <strong>tidak</strong> mengakses Gmail, kenalan, Google Drive atau mana-mana data
        Google lain milik anda.
      </p>

      <h3 style={h3}>d. Borang aduan dan maklum balas (Hubungi Kami)</h3>
      <ul style={ul}>
        <li>Nama penuh, emel, nombor telefon (pilihan), kategori, platform, nama program, tarikh kejadian, subjek, keterangan dan lampiran yang anda muat naik.</li>
      </ul>

      <h2 style={h2}>2. Bagaimana kami menggunakan maklumat anda</h2>
      <ul style={ul}>
        <li>Mewujudkan dan mengurus akaun sembang anda, serta membolehkan anda log masuk.</li>
        <li>Memaparkan mesej sembang dan profil anda kepada pengguna lain.</li>
        <li>Menghantar emel berkaitan akaun, seperti pengesahan emel dan pautan set semula kata laluan.</li>
        <li>Menyiasat dan menjawab aduan yang anda hantar.</li>
        <li>Menyederhana sembang (memadam mesej atau menyekat akaun yang melanggar peraturan) dan melindungi portal daripada spam atau penyalahgunaan.</li>
        <li>Menghasilkan statistik agregat tentang penggunaan portal dan bilangan pendengar.</li>
      </ul>
      <p style={p}>Kami tidak menggunakan maklumat anda untuk pengiklanan dan tidak menjualnya kepada sesiapa.</p>

      <h2 style={h2}>3. Data pengguna Google</h2>
      <p style={p}>
        Emel dan ID akaun Google yang diterima melalui log masuk Google digunakan <strong>hanya</strong> untuk mengenal pasti
        akaun sembang anda dan membolehkan anda log masuk. Data ini tidak dikongsi dengan pihak ketiga, tidak digunakan
        untuk pengiklanan, dan tidak dipindahkan kecuali apabila dikehendaki oleh undang-undang. Penggunaan dan
        pemindahan maklumat yang diterima daripada API Google mematuhi{' '}
        <a href="https://developers.google.com/terms/api-services-user-data-policy" target="_blank" rel="noopener noreferrer">
          Google API Services User Data Policy
        </a>
        , termasuk keperluan Limited Use.
      </p>
      <p style={p}>
        Anda boleh menarik balik akses portal ini kepada akaun Google anda pada bila-bila masa di{' '}
        <a href="https://myaccount.google.com/permissions" target="_blank" rel="noopener noreferrer">myaccount.google.com/permissions</a>.
      </p>

      <h2 style={h2}>4. Maklumat yang dilihat oleh orang lain</h2>
      <p style={p}>
        Sembang Langsung ialah ruang awam. Username, warna nama, gambar profil dan mesej anda boleh dilihat oleh semua
        pelawat portal. Maklumat profil yang anda isi boleh dilihat oleh pengguna lain yang membuka profil anda. Alamat
        emel anda <strong>tidak</strong> dipaparkan kepada pengguna lain.
      </p>

      <h2 style={h2}>5. Perkongsian maklumat</h2>
      <p style={p}>
        Kami tidak menjual, menyewa atau berkongsi maklumat peribadi anda dengan pihak ketiga untuk tujuan komersial.
        Maklumat hanya didedahkan jika dikehendaki oleh undang-undang atau oleh pihak berkuasa yang sah, atau apabila perlu
        untuk menyiasat aduan yang anda kemukakan.
      </p>

      <h2 style={h2}>6. Storan dalam pelayar</h2>
      <p style={p}>Portal ini tidak menggunakan kuki pengiklanan. Kami menyimpan sedikit maklumat dalam pelayar anda:</p>
      <ul style={ul}>
        <li><strong>Log masuk sembang</strong>: maklumat sesi supaya anda kekal log masuk, sehingga anda log keluar.</li>
        <li><strong>Tetapan aksesibiliti</strong>: saiz teks, kontras dan fon pilihan anda.</li>
        <li><strong>Mesej terakhir dibaca</strong>: untuk mengira mesej sembang baharu.</li>
        <li><strong>ID sesi statistik</strong>: dipadam apabila tab pelayar ditutup.</li>
      </ul>
      <p style={p}>Anda boleh memadam maklumat ini pada bila-bila masa melalui tetapan pelayar anda.</p>

      <h2 style={h2}>7. Penyimpanan dan keselamatan</h2>
      <p style={p}>
        Maklumat disimpan di pelayan yang diuruskan oleh RTM dan dihantar melalui sambungan yang disulitkan (HTTPS).
        Akaun sembang dan mesej disimpan selagi akaun anda aktif, atau sehingga ia dipadam oleh anda atau pentadbir. Aduan
        disimpan untuk tempoh yang diperlukan bagi menyiasat dan merekodkannya.
      </p>

      <h2 style={h2}>8. Hak dan pilihan anda</h2>
      <ul style={ul}>
        <li>Melihat dan mengemas kini profil anda di halaman Profil Sembang.</li>
        <li>Meminta akaun sembang anda, bersama mesej dan maklumat profilnya, dipadam dengan menghubungi kami.</li>
        <li>Menarik balik akses log masuk Google seperti yang diterangkan dalam bahagian 3.</li>
      </ul>

      <h2 style={h2}>9. Perubahan kepada dasar ini</h2>
      <p style={p}>
        Kami mungkin mengemas kini dasar ini dari semasa ke semasa. Tarikh kemas kini terakhir dipaparkan di bahagian atas
        halaman ini.
      </p>

      <h2 style={h2}>10. Hubungi kami</h2>
      <p style={p}>
        Untuk sebarang pertanyaan tentang privasi atau permintaan memadam akaun, sila hubungi kami melalui halaman{' '}
        <a href="/hubungi">Hubungi Kami</a>.
      </p>
    </main>
  );
}
