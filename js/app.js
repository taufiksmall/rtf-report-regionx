// ============================================================
// Shared helpers dipakai di semua halaman form
// ============================================================

function formatDateIndo(dateStr) {
  // dateStr format: YYYY-MM-DD -> "7 Juli 2026"
  if (!dateStr) return "-";
  const bulan = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];
  const [y, m, d] = dateStr.split("-").map(Number);
  return `${d} ${bulan[m - 1]} ${y}`;
}

function populateAreaSelect(selectEl) {
  selectEl.innerHTML = '<option value="">-- Pilih Area --</option>';
  getAreaNames().forEach((area) => {
    const opt = document.createElement("option");
    opt.value = area;
    opt.textContent = area;
    selectEl.appendChild(opt);
  });
}

function populateCabangSelect(selectEl, areaName) {
  selectEl.innerHTML = '<option value="">-- Pilih Cabang --</option>';
  selectEl.disabled = !areaName;
  if (!areaName) return;
  getBranchesByArea(areaName).forEach(({ kode, nama }) => {
    const opt = document.createElement("option");
    opt.value = kode;
    opt.textContent = `${kode} - ${nama}`;
    opt.dataset.nama = nama;
    selectEl.appendChild(opt);
  });
}

function setDefaultDateToday(dateInputEl) {
  const today = new Date();
  const iso = today.toISOString().slice(0, 10);
  dateInputEl.value = iso;
  dateInputEl.max = iso;
}

// Kirim payload ke Google Apps Script Web App.
// Catatan: gunakan Content-Type text/plain untuk menghindari CORS preflight
// (lihat README.md - Apps Script akan tetap mem-parsing body sebagai JSON).
async function sendToSheet(payload) {
  if (!APPS_SCRIPT_URL || APPS_SCRIPT_URL.includes("PASTE_APPS_SCRIPT")) {
    throw new Error("APPS_SCRIPT_URL belum dikonfigurasi di js/config.js");
  }
  const res = await fetch(APPS_SCRIPT_URL, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    throw new Error(`Gagal menyimpan data (HTTP ${res.status})`);
  }
  return res.json().catch(() => ({}));
}

function openWhatsApp(text) {
  const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
  window.open(url, "_blank");
}

function copyToClipboard(text) {
  return navigator.clipboard.writeText(text);
}
