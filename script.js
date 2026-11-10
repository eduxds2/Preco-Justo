// Lista de ofertas/produtos (simulação de banco de dados)
const ofertas = [
  {
    id: 1,
    titulo: "Hotel & Resort Vista Mar",
    categoria: "Acomodação",
    localizacao: "Santo André, São Paulo • 500m do centro",
    avaliacao: 4.9,
    avaliacoesCount: 320,
    preco: 280.00,
    imagem: "https://via.placeholder.com/120",
    linkParceiro: "https://www.booking.com",
    cliques: 0
  },
  {
    id: 2,
    titulo: "Pousada Cantinho da Serra",
    categoria: "Acomodação",
    localizacao: "Serra da Mantiqueira, SP • 2km do centro",
    avaliacao: 4.7,
    avaliacoesCount: 145,
    preco: 190.00,
    imagem: "https://via.placeholder.com/120",
    linkParceiro: "https://www.booking.com",
    cliques: 0
  },
  {
    id: 3,
    titulo: "Smartphone Galaxy S23 256GB",
    categoria: "Produto",
    localizacao: "Frete Grátis para todo o Brasil",
    avaliacao: 4.8,
    avaliacoesCount: 890,
    preco: 3299.00,
    imagem: "https://via.placeholder.com/120",
    linkParceiro: "https://www.amazon.com.br",
    cliques: 0
  }
];

// Função para formatar valores em Reais (R$)
function formatarMoeda(valor) {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

// Função para renderizar os cards no HTML
function renderizarOfertas(lista) {
  const container = document.getElementById('offersContainer');
  container.innerHTML = '';

  if (lista.length === 0) {
    container.innerHTML = `<p style="text-align: center; color: #64748B; margin-top: 2rem;">Nenhuma oferta encontrada.</p>`;
    return;
  }

  lista.forEach(item => {
    const cardHTML = `
      <div class="card">
        <img src="${item.imagem}" alt="${item.titulo}" class="card-img">
        <div class="card-info">
          <span class="card-tag">${item.categoria}</span>
          <h2 class="card-title">${item.titulo}</h2>
          <p class="card-location">${item.localizacao}</p>
          <p style="font-size: 0.875rem; color: #EAB308;">★ ${item.avaliacao} <span style="color: #94A3B8;">(${item.avaliacoesCount} avaliações)</span></p>
        </div>
        <div class="card-action">
          <span class="price-label">A partir de</span>
          <span class="price-value">${formatarMoeda(item.preco)}</span>
          <button onclick="redirecionarComContagem(${item.id})" class="btn-redirect">
            Ver Oferta 🡭
          </button>
        </div>
      </div>
    `;
    container.innerHTML += cardHTML;
  });
}

// Função de Busca Instantânea
function buscarOfertas() {
  const query = document.getElementById('searchInput').value.toLowerCase();
  const ofertasFiltradas = ofertas.filter(item => 
    item.titulo.toLowerCase().includes(query) || 
    item.categoria.toLowerCase().includes(query) ||
    item.localizacao.toLowerCase().includes(query)
  );
  renderizarOfertas(ofertasFiltradas);
}

// Função para contabilizar o clique e abrir a loja parceira
function redirecionarComContagem(id) {
  const item = ofertas.find(o => o.id === id);
  if (item) {
    item.cliques += 1;
    console.log(`Clique contabilizado para: ${item.titulo}. Total de cliques: ${item.cliques}`);
    
    // Abre o link do parceiro numa nova aba
    window.open(item.linkParceiro, '_blank');
  }
}

// Renderiza a lista inicial quando a página carrega
document.addEventListener('DOMContentLoaded', () => {
  renderizarOfertas(ofertas);
  
  // Permite buscar ao pressionar Enter no campo de busca
  const input = document.getElementById('searchInput');
  if (input) {
    input.addEventListener('keyup', (e) => {
      if (e.key === 'Enter') buscarOfertas();
    });
  }
});
