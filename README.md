<div align="center">

  <h1>📊 Record Merger</h1>
  <p><b>Match two spreadsheets. Keep every row. Miss nothing.</b></p>

  <p>
    <a href="https://solutionexe.github.io/Excel-File-Merger/">
      <img src="https://img.shields.io/badge/Live%20Demo-Launch%20App-4bb31b?style=for-the-badge&logo=github&logoColor=white" alt="Live Demo" />
    </a>
    <a href="https://github.com/SoLuTiOnExE">
      <img src="https://img.shields.io/badge/Developer-SoLuTiOnExE-131A1C?style=for-the-badge&logo=github&logoColor=white" alt="Developer" />
    </a>
    <img src="https://img.shields.io/badge/License-MIT-0B0B0F?style=for-the-badge" alt="License" />
  </p>

  <br />
</div>

---

## 📌 Overview

**Record Merger** is a privacy-first, client-side web application built for merging and aligning record data from two distinct spreadsheets (`.xlsx`, `.xls`, or `.csv`). 

Whether you are matching student admission files with quiz results, merging sales lead sheets, or aligning inventory logs, **Record Merger** identifies matching unique keys (e.g., Email, Matriculation Number, Reference ID) and outputs a single, comprehensive spreadsheet while ensuring **zero data loss**.

---

## ✨ Key Features

- 📁 **Multi-Format Support:** Drag & drop `.xlsx`, `.xls`, and `.csv` files effortlessly.
- 🧠 **Smart Auto-Detection:** Automatically suggests primary key columns based on header titles (e.g., *Email*, *ID*, *Admission Number*).
- 🔄 **Full Record Alignment:** Performs a full outer join—keeping matched rows while preserving unmatched entries from both File A and File B.
- ⚡ **100% Client-Side Processing:** All parsing and file merging take place locally inside your browser using **SheetJS**. Your data is never uploaded to an external server.
- 📊 **Real-Time Analytics & Preview:** Visual breakdown showing total matched rows vs. unmatched rows from each source file.
- 📥 **Instant Export:** Download the merged dataset directly back into standard `.xlsx` format.

---

## 🚀 How It Works

```
  [ File A ]  ─┐
               ├─►  [ Map Key Column ]  ─►  [ Match & Align ]  ─►  [ Export .xlsx ]
  [ File B ]  ─┘
```

1. **Step 01 — Load Files:** Drop **File A** (e.g., Master records) and **File B** (e.g., Updates/Results) into the dropzones.
2. **Step 02 — Map Columns:** Select the key column common to both files (e.g., `Email` or `Student_ID`).
3. **Step 03 — Merge & Download:** View summary stats, inspect the dynamic data preview, and download your complete `.xlsx` dataset.

---

## 🛠️ Built With

- **HTML5 & CSS3** — Custom modern dark theme with CSS custom properties.
- **Vanilla JavaScript (ES6+)** — Fast DOM manipulations and state handling.
- **[SheetJS / js-xlsx](https://github.com/SheetJS/sheetjs)** — In-browser spreadsheet parsing and generation.
- **Google Fonts** — *Syne* & *DM Sans*.

---

## 💻 Local Setup

Since **Record Merger** runs entirely in the browser without backend dependencies, setting it up locally is straightforward:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/SoLuTiOnExE/Excel-File-Merger.git
   ```

2. **Navigate into the directory:**
   ```bash
   cd Excel-File-Merger
   ```

3. **Run the app:**
   Simply double-click `index.html` or open it with your preferred browser / Live Server extension in VS Code.

---

## 👨‍💻 Developer Profile

**Fasanya Ayomide**  
*Software & Solution Developer*

- **GitHub:** [@SoLuTiOnExE](https://github.com/SoLuTiOnExE)
- **Email:** [fasanyaayomide2019@gmail.com](mailto:fasanyaayomide2019@gmail.com)
- **Phone:** `+234 812 072 9938` | `+234 704 162 6944`
- **WhatsApp:** [Chat on WhatsApp](https://wa.me/2348120729938)

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
