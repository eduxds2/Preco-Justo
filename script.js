const bancoDados = {
  monte: [
    { titulo: "Pacote Nordeste Completo", sub: "Aéreo + Hotel (7 Dias) • Salvador", preco: 1890, descTag: "Mais Vendido", img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=500&q=80" },
    { titulo: "Experiência Rio de Janeiro", sub: "Aéreo + Hotel (4 Dias) • Copacabana", preco: 1250, descTag: "Imperdível", img: "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&w=500&q=80" },
    { titulo: "Foz do Iguaçu em Família", sub: "Aéreo + Hotel (5 Dias)", preco: 1420, nota: "★ 4.8", img: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=500&q=80" }
  ],
  voos: [
    { titulo: "Voo São Paulo (GRU) ➔ Porto Seguro (BPS)", sub: "Ida e Volta • Direto • Por LATAM", preco: 450, img: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=500&q=80" },
    { titulo: "Voo Rio de Janeiro (GIG) ➔ Salvador (SSA)", sub: "Somente Ida • Voo Noturno • Por GOL", preco: 310, img: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=500&q=80" },
    { titulo: "Voo São Paulo (CGH) ➔ Recife (REC)", sub: "Ida e Volta • Econômica • Por Azul", preco: 590, img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=500&q=80" }
  ],
  pacotes: [
    { titulo: "Pacote Natal + Pipa", sub: "Aéreo Ida e Volta + 5 Noites de Hospedagem", preco: 1680, descTag: "-30%", img: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=500&q=80" },
    { titulo: "Pacote Maceió Promocional", sub: "Aéreo + Resort All Inclusive", preco: 2450, descTag: "Exclusivo", img: "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=500&q=80" }
  ],
  carros: [
    { titulo: "Volkswagen Golf GTI", sub: "Esportivo Turbo • 230 CV", preco: 380, cap: "👤 5  🧳 3  🚪 4", img: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=500&q=80" },
    { titulo: "Chevrolet Camaro ZL1", sub: "Esportivo V8 • 650 CV", preco: 890, cap: "👤 4  🧳 2  🚪 2", img: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=500&q=80" },
    { titulo: "Jeep Renegade SUV", sub: "SUV Automático", preco: 216, cap: "👤 5  🧳 3  🚪 4", img: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=500&q=80" }
  ],
  frota: [
    { titulo: "Grupo GI - SUV Compacto Especial", desc: "Nissan Kicks 1.6, GM Tracker ou similar", img: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=500&q=80" },
    { titulo: "Grupo GX - SUV Automático", desc: "VW T-Cross 1.0 Turbo, Hyundai Creta", img: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=500&q=80" }
  ],
  hospedagem: [
    { titulo: "Natal Praia Hotel", sub: "A 958m do centro • Natal", preco: 156, descTag: "-56%", nota: "★ 8.0", img: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=500&q=80" },
    { titulo: "D Beach Resort", sub: "A 11km do centro • Natal", preco: 469, nota: "★ 8.5", img: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=500&q=80" },
    { titulo: "Salinas Maceió All Inclusive Resort", sub: "A 20km do centro • Maceió", preco: 2052, nota: "★ 9.4", img: "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=500&q=80" }
  ],
  campos: [
    { titulo: "Pousada Campos De Provence", preco: 297, descTag: "-8%", img: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=500&q=80" },
    { titulo: "Pousada Grandchamp", preco: 316, img: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=500&q=80" }
  ],
  seguros: [
    { titulo: "Seguro Viagem - Brasil", sub: "Cobertura Médica Nacional R$ 40.000", preco: 35, img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=500&q=80" },
    { titulo: "Seguro Viagem - América Latina", sub: "Cobertura Médica USD 30.000", preco: 90, img: "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&w=500&q=80" },
    { titulo: "Seguro Viagem - Europa", sub: "Cobertura Médica EUR 30.000 (Tratado Schengen)", preco: 120, img: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=500&q=80" }
  ]
};

let hospedes = { adultos: 2, criancas: 0, quartos: 1 };

function formatarMoeda(v) {
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function trocarAba(categoria, elemento) {
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  if (elemento) elemento.classList.add('active');

  const formGeral = document.getElementById('formGeral');
  const formHospedagem = document.getElementById('formHospedagem');

  document.querySelectorAll('.tab-content').forEach(c => c.style.display = 'none');

  if (categoria === 'hospedagem') {
    formGeral.style.display = 'none';
    formHospedagem.style.display = 'block';
    document.getElementById('viewHospedagem').style.display = 'block';
    renderHospedagem();
  } else if (categoria === 'carros') {
    formGeral.style.display = 'block';
    formHospedagem.style.display = 'none';
    configurarInputs('Pesquisar carros', false, 'LOCAL DE RETIRADA', 'Cidade ou Aeroporto', 'LOCAL DE DEVOLUÇÃO', 'Mesmo local');
    document.getElementById('viewCarros').style.display = 'block';
    renderCarros();
  } else if (categoria === 'seguros') {
    formGeral.style.display = 'block';
    formHospedagem.style.display = 'none';
    configurarInputs('Pesquisar seguros', false, 'DESTINO', 'Ex: Brasil, Europa', 'PASSAGEIROS', '1 viajante');
    document.getElementById('viewSeguros').style.display = 'block';
    renderSeguros();
  } else if (categoria === 'pacotes') {
    formGeral.style.display = 'block';
    formHospedagem.style.display = 'none';
    configurarInputs('Pesquisar pacotes', true, 'DE', 'Insira uma origem', 'PARA', 'Insira um destino');
    document.getElementById('viewVoos').style.display = 'block';
    atualizarTitulosSecao("Pacotes Promocionais Exclusivos", "Garanta voo + hotel com preços imperdíveis");
    renderPacotes();
  } else if (categoria === 'voos') {
    formGeral.style.display = 'block';
    formHospedagem.style.display = 'none';
    configurarInputs('Pesquisar voos', true, 'DE', 'Insira uma origem', 'PARA', 'Insira um destino');
    document.getElementById('viewVoos').style.display = 'block';
    atualizarTitulosSecao("Passagens Aéreas Nacionais e Internacionais", "As melhores rotas com as principais companhias");
    renderVoos();
  } else {
    formGeral.style.display = 'block';
    formHospedagem.style.display = 'none';
    configurarInputs('Monte sua viagem', true, 'DE', 'Insira uma origem', 'PARA', 'Insira um destino');
    document.getElementById('viewVoos').style.display = 'block';
    atualizarTitulosSecao("Monte sua Viagem Personalizada", "Combine voos, estadias e aproveite o melhor roteiro");
    renderMonte();
  }
}

function atualizarTitulosSecao(titulo, sub) {
  const t = document.getElementById('secVoosTitle');
  const s = document.getElementById('secVoosSub');
  if (t) t.innerText = titulo;
  if (s) s.innerText = sub;
}

function configurarInputs(title, showOptions, lOrig, pOrig, lDest, pDest) {
  document.getElementById('searchCardTitle').innerText = title;
  document.getElementById('tripOptions').style.display = showOptions ? 'flex' : 'none';
  document.getElementById('labelOrigem').innerText = lOrig;
  document.getElementById('inputOrigem').placeholder = pOrig;
  document.getElementById('labelDestino').innerText = lDest;
  document.getElementById('inputDestino').placeholder = pDest;
}

function renderMonte() {
  const vGrid = document.getElementById('voosGrid');
  vGrid.innerHTML = '';
  bancoDados.monte.forEach(i => {
    vGrid.innerHTML += `
      <div class="content-card">
        <img src="${i.img}" alt="${i.titulo}">
        <div class="card-body">
          <span style="font-size:0.7rem; color:#22C55E; font-weight:700;">PACOTE COMPLETO</span>
          <h3 class="card-title">${i.titulo}</h3>
          <p class="card-subtitle">${i.sub}</p>
          <div class="price-box">
            <span class="price-label">Preço por pessoa a partir de</span>
            <div class="price-amount">${formatarMoeda(i.preco)}</div>
          </div>
        </div>
      </div>
    `;
  });
}

function renderVoos() {
  const vGrid = document.getElementById('voosGrid');
  vGrid.innerHTML = '';
  bancoDados.voos.forEach(i => {
    vGrid.innerHTML += `
      <div class="content-card">
        <img src="${i.img}" alt="${i.titulo}">
        <div class="card-body">
          <span style="font-size:0.7rem; color:#22C55E; font-weight:700;">PASSAGEM AÉREA</span>
          <h3 class="card-title">${i.titulo}</h3>
          <p class="card-subtitle">${i.sub}</p>
          <div class="price-box">
            <span class="price-label">Tarifa de ida e volta</span>
            <div class="price-amount">${formatarMoeda(i.preco)}</div>
          </div>
        </div>
      </div>
    `;
  });
}

function renderPacotes() {
  const vGrid = document.getElementById('voosGrid');
  vGrid.innerHTML = '';
  bancoDados.pacotes.forEach(i => {
    vGrid.innerHTML += `
      <div class="content-card">
        <img src="${i.img}" alt="${i.titulo}">
        <div class="card-body">
          <span style="font-size:0.7rem; color:#22C55E; font-weight:700;">PACOTE PROMOCIONAL</span>
          <h3 class="card-title">${i.titulo}</h3>
          <p class="card-subtitle">${i.sub}</p>
          <div class="price-box">
            <span class="price-label">A partir de</span>
            <div class="price-amount">${formatarMoeda(i.preco)}</div>
          </div>
        </div>
      </div>
    `;
  });
}

function renderCarros() {
  const cGrid = document.getElementById('carrosGrid');
  cGrid.innerHTML = '';
  bancoDados.carros.forEach(i => {
    cGrid.innerHTML += `
      <div class="content-card">
        <img src="${i.img}" alt="${i.titulo}">
        <div class="card-body">
          <span style="font-size:0.7rem; color:#22C55E; font-weight:700;">CARRO EXCLUSIVO</span>
          <h3 class="card-title">${i.titulo}</h3>
          <p class="card-subtitle">${i.sub}</p>
          <div class="car-icons-row" style="font-size:0.8rem; color:#9CA3AF; margin:8px 0;"><span>${i.cap}</span></div>
          <div class="price-box">
            <span class="price-label">Diárias a partir de</span>
            <div class="price-amount">${formatarMoeda(i.preco)}</div>
          </div>
          <div class="remessa-tag">Taxa de remessa: <strong>Isento</strong></div>
        </div>
      </div>
    `;
  });

  const fGrid = document.getElementById('frotaGrid');
  fGrid.innerHTML = '';
  bancoDados.frota.forEach(i => {
    fGrid.innerHTML += `
      <div class="content-card">
        <img src="${i.img}" alt="${i.titulo}">
        <div class="card-body">
          <h3 class="card-title">${i.titulo}</h3>
          <p class="card-subtitle">${i.desc}</p>
        </div>
      </div>
    `;
  });
}

function renderHospedagem() {
  const hGrid = document.getElementById('hospedagemGrid');
  hGrid.innerHTML = '';
  bancoDados.hospedagem.forEach(i => {
    hGrid.innerHTML += `
      <div class="content-card">
        <img src="${i.img}" alt="${i.titulo}">
        <div class="card-body">
          <span class="card-subtitle">HOSPEDAGENS</span>
          <h3 class="card-title">${i.titulo}</h3>
          <p class="card-subtitle">${i.sub}</p>
          <p style="font-size:0.8rem; color:#22C55E; font-weight:bold;">${i.nota}</p>
          <div class="price-box">
            <span class="price-label">1 noite, 2 pessoas a partir de</span>
            <div class="price-amount">${formatarMoeda(i.preco)} ${i.descTag ? `<span style="background:#059669; color:white; padding:2px 6px; border-radius:4px; font-size:0.7rem;">${i.descTag}</span>` : ''}</div>
          </div>
        </div>
      </div>
    `;
  });

  const cGrid = document.getElementById('camposGrid');
  cGrid.innerHTML = '';
  bancoDados.campos.forEach(i => {
    cGrid.innerHTML += `
      <div class="content-card">
        <img src="${i.img}" alt="${i.titulo}">
        <div class="card-body">
          <h3 class="card-title">${i.titulo}</h3>
          <div class="price-amount">${formatarMoeda(i.preco)} ${i.descTag ? `<span style="background:#059669; color:white; padding:2px 6px; border-radius:4px; font-size:0.7rem;">${i.descTag}</span>` : ''}</div>
        </div>
      </div>
    `;
  });
}

function renderSeguros() {
  const sGrid = document.getElementById('segurosGrid');
  sGrid.innerHTML = '';
  bancoDados.seguros.forEach(i => {
    sGrid.innerHTML += `
      <div class="content-card">
        <img src="${i.img}" alt="${i.titulo}">
        <div class="card-body">
          <span style="font-size:0.7rem; color:#22C55E; font-weight:700;">ASSISTÊNCIA MÉDICA</span>
          <h3 class="card-title">${i.titulo}</h3>
          <p class="card-subtitle">${i.sub}</p>
          <div class="price-box">
            <span class="price-label">Preço por pessoa de</span>
            <div class="price-amount">${formatarMoeda(i.preco)}</div>
          </div>
        </div>
      </div>
    `;
  });
}

function toggleModalHospedes() {
  const modal = document.getElementById('guestModal');
  if (modal) modal.style.display = modal.style.display === 'none' ? 'block' : 'none';
}

function alterarHospedes(tipo, delta) {
  if (hospedes[tipo] + delta >= 0) {
    if (tipo === 'adultos' && hospedes[tipo] + delta < 1) return;
    if (tipo === 'quartos' && hospedes[tipo] + delta < 1) return;

    hospedes[tipo] += delta;
    document.getElementById(`cnt${tipo.charAt(0).toUpperCase() + tipo.slice(1)}`).innerText = hospedes[tipo];
    const totalPessoas = hospedes.adultos + hospedes.criancas;
    document.getElementById('stayOcupacaoInput').value = `${totalPessoas} hóspedes, ${hospedes.quartos} quarto(s)`;
  }
}

function redefinirHospedes() {
  hospedes = { adultos: 2, criancas: 0, quartos: 1 };
  document.getElementById('cntAdultos').innerText = 2;
  document.getElementById('cntCriancas').innerText = 0;
  document.getElementById('cntQuartos').innerText = 1;
  document.getElementById('stayOcupacaoInput').value = "2 hóspedes, 1 quarto";
}

function confirmarHospedes() {
  document.getElementById('guestModal').style.display = 'none';
}

function selecionarTipoViagem(tipo) {
  const p1 = document.getElementById('pillIdaVolta');
  const p2 = document.getElementById('pillSomenteIda');
  if (tipo === 'ida-volta') {
    p1.classList.add('active');
    p2.classList.remove('active');
  } else {
    p2.classList.add('active');
    p1.classList.remove('active');
  }
}

function inverterDestinos() {
  const orig = document.getElementById('inputOrigem');
  const dest = document.getElementById('inputDestino');
  if (orig && dest) {
    const temp = orig.value;
    orig.value = dest.value;
    dest.value = temp;

    const btnSwap = document.getElementById('btnSwap');
    if (btnSwap) {
      btnSwap.style.transform = "scale(1.2) rotate(180deg)";
      setTimeout(() => {
        btnSwap.style.transform = "scale(1) rotate(0deg)";
      }, 200);
    }
  }
}

function realizarPesquisa() {}

document.addEventListener('DOMContentLoaded', () => {
  trocarAba('monte');
});
