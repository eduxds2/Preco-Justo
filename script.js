const ofertas = [
  {
    id: 1,
    titulo: "Hotel & Resort Vista Mar",
    localizacao: "Santo André, SP • 500m do centro",
    nota: 4.8,
    preco: 280.00,
    imagem: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=500&q=80",
    linkParceiro: "https://www.booking.com"
  },
  {
    id: 2,
    titulo: "Pousada Cantinho da Serra",
    localizacao: "Serra da Mantiqueira, SP",
    nota: 4.7,
    preco: 190.00,
    imagem: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=500&q=80",
    linkParceiro: "https://www.booking.com"
  },
  {
    id: 3,
    titulo: "Voo São Paulo (GRU) ➔ Porto Seguro (BPS)",
    localizacao: "Ida e Volta • Direto",
    nota: 4.9,
    preco: 450.00,
    imagem: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=500&q=80",
    linkParceiro: "https://www.latamairlines.com"
  }
];

function formatarMoeda(valor) {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function renderizarOfertas(lista) {
  const container = document.getElementById('offersContainer');
  if (!container) return;

  container.innerHTML = '';
  lista.forEach(item => {
    container.innerHTML += `
      <div class="offer-card">
        <img src="${item.imagem}" alt="${item.titulo}">
        <div class="offer-body">
          <h3 class="offer-title">${item.titulo}</h3>
          <p class="offer-location">${item.localizacao}</p>
          <p style="font-size:0.75rem; color:#F59E0B; font-weight:bold;">★ ${item.nota}</p>
          <div style="margin-top: 8px;">
            <span style="font-size:0.75rem; color:#64748B;">A partir de</span>
            <div class="offer-price">${formatarMoeda(item.preco)}</div>
          </div>
          <button onclick="window.open('${item.linkParceiro}', '_blank')" class="btn-offer-green">Ver Oferta ❯</button>
        </div>
      </div>
    `;
  });
}

function toggleTheme() {
  const body = document.body;
  const btn = document.getElementById('btnThemeToggle');

  if (body.classList.contains('light-mode')) {
    body.classList.remove('light-mode');
    body.classList.add('dark-mode');
    btn.innerText = '☀️ Modo';
  } else {
    body.classList.remove('dark-mode');
    body.classList.add('light-mode');
    btn.innerText = '🌙 Modo';
  }
}

function trocarAba(categoria, elemento) {
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  if (elemento) elemento.classList.add('active');

  const fGeral = document.getElementById('formGeral');
  const fHosp = document.getElementById('formHospedagem');

  if (categoria === 'hospedagem') {
    fGeral.style.display = 'none';
    fHosp.style.display = 'block';
  } else {
    fGeral.style.display = 'block';
    fHosp.style.display = 'none';
    const title = document.getElementById('searchCardTitle');
    if (title) title.innerText = categoria === 'voos' ? 'Para onde você quer ir?' : `Pesquisar ${categoria}`;
  }
}

function inverterDestinos() {
  const orig = document.getElementById('inputOrigem');
  const dest = document.getElementById('inputDestino');
  if (orig && dest) {
    const temp = orig.value;
    orig.value = dest.value;
    dest.value = temp;
  }
}

function realizarPesquisa() {
  const termo = document.getElementById('inputDestino')?.value.toLowerCase();
  if (!termo) {
    renderizarOfertas(ofertas);
    return;
  }
  const filtrados = ofertas.filter(o => 
    o.titulo.toLowerCase().includes(termo) || 
    o.localizacao.toLowerCase().includes(termo)
  );
  renderizarOfertas(filtrados);
}

document.addEventListener('DOMContentLoaded', () => {
  renderizarOfertas(ofertas);
});
