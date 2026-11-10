// Catálogo completo com todos os dados
const catalogoCompleto = {
  hospedagem: [
    {
      titulo: "Hotel & Resort Vista Mar",
      localizacao: "Santo André, SP • 500m do centro",
      nota: 4.9,
      preco: 280.00,
      imagem: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=500&q=80",
      link: "https://www.booking.com"
    },
    {
      titulo: "Pousada Cantinho da Serra",
      localizacao: "Serra da Mantiqueira, SP",
      nota: 4.7,
      preco: 190.00,
      imagem: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=500&q=80",
      link: "https://www.booking.com"
    },
    {
      titulo: "Salinas Maceió All Inclusive Resort",
      localizacao: "Maceió, AL • Beira-mar",
      nota: 4.9,
      preco: 1050.00,
      imagem: "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=500&q=80",
      link: "https://www.booking.com"
    }
  ],
  voos: [
    {
      titulo: "Voo São Paulo (GRU) ➔ Porto Seguro (BPS)",
      localizacao: "Ida e Volta • Direto",
      nota: 4.9,
      preco: 450.00,
      imagem: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=500&q=80",
      link: "https://www.latamairlines.com"
    },
    {
      titulo: "Voo Rio de Janeiro (GIG) ➔ Salvador (SSA)",
      localizacao: "Somente Ida • Voo Noturno",
      nota: 4.7,
      preco: 310.00,
      imagem: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=500&q=80",
      link: "https://www.voegol.com.br"
    },
    {
      titulo: "Voo São Paulo (CGH) ➔ Recife (REC)",
      localizacao: "Ida e Volta • Classe Econômica",
      nota: 4.8,
      preco: 590.00,
      imagem: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=500&q=80",
      link: "https://www.voeazul.com.br"
    }
  ],
  carros: [
    {
      titulo: "VW Gol 1.0 ou Similar",
      categoria: "Econômico com Ar",
      localizacao: "Retirada em Guarulhos",
      preco: 79.00,
      imagem: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=500&q=80",
      link: "https://www.rentcars.com"
    },
    {
      titulo: "Hyundai HB20 Automático",
      categoria: "Compacto Automático",
      localizacao: "Retirada em Congonhas",
      preco: 149.00,
      imagem: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=500&q=80",
      link: "https://www.rentcars.com"
    },
    {
      titulo: "Jeep Renegade SUV",
      categoria: "SUV Intermediário",
      localizacao: "Retirada em Porto Seguro",
      preco: 216.00,
      imagem: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=500&q=80",
      link: "https://www.rentcars.com"
    }
  ],
  seguros: [
    {
      titulo: "Seguro Viagem - Brasil",
      localizacao: "Cobertura Médica R$ 50.000",
      preco: 35.00,
      imagem: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=500&q=80",
      link: "https://www.cvc.com.br"
    },
    {
      titulo: "Seguro Viagem - América Latina",
      localizacao: "Cobertura Médica USD 30.000",
      preco: 90.00,
      imagem: "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&w=500&q=80",
      link: "https://www.cvc.com.br"
    },
    {
      titulo: "Seguro Viagem - Europa (Schengen)",
      localizacao: "Cobertura Médica EUR 30.000",
      preco: 120.00,
      imagem: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=500&q=80",
      link: "https://www.cvc.com.br"
    }
  ]
};

let hospedes = { adultos: 2, criancas: 0, quartos: 1 };

