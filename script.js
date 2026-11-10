const ofertas = [
  {
    id: 1,
    titulo: "Hotel & Resort Vista Mar",
    localizacao: "Santo André, SP • 500m do centro",
    nota: 4.9,
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
    nota: 4.8,
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
          <h3 style="font-size:1.05rem; font-weight:700;">${item.titulo}</h3>
          <p style="font-size:0.82rem; color:#6B7280; margin:4px 0;">${item.localizacao}</p>
          <p style="font-size:0.8rem; color:#F59E0B; font-weight:bold;">★ ${item.nota}</p>
          <div style="margin-top: 10px;">
            <span style="font-size:0.75rem; color:#6B7280;">A partir de</span>
            <div class="offer-price">${formatarMoeda(item.preco)}</div>
          </div>
          <button onclick="window.open('${item.linkParceiro}', '_blank')" class="btn-submit-search" style="width:100%; margin-top:10px;">Ver Oferta ❯</button>
        </div>
      </div>
    `;
  });
}

function trocarAba(categoria, elemento) {
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  if (elemento) elemento.classList.add('active');

  const fVoos = document.getElementById('formVoos');
  const fHosp = document.getElementById('formHospedagem');
  const fCarros = document.getElementById('formCarros');
  const fSeguros = document.getElementById('formSeguros');

  fVoos.style.display = 'none';
  fHosp.style.display = 'none';
  fCarros.style.display = 'none';
  fSeguros.style.display = 'none';

  if (categoria === 'hospedagem') {
    fHosp.style.display = 'block';
  } else if (categoria === 'carros') {
    fCarros.style.display = 'block';
  } else if (categoria === 'seguros') {
    fSeguros.style.display = 'block';
  } else {
    fVoos.style.display = 'block';
    const title = document.getElementById('searchCardTitle');
    if (title) title.innerText = categoria === 'voos' ? 'Para onde você quer ir?' : `Pesquisar ${categoria}`;
  }
}

function inverterVoos() {
  const orig = document.getElementById('flightOrigem');
  const dest = document.getElementById('flightDestino');
  if (orig && dest) {
    const temp = orig.value;
    orig.value = dest.value;
    dest.value = temp;
  }
}

function realizarPesquisa() {
  renderizarOfertas(ofertas);
}

document.addEventListener('DOMContentLoaded', () => {
  renderizarOfertas(ofertas);
});
