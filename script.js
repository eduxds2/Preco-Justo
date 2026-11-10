// Dados simulados de hospedagens e voos
const ofertas = [
  {
    id: 1,
    tipo: "hospedagem",
    titulo: "Hotel & Resort Vista Mar",
    localizacao: "Santo André, SP • 500m do centro",
    nota: 4.9,
    preco: 280.00,
    imagem: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=500&q=80",
    linkParceiro: "https://www.booking.com"
  },
  {
    id: 2,
    tipo: "hospedagem",
    titulo: "Pousada Cantinho da Serra",
    localizacao: "Serra da Mantiqueira, SP",
    nota: 4.7,
    preco: 190.00,
    imagem: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=500&q=80",
    linkParceiro: "https://www.booking.com"
  },
  {
    id: 3,
    tipo: "voos",
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
  if (lista.length === 0) {
    container.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: #6B7280;">Nenhuma oferta encontrada para esta pesquisa.</p>`;
    return;
  }

  lista.forEach(item => {
    container.innerHTML += `
      <div class="offer-card">
        <img src="${item.imagem}" alt="${item.titulo}">
        <div class="offer-body">
          <h3 class="offer-title">${item.titulo}</h3>
          <p class="offer-location">${item.localizacao}</p>
          <p style="font-size:0.85rem; color:#F59E0B;">★ ${item.nota}</p>
          <div style="margin-top: 10px;">
            <span style="font-size:0.75rem; color:#6B7280;">A partir de</span>
            <div class="offer-price">${formatarMoeda(item.preco)}</div>
          </div>
          <button onclick="window.open('${item.linkParceiro}', '_blank')" class="btn-reserve">Ver Oferta ❯</button>
        </div>
      </div>
    `;
  });
}

// Troca de Abas do Hero
function trocarAba(categoria) {
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  event.target.classList.add('active');

  const title = document.getElementById('searchCardTitle');
  const options = document.getElementById('tripOptions');

  if (categoria === 'voos' || categoria === 'monte') {
    title.innerText = "Para onde você quer ir?";
    options.style.display = "flex";
  } else if (categoria === 'hospedagem') {
    title.innerText = "Encontre seu hotel ou pousada ideal";
    options.style.display = "none";
  } else {
    title.innerText = `Pesquisar ${categoria}`;
    options.style.display = "none";
  }
}

function inverterDestinos() {
  const orig = document.getElementById('inputOrigem');
  const dest = document.getElementById('inputDestino');
  const temp = orig.value;
  orig.value = dest.value;
  dest.value = temp;
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
