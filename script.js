const hoteis = [
  {
    id: 1,
    nome: "Kûara Hotel",
    estrelas: 5,
    cidade: "Porto Seguro",
    imagem: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=500&q=80",
    nota: 9.4,
    avaliacaoTexto: "Excelente",
    avaliacoesCount: "2.161",
    distancia: "5,5 km até Centro",
    destaque: "Opção popular",
    recursos: "✓ Acesso privativo à praia<br>✓ Tratamentos de bem-estar no Spa",
    cancelamentoGratuito: true,
    temPiscina: true,
    temCafe: true,
    melhorOferta: {
      parceiro: "Quero Passagem",
      beneficios: ["✓ Cancelamento gratuito", "✓ Café da manhã incluído"],
      preco: 2162.00,
      link: "https://www.booking.com"
    },
    outrasOfertas: [
      { parceiro: "Outrip", preco: 2126.00 },
      { parceiro: "Prestigia", preco: 2757.00 }
    ]
  },
  {
    id: 2,
    nome: "Nauticomar All Inclusive Hotel",
    estrelas: 4,
    cidade: "Porto Seguro",
    imagem: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=500&q=80",
    nota: 8.3,
    avaliacaoTexto: "Muito boa",
    avaliacoesCount: "10.460",
    distancia: "6,8 km até Centro",
    destaque: "Opção popular",
    recursos: "✓ Acesso exclusivo ao Paradiso Beach Club<br>✓ Caminhada curta até a Praia",
    cancelamentoGratuito: true,
    temPiscina: true,
    temCafe: true,
    melhorOferta: {
      parceiro: "Quero Passagem",
      beneficios: ["✓ Cancelamento gratuito", "✓ All Inclusive"],
      preco: 1812.00,
      link: "https://www.booking.com"
    },
    outrasOfertas: [
      { parceiro: "Outrip", preco: 1191.00 },
      { parceiro: "Expedia", preco: 1894.00 }
    ]
  },
  {
    id: 3,
    nome: "Best Western Shalimar Praia Hotel",
    estrelas: 4,
    cidade: "Porto Seguro",
    imagem: "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=500&q=80",
    nota: 9.1,
    avaliacaoTexto: "Excelente",
    avaliacoesCount: "7.361",
    distancia: "100 m da praia",
    destaque: "35% menos que nos principais sites",
    recursos: "✓ Piscina externa aquecida e hidromassagem<br>✓ Centro completo de bem-estar",
    cancelamentoGratuito: true,
    temPiscina: true,
    temCafe: true,
    melhorOferta: {
      parceiro: "Nosso preço mais baixo",
      beneficios: ["✓ Cancelamento gratuito", "✓ Café da manhã incluído"],
      preco: 375.00,
      link: "https://www.booking.com"
    },
    outrasOfertas: [
      { parceiro: "Booking.com", preco: 574.00 },
      { parceiro: "Agoda", preco: 633.00 }
    ]
  }
];

function formatarMoeda(valor) {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function renderizarHoteis(lista) {
  const container = document.getElementById('offersContainer');
  container.innerHTML = '';

  if (lista.length === 0) {
    container.innerHTML = `<p style="text-align: center; color: #64748B; padding: 2rem;">Nenhum hotel encontrado para estes filtros.</p>`;
    return;
  }

  lista.forEach(hotel => {
    let outrasOfertasHTML = hotel.outrasOfertas.map(o => `
      <div class="other-deal-row">
        <span>${o.parceiro}</span>
        <strong>${formatarMoeda(o.preco)}</strong>
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
          <h2 class="hotel-title">${hotel.nome} <span style="color: #F59E0B; font-size: 0.85rem;">${'★'.repeat(hotel.estrelas)}</span></h2>
          <div class="rating-badge">
            <span class="score">${hotel.nota}</span>
            <span class="rating-text">${hotel.avaliacaoTexto}</span>
            <span style="color: #64748B; font-size: 0.78rem;">(${hotel.avaliacoesCount})</span>
          </div>
          <p class="hotel-distance">📍 ${hotel.distancia}</p>
          <div class="hotel-features">${hotel.recursos}</div>
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
  const filtrados = hoteis.filter(h => 
    h.nome.toLowerCase().includes(query) || 
    h.cidade.toLowerCase().includes(query)
  );
  renderizarHoteis(filtrados);
}

function pesquisarCidade(nomeCidade) {
  document.getElementById('searchInput').value = nomeCidade;
  buscarHoteis();
  window.scrollTo({ top: 300, behavior: 'smooth' });
}

function aplicarFiltrosSidebar() {
  const cancelamento = document.getElementById('chkCancelamento').checked;
  const pMin = parseFloat(document.getElementById('priceMin').value) || 0;
  const pMax = parseFloat(document.getElementById('priceMax').value) || 99999;

  const filtrados = hoteis.filter(h => {
    const atendeCancelamento = !cancelamento || h.cancelamentoGratuito;
    const atendePreco = h.melhorOferta.preco >= pMin && h.melhorOferta.preco <= pMax;
    return atendeCancelamento && atendePreco;
  });

  renderizarHoteis(filtrados);
}

function filtrarPorPill(tipo) {
  document.querySelectorAll('.filter-pill').forEach(btn => btn.classList.remove('active'));
  event.target.classList.add('active');

  if (tipo === 'todos') {
    renderizarHoteis(hoteis);
  } else if (tipo === 'cancelamento') {
    renderizarHoteis(hoteis.filter(h => h.cancelamentoGratuito));
  } else if (tipo === 'piscina') {
    renderizarHoteis(hoteis.filter(h => h.temPiscina));
  } else if (tipo === 'cafe') {
    renderizarHoteis(hoteis.filter(h => h.temCafe));
  } else {
    renderizarHoteis(hoteis);
  }
}

function redirecionar(link) {
  window.open(link, '_blank');
}

document.addEventListener('DOMContentLoaded', () => {
  renderizarHoteis(hoteis);
});
