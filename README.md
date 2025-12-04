# Sistem Pendukung Keputusan Penentuan Kinerja Perawat Terbaik

Sistem ini menggunakan metode **Simple Additive Weighting (SAW)** untuk menentukan perawat terbaik berdasarkan kriteria yang telah ditentukan.

---

## 1. Struktur Data

- **Perawat**: Alternatif yang akan dinilai.
- **Kriteria**: Faktor penilaian, misal `Absensi`, `Kompetensi Teknis`, `Kemampuan Komunikasi`, dll.
- **Nilai**: Nilai tiap perawat untuk setiap kriteria.
- **HasilPerhitungan**: Hasil akhir perawat setelah dihitung SAW, termasuk skor total dan ranking.

---

## 2. Langkah-langkah Perhitungan SAW

### a. Matriks Nilai Alternatif
Contoh nilai perawat untuk setiap kriteria:

| Perawat | C1 (Absensi) | C2 (Kompetensi) | C3 (Komunikasi) | C4 (Kepribadian) | C5 (Kegagalan) |
|---------|--------------|----------------|----------------|-----------------|----------------|
| A1      | 90           | 8              | 2              | 92              | 1              |
| A2      | 80           | 7              | 2              | 85              | 1              |
| A3      | 79           | 5              | 2              | 85              | 1              |
| A4      | 75           | 6              | 2              | 80              | 2              |
| A5      | 80           | 6              | 2              | 80              | 1              |
| A6      | 90           | 5              | 2              | 80              | 2              |

---

### b. Normalisasi Nilai
Rumus normalisasi:

- **Benefit (semakin besar lebih baik)**  
\[
r_{ij} = \frac{x_{ij}}{\max(x_j)}
\]

- **Cost (semakin kecil lebih baik)**  
\[
r_{ij} = \frac{\min(x_j)}{x_{ij}}
\]

Contoh hasil normalisasi:

| Perawat | C1 | C2    | C3 | C4    | C5  |
|---------|----|-------|----|-------|-----|
| A1      | 1  | 1     | 1  | 1     | 0.5 |
| A2      | 0.888 | 0.875 | 1  | 0.92391 | 0.5 |
| A3      | 0.8778 | 0.625 | 1  | 0.92391 | 0.5 |
| A4      | 0.8333 | 0.75 | 1  | 0.86956 | 1 |
| A5      | 0.888 | 0.76 | 1  | 0.86956 | 0.5 |
| A6      | 1  | 0.625 | 1  | 0.86956 | 0.5 |

---

### c. Perhitungan Skor Total
\[
V_i = \sum_{j=1}^{n} w_j \cdot r_{ij}
\]

Contoh dengan bobot kriteria:

| Kriteria | Bobot |
|----------|-------|
| C1       | 20    |
| C2       | 30    |
| C3       | 15    |
| C4       | 15    |
| C5       | 20    |

Perhitungan A1:

\[
V_1 = (20*1) + (30*1) + (15*1) + (15*1) + (20*0.5) = 90
\]

---

### d. Ranking Perawat
Setelah skor total dihitung, ranking ditentukan berdasarkan skor tertinggi:

| Rank | Perawat            | Skor Total |
|------|------------------|------------|
| 1    | Salsabila S.Kep    | 90         |
| 2    | Maura Laureza S.Kep| 82.886     |
| 3    | Lauras S.Kep       | 87.21      |
| 4    | Laureza S.Kep      | 78.621     |
| 5    | Arya S.Kep         | 75.164     |
| 6    | Karina S.Kep       | 75.417     |

> Perawat dengan skor tertinggi menjadi **perawat terbaik**.

---

## 3. Alur Perhitungan SAW (Diagram)

```text
+-----------------+
| Input Nilai     |
| Perawat x Kriteria|
+--------+--------+
         |
         v
+-----------------+
| Normalisasi     |
| (Benefit / Cost)|
+--------+--------+
         |
         v
+-----------------+
| Hitung Skor     |
| Total Perawat   |
+--------+--------+
         |
         v
+-----------------+
| Urutkan Ranking |
+-----------------+
