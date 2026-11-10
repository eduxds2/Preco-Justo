// Ofertas simuladas de Hospedagem / Voos
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

// Dados simulados de Carros (Estilo CVC)
const carrosCVC = [
  {
    id: 1,
    modelo: "VW Gol ou similar",
    categoria: "Econômico com Ar",
    passageiros: 5,
    malas: 2,
    cambio: "Manual",
    precoDiaria: 67.00,
    imagem: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=500&q=80",
    linkParceiro: "https://www.rentcars.com"
  },
  {
    id: 2,
    modelo: "Hyundai HB20 ou similar",
    categoria: "Compacto Automático",
    passageiros: 5,
    malas: 3,
    cambio: "Automático",
    precoDiaria: 164.00,
    imagem: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=500&q=80",
    linkParceiro: "https://www.rentcars.com"
  },
  {
    id: 3,
    modelo: "Jeep Renegade ou similar",
    categoria: "SUV Intermediário",
    passageiros: 5,
    malas: 4,
    cambio: "Automático",
    precoDiaria: 216.00,
    imagem: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=500&q=80",
    linkParceiro: "https://www.rentcars.com"
  }
];

function formatarMoeda(valor) {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

// Controle do Tema (Light Mode / Dark Mode)
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

  const formGen = document.getElementById('formGenerico');
  const formCarros = document.getElementById('formCarros');
  const secCarros = document.getElementById('sectionCarrosCVC');
  const secGeral = document.getElementById('sectionGeral');

  if (categoria === 'carros') {
    formGen.style.display = 'none';
    formCarros.style.display = 'block';
    secCarros.style.display = 'block';
    secGeral.style.display = 'none';
    renderizarCarros(carrosCVC);
  } else {
    formGen.style.display = 'block';
    formCarros.style.display = 'none';
    secCarros.style.display = 'none';
    secGeral.style.display = 'block';
    
    const title = document.getElementById('searchCardTitle');
    if (title) {
      title.innerText = categoria === 'voos' ? 'Para onde você quer ir?' : `Pesquisar ${categoria}`;
    }
  }
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

function renderizarCarros(lista) {
  const container = document.getElementById('carsContainer');
  if (!container) return;

  container.innerHTML = '';
  lista.forEach(car => {
    container.innerHTML += `
      <div class="car-card">
        <img src="${car.imagem}" alt="${car.modelo}">
        <div class="car-body">
          <span style="font-size:0.75rem; font-weight:700; color:#2563EB;">${car.categoria}</span>
          <h3 style="font-size:1.1rem; font-weight:700; margin-top:2px;">${car.modelo}</h3>
          <div class="car-specs">
            <span>👤 ${car.passageiros} pessoas</span>
            <span>🧳 ${car.malas} malas</span>
            <span>⚙️ ${car.cambio}</span>
          </div>
          <div style="margin-top: 10px;">
            <span style="font-size:0.75rem; color:#64748B;">Diária a partir de</span>
            <div style="font-size:1.3rem; font-weight:800; color:#16A34A;">${formatarMoeda(car.precoDiaria)}</div>
          </div>
          <button onclick="window.open('${car.linkParceiro}', '_blank')" class="btn-submit-search" style="width:100%; margin-top:10px; background-color:#16A34A;">Alugar Carro ❯</button>
        </div>
      </div>
    `;
  });
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
    renderizarOfertas(ofertasGerais);
    return;
  }

  const filtrados = ofertasGerais.filter(o => 
    o.titulo.toLowerCase().includes(termo) || 
    o.localizacao.toLowerCase().includes(termo)
  );
  renderizarOfertas(filtrados);
}

function buscarCarros() {
  const local = document.getElementById('carLocal')?.value.toLowerCase();
  if (!local) {
    renderizarCarros(carrosCVC);
    return;
  }
  renderizarCarros(carrosCVC);
}

document.addEventListener('DOMContentLoaded', () => {
  renderizarOfertas(ofertasGerais);
});
