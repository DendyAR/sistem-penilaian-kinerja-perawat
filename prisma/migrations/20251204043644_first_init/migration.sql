-- CreateEnum
CREATE TYPE "Role" AS ENUM ('admin', 'staff');

-- CreateEnum
CREATE TYPE "JenisKriteria" AS ENUM ('benefit', 'cost');

-- CreateTable
CREATE TABLE "Admin" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'admin',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Perawat" (
    "id" SERIAL NOT NULL,
    "nama" TEXT NOT NULL,
    "departemen" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Perawat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Kriteria" (
    "id" SERIAL NOT NULL,
    "nama" TEXT NOT NULL,
    "bobot" DOUBLE PRECISION NOT NULL,
    "jenis" "JenisKriteria" NOT NULL,

    CONSTRAINT "Kriteria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Nilai" (
    "id" SERIAL NOT NULL,
    "nilai" DOUBLE PRECISION NOT NULL,
    "perawatId" INTEGER NOT NULL,
    "kriteriaId" INTEGER NOT NULL,

    CONSTRAINT "Nilai_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HasilPerhitungan" (
    "id" SERIAL NOT NULL,
    "perawatId" INTEGER NOT NULL,
    "totalSkor" DOUBLE PRECISION NOT NULL,
    "ranking" INTEGER NOT NULL,

    CONSTRAINT "HasilPerhitungan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProsesPerhitungan" (
    "id" SERIAL NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "hasilJson" JSONB NOT NULL,
    "catatan" TEXT,

    CONSTRAINT "ProsesPerhitungan_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_username_key" ON "Admin"("username");

-- AddForeignKey
ALTER TABLE "Nilai" ADD CONSTRAINT "Nilai_perawatId_fkey" FOREIGN KEY ("perawatId") REFERENCES "Perawat"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Nilai" ADD CONSTRAINT "Nilai_kriteriaId_fkey" FOREIGN KEY ("kriteriaId") REFERENCES "Kriteria"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HasilPerhitungan" ADD CONSTRAINT "HasilPerhitungan_perawatId_fkey" FOREIGN KEY ("perawatId") REFERENCES "Perawat"("id") ON DELETE CASCADE ON UPDATE CASCADE;