function formatarMoeda(valor) {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

// Preenche todas as seções simultaneamente para criar um catálogo extenso
function renderizarTodoOCatalogo() {
  renderizarGrid('hospedagemGrid', catalogoCompleto.hospedagem);
  renderizarGrid('voosGrid', catalogoCompleto.voos);
  renderizarGridCarros('carrosGrid', catalogoCompleto.carros);
  renderizarGrid('segurosGrid', catalogoCompleto.seguros);
}

function renderizarGrid(elementId, lista) {
  const container = document.getElementById(elementId);
  if (!container) return;

  container.innerHTML = '';
  lista.forEach(item => {
    container.innerHTML += `
      <div class="content-card">
        <img src="${item.imagem}" alt="${item.titulo}">
        <div class="card-body">
          <h3 class="card-title">${item.titulo}</h3>
          <p class="card-subtitle">${item.localizacao}</p>
          ${item.nota ? `<p style="font-size:0.75rem; color:#F59E0B; font-weight:bold;">★ ${item.nota}</p>` : ''}
          <div class="price-box">
            <span class="price-label">A partir de</span>
            <div class="price-amount">${formatarMoeda(item.preco)}</div>
          </div>
          <button onclick="window.open('${item.link}', '_blank')" class="btn-card-action">Ver Oferta ❯</button>
        </div>
      </div>
    `;
  });
}

function renderizarGridCarros(elementId, lista) {
  const container = document.getElementById(elementId);
  if (!container) return;

  container.innerHTML = '';
  lista.forEach(item => {
    container.innerHTML += `
      <div class="content-card">
        <img src="${item.imagem}" alt="${item.titulo}">
        <div class="card-body">
          <span style="font-size:0.75rem; color:#22C55E; font-weight:700;">${item.categoria}</span>
          <h3 class="card-title">${item.titulo}</h3>
          <p class="card-subtitle">${item.localizacao}</p>
          <div class="car-icons-row">
            <span>👤 5 lugares</span> <span>🧳 2 malas</span>
          </div>
          <div class="price-box">
            <span class="price-label">Diária a partir de</span>
            <div class="price-amount">${formatarMoeda(item.preco)}</div>
          </div>
          <button onclick="window.open('${item.link}', '_blank')" class="btn-card-action">Alugar Carro ❯</button>
        </div>
      </div>
    `;
  });
}

// Trocar de aba ajusta os inputs e navega até a seção
function trocarAba(categoria, elemento) {
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  if (elemento) elemento.classList.add('active');

  const formGeral = document.getElementById('formGeral');
  const formHospedagem = document.getElementById('formHospedagem');

  const title = document.getElementById('searchCardTitle');
  const tripOptions = document.getElementById('tripOptions');
  const labelOrigem = document.getElementById('labelOrigem');
  const labelDestino = document.getElementById('labelDestino');
  const inputOrigem = document.getElementById('inputOrigem');
  const inputDestino = document.getElementById('inputDestino');

  if (categoria === 'hospedagem') {
    formGeral.style.display = 'none';
    formHospedagem.style.display = 'block';
    scrollerPara('sec-hospedagem');
  } else {
    formGeral.style.display = 'block';
    formHospedagem.style.display = 'none';

    if (categoria === 'carros') {
      if (title) title.innerText = "Pesquisar carros";
      if (tripOptions) tripOptions.style.display = "none";
      if (labelOrigem) labelOrigem.innerText = "LOCAL DE RETIRADA";
      if (inputOrigem) inputOrigem.placeholder = "Cidade ou Aeroporto";
      if (labelDestino) labelDestino.innerText = "LOCAL DE DEVOLUÇÃO";
      if (inputDestino) inputDestino.placeholder = "Mesmo local de retirada";
      scrollerPara('sec-carros');
    } else if (categoria === 'seguros') {
      if (title) title.innerText = "Pesquisar seguros";
      if (tripOptions) tripOptions.style.display = "none";
      if (labelOrigem) labelOrigem.innerText = "DESTINO";
      if (inputOrigem) inputOrigem.placeholder = "Ex: Brasil, Europa, EUA";
      if (labelDestino) labelDestino.innerText = "PASSAGEIROS";
      if (inputDestino) inputDestino.placeholder = "1 viajante";
      scrollerPara('sec-seguros');
    } else if (categoria === 'voos') {
      if (title) title.innerText = "Pesquisar voos";
      if (tripOptions) tripOptions.style.display = "flex";
      if (labelOrigem) labelOrigem.innerText = "DE";
      if (inputOrigem) inputOrigem.placeholder = "Insira uma origem";
      if (labelDestino) labelDestino.innerText = "PARA";
      if (inputDestino) inputDestino.placeholder = "Insira um destino";
      scrollerPara('sec-voos');
    } else {
      if (title) title.innerText = "Pesquisar viagens";
      if (tripOptions) tripOptions.style.display = "flex";
      if (labelOrigem) labelOrigem.innerText = "DE";
      if (inputOrigem) inputOrigem.placeholder = "Insira uma origem";
      if (labelDestino) labelDestino.innerText = "PARA";
      if (inputDestino) inputDestino.placeholder = "Insira um destino";
    }
  }
}

function scrollerPara(id) {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' });
  }
}

// Modal de Hóspedes
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
  }
}

function toggleTheme() {
  const body = document.body;
  const btn = document.getElementById('btnThemeToggle');
  if (body.classList.contains('light-mode')) {
    body.classList.remove('light-mode');
    body.classList.add('dark-mode');
    if (btn) btn.innerText = '☀️ Modo Claro';
  } else {
    body.classList.remove('dark-mode');
    body.classList.add('light-mode');
    if (btn) btn.innerText = '🌙 Modo Escuro';
  }
}

function realizarPesquisa() {
  scrollerPara('sec-hospedagem');
}

document.addEventListener('DOMContentLoaded', () => {
  renderizarTodoOCatalogo();
});
