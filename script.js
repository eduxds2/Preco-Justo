// Ofertas simuladas gerais
const ofertasGerais = [
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
    titulo: "Voo São Paulo ➔ Porto Seguro",
    localizacao: "Ida e Volta • Classe Econômica",
    nota: 4.8,
    preco: 450.00,
    imagem: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=500&q=80",
    linkParceiro: "https://www.latamairlines.com"
  }
];

const segurosViagem = [
  {
    id: 1,
    titulo: "Seguro Viagem América Latina",
    cobertura: "USD 30.000 Despesas Médicas",
    preco: 94.00,
    imagem: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=500&q=80",
    linkParceiro: "https://www.cvc.com.br"
  },
  {
    id: 2,
    titulo: "Seguro Europa Tratado de Schengen",
    cobertura: "EUR 30.000 Despesas Médicas",
    preco: 166.00,
    imagem: "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&w=500&q=80",
    linkParceiro: "https://www.cvc.com.br"
  }
];

// Ocupação do Hotel
let contadores = { adultos: 2, criancas: 0, quartos: 1 };

function alterarContador(tipo, delta) {
  if (contadores[tipo] + delta >= 0) {
    if (tipo === 'adultos' && contadores[tipo] + delta < 1) return;
    if (tipo === 'quartos' && contadores[tipo] + delta < 1) return;
    
    contadores[tipo] += delta;
    document.getElementById(`cnt${tipo.charAt(0).toUpperCase() + tipo.slice(1)}`).innerText = contadores[tipo];
    
    document.getElementById('stayOcupacaoInput').value = 
      `${contadores.adultos} adultos · ${contadores.criancas} crianças · ${contadores.quartos} quarto(s)`;
  }
}

function togglePopover(id) {
  const pop = document.getElementById(id);
  if (pop) {
    pop.style.display = pop.style.display === 'none' ? 'block' : 'none';
  }
}

function toggleTheme() {
  const body = document.body;
  const btn = document.getElementById('btnThemeToggle');

  if (body.classList.contains('light-mode')) {
    body.classList.remove('light-mode');
    body.classList.add('dark-mode');
    btn.innerText = '☀️';
  } else {
    body.classList.remove('dark-mode');
    body.classList.add('light-mode');
    btn.innerText = '🌙';
  }
}

// Troca de Abas
function trocarAba(categoria, elemento) {
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  if (elemento) elemento.classList.add('active');

  const fVoos = document.getElementById('formVoos');
  const fHosp = document.getElementById('formHospedagem');
  const fSeguros = document.getElementById('formSeguros');
  const fCarros = document.getElementById('formCarros');
  
  const secSeguros = document.getElementById('sectionSeguros');
  const secGeral = document.getElementById('sectionGeral');

  // Ocultar todos os formulários
  fVoos.style.display = 'none';
  fHosp.style.display = 'none';
  fSeguros.style.display = 'none';
  fCarros.style.display = 'none';
  secSeguros.style.display = 'none';
  secGeral.style.display = 'block';

  if (categoria === 'hospedagem') {
    fHosp.style.display = 'block';
  } else if (categoria === 'seguros') {
    fSeguros.style.display = 'block';
    secSeguros.style.display = 'block';
    secGeral.style.display = 'none';
    renderizarSeguros(segurosViagem);
  } else if (categoria === 'carros') {
    fCarros.style.display = 'block';
  } else {
    fVoos.style.display = 'block';
  }
}

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
          <p style="font-size:0.82rem; color:#64748B;">${item.localizacao}</p>
          <div style="margin-top: 10px;">
            <span style="font-size:0.75rem; color:#64748B;">A partir de</span>
            <div style="font-size:1.3rem; font-weight:800; color:#2563EB;">${formatarMoeda(item.preco)}</div>
          </div>
          <button onclick="window.open('${item.linkParceiro}', '_blank')" class="btn-submit-search" style="width:100%; margin-top:8px;">Ver Oferta ❯</button>
        </div>
      </div>
    `;
  });
}

function renderizarSeguros(lista) {
  const container = document.getElementById('segurosContainer');
  if (!container) return;

  container.innerHTML = '';
  lista.forEach(item => {
    container.innerHTML += `
      <div class="offer-card">
        <img src="${item.imagem}" alt="${item.titulo}">
        <div class="offer-body">
          <h3 style="font-size:1.05rem; font-weight:700;">${item.titulo}</h3>
          <p style="font-size:0.82rem; color:#16A34A; font-weight:bold;">${item.cobertura}</p>
          <div style="margin-top: 10px;">
            <span style="font-size:0.75rem; color:#64748B;">A partir de</span>
            <div style="font-size:1.3rem; font-weight:800; color:#2563EB;">${formatarMoeda(item.preco)}</div>
          </div>
          <button onclick="window.open('${item.linkParceiro}', '_blank')" class="btn-submit-search" style="width:100%; margin-top:8px;">Cotar Seguro ❯</button>
        </div>
      </div>
    `;
  });
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

function buscarVoos() { renderizarOfertas(ofertasGerais); }
function buscarHospedagens() { renderizarOfertas(ofertasGerais); }
function buscarSeguros() { renderizarSeguros(segurosViagem); }
function buscarCarros() { renderizarOfertas(ofertasGerais); }

document.addEventListener('DOMContentLoaded', () => {
  renderizarOfertas(ofertasGerais);
});
