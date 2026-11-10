// Base de Dados com ofertas por categoria
const bancoDeDados = {
  monte: [
    {
      titulo: "Pacote Completo: Voo + Hotel Resort",
      localizacao: "Porto Seguro, BA • 7 Noites",
      nota: 4.9,
      preco: 1250.00,
      imagem: "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=500&q=80",
      link: "https://www.booking.com"
    },
    {
      titulo: "Pacote Serra & Gastronomia",
      localizacao: "Campos do Jordão, SP • 3 Noites",
      nota: 4.8,
      preco: 780.00,
      imagem: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=500&q=80",
      link: "https://www.booking.com"
    }
  ],
  voos: [
    {
      titulo: "Voo São Paulo (GRU) ➔ Porto Seguro (BPS)",
      localizacao: "Ida e Volta • Direto",
      nota: 4.8,
      preco: 450.00,
      imagem: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=500&q=80",
      link: "https://www.latamairlines.com"
    },
    {
      titulo: "Voo Rio de Janeiro (GIG) ➔ Salvador (SSA)",
      localizacao: "Somente Ida • Voo Direto",
      nota: 4.7,
      preco: 310.00,
      imagem: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=500&q=80",
      link: "https://www.voegol.com.br"
    }
  ],
  pacotes: [
    {
      titulo: "Pacote Nordeste dos Sonhos",
      localizacao: "Maceió, AL • Voo + Hospedagem",
      nota: 4.9,
      preco: 990.00,
      imagem: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=500&q=80",
      link: "https://www.cvc.com.br"
    }
  ],
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
    }
  ],
  carros: [
    {
      titulo: "VW Gol 1.0 ou Similar",
      localizacao: "Retirada no Aeroporto de Guarulhos",
      nota: 4.6,
      preco: 79.00,
      imagem: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=500&q=80",
      link: "https://www.rentcars.com"
    },
    {
      titulo: "Jeep Renegade Automático",
      localizacao: "Retirada em Porto Seguro",
      nota: 4.9,
      preco: 189.00,
      imagem: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=500&q=80",
      link: "https://www.rentcars.com"
    }
  ],
  seguros: [
    {
      titulo: "Seguro Viagem Brasil Completo",
      localizacao: "Cobertura Médica de R$ 50.000",
      nota: 4.9,
      preco: 42.00,
      imagem: "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&w=500&q=80",
      link: "https://www.cvc.com.br"
    }
  ]
};

let hospedes = { adultos: 2, criancas: 0, quartos: 1 };
let abaAtual = 'monte';

