# Server Pi Network Proxy

![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)
![Language](https://img.shields.io/badge/language-Node.js-green.svg)
![Framework](https://img.shields.io/badge/framework-Express.js-lightgrey.svg)
![Status](https://img.shields.io/badge/status-aktif-brightgreen)
[![Telegram](https://img.shields.io/badge/Telegram-Zendshost-blue.svg?logo=telegram)](https://t.me/zendshost)

Sebuah server proxy sederhana yang dibangun dengan Node.js dan Express untuk memfasilitasi komunikasi antara aplikasi Anda dan API node Pi Network. Proyek ini dirancang untuk mengatasi masalah umum seperti CORS (Cross-Origin Resource Sharing) dan kendala sertifikat SSL saat mengembangkan aplikasi yang berinteraksi dengan infrastruktur Pi.

## Daftar Isi

- [Tentang Proyek](#tentang-proyek)
- [Fitur Utama](#fitur-utama)
- [Bagaimana Cara Kerjanya?](#bagaimana-cara-kerjanya)
- [Prasyarat](#prasyarat)
- [Instalasi & Pengaturan](#instalasi--pengaturan)
- [Menjalankan Server](#menjalankan-server)
  - [Mode Pengembangan](#mode-pengembangan)
  - [Mode Produksi (Disarankan)](#mode-produksi-disarankan)
- [Cara Penggunaan](#cara-penggunaan)
  - [Struktur Endpoint](#struktur-endpoint)
  - [Contoh Permintaan (GET)](#contoh-permintaan-get)
  - [Contoh Permintaan (POST)](#contoh-permintaan-post)
- [Konfigurasi](#konfigurasi)
- [Peringatan Keamanan](#-peringatan-keamanan)
- [Kontribusi](#kontribusi)
- [Lisensi](#lisensi)
- [Kontak](#kontak)

## Tentang Proyek

Saat mengembangkan aplikasi (terutama aplikasi web berbasis browser) yang perlu berkomunikasi langsung dengan API node Pi Network, pengembang sering kali menghadapi dua masalah utama:

1.  **Masalah CORS:** Browser memblokir permintaan HTTP ke domain yang berbeda dari domain aplikasi web Anda karena alasan keamanan.
2.  **Masalah Sertifikat SSL:** Node Pi Network mungkin menggunakan sertifikat SSL _self-signed_ yang tidak dikenali oleh klien HTTP secara default, menyebabkan koneksi gagal.

Server proxy ini bertindak sebagai perantara yang aman dan andal. Aplikasi Anda mengirim permintaan ke server proxy ini, dan server proxy yang akan meneruskannya ke node Pi Network. Karena komunikasi server-ke-server tidak terikat oleh kebijakan CORS browser, masalah ini dapat diatasi dengan mudah.

## Fitur Utama

-   **Proxy HTTP/HTTPS:** Meneruskan semua jenis metode permintaan (GET, POST, PUT, DELETE, dll.) beserta header dan body-nya.
-   **Penanganan CORS:** Secara efektif menghilangkan masalah CORS untuk aplikasi frontend.
-   **Mengabaikan Validasi SSL:** Dikonfigurasi untuk berkomunikasi dengan server target yang menggunakan sertifikat SSL _self-signed_ atau tidak valid.
-   **Ringan & Cepat:** Dibangun di atas Express.js yang minimalis dan performan.
-   **Mudah Dijalankan:** Hanya memerlukan Node.js dan beberapa dependensi.

## Bagaimana Cara Kerjanya?

Alur kerja proxy ini sangat sederhana namun efektif.

```
+----------------+      +--------------------------+      +---------------------------+
|                |      |                          |      |                           |
|  Aplikasi Anda |----->|  Server Proxy            |----->|  API Node Pi Network      |
| (Web/Mobile/dll) |      | (localhost:31401)        |      | (https://138.68.40.95)    |
|                |      |                          |      |                           |
+----------------+      +--------------------------+      +---------------------------+
```

1.  Aplikasi Anda membuat permintaan ke `http://localhost:31401/proxy/{endpoint_pi_network}`.
2.  Server proxy menerima permintaan ini.
3.  Server proxy membuat permintaan baru ke `https://138.68.40.95/{endpoint_pi_network}` dengan menyalin metode, header, dan body dari permintaan asli.
4.  Server proxy menerima respons dari API Pi Network.
5.  Server proxy meneruskan kembali respons tersebut ke aplikasi Anda.

## Prasyarat

Sebelum memulai, pastikan sistem Anda telah terinstal:
-   [Node.js](https://nodejs.org/) (disarankan versi LTS)
-   [npm](https://www.npmjs.com/) (biasanya terinstal bersama Node.js) atau [Yarn](https://yarnpkg.com/)
-   [Git](https://git-scm.com/)

## Instalasi & Pengaturan

Ikuti langkah-langkah berikut untuk menyiapkan proyek di lingkungan lokal Anda.

1.  **Clone repositori ini:**
    ```bash
    git clone https://github.com/zendshost/serverpinetwork.git
    ```

2.  **Masuk ke direktori proyek:**
    ```bash
    cd serverpinetwork
    ```

3.  **Instal semua dependensi yang diperlukan:**
    ```bash
    npm install
    ```
    Atau jika Anda menggunakan Yarn:
    ```bash
    yarn install
    ```

## Menjalankan Server

### Mode Pengembangan

Untuk menjalankan server secara langsung untuk keperluan pengembangan atau pengujian.

```bash
node index.js
```

Jika berhasil, Anda akan melihat pesan berikut di terminal:
```
Proxy aktif di http://localhost:31401
```

Server sekarang siap menerima permintaan.

### Mode Produksi (Disarankan)

Untuk penggunaan jangka panjang atau di lingkungan produksi, sangat disarankan menggunakan manajer proses seperti **PM2**. PM2 akan menjaga server tetap berjalan, me-restart secara otomatis jika terjadi crash, dan menyediakan fitur monitoring.

1.  **Instal PM2 secara global (jika belum punya):**
    ```bash
    npm install pm2 -g
    ```

2.  **Jalankan server menggunakan PM2:**
    ```bash
    pm2 start index.js --name "pi-proxy-server"
    ```

3.  **Untuk memonitor log atau status:**
    ```bash
    pm2 logs pi-proxy-server
    pm2 status
    ```

## Cara Penggunaan

Setelah server proxy berjalan, Anda dapat mulai mengirim permintaan melalui server tersebut.

### Struktur Endpoint

Semua permintaan ke API Pi Network harus diawali dengan `/proxy`.

-   **URL Asli:** `https://138.68.40.95/v2/blockchain`
-   **URL via Proxy:** `http://localhost:31401/proxy/v2/blockchain`

### Contoh Permintaan (GET)

Misalnya, Anda ingin mendapatkan informasi blockchain dari node Pi Network menggunakan `curl`.

```bash
curl http://localhost:31401/proxy/v2/blockchain
```

Contoh menggunakan `axios` di dalam proyek JavaScript Anda:

```javascript
import axios from 'axios';

async function getBlockchainInfo() {
  try {
    const response = await axios.get('http://localhost:31401/proxy/v2/blockchain');
    console.log('Blockchain Info:', response.data);
  } catch (error) {
    console.error('Gagal mengambil data:', error.response?.data || error.message);
  }
}

getBlockchainInfo();
```

### Contoh Permintaan (POST)

Misalnya, Anda ingin mengirimkan transaksi ke endpoint `/v2/transactions`.

```bash
curl -X POST http://localhost:31401/proxy/v2/transactions \
-H "Content-Type: application/json" \
-d '{"transaction": "data_transaksi_anda"}'
```

Contoh menggunakan `axios`:

```javascript
import axios from 'axios';

async function submitTransaction(txData) {
  try {
    const response = await axios.post(
      'http://localhost:31401/proxy/v2/transactions',
      { transaction: txData },
      { headers: { 'Content-Type': 'application/json' } }
    );
    console.log('Respon Transaksi:', response.data);
  } catch (error) {
    console.error('Gagal mengirim transaksi:', error.response?.data || error.message);
  }
}

// Ganti dengan data transaksi yang valid
submitTransaction("data_transaksi_anda");
```

## Konfigurasi

Anda dapat mengubah port server dengan mengedit file `index.js`.

Ubah nilai variabel `PORT`:

```javascript
// index.js
const PORT = 31401; // Ganti dengan port yang Anda inginkan, misal: 8080
```

Simpan file dan restart server agar perubahan diterapkan.

## ⚠️ Peringatan Keamanan

Proyek ini menggunakan opsi `rejectUnauthorized: false` pada agen HTTPS. Opsi ini **menonaktifkan validasi sertifikat SSL**.

-   **Tujuan:** Ini dilakukan secara sengaja agar server proxy dapat berkomunikasi dengan node Pi Network yang mungkin menggunakan sertifikat _self-signed_.
-   **Risiko:** Menonaktifkan validasi ini membuka kemungkinan serangan _Man-in-the-Middle_ (MITM) jika Anda menggunakan proxy ini untuk terhubung ke server yang tidak tepercaya.

**Gunakan server ini dengan hati-hati.** Pastikan Anda hanya mengarahkannya ke alamat IP atau domain yang Anda kenal dan percayai sepenuhnya, seperti alamat IP node Pi Network yang sudah terverifikasi (`138.68.40.95`).

## Kontribusi

Kontribusi untuk meningkatkan proyek ini sangat kami hargai. Jika Anda ingin berkontribusi, silakan:

1.  *Fork* repositori ini.
2.  Buat *branch* baru untuk fitur Anda (`git checkout -b fitur/FiturKeren`).
3.  Lakukan perubahan dan *commit* (`git commit -m 'Menambahkan FiturKeren'`).
4.  *Push* ke *branch* Anda (`git push origin fitur/FiturKeren`).
5.  Buka *Pull Request*.

Anda juga dapat membuka *issue* untuk melaporkan bug atau memberikan saran.

## Lisensi

Proyek ini dilisensikan di bawah [Lisensi MIT](LICENSE).

## Kontak

Dikembangkan oleh: **zendshost**

-   **Telegram:** [@zendshost](https://t.me/zendshost)
-   **GitHub:** [zendshost](https://github.com/zendshost)
