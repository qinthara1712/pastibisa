 
        //  Dzakwan Qinthara_1710624052
        // Ini adalah langkah paling awal dan paling penting. Kita seperti menunggu sampai semua elemen HTML (tombol, layar, gambar) selesai dimuat dengan sempurna, baru jalankan kode JavaScript di dalamnya. Ini untuk mencegah error jika JavaScript mencoba mengakses elemen yang belum siap. 
        document.addEventListener('DOMContentLoaded', function() {
            
            //  Setelah halaman siap, kita "mengenalkan" JavaScript dengan komponen-komponen UI (User Interface) yang vital. display: Kita simpan elemen <input> yang menjadi layar kalkulator. statusImage: Kita simpan elemen <img> yang menjadi gambar status di atas. buttons: Kita simpan semua elemen yang memiliki class .btn-calc (semua tombol) ke dalam satu grup/daftar. 
            const display = document.getElementById('display');
            const statusImage = document.getElementById('statusImage');
            const buttons = document.querySelectorAll('.btn-calc');

            //  3 variabel (imgNormal, imgSuccess, imgError) untuk menyimpan link gambar status. Ini agar script lebih rapi dan mudah saat ingin mengganti gambar feedback. 
            const imgNormal = 'https://placehold.co/400x100/374151/E5E7EB?text=Kalkulator';
            const imgSuccess = 'https://placehold.co/400x100/16A34A/FFFFFF?text=Sukses!';
            const imgError = 'https://placehold.co/400x100/DC2626/FFFFFF?text=Error!';

            /**
              Selanjutnya, "SOP" atau fungsi standar untuk tugas-tugas yang akan sering dipanggil:

function changeImage(state): Ini adalah fungsi untuk mengatur feedback visual. Jika dipanggil dengan state 'success', gambar akan berubah jadi hijau. Jika 'error', jadi merah. Jika 'normal', akan kembali ke gambar abu-abu standar.
             */
            function changeImage(state) {
                if (state === 'success') {
                    statusImage.src = imgSuccess;
                    statusImage.alt = "Perhitungan Sukses";
                } else if (state === 'error') {
                    statusImage.src = imgError;
                    statusImage.alt = "Error Perhitungan";
                } else { 
                    statusImage.src = imgNormal;
                    statusImage.alt = "Status Kalkulator";
                }
            }

            /**
              function clearDisplay(): Ini adalah SOP untuk tombol 'C'. Tugasnya membersihkan layar (display.value = '') dan mengembalikan gambar status ke normal. 
             */
            function clearDisplay() {
                display.value = '';
                changeImage('normal'); // Memanggil function untuk merubah gambar
            }

            /**
              function deleteLastChar(): Ini SOP untuk tombol 'DEL'. Tugasnya menghapus satu karakter terakhir dari layar. 
             */
            function deleteLastChar() {
                display.value = display.value.slice(0, -1);
            }

            /**
              function appendToDisplay(value): Ini SOP untuk tombol angka dan operator (+, -, *, /). Tugasnya adalah "menempelkan" atau menambahkan karakter (misal '7' atau '+') ke akhir teks yang sudah ada di layar.  
             */
            function appendToDisplay(value) {
                display.value += value;
            }

            /**
              Ini adalah fungsi terpenting yang akan dipanggil saat tombol '=' ditekan.   
             */
            function calculateResult() {
                //  script akan mengecek apakah layarnya kosong. Jika kosong (display.value === '') tapi pengguna menekan '=', maka akan tampil pesan "Kosong!" dan gambar status berubah jadi "Error".
 
                if (display.value === '') {
                    changeImage('error');
                    display.value = 'Kosong!';
                    setTimeout(clearDisplay, 1500);
                    return;
                }

                try {
                    //  try...catch (Penanganan Error): Script akan mencoba (try) menjalankan kalkulasi. Jika terjadi error (misal pengguna mengetik 5++3 yang tidak valid), prosesnya akan "ditangkap" (catch) dan menampilkan "Error" tanpa membuat browser crash.
                    let result = eval(display.value
                        .replace(/%/g, '/100') //  Karena JavaScript tidak mengerti '50%', fungsi replace(/%/g, '/100') untuk mengubah string itu menjadi '50/100' yang bisa dihitung. fungsi eval() untuk mengeksekusi string matematika tersebut (misal '50/100' atau '10+5*2') dan mendapatkan hasilnya.
 
                    ); 
                    
                    //  Setelah hasil didapat, ada pengecekan isFinite(result). Ini untuk memastikan hasilnya adalah angka yang wajar, bukan Infinity (misalnya hasil dari 10 / 0). Dengan kata lain ini adalah validasi hasil
                    if (isFinite(result)) {
                        display.value = result;
                        changeImage('success'); //  Jika berhasil dan wajar, layar akan menampilkan hasil dan gambar status berubah jadi "Sukses". Jika gagal (baik karena eval error atau hasilnya Infinity), layar menampilkan "Error" dan gambar status jadi "Error". 
                    } else {
                        throw new Error("Hasil tidak valid");
                    }

                } catch (error) {
                    console.error("Error kalkulasi:", error);
                    display.value = 'Error';
                    changeImage('error'); //  Untuk pesan "Error", ini menggunakan setTimeout(clearDisplay, 1500). Hal ini untuk memberi jeda 1,5 detik agar pengguna bisa membaca pesannya, sebelum layar otomatis dibersihkan.  
                    setTimeout(clearDisplay, 1500);
                }
            }


            //  Melakukan looping (forEach) ke setiap tombol yang sudah kita simpan tadi. Setiap tombol diberi addEventListener('click'), yang artinya "hei tombol, kalau kamu di-klik, jalankan perintah ini." Di dalamnya, ada switch(value) untuk mendelegasikan tugas berdasarkan data-value dari tombol yang diklik
            buttons.forEach(button => {
                button.addEventListener('click', () => {
                    const value = button.getAttribute('data-value');

                    //  Jika value adalah 'C', panggil clearDisplay(). 
                    switch(value) {
                        case 'C':
                            clearDisplay();
                            break;
                        case 'DEL':
                            //  Jika value adalah 'DEL', panggil deleteLastChar(). 
                            deleteLastChar();
                            break;
                        case '=':
                            //  Jika value adalah '=', panggil calculateResult(). 
                            calculateResult();
                            break;
                        default:
                            //  Jika pengguna baru saja mendapat hasil (gambar status 'Sukses' atau 'Error') lalu menekan angka baru, script akan otomatis membersihkan layar dulu (clearDisplay()) sebelum menampilkan angka baru itu. Ini agar input baru tidak tercampur dengan hasil sebelumnya.
                            if (statusImage.src === imgSuccess || statusImage.src === imgError) {
                                clearDisplay();
                            }
                            // Jika lainnya (angka atau operator), panggil appendToDisplay(value).
                            appendToDisplay(value); 
                            break;
                    }
                });
            });

            //  Ini memetakan tombol keyboard ke fungsi yang sama:'Enter' atau '=' akan memanggil calculateResult(). Backspace' akan memanggil deleteLastChar(). Escape' atau 'c' akan memanggil clearDisplay(). Tombol angka dan operator (+, -, *, /) akan memanggil appendToDisplay(). 
            document.addEventListener('keydown', (e) => {
                const key = e.key;

                if (key >= '0' && key <= '9' || key === '.' || key === '+' || key === '-' || key === '*' || key === '/' || key === '%') {
                    if (statusImage.src === imgSuccess || statusImage.src === imgError) {
                        clearDisplay();
                    }
                    appendToDisplay(key);
                    e.preventDefault();
                } else if (key === 'Enter' || key === '=') {
                    calculateResult();
                    e.preventDefault();
                } else if (key === 'Backspace') {
                    deleteLastChar();
                    e.preventDefault();
                } else if (key === 'Escape' || key.toLowerCase() === 'c') {
                    clearDisplay();
                    e.preventDefault();
                }
            });

        });
    