/*
 * Dashboard de Vendas — lógica em JavaScript puro (com Chart.js).
 * Agrega os pedidos, calcula os KPIs e desenha os gráficos. O seletor de
 * categoria refiltra os dados e atualiza tudo em tempo real.
 * Autora: Ana Paula Galdino
 */
"use strict";

const AZUL = ["#1f4e79", "#2e6da4", "#5b9bd5", "#7fb0d8", "#a6c8e0", "#4fd1c5"];
const MESES = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
Chart.defaults.color = "#95a3bd";
Chart.defaults.font.family = "Inter, sans-serif";
Chart.defaults.borderColor = "rgba(255,255,255,0.05)";

const brl = (v) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });

/** Soma valores de um array de pedidos agrupando por uma chave. */
function agrupar(pedidos, chave) {
  return pedidos.reduce((acc, p) => {
    const k = typeof chave === "function" ? chave(p) : p[chave];
    acc[k] = (acc[k] || 0) + p.valor;
    return acc;
  }, {});
}

function kpis(pedidos) {
  const total = pedidos.reduce((s, p) => s + p.valor, 0);
  return [
    { label: "Faturamento", valor: brl(total) },
    { label: "Pedidos", valor: pedidos.length.toLocaleString("pt-BR") },
    { label: "Ticket médio", valor: brl(total / (pedidos.length || 1)) },
    { label: "Categorias", valor: new Set(pedidos.map((p) => p.categoria)).size },
  ];
}

function renderKpis(pedidos) {
  document.getElementById("kpis").innerHTML = kpis(pedidos)
    .map((k) => `<div class="kpi"><div class="label">${k.label}</div><div class="valor">${k.valor}</div></div>`)
    .join("");
}

const charts = {};
function desenhar(id, config) {
  if (charts[id]) charts[id].destroy();
  charts[id] = new Chart(document.getElementById(id), config);
}

function atualizar(pedidos) {
  renderKpis(pedidos);

  // Faturamento por mês
  const porMes = new Array(12).fill(0);
  pedidos.forEach((p) => { porMes[new Date(p.data).getUTCMonth()] += p.valor; });
  desenhar("chartMensal", {
    type: "line",
    data: { labels: MESES, datasets: [{ data: porMes, borderColor: "#4fd1c5",
      backgroundColor: "rgba(79,209,197,0.15)", fill: true, tension: 0.35, pointRadius: 3 }] },
    options: baseOpts(true),
  });

  // Por categoria
  const cat = agrupar(pedidos, "categoria");
  const catOrd = Object.entries(cat).sort((a, b) => b[1] - a[1]);
  desenhar("chartCategoria", {
    type: "bar",
    data: { labels: catOrd.map((e) => e[0]),
      datasets: [{ data: catOrd.map((e) => e[1]), backgroundColor: "#2e6da4", borderRadius: 4 }] },
    options: baseOpts(true),
  });

  // Pagamento (doughnut)
  const pag = agrupar(pedidos, "pagamento");
  desenhar("chartPagamento", {
    type: "doughnut",
    data: { labels: Object.keys(pag),
      datasets: [{ data: Object.values(pag), backgroundColor: AZUL, borderColor: "#141b2b", borderWidth: 2 }] },
    options: { responsive: true, plugins: { legend: { position: "bottom" } } },
  });

  // Top produtos
  const prod = Object.entries(agrupar(pedidos, "produto")).sort((a, b) => b[1] - a[1]).slice(0, 8).reverse();
  desenhar("chartProdutos", {
    type: "bar",
    data: { labels: prod.map((e) => e[0]),
      datasets: [{ data: prod.map((e) => e[1]), backgroundColor: "#5b9bd5", borderRadius: 4 }] },
    options: { ...baseOpts(false), indexAxis: "y" },
  });
}

function baseOpts(money) {
  return {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: { callbacks: { label: (c) => brl(c.parsed.y ?? c.parsed.x ?? c.parsed) } },
    },
    scales: {
      x: { grid: { display: false } },
      y: { ticks: { callback: (v) => (money ? brl(v) : v) } },
    },
  };
}

// --- Inicialização e filtro ---
function init() {
  const select = document.getElementById("cat");
  [...new Set(PEDIDOS.map((p) => p.categoria))].sort().forEach((c) => {
    const opt = document.createElement("option");
    opt.value = c; opt.textContent = c; select.appendChild(opt);
  });
  select.addEventListener("change", () => {
    const f = select.value === "todas" ? PEDIDOS : PEDIDOS.filter((p) => p.categoria === select.value);
    atualizar(f);
  });
  atualizar(PEDIDOS);
}

document.addEventListener("DOMContentLoaded", init);