function formatarMoeda(valor) {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function renderizarOfertas(categoria) {
  const container = document.getElementById('offersContainer');
  if (!container) return;

  const lista = bancoDeDados[categoria] || bancoDeDados.hospedagem.concat(bancoDeDados.voos);
  container.innerHTML = '';

  lista.forEach(item => {
    container.innerHTML += `
      <div class="offer-card">
        <img src="${item.imagem}" alt="${item.titulo}">
        <div class="offer-body">
          <h3 class="offer-title">${item.titulo}</h3>
          <p class="offer-location">${item.localizacao}</p>
          <p style="font-size:0.75rem; color:#F59E0B; font-weight:bold;">★ ${item.nota}</p>
          <div style="margin-top: 8px;">
            <span style="font-size:0.75rem; color:#9CA3AF;">A partir de</span>
            <div class="offer-price">${formatarMoeda(item.preco)}</div>
          </div>
          <button onclick="window.open('${item.link}', '_blank')" class="btn-offer-green">Ver Oferta ❯</button>
        </div>
      </div>
    `;
  });
}

function trocarAba(categoria, elemento) {
  abaAtual = categoria;

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
  const btnSwap = document.getElementById('btnSwap');
  const categoryTitle = document.getElementById('resultsCategoryTitle');

  if (categoria === 'hospedagem') {
    formGeral.style.display = 'none';
    formHospedagem.style.display = 'block';
    if (categoryTitle) categoryTitle.innerText = "Melhores ofertas de Hospedagem";
  } else {
    formGeral.style.display = 'block';
    formHospedagem.style.display = 'none';

    if (categoria === 'carros') {
      if (title) title.innerText = "Pesquisar carros";
      if (tripOptions) tripOptions.style.display = "none";
      if (btnSwap) btnSwap.style.display = "flex";
      if (labelOrigem) labelOrigem.innerText = "LOCAL DE RETIRADA";
      if (inputOrigem) inputOrigem.placeholder = "Cidade ou Aeroporto";
      if (labelDestino) labelDestino.innerText = "LOCAL DE DEVOLUÇÃO";
      if (inputDestino) inputDestino.placeholder = "Mesmo local de retirada";
      if (categoryTitle) categoryTitle.innerText = "Carros Disponíveis para Aluguel";
    } else if (categoria === 'seguros') {
      if (title) title.innerText = "Pesquisar seguros";
      if (tripOptions) tripOptions.style.display = "none";
      if (btnSwap) btnSwap.style.display = "none";
      if (labelOrigem) labelOrigem.innerText = "DESTINO";
      if (inputOrigem) inputOrigem.placeholder = "Ex: Brasil, Europa, EUA";
      if (labelDestino) labelDestino.innerText = "PASSAGEIROS";
      if (inputDestino) inputDestino.placeholder = "1 viajante";
      if (categoryTitle) categoryTitle.innerText = "Planos de Seguro Viagem";
    } else {
      if (title) title.innerText = `Pesquisar ${categoria === 'monte' ? 'viagens' : categoria}`;
      if (tripOptions) tripOptions.style.display = "flex";
      if (btnSwap) btnSwap.style.display = "flex";
      if (labelOrigem) labelOrigem.innerText = "DE";
      if (inputOrigem) inputOrigem.placeholder = "Insira uma origem";
      if (labelDestino) labelDestino.innerText = "PARA";
      if (inputDestino) inputDestino.placeholder = "Insira um destino";
      if (categoryTitle) categoryTitle.innerText = "Melhores ofertas de Hospedagem & Voos";
    }
  }

  renderizarOfertas(categoria);
}

function toggleModalHospedes() {
  const modal = document.getElementById('guestModal');
  if (modal) {
    modal.style.display = modal.style.display === 'none' ? 'block' : 'none';
  }
}

function alterarHospedes(tipo, delta) {
  if (hospedes[tipo] + delta >= 0) {
    if (tipo === 'adultos' && hospedes[tipo] + delta < 1) return;
    if (tipo === 'quartos' && hospedes[tipo] + delta < 1) return;

    hospedes[tipo] += delta;
    document.getElementById(`cnt${tipo.charAt(0).toUpperCase() + tipo.slice(1)}`).innerText = hospedes[tipo];
    atualizarTextoInputHospedes();
  }
}

function atualizarTextoInputHospedes() {
  const totalPessoas = hospedes.adultos + hospedes.criancas;
  const texto = `${totalPessoas} hóspede${totalPessoas > 1 ? 's' : ''}, ${hospedes.quartos} quarto${hospedes.quartos > 1 ? 's' : ''}`;
  document.getElementById('stayOcupacaoInput').value = texto;
}

function redefinirHospedes() {
  hospedes = { adultos: 2, criancas: 0, quartos: 1 };
  document.getElementById('cntAdultos').innerText = 2;
  document.getElementById('cntCriancas').innerText = 0;
  document.getElementById('cntQuartos').innerText = 1;
  atualizarTextoInputHospedes();
}

function confirmarHospedes() {
  document.getElementById('guestModal').style.display = 'none';
}

document.addEventListener('click', (e) => {
  const modal = document.getElementById('guestModal');
  const input = document.getElementById('stayOcupacaoInput');
  if (modal && input && modal.style.display === 'block') {
    if (!modal.contains(e.target) && e.target !== input) {
      modal.style.display = 'none';
    }
  }
});

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
  if (body.classList.contains('dark-mode')) {
    body.classList.remove('dark-mode');
    body.classList.add('light-mode');
    if (btn) btn.innerText = '🌙 Modo';
  } else {
    body.classList.remove('light-mode');
    body.classList.add('dark-mode');
    if (btn) btn.innerText = '☀️ Modo';
  }
}

function realizarPesquisa() {
  renderizarOfertas(abaAtual);
}

document.addEventListener('DOMContentLoaded', () => {
  renderizarOfertas('monte');
});
