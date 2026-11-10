const hoteis = [
  {
    id: 1,
    nome: "Arraial Bangalô Praia Hotel",
    cidade: "Porto Seguro",
    imagem: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=500&q=80",
    nota: 8.3,
    avaliacaoTexto: "Muito bom",
    avaliacoesCount: "4.127",
    descontoBadge: "12% mais barato que outros sites",
    preco: 761.00,
    parceiro: "Outrip",
    cancelamentoGratuito: true
  },
  {
    id: 2,
    nome: "Hotel Solar do Imperador",
    cidade: "Porto Seguro",
    imagem: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=500&q=80",
    nota: 8.4,
    avaliacaoTexto: "Muito bom",
    avaliacoesCount: "6.371",
    descontoBadge: "22% mais barato que outros sites",
    preco: 328.00,
    parceiro: "Decolar",
    cancelamentoGratuito: true
  },
  {
    id: 3,
    nome: "Hotel Recanto Do Sol",
    cidade: "Porto Seguro",
    imagem: "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=500&q=80",
    nota: 7.1,
    avaliacaoTexto: "Bom",
    avaliacoesCount: "1.019",
    descontoBadge: "Caiu R$ 17",
    preco: 153.00,
    parceiro: "Decolar",
    cancelamentoGratuito: true
  },
  {
    id: 4,
    nome: "Mont Hebron",
    cidade: "Porto Seguro",
    imagem: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=500&q=80",
    nota: 9.2,
    avaliacaoTexto: "Excelente",
    avaliacoesCount: "532",
    descontoBadge: "Caiu R$ 95",
    preco: 329.00,
    parceiro: "Booking.com",
    cancelamentoGratuito: true
  }
];

function formatarMoeda(valor) {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

// Redireciona da Home para a página de busca
function irParaBusca(destino) {
  const termo = destino || document.getElementById('homeSearchInput')?.value || 'Porto Seguro';
  window.location.href = `busca.html?q=${encodeURIComponent(termo)}`;
}

// Renderiza mini-cards na Home
function renderizarOfertasHome() {
  const container = document.getElementById('homeOffersGrid');
  if (!container) return;

  container.innerHTML = '';
  hoteis.forEach(hotel => {
    container.innerHTML += `
      <div class="mini-offer-card" onclick="irParaBusca('${hotel.cidade}')">
        <img src="${hotel.imagem}" alt="${hotel.nome}">
        <div class="mini-offer-body">
          <span class="tag-red">${hotel.descontoBadge}</span>
          <h4 style="margin-top:6px; font-size:0.9rem;">${hotel.nome}</h4>
          <p style="font-size:0.75rem; color:#64748B;">★ ${hotel.nota} ${hotel.avaliacaoTexto}</p>
          <div class="mini-price">${formatarMoeda(hotel.preco)} <span style="font-size:0.7rem; font-weight:normal;">/diária</span></div>
        </div>
      </div>
    `;
  });
}

// Renderiza busca completa em busca.html
function renderizarResultadosBusca(lista) {
  const container = document.getElementById('offersContainer');
  if (!container) return;

  container.innerHTML = '';
  lista.forEach(hotel => {
    container.innerHTML += `
      <div class="hotel-card">
        <div class="hotel-img-container">
          <img src="${hotel.imagem}" alt="${hotel.nome}" class="hotel-img">
        </div>
        <div class="hotel-details">
          <h2>${hotel.nome}</h2>
          <p style="color:#059669; font-weight:bold; font-size:0.85rem;">★ ${hotel.nota} (${hotel.avaliacaoTexto})</p>
          <p style="font-size:0.8rem; color:#64748B;">📍 ${hotel.cidade}, Brasil</p>
        </div>
        <div class="hotel-pricing">
          <div class="best-deal-box">
            <span style="font-size:0.75rem; font-weight:bold; color:#065F46;">${hotel.parceiro}</span>
            <div style="font-size:1.3rem; font-weight:bold; color:#065F46;">${formatarMoeda(hotel.preco)}</div>
            <button onclick="window.open('https://www.booking.com', '_blank')" class="btn-green-deal">Ver oferta ❯</button>
          </div>
        </div>
      </div>
    `;
  });
}

function aplicarFiltrosSidebar() {
  const cancelamento = document.getElementById('chkCancelamento')?.checked;
  const pMin = parseFloat(document.getElementById('priceMin')?.value) || 0;
  const pMax = parseFloat(document.getElementById('priceMax')?.value) || 99999;

  const filtrados = hoteis.filter(h => {
    const okCanc = !cancelamento || h.cancelamentoGratuito;
    const okPrice = h.preco >= pMin && h.preco <= pMax;
    return okCanc && okPrice;
  });

  renderizarResultadosBusca(filtrados);
}

function filtrarBuscaPagina() {
  const term = document.getElementById('buscaSearchInput').value.toLowerCase();
  const filtrados = hoteis.filter(h => h.nome.toLowerCase().includes(term) || h.cidade.toLowerCase().includes(term));
  renderizarResultadosBusca(filtrados);
}

document.addEventListener('DOMContentLoaded', () => {
  renderizarOfertasHome();

  // Caso esteja em busca.html
  if (window.location.pathname.includes('busca.html')) {
    const params = new URLSearchParams(window.location.search);
    const query = params.get('q');
    if (query && document.getElementById('buscaSearchInput')) {
      document.getElementById('buscaSearchInput').value = query;
    }
    filtrarBuscaPagina();
  }
});
