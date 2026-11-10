let hospedes = { adultos: 2, criancas: 0, quartos: 1 };
let abaAtual = 'monte';

// Alternador de Temas (Claro / Escuro)
function toggleTheme() {
  const body = document.body;
  const btn = document.getElementById('btnThemeToggle');
  if (body.classList.contains('light-mode')) {
    body.classList.remove('light-mode');
    body.classList.add('dark-mode');
    if (btn) btn.innerText = '☀️ Modo';
  } else {
    body.classList.remove('dark-mode');
    body.classList.add('light-mode');
    if (btn) btn.innerText = '🌙 Modo';
  }
}

// Troca de Abas
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

  if (categoria === 'hospedagem') {
    formGeral.style.display = 'none';
    formHospedagem.style.display = 'block';
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
    } else if (categoria === 'seguros') {
      if (title) title.innerText = "Pesquisar seguros";
      if (tripOptions) tripOptions.style.display = "none";
      if (btnSwap) btnSwap.style.display = "none";
      if (labelOrigem) labelOrigem.innerText = "DESTINO";
      if (inputOrigem) inputOrigem.placeholder = "Ex: Brasil, Europa, EUA";
      if (labelDestino) labelDestino.innerText = "PASSAGEIROS";
      if (inputDestino) inputDestino.placeholder = "1 viajante";
    } else {
      if (title) title.innerText = `Pesquisar ${categoria === 'monte' ? 'viagens' : categoria}`;
      if (tripOptions) tripOptions.style.display = "flex";
      if (btnSwap) btnSwap.style.display = "flex";
      if (labelOrigem) labelOrigem.innerText = "DE";
      if (inputOrigem) inputOrigem.placeholder = "Insira uma origem";
      if (labelDestino) labelDestino.innerText = "PARA";
      if (inputDestino) inputDestino.placeholder = "Insira um destino";
    }
  }

  renderizarConteudoAba(categoria);
}

