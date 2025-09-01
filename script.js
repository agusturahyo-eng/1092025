const API_URL = "https://script.google.com/macros/s/AKfycbxtaMvHhGe8QcQDu1CLJRgNyDbh1Z1-oB_IrJ6EX3YZ5w1yuKsBzAUsSj9JEqnGbklxSg/exec";

let allData = [];

async function loadData() {
  try {
    const res = await fetch(API_URL);
    allData = await res.json();

    renderRekap();
  } catch (e) {
    document.getElementById("rekapContainer").innerText = "Gagal memuat data!";
  }
}

function renderRekap() {
  const container = document.getElementById("rekapContainer");
  container.innerHTML = "";

  // grupkan per petugas
  const grouped = {};
  allData.forEach(row => {
    const petugas = row.petugas || "Tanpa Petugas";
    if (!grouped[petugas]) grouped[petugas] = [];
    grouped[petugas].push(row);
  });

  for (let petugas in grouped) {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <h3>${petugas}</h3>
      <p>Total pelanggan: <b>${grouped[petugas].length}</b></p>
    `;
    card.onclick = () => showDetail(petugas, grouped[petugas]);
    container.appendChild(card);
  }
}

function showDetail(petugas, data) {
  document.getElementById("rekapContainer").classList.add("hidden");
  const detail = document.getElementById("detailContainer");
  detail.classList.remove("hidden");

  document.getElementById("detailTitle").innerText = `Detail - ${petugas}`;

  const tbody = document.querySelector("#detailTable tbody");
  tbody.innerHTML = "";

  data.forEach(row => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${row.idpel}</td>
      <td>${row.nama}</td>
      <td>${row.tgl_lunas || "-"}</td>
      <td>${row.tgl_lunas ? "Lunas" : "Belum Lunas"}</td>
      <td>${row.jumlah}</td>
    `;
    tbody.appendChild(tr);
  });
}

function closeDetail() {
  document.getElementById("detailContainer").classList.add("hidden");
  document.getElementById("rekapContainer").classList.remove("hidden");
}

// jalankan awal
loadData();
