// Banco de dados simulado no formato Trivago (Comparando várias lojas por hotel)
const hoteis = [
  {
    id: 1,
    nome: "Kûara Hotel",
    estrelas: "★★★★★",
    imagem: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=500&q=80",
    nota: 9.4,
    avaliacaoTexto: "Excelente",
    avaliacoesCount: "2.161",
    distancia: "5,5 km até Centro",
    destaque: "Opção popular",
    recursos: "✓ Acesso privativo à praia de Pitinga<br>✓ Tratamentos de bem-estar no Spa",
    melhorOferta: {
      parceiro: "Quero Passagem",
      beneficios: ["✓ Cancelamento gratuito", "✓ Café da manhã incluído"],
      preco: 2162.00,
      link: "https://www.queropassagem.com.br"
    },
    outrasOfertas: [
      { parceiro: "Outrip", preco: 2126.00, link: "https://www.outrip.com" },
      { parceiro: "Prestigia", preco: 2757.00, link: "https://www.prestigia.com" }
    ]
  },
  {
    id: 2,
    nome: "Nauticomar All Inclusive Hotel",
    estrelas: "★★★★",
    imagem: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=500&q=80",
    nota: 8.3,
    avaliacaoTexto: "Muito bom",
    avaliacoesCount: "10.460",
    distancia: "6,8 km até Centro",
    destaque: "Opção popular",
    recursos: "✓ Acesso exclusivo ao Paradiso Beach Club<br>✓ Caminhada curta até a Praia",
    melhorOferta: {
      parceiro: "Quero Passagem",
      beneficios: ["✓ Cancelamento gratuito", "✓ All Inclusive"],
      preco: 1812.00,
      link: "https://www.queropassagem.com.br"
    },
    outrasOfertas: [
      { parceiro: "Outrip", preco: 1191.00, link: "https://www.outrip.com" },
      { parceiro: "Expedia", preco: 1894.00, link: "https://www.expedia.com" }
    ]
  },
  {
    id: 3,
    nome: "Best Western Shalimar Praia Hotel",
    estrelas: "★★★★",
    imagem: "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=500&q=80",
    nota: 9.1,
    avaliacaoTexto: "Excelente",
    avaliacoesCount: "7.361",
    distancia: "100 m da praia",
    destaque: "35% menos que nos principais sites",
    recursos: "✓ Piscina externa aquecida e hidromassagem<br>✓ Centro completo de bem-estar",
    melhorOferta: {
      parceiro: "Nosso preço mais baixo",
      beneficios: ["✓ Cancelamento gratuito", "✓ Café da manhã incluído"],
      preco: 375.00,
      link: "https://www.booking.com"
    },
    outrasOfertas: [
      { parceiro: "Booking.com", preco: 574.00, link: "https://www.booking.com" },
      { parceiro: "Agoda", preco: 633.00, link: "https://www.agoda.com" }
    ]
  }
];

function formatarMoeda(valor) {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function renderizarHoteis(lista) {
  const container = document.getElementById('offersContainer');
  container.innerHTML = '';

  lista.forEach(hotel => {
    let outrasOfertasHTML = hotel.outrasOfertas.map(o => `
      <div class="other-deal-row">
        <span>${o.parceiro}</span>
        <span class="other-deal-price">${formatarMoeda(o.preco)}</span>
      </div>
    `).join('');

    let beneficiosHTML = hotel.melhorOferta.beneficios.map(b => `
      <div class="deal-benefit">${b}</div>
    `).join('');

    const html = `
      <div class="hotel-card">
        <div class="hotel-img-container">
          <img src="${hotel.imagem}" alt="${hotel.nome}" class="hotel-img">
          <span class="tag-popular">${hotel.destaque}</span>
        </div>
        
        <div class="hotel-details">
          <div>
            <h2 class="hotel-title">${hotel.nome} <span style="color: #F59E0B; font-size: 0.9rem;">${hotel.estrelas}</span></h2>
            <div class="rating-badge">
              <span class="score">${hotel.nota}</span>
              <span class="rating-text">${hotel.avaliacaoTexto}</span>
              <span style="color: #6B7280; font-size: 0.8rem;">(${hotel.avaliacoesCount})</span>
            </div>
            <p class="hotel-distance">📍 ${hotel.distancia}</p>
            <div class="hotel-features">${hotel.recursos}</div>
          </div>
        </div>

        <div class="hotel-pricing">
          <div class="best-deal-box">
            <div class="deal-partner-name">${hotel.melhorOferta.parceiro}</div>
            ${beneficiosHTML}
            <div class="deal-price">${formatarMoeda(hotel.melhorOferta.preco)}</div>
            <button onclick="redirecionar('${hotel.melhorOferta.link}')" class="btn-green-deal">
              Ver oferta ❯
            </button>
          </div>

          <div class="other-deals">
            ${outrasOfertasHTML}
          </div>
        </div>
      </div>
    `;
    container.innerHTML += html;
  });
}

function buscarHoteis() {
  const query = document.getElementById('searchInput').value.toLowerCase();
  const filtrados = hoteis.filter(h => h.nome.toLowerCase().includes(query) || h.distancia.toLowerCase().includes(query));
  renderizarHoteis(filtrados);
}

function redirecionar(link) {
  window.open(link, '_blank');
}

// Funções para Controle do Modal de Login (Não obrigatório para o comprador)
function abrirModalLogin() {
  document.getElementById('loginModal').style.display = 'flex';
}

function fecharModalLogin() {
  document.getElementById('loginModal').style.display = 'none';
}

function processarLogin(e) {
  e.preventDefault();
  const usuario = document.getElementById('loginUser').value;
  alert(`Bem-vindo de volta, ${usuario}!`);
  fecharModalLogin();
  document.getElementById('btnLoginHeader').innerText = `Olá, ${usuario}`;
}

document.addEventListener('DOMContentLoaded', () => {
  renderizarHoteis(hoteis);
});
