# Shift & Schedule System Documentation

## Overview
 Sistem Shift Management ini dirancang untuk mengelola jadwal kerja karyawan secara fleksibel. Sistem ini terdiri dari 3 komponen utama:
 1. **Shift Definition**: Definisi shift (misal: "Regular Morning", "Night Shift").
 2. **Shift Schedule**: Detail jadwal harian (Jam Masuk/Pulang) untuk setiap shift.
 3. **Employee Shift**: Penugasan shift ke karyawan.

## Data Models & Validations

### 1. Shift (`shifts`)
Menyimpan data master shift.
- **Fields Utama**:
  - `Name` (Required unique): Nama shift.
  - `Code` (Auto-generated unique): Kode unik shift.
  - `Description`: Deskripsi optional.
  - `IsActive`: Status aktif/non-aktif.

- **Automated Validation & Logic**:
  - **Auto-Generate Code**: Sebelum data disimpan (`BeforeCreate`), sistem akan mengecek jika `Code` kosong. Jika kosong, sistem akan generate kode dengan format `SH-{001}` (increment berdasarkan jumlah shift yang ada).
  - **Constraints**: 
    - `Code` harus unik di database.
    - `Name` tidak boleh null.

### 2. Shift Schedule (`shift_schedules`)
Menyimpan detail jadwal harian untuk setiap shift (Senin-Minggu).
- **Relasi**: Belongs To `Shift` (One-to-Many).
- **Fields Utama**:
  - `ShiftID`: ID Shift yang berelasi perhari.
  - `DayOfWeek`: Hari dalam angka (0=Minggu, 1=Senin, ... 6=Sabtu).
  - `StartTime`: Jam mulai kerja (Format: `HH:MM:SS`).
  - `EndTime`: Jam selesai kerja (Format: `HH:MM:SS`).
  - `IsWorkingDay`: Boolean, menandakan apakah hari tersebut hari kerja atau libur.

- **Logic**:
  - Setiap 1 `Shift` idealnya memiliki 7 record `ShiftSchedule` untuk merepresentasikan jadwal seminggu penuh.
  - Jika `IsWorkingDay = false`, maka `StartTime` dan `EndTime` bisa diabaikan (atau di-set ke `00:00:00`).

### 3. Employee Shift (`employee_shifts`)
Menyimpan penugasan shift ke karyawan.
- **Relasi**:
  - Belongs To `Employee`
  - Belongs To `Shift`
- **Fields Utama**:
  - `EmployeeID`: ID Karyawan.
  - `ShiftID`: ID Shift yang ditugaskan.
  - `EffectiveFrom`: Tanggal mulai berlakunya shift ini.
  - `EffectiveTo`: Tanggal berakhir (bisa null jika berlaku seterusnya).

- **Logic**:
  - Memungkinkan pencatatan riwayat perpindahan shift karyawan.
  - `EffectiveTo` yang kosong menandakan shift tersebut adalah shift aktif saat ini.

## File Structure & Implementasi

Berikut adalah file-file yang telah dibuat dan dimodifikasi:

1.  **Models**:
    -   `internal/models/shift.go`: Definisi struct `Shift` dan `ShiftSchedule` serta logic `BeforeCreate` untuk kode shift.
    -   `internal/models/employee_shift.go`: Definisi struct `EmployeeShift` untuk linking table.

2.  **Seeders (Data Awal)**:
    -   `internal/seeders/shift_seeder.go`: Script untuk mengisi data awal shift.
    -   **Data yang digenerate**:
        -   **Regular Morning**: 08:00 - 17:00 (Senin - Jumat)
        -   **Night Shift**: 17:00 - 02:00 (Senin - Jumat)
    -   `internal/seeders/seeder.go`: Register `SeedShifts` ke main seeder agar dijalankan saat `make seed`.

3.  **Database Config**:
    -   `pkg/database/gorm.go`: Mendaftarkan model baru ke `AutoMigrate` agar tabel otomatis dibuat di database.

## Workflow Penggunaan

1.  **Membuat Shift Baru**:
    -   User menginput `Name`, `Description`, dan jadwal harian.
    -   System menyimpan `Shift`.
    -   System menyimpan 7 record `ShiftSchedule` (Senin-Minggu).
    -   Code shift otomatis terisi (misal: `SH-003`).

2.  **Assign Shift ke Karyawan**:
    -   User memilih karyawan dan shift.
    -   System membuat record di `employee_shifts` dengan `EffectiveFrom` hari ini (atau tanggal yang dipilih).
    -   Record lama (jika ada) di-update `EffectiveTo`-nya menjadi kemarin (jika history tracking diimplementasikan di service layer).

## Validasi Teknis (GORM)
-   **Unique Index** pada `shifts.code` mencegah duplikasi kode.
-   **Foreign Key Constraint** pada `shift_schedules.shift_id` memastikan data jadwal terhapus jika shift induk dihapus (tergantung konfigurasi `OnDelete`).
-   **Foreign Key Constraint** pada `employee_shifts` memastikan integritas data karyawan dan shift.