// Renderização dos Layouts das Imagens por Aba
function renderizarConteudoAba(categoria) {
  const container = document.getElementById('mainBodyContent');
  if (!container) return;

  if (categoria === 'carros') {
    // 🚗 LAYOUT CARROS (img1 + img2)
    container.innerHTML = `
      <!-- Seção img2: Destaques de Serviço -->
      <div class="frota-features-grid">
        <div class="feature-item">
          <div class="feature-icon-circle">📱</div>
          <div class="feature-text">
            <h4>Fast Retirada Digital</h4>
            <p>Retire seu carro em até 5 minutos, sem enfrentar filas.</p>
          </div>
        </div>
        <div class="feature-item">
          <div class="feature-icon-circle">🚗</div>
          <div class="feature-text">
            <h4>Adicionais</h4>
            <p>Pra que sua viagem seja ainda mais simples e prazerosa!</p>
          </div>
        </div>
        <div class="feature-item">
          <div class="feature-icon-circle">👤</div>
          <div class="feature-text">
            <h4>Portal do Cliente</h4>
            <p>Tudo que você precisa, em um só lugar.</p>
          </div>
        </div>
      </div>

      <!-- Seção img1: Aluguel de Carros -->
      <section class="section-block">
        <h2 class="section-block-title">🚗 Aluguel de Carros</h2>
        <p class="section-block-subtitle">Encontre o carro certo para você</p>
        
        <div class="cards-grid">
          <div class="content-card">
            <img src="https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=500&q=80" alt="Buenos Aires">
            <div class="card-body">
              <span class="blue-badge">Carros</span>
              <h3 class="card-title">Buenos Aires</h3>
              <p class="card-subtitle">Intermediário</p>
              <div class="car-icons-row">
                <span>👤 5</span> <span>🧳 2</span> <span>🚪 2</span>
              </div>
              <div class="price-box">
                <span class="price-label">Diárias a partir de</span>
                <div class="price-amount">R$ 286</div>
              </div>
              <div class="remessa-tag">Taxa de remessa: <strong>Isento</strong></div>
            </div>
          </div>

          <div class="content-card">
            <img src="https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=500&q=80" alt="Orlando">
            <div class="card-body">
              <span class="blue-badge">Carros</span>
              <h3 class="card-title">Orlando</h3>
              <p class="card-subtitle">Compacto</p>
              <div class="car-icons-row">
                <span>👤 5</span> <span>🧳 2</span> <span>🚪 2</span>
              </div>
              <div class="price-box">
                <span class="price-label">Diárias a partir de</span>
                <div class="price-amount">R$ 216</div>
              </div>
              <div class="remessa-tag">Taxa de remessa: <strong>Isento</strong></div>
            </div>
          </div>

          <div class="content-card">
            <img src="https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=500&q=80" alt="Santiago">
            <div class="card-body">
              <span class="blue-badge">Carros</span>
              <h3 class="card-title">Santiago</h3>
              <p class="card-subtitle">Econômico</p>
              <div class="car-icons-row">
                <span>👤 5</span> <span>🧳 2</span> <span>🚪 2</span>
              </div>
              <div class="price-box">
                <span class="price-label">Diárias a partir de</span>
                <div class="price-amount">R$ 268</div>
              </div>
              <div class="remessa-tag">Taxa de remessa: <strong>Isento</strong></div>
            </div>
          </div>
        </div>
      </section>

      <!-- Seção img2: Conheça a nossa Frota -->
      <section class="section-block">
        <h2 class="section-block-title" style="text-align:center;">Conheça a nossa Frota</h2>
        <p class="section-block-subtitle" style="text-align:center;">As melhores condições para você reservar e aproveitar</p>
        
        <div class="cards-grid mt-3">
          <div class="content-card">
            <img src="https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=500&q=80" alt="SUV Compacto">
            <div class="card-body">
              <h3 class="card-title">Grupo GI - SUV Compacto Especial</h3>
              <p class="card-subtitle">Nissan Kicks 1.6, GM Tracker ou similar</p>
            </div>
          </div>
          <div class="content-card">
            <img src="https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=500&q=80" alt="SUV Automático">
            <div class="card-body">
              <h3 class="card-title">Grupo GX - SUV Automático</h3>
              <p class="card-subtitle">VW T-Cross 1.0 Turbo, Hyundai Creta</p>
            </div>
          </div>
          <div class="content-card">
            <img src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=500&q=80" alt="SUV Luxo">
            <div class="card-body">
              <h3 class="card-title">Grupo GH - SUV Luxo Automático</h3>
              <p class="card-subtitle">Jeep Compass 1.3 Turbo ou similar</p>
            </div>
          </div>
        </div>

        <div class="btn-group-center">
          <button class="btn-outline-green">CONFIRA TODOS OS GRUPOS</button>
        </div>
      </section>
    `;
  } else if (categoria === 'hospedagem') {
    // 🏨 LAYOUT HOSPEDAGEM (img3 + img4)
    container.innerHTML = `
      <!-- Seção img3: Especial Nordeste -->
      <section class="section-block">
        <h2 class="section-block-title">Especial Nordeste: Hotéis e Resorts</h2>
        
        <div class="cards-grid">
          <div class="content-card">
            <img src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=500&q=80" alt="Natal Praia Hotel">
            <div class="card-body">
              <span class="card-subtitle">HOSPEDAGENS</span>
              <h3 class="card-title">Natal Praia Hotel</h3>
              <p class="card-subtitle">A 958m do centro • Natal</p>
              <p style="font-size:0.8rem; color:#0284C7;">★ 8.0 · ★★★</p>
              <div class="price-box">
                <span class="price-label">1 noite, 2 pessoas a partir de</span>
                <div class="price-amount">R$ 156 <span class="green-discount-tag">-56%</span></div>
              </div>
            </div>
          </div>

          <div class="content-card">
            <img src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=500&q=80" alt="D Beach Resort">
            <div class="card-body">
              <span class="card-subtitle">HOSPEDAGENS</span>
              <h3 class="card-title">D Beach Resort</h3>
              <p class="card-subtitle">A 11km do centro • Natal</p>
              <p style="font-size:0.8rem; color:#0284C7;">★ 8.5 · ★★★★</p>
              <div class="price-box">
                <span class="price-label">1 noite, 2 pessoas a partir de</span>
                <div class="price-amount">R$ 469</div>
              </div>
            </div>
          </div>

          <div class="content-card">
            <img src="https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=500&q=80" alt="Salinas Maceió">
            <div class="card-body">
              <span class="card-subtitle">HOSPEDAGENS</span>
              <h3 class="card-title">Salinas Maceió All Inclusive</h3>
              <p class="card-subtitle">A 20km do centro • Maceió</p>
              <p style="font-size:0.8rem; color:#0284C7;">★ 9.4 · ★★★★</p>
              <div class="price-box">
                <span class="price-label">1 noite, 2 pessoas a partir de</span>
                <div class="price-amount">R$ 2.052</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Seção img4: Categorias Campos do Jordão & Litoral SP -->
      <section class="section-block">
        <h2 class="section-block-title">🏰 Hospedagens em Campos do Jordão</h2>
        <div class="cards-grid">
          <div class="content-card">
            <img src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=500&q=80" alt="Pousada Provence">
            <div class="card-body">
              <h3 class="card-title">Pousada Campos De Provence</h3>
              <div class="price-amount">R$ 297 <span class="green-discount-tag">-8%</span></div>
            </div>
          </div>
          <div class="content-card">
            <img src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=500&q=80" alt="Pousada Grandchamp">
            <div class="card-body">
              <h3 class="card-title">Pousada Grandchamp</h3>
              <div class="price-amount">R$ 316</div>
            </div>
          </div>
        </div>
      </section>
    `;
  } else if (categoria === 'seguros') {
    // 🛡️ LAYOUT SEGURO VIAGEM (img7)
    container.innerHTML = `
      <section class="section-block">
        <h2 class="section-block-title">🛡️ Viaje protegido com um seguro viagem</h2>
        
        <div class="cards-grid">
          <div class="content-card">
            <img src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=500&q=80" alt="Brasil">
            <div class="card-body">
              <span class="card-subtitle">ASSISTÊNCIA</span>
              <h3 class="card-title">Seguro Viagem - Brasil</h3>
              <p class="card-subtitle">Por 2 dias • Reserva Flexível</p>
              <div class="price-box">
                <span class="price-label">Preço por pessoa de</span>
                <div class="price-amount">R$ 35</div>
              </div>
            </div>
          </div>

          <div class="content-card">
            <img src="https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&w=500&q=80" alt="América Latina">
            <div class="card-body">
              <span class="card-subtitle">ASSISTÊNCIA</span>
              <h3 class="card-title">Seguro Viagem - América Latina</h3>
              <p class="card-subtitle">Por 2 dias • Reserva Flexível</p>
              <div class="price-box">
                <span class="price-label">Preço por pessoa de</span>
                <div class="price-amount">R$ 90</div>
              </div>
            </div>
          </div>

          <div class="content-card">
            <img src="https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=500&q=80" alt="Europa">
            <div class="card-body">
              <span class="card-subtitle">ASSISTÊNCIA</span>
              <h3 class="card-title">Seguro Viagem - Europa</h3>
              <p class="card-subtitle">Por 2 dias • Reserva Flexível</p>
              <div class="price-box">
                <span class="price-label">Preço por pessoa de</span>
                <div class="price-amount">R$ 90</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- FAQ img7 -->
      <section class="section-block">
        <h2 class="section-block-title">Dúvidas frequentes sobre seguro viagem</h2>
        <div class="faq-grid mt-3">
          <div class="faq-card content-card">
            <h4>O que é o seguro viagem?</h4>
            <p>O seguro viagem cuida, protege e presta suporte ao passageiro durante o período da sua viagem em casos de urgências e emergências.</p>
          </div>
          <div class="faq-card content-card">
            <h4>Por que contratar um seguro viagem?</h4>
            <p>Recomendado para viagens internacionais ou nacionais, o seguro garante tranquilidade médica e auxílio com bagagens.</p>
          </div>
        </div>

        <div class="newsletter-box content-card">
          <div>
            <h4>Receba ofertas exclusivas no seu e-mail</h4>
            <p style="font-size:0.8rem; color:#64748B;">Política de privacidade aplicada</p>
          </div>
          <div class="newsletter-input-group">
            <input type="email" placeholder="Insira seu e-mail">
            <button class="btn-submit-search">Quero me inscrever</button>
          </div>
        </div>
      </section>
    `;
  } else {
    // ✈️ LAYOUT VOOS & VIAGEM (img5 + img6)
    container.innerHTML = `
      <!-- Seção img5: Passagens Baratas Nordeste -->
      <section class="section-block">
        <h2 class="section-block-title">🌅 Passagens aéreas baratas Nordeste do Brasil</h2>
        <p class="section-block-subtitle">Explore e garanta sua passagem para o paraíso nordestino</p>
        
        <div class="cards-grid">
          <div class="content-card">
            <img src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=500&q=80" alt="Fortaleza">
            <div class="card-body">
              <span class="card-subtitle">PASSAGEM</span>
              <h3 class="card-title">Voos para Fortaleza</h3>
              <p class="card-subtitle">Saindo de São Paulo • Por Azul</p>
              <div class="price-box">
                <span class="price-label">Preço ida e volta</span>
                <div class="price-amount">R$ 885</div>
              </div>
            </div>
          </div>

          <div class="content-card">
            <img src="https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=500&q=80" alt="Recife">
            <div class="card-body">
              <span class="card-subtitle">PASSAGEM</span>
              <h3 class="card-title">Voos para Recife</h3>
              <p class="card-subtitle">Saindo de São Paulo • Por Gol</p>
              <div class="price-box">
                <span class="price-label">Preço ida e volta</span>
                <div class="price-amount">R$ 884</div>
              </div>
            </div>
          </div>

          <div class="content-card">
            <img src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=500&q=80" alt="Maceió">
            <div class="card-body">
              <span class="card-subtitle">PASSAGEM</span>
              <h3 class="card-title">Voos para Maceió</h3>
              <p class="card-subtitle">Saindo de São Paulo • Por LATAM</p>
              <div class="price-box">
                <span class="price-label">Preço ida e volta</span>
                <div class="price-amount">R$ 777</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Seção img6: Recursos e Companhias Aéreas -->
      <section class="section-block">
        <h2 class="section-block-title">Passagens aéreas baratas: viaje mais e gaste menos</h2>
        
        <div class="recursos-voos-grid">
          <div class="recurso-card content-card">
            <div class="recurso-icon">✈️</div>
            <h4>Oportunidades de voos</h4>
            <p style="font-size:0.8rem; color:#64748B;">Filtre voos madrugadores e promoções exclusivas.</p>
          </div>
          <div class="recurso-card content-card">
            <div class="recurso-icon">📊</div>
            <h4>Meses baratos</h4>
            <p style="font-size:0.8rem; color:#64748B;">Saiba qual mês é mais barato para comprar.</p>
          </div>
        </div>

        <div class="company-logos-row content-card">
          <span class="company-logo-item">LATAM AIRLINES</span>
          <span class="company-logo-item">GOL</span>
          <span class="company-logo-item">AZUL</span>
          <span class="company-logo-item">COPA AIRLINES</span>
        </div>
      </section>
    `;
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

function realizarPesquisa() {
  renderizarConteudoAba(abaAtual);
}

document.addEventListener('DOMContentLoaded', () => {
  renderizarConteudoAba('monte');
});
