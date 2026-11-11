/* =====================================================================
   PREÇO JUSTO — Dados demonstrativos e simulador de resultados
   ---------------------------------------------------------------------
   Todo o conteúdo deste arquivo é FICTÍCIO e estático. Não há consulta
   a companhias aéreas, hotéis ou locadoras: os resultados são montados
   no navegador a partir das tabelas abaixo, com regras simples
   (distância entre cidades, multiplicadores e variações fixas).
   A mesma busca sempre gera os mesmos resultados.
   Preços e disponibilidade são apenas ilustrativos.
   ===================================================================== */
(function (global) {
  'use strict';

  /* ---------- Utilidades ---------- */
  function normalizar(texto) {
    return String(texto || '')
      .normalize('NFD').replace(/[̀-ͯ]/g, '')
      .toLowerCase().replace(/\s+/g, ' ').trim();
  }
  function hash(texto) {
    var h = 0;
    for (var i = 0; i < texto.length; i++) h = (h * 31 + texto.charCodeAt(i)) >>> 0;
    return h;
  }
  // Fator fixo entre (1 - amplitude/2) e (1 + amplitude/2) para cada chave
  function variacao(chave, amplitude) {
    return 1 - amplitude / 2 + ((hash(chave) % 1000) / 1000) * amplitude;
  }
  function arredondarPreco(valor) { return Math.max(19, Math.round(valor / 10) * 10 - 1); }
  function numero(valor) { return Math.round(valor).toLocaleString('pt-BR'); }
  function moeda(valor) { return 'R$ ' + numero(valor); }
  function plural(n, um, varios) { return n + ' ' + (n === 1 ? um : varios); }

  /* ---------- Datas e horários ---------- */
  var DIAS = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'];
  var MESES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
  var MESES_LONGOS = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];

  function lerData(iso) {
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || '');
    if (!m) return null;
    var d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
    return isNaN(d.getTime()) ? null : d;
  }
  function dataISO(d) {
    var p = function (n) { return (n < 10 ? '0' : '') + n; };
    return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate());
  }
  function somarDias(iso, dias) {
    var d = lerData(iso) || new Date();
    d.setDate(d.getDate() + dias);
    return dataISO(d);
  }
  function hojeISO() { return dataISO(new Date()); }
  function diasEntre(isoA, isoB) {
    var a = lerData(isoA), b = lerData(isoB);
    if (!a || !b) return 0;
    return Math.round((b - a) / 86400000);
  }
  function dataCurta(iso) {
    var d = lerData(iso);
    return d ? DIAS[d.getDay()] + ', ' + d.getDate() + ' ' + MESES[d.getMonth()] : '';
  }
  function dataLonga(iso) {
    var d = lerData(iso);
    return d ? d.getDate() + ' de ' + MESES_LONGOS[d.getMonth()] + ' de ' + d.getFullYear() : '';
  }
  function horaParaMinutos(hhmm) {
    var p = String(hhmm || '00:00').split(':');
    return Number(p[0]) * 60 + Number(p[1] || 0);
  }
  function minutosParaHora(min) {
    var m = ((min % 1440) + 1440) % 1440;
    var h = Math.floor(m / 60), r = m % 60;
    return (h < 10 ? '0' : '') + h + ':' + (r < 10 ? '0' : '') + r;
  }
  function duracaoTexto(min) {
    var h = Math.floor(min / 60), m = min % 60;
    if (!h) return m + 'min';
    return h + 'h' + (m ? ' ' + (m < 10 ? '0' : '') + m + 'min' : '');
  }

  /* ---------- Cidades e aeroportos ----------
     perfil define o estilo das hospedagens sugeridas.
     hotel / carro / voo são multiplicadores de preço da cidade. */
  var LUGARES = [
    { id: 'GRU', cidade: 'São Paulo', aeroporto: 'Guarulhos', uf: 'SP', pais: 'Brasil', lat: -23.43, lon: -46.47, perfil: 'cidade' },
    { id: 'CGH', cidade: 'São Paulo', aeroporto: 'Congonhas', uf: 'SP', pais: 'Brasil', lat: -23.63, lon: -46.66, perfil: 'cidade' },
    { id: 'VCP', cidade: 'Campinas', aeroporto: 'Viracopos', uf: 'SP', pais: 'Brasil', lat: -23.01, lon: -47.13, perfil: 'cidade' },
    { id: 'GIG', cidade: 'Rio de Janeiro', aeroporto: 'Galeão', uf: 'RJ', pais: 'Brasil', lat: -22.81, lon: -43.25, perfil: 'praia', hotel: 1.15 },
    { id: 'SDU', cidade: 'Rio de Janeiro', aeroporto: 'Santos Dumont', uf: 'RJ', pais: 'Brasil', lat: -22.91, lon: -43.16, perfil: 'praia', hotel: 1.15 },
    { id: 'BSB', cidade: 'Brasília', uf: 'DF', pais: 'Brasil', lat: -15.87, lon: -47.92, perfil: 'cidade' },
    { id: 'CNF', cidade: 'Belo Horizonte', aeroporto: 'Confins', uf: 'MG', pais: 'Brasil', lat: -19.63, lon: -43.97, perfil: 'cidade' },
    { id: 'SSA', cidade: 'Salvador', uf: 'BA', pais: 'Brasil', lat: -12.91, lon: -38.33, perfil: 'praia' },
    { id: 'BPS', cidade: 'Porto Seguro', uf: 'BA', pais: 'Brasil', lat: -16.44, lon: -39.08, perfil: 'praia' },
    { id: 'REC', cidade: 'Recife', uf: 'PE', pais: 'Brasil', lat: -8.13, lon: -34.92, perfil: 'praia' },
    { id: 'FEN', cidade: 'Fernando de Noronha', uf: 'PE', pais: 'Brasil', lat: -3.85, lon: -32.42, perfil: 'praia', hotel: 2.1, carro: 1.6, voo: 1.8 },
    { id: 'FOR', cidade: 'Fortaleza', uf: 'CE', pais: 'Brasil', lat: -3.78, lon: -38.53, perfil: 'praia' },
    { id: 'NAT', cidade: 'Natal', uf: 'RN', pais: 'Brasil', lat: -5.77, lon: -35.37, perfil: 'praia' },
    { id: 'MCZ', cidade: 'Maceió', uf: 'AL', pais: 'Brasil', lat: -9.51, lon: -35.79, perfil: 'praia' },
    { id: 'POA', cidade: 'Porto Alegre', uf: 'RS', pais: 'Brasil', lat: -29.99, lon: -51.17, perfil: 'cidade' },
    { id: 'FLN', cidade: 'Florianópolis', uf: 'SC', pais: 'Brasil', lat: -27.67, lon: -48.55, perfil: 'praia', hotel: 1.1 },
    { id: 'IGU', cidade: 'Foz do Iguaçu', uf: 'PR', pais: 'Brasil', lat: -25.6, lon: -54.49, perfil: 'natureza' },
    { id: 'BYO', cidade: 'Bonito', uf: 'MS', pais: 'Brasil', lat: -21.25, lon: -56.45, perfil: 'natureza', hotel: 1.1 },
    { id: 'EZE', cidade: 'Buenos Aires', aeroporto: 'Ezeiza', pais: 'Argentina', lat: -34.82, lon: -58.53, perfil: 'cidade', hotel: 1.1, carro: 1.1 },
    { id: 'BRC', cidade: 'Bariloche', pais: 'Argentina', lat: -41.15, lon: -71.16, perfil: 'serra', hotel: 1.25, carro: 1.15 },
    { id: 'SCL', cidade: 'Santiago', pais: 'Chile', lat: -33.39, lon: -70.79, perfil: 'cidade', hotel: 1.15, carro: 1.1 },
    { id: 'LIS', cidade: 'Lisboa', pais: 'Portugal', lat: 38.77, lon: -9.13, perfil: 'cidade', hotel: 1.45, carro: 1.3 },
    { id: 'MCO', cidade: 'Orlando', uf: 'Flórida', pais: 'Estados Unidos', lat: 28.43, lon: -81.31, perfil: 'cidade', hotel: 1.5, carro: 1.25 },
    // Destinos sem aeroporto comercial nesta demonstração: usam o mais próximo
    { id: 'gramado', cidade: 'Gramado', uf: 'RS', pais: 'Brasil', lat: -29.37, lon: -50.87, perfil: 'serra', proximo: 'POA', hotel: 1.2 },
    { id: 'campos-do-jordao', cidade: 'Campos do Jordão', uf: 'SP', pais: 'Brasil', lat: -22.74, lon: -45.59, perfil: 'serra', proximo: 'GRU', hotel: 1.15 },
    { id: 'porto-de-galinhas', cidade: 'Porto de Galinhas', uf: 'PE', pais: 'Brasil', lat: -8.5, lon: -35, perfil: 'praia', proximo: 'REC', hotel: 1.1 },
    // Ponto de conexão usado apenas nas rotas da Copa Airlines
    { id: 'PTY', cidade: 'Cidade do Panamá', pais: 'Panamá', lat: 9.07, lon: -79.38, perfil: 'cidade', oculto: true }
  ];

  function lugarPorId(id) {
    for (var i = 0; i < LUGARES.length; i++) if (LUGARES[i].id === id) return LUGARES[i];
    return null;
  }
  function ehAeroporto(l) { return !!l && /^[A-Z]{3}$/.test(l.id); }
  function aeroportoDe(l) { return ehAeroporto(l) ? l : lugarPorId(l && l.proximo); }
  function mesmaCidade(a, b) { return !!a && !!b && normalizar(a.cidade) === normalizar(b.cidade); }
  function regiao(l) { return l.uf && l.pais === 'Brasil' ? l.uf + ', Brasil' : (l.uf ? l.uf + ', ' : '') + l.pais; }
  function rotuloAeroporto(l) { return l.cidade + ' (' + l.id + ')'; }
  function rotuloCidade(l) { return l.cidade + ', ' + (l.pais === 'Brasil' ? l.uf : l.pais); }
  function rotulo(l) { return ehAeroporto(l) ? rotuloAeroporto(l) : rotuloCidade(l); }
  function descricaoAeroporto(l) { return (l.aeroporto ? 'Aeroporto ' + l.aeroporto + ' · ' : '') + regiao(l); }

  // Aceita "Salvador (SSA)", "SSA", "Salvador", "salvador, ba"...
  function encontrarLugar(texto, opcoes) {
    opcoes = opcoes || {};
    var t = String(texto || '').trim();
    if (!t) return null;
    var visiveis = LUGARES.filter(function (l) { return !l.oculto && (!opcoes.somenteAeroportos || ehAeroporto(l)); });
    var codigo = /\(([A-Za-z]{3})\)/.exec(t) || (/^[A-Za-z]{3}$/.test(t) ? [t, t] : null);
    if (codigo) {
      var porCodigo = lugarPorId(codigo[1].toUpperCase());
      if (porCodigo && visiveis.indexOf(porCodigo) > -1) return porCodigo;
    }
    var n = normalizar(t.replace(/\(.*?\)/g, '').split(',')[0].split(' - ')[0]);
    if (!n) return null;
    var exato = visiveis.filter(function (l) { return normalizar(l.cidade) === n || normalizar(l.aeroporto) === n; })[0];
    if (exato) return exato;
    if (n.length < 3) return null;
    return visiveis.filter(function (l) { return normalizar(l.cidade).indexOf(n) === 0; })[0] || null;
  }

  function distanciaKm(a, b) {
    var rad = Math.PI / 180;
    var dLat = (b.lat - a.lat) * rad, dLon = (b.lon - a.lon) * rad;
    var s = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(a.lat * rad) * Math.cos(b.lat * rad) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    return 6371 * 2 * Math.atan2(Math.sqrt(s), Math.sqrt(1 - s));
  }
  function tempoDeVoo(km) { return Math.max(45, Math.round((km / 790 * 60 + 28) / 5) * 5); }

  /* ---------- Companhias aéreas ---------- */
  var COMPANHIAS = {
    GOL: { id: 'GOL', nome: 'GOL', logo: 'img/companhias/gol.png', hubs: ['GRU', 'GIG', 'BSB'] },
    AZUL: { id: 'AZUL', nome: 'Azul', logo: 'img/companhias/azul.png', hubs: ['VCP', 'CNF', 'REC'] },
    LATAM: { id: 'LATAM', nome: 'LATAM', logo: 'img/companhias/latam.png', hubs: ['GRU', 'BSB', 'SCL'] },
    COPA: { id: 'COPA', nome: 'Copa Airlines', logo: 'img/companhias/copa.png', hubs: ['PTY'] }
  };
  function companhiasDaRota(o, d) {
    var paises = [o.pais, d.pais];
    if (paises.indexOf('Estados Unidos') > -1) return ['LATAM', 'AZUL', 'COPA'];
    if (paises.indexOf('Portugal') > -1) return ['LATAM', 'AZUL'];
    return ['GOL', 'AZUL', 'LATAM'];
  }

  /* ---------- Modelos de voo (horários e perfil tarifário) ---------- */
  var VOOS_MODELOS = [
    { saida: '06:10', cia: 0, paradas: 0, fator: 1.0, mala: false },
    { saida: '07:45', cia: 1, paradas: 1, fator: 0.86, mala: false },
    { saida: '09:20', cia: 2, paradas: 0, fator: 1.12, mala: true },
    { saida: '11:05', cia: 0, paradas: 1, fator: 0.9, mala: true },
    { saida: '13:35', cia: 1, paradas: 0, fator: 1.04, mala: false },
    { saida: '15:50', cia: 2, paradas: 1, fator: 0.94, mala: false },
    { saida: '18:25', cia: 0, paradas: 0, fator: 1.18, mala: true },
    { saida: '21:40', cia: 1, paradas: 2, fator: 0.78, mala: false }
  ];
  var VOOS_LONGOS = [
    { saida: '21:35', cia: 0, paradas: 0, fator: 1.1, mala: true },
    { saida: '23:50', cia: 1, paradas: 0, fator: 1.0, mala: true },
    { saida: '10:15', cia: 2, paradas: 1, fator: 0.84, mala: true },
    { saida: '17:40', cia: 0, paradas: 1, fator: 0.88, mala: false },
    { saida: '06:30', cia: 1, paradas: 1, fator: 0.8, mala: false },
    { saida: '19:05', cia: 2, paradas: 0, fator: 1.06, mala: true }
  ];
  var CLASSES = { 'Econômica': 1, 'Premium economy': 1.6, 'Executiva': 3.1, 'Primeira classe': 5.2 };

  function escolherEscalas(cia, o, d, quantidade) {
    var hubs = COMPANHIAS[cia].hubs;
    // A Copa conecta sempre no Panamá; as demais preferem os próprios hubs
    var ids = cia === 'COPA' ? hubs : hubs.concat(['BSB', 'GRU', 'CNF', 'VCP', 'REC']);
    var vistos = {};
    var candidatos = ids.filter(function (id) {
      if (vistos[id]) return false;
      vistos[id] = true;
      return true;
    }).map(lugarPorId).filter(function (h) {
      // Evita conexões muito próximas da origem ou do destino (ex.: GRU → VCP)
      return h && !mesmaCidade(h, o) && !mesmaCidade(h, d) && distanciaKm(o, h) > 300 && distanciaKm(h, d) > 300;
    });
    var custo = function (h) {
      return (distanciaKm(o, h) + distanciaKm(h, d)) * (hubs.indexOf(h.id) > -1 ? 1 : 1.15);
    };
    candidatos.sort(function (a, b) { return custo(a) - custo(b); });
    var escolhidos = candidatos.slice(0, quantidade);
    escolhidos.sort(function (a, b) { return distanciaKm(o, a) - distanciaKm(o, b); });
    return escolhidos;
  }

  function montarTrecho(o, d, saida, paradasDesejadas, cia, chave) {
    var paradas = cia === 'COPA' ? Math.max(1, paradasDesejadas) : paradasDesejadas;
    var escalas = paradas ? escolherEscalas(cia, o, d, paradas) : [];
    var pontos = [o].concat(escalas, [d]);
    var inicio = horaParaMinutos(saida) + (hash(chave) % 3) * 5;
    var t = inicio;
    var segmentos = [], conexoes = [];
    for (var i = 0; i < pontos.length - 1; i++) {
      var dur = tempoDeVoo(distanciaKm(pontos[i], pontos[i + 1]));
      segmentos.push({ de: pontos[i], para: pontos[i + 1], saida: t, chegada: t + dur, duracao: dur });
      t += dur;
      if (i < pontos.length - 2) {
        var espera = [55, 75, 95, 120][hash(chave + i) % 4];
        conexoes.push({ lugar: pontos[i + 1], duracao: espera });
        t += espera;
      }
    }
    return {
      de: o, para: d, saida: inicio, chegada: t, duracao: t - inicio,
      diasExtras: Math.floor(t / 1440), paradas: escalas.length,
      escalas: escalas, segmentos: segmentos, conexoes: conexoes
    };
  }

  function periodoDoDia(min) {
    var h = Math.floor((min % 1440) / 60);
    if (h < 6) return 'madrugada';
    if (h < 12) return 'manha';
    if (h < 18) return 'tarde';
    return 'noite';
  }

  /* b: { origem, destino, ida, volta, adultos, criancas, bebes, classe } */
  function gerarVoos(b) {
    var o = b.origem, d = b.destino;
    var km = distanciaKm(o, d);
    var nacional = o.pais === 'Brasil' && d.pais === 'Brasil';
    var modelos = km > 4500 ? VOOS_LONGOS : VOOS_MODELOS;
    var cias = companhiasDaRota(o, d);
    var multiplicador = Math.max(o.voo || 1, d.voo || 1) * (CLASSES[b.classe] || 1);
    var base = (nacional ? 150 + km * 0.21 : 380 + km * 0.22) * multiplicador;
    var rota = o.id + '-' + d.id;
    var trechos = b.volta ? 2 : 1;

    var lista = modelos.map(function (m, i) {
      var cia = cias[m.cia % cias.length];
      var ida = montarTrecho(o, d, m.saida, m.paradas, cia, rota + i);
      var precoAdulto = arredondarPreco(base * m.fator * variacao(rota + i, 0.14));
      var volta = null;
      if (b.volta) {
        var mv = modelos[(i + 3) % modelos.length];
        volta = montarTrecho(d, o, mv.saida, m.paradas, cia, rota + 'v' + i);
        precoAdulto += arredondarPreco(base * mv.fator * variacao(rota + 'v' + i, 0.14));
      }
      var precoCrianca = arredondarPreco(precoAdulto * 0.75);
      var precoBebe = arredondarPreco(precoAdulto * 0.1);
      var taxas = (nacional ? 42 : 215) * trechos * (b.adultos + b.criancas);
      var total = precoAdulto * b.adultos + precoCrianca * b.criancas + precoBebe * b.bebes + taxas;
      return {
        id: 'voo-' + i,
        tipo: 'voo',
        cia: COMPANHIAS[cia],
        ida: ida,
        volta: volta,
        mala: m.mala,
        paradas: Math.max(ida.paradas, volta ? volta.paradas : 0),
        periodo: periodoDoDia(ida.saida),
        duracao: ida.duracao + (volta ? volta.duracao : 0),
        precoAdulto: precoAdulto,
        precoCrianca: precoCrianca,
        precoBebe: precoBebe,
        taxas: taxas,
        total: total,
        selos: []
      };
    });
    marcarSelos(lista, 'precoAdulto', 'duracao');
    return lista;
  }

  function marcarSelos(lista, campoPreco, campoDuracao) {
    if (!lista.length) return;
    var maisBarato = lista.reduce(function (a, b) { return b[campoPreco] < a[campoPreco] ? b : a; });
    maisBarato.selos.push('Menor preço');
    if (campoDuracao) {
      var maisRapido = lista.reduce(function (a, b) { return b[campoDuracao] < a[campoDuracao] ? b : a; });
      if (maisRapido !== maisBarato) maisRapido.selos.push('Mais rápido');
    }
  }

  /* ---------- Hospedagens fictícias ---------- */
  var COMODIDADES = {
    'cafe': { nome: 'Café da manhã', icone: 'i-coffee' },
    'piscina': { nome: 'Piscina', icone: 'i-waves' },
    'wifi': { nome: 'Wi-Fi', icone: 'i-wifi' },
    'estacionamento': { nome: 'Estacionamento', icone: 'i-parking' },
    'pets': { nome: 'Aceita pets', icone: 'i-paw' },
    'all-inclusive': { nome: 'All inclusive', icone: 'i-utensils' },
    'lareira': { nome: 'Lareira', icone: 'i-flame' },
    'cozinha': { nome: 'Cozinha', icone: 'i-utensils' },
    'academia': { nome: 'Academia', icone: 'i-dumbbell' }
  };

  var HOSPEDAGENS = {
    praia: [
      { tipo: 'Resort', nome: 'Resort Costa Dourada', img: 'resort-maceio', base: 980, km: 9.5, comodidades: ['all-inclusive', 'piscina', 'wifi', 'estacionamento'], cancelamento: true, descricao: 'Complexo à beira-mar com piscinas, restaurantes e programação para toda a família.' },
      { tipo: 'Hotel', nome: 'Hotel Orla Azul', img: 'hotel-natal', base: 430, km: 1.4, comodidades: ['cafe', 'piscina', 'wifi'], cancelamento: true, descricao: 'Hotel em frente à praia, com deck de madeira, piscina e café da manhã regional.' },
      { tipo: 'Pousada', nome: 'Pousada Brisa do Mar', img: 'pousada-praia', base: 310, km: 0.9, comodidades: ['cafe', 'piscina', 'wifi', 'pets'], cancelamento: false, descricao: 'Pousada aconchegante a poucos passos da areia, com área verde e piscina.' },
      { tipo: 'Pousada', nome: 'Bangalôs Maré Mansa', img: 'bangalo-praia', base: 390, km: 4.2, comodidades: ['cafe', 'wifi', 'pets'], cancelamento: true, descricao: 'Bangalôs de madeira com cobertura de palha e acesso direto à praia.' },
      { tipo: 'Apartamento', nome: 'Apartamento Vista Mar', img: 'apartamento', base: 340, km: 2.8, comodidades: ['wifi', 'cozinha', 'estacionamento'], cancelamento: true, descricao: 'Apartamento inteiro com sala integrada, cozinha equipada e varanda.' },
      { tipo: 'Hotel', nome: 'Hotel Farol Central', img: 'hotel-quarto', base: 260, km: 3.6, comodidades: ['cafe', 'wifi', 'estacionamento'], cancelamento: false, descricao: 'Opção prática e econômica perto do centro e dos restaurantes.' },
      { tipo: 'Resort', nome: 'Resort Lagoa Serena', img: 'resort-piscina', base: 1190, km: 14, comodidades: ['all-inclusive', 'piscina', 'wifi', 'estacionamento', 'pets'], cancelamento: true, descricao: 'Resort com piscina de borda, spa e restaurantes à beira da lagoa.' }
    ],
    serra: [
      { tipo: 'Chalé', nome: 'Chalés Recanto da Mata', img: 'chale-serra', base: 540, km: 3.5, comodidades: ['lareira', 'cafe', 'wifi', 'estacionamento', 'pets'], cancelamento: true, descricao: 'Chalés de madeira cercados pela mata, com lareira e varanda privativa.' },
      { tipo: 'Pousada', nome: 'Pousada Vale das Hortênsias', img: 'pousada-campos-do-jordao', base: 360, km: 1.8, comodidades: ['lareira', 'cafe', 'wifi'], cancelamento: false, descricao: 'Pousada em estilo europeu com café colonial e jardim florido.' },
      { tipo: 'Hotel', nome: 'Hotel Bosque Alpino', img: 'hotel-boutique', base: 470, km: 0.6, comodidades: ['cafe', 'piscina', 'wifi', 'estacionamento'], cancelamento: true, descricao: 'Hotel boutique no centro, com piscina aquecida e quartos decorados em madeira.' },
      { tipo: 'Apartamento', nome: 'Apartamento Centro da Serra', img: 'apartamento', base: 310, km: 0.4, comodidades: ['wifi', 'cozinha', 'pets'], cancelamento: true, descricao: 'Apartamento inteiro perto das lojas, cafés e restaurantes.' },
      { tipo: 'Hotel', nome: 'Hotel Mirante da Serra', img: 'hotel-quarto', base: 290, km: 2.2, comodidades: ['cafe', 'wifi', 'estacionamento', 'pets'], cancelamento: false, descricao: 'Quartos confortáveis com vista para o vale e estacionamento gratuito.' },
      { tipo: 'Resort', nome: 'Resort Montanha Clara', img: 'hotel-lobby', base: 890, km: 7.5, comodidades: ['all-inclusive', 'piscina', 'wifi', 'estacionamento'], cancelamento: true, descricao: 'Resort com spa, piscina coberta e gastronomia de inverno.' }
    ],
    cidade: [
      { tipo: 'Hotel', nome: 'Hotel Executivo Boulevard', img: 'hotel-sao-paulo', base: 310, km: 1.1, comodidades: ['cafe', 'wifi', 'estacionamento', 'academia'], cancelamento: true, descricao: 'Perto de avenidas e centros de negócios, com café da manhã incluído.' },
      { tipo: 'Hotel', nome: 'Hotel Design Paralelo', img: 'hotel-boutique', base: 480, km: 0.7, comodidades: ['cafe', 'wifi', 'academia'], cancelamento: true, descricao: 'Hotel boutique com decoração autoral e bar no terraço.' },
      { tipo: 'Apartamento', nome: 'Studio Jardim Central', img: 'apartamento', base: 260, km: 2, comodidades: ['wifi', 'cozinha', 'pets'], cancelamento: true, descricao: 'Studio inteiro com cozinha, ideal para estadias mais longas.' },
      { tipo: 'Hotel', nome: 'Grand Hotel Avenida', img: 'hotel-lobby', base: 640, km: 0.3, comodidades: ['cafe', 'piscina', 'wifi', 'academia', 'estacionamento'], cancelamento: true, descricao: 'Hotel clássico com lobby amplo, piscina e serviço de quarto.' },
      { tipo: 'Hotel', nome: 'Hotel Estação Econômico', img: 'hotel-quarto', base: 190, km: 3.4, comodidades: ['cafe', 'wifi'], cancelamento: false, descricao: 'Quartos simples e funcionais perto do transporte público.' },
      { tipo: 'Pousada', nome: 'Casa Quintal Pousada Urbana', img: 'pousada-campos-do-jordao', base: 280, km: 4.6, comodidades: ['cafe', 'wifi', 'pets'], cancelamento: false, descricao: 'Casarão restaurado com quintal arborizado em bairro tranquilo.' }
    ],
    natureza: [
      { tipo: 'Resort', nome: 'Eco Resort Águas Claras', img: 'resort-piscina', base: 820, km: 12, comodidades: ['all-inclusive', 'piscina', 'wifi', 'estacionamento'], cancelamento: true, descricao: 'Resort cercado de natureza, com piscinas e passeios guiados.' },
      { tipo: 'Chalé', nome: 'Chalés Trilha Verde', img: 'chale-serra', base: 450, km: 6.5, comodidades: ['cafe', 'wifi', 'estacionamento', 'pets'], cancelamento: true, descricao: 'Chalés na mata com café da manhã e trilhas próprias.' },
      { tipo: 'Hotel', nome: 'Hotel Rio Cristalino', img: 'hotel-natal', base: 390, km: 2.1, comodidades: ['cafe', 'piscina', 'wifi', 'estacionamento'], cancelamento: true, descricao: 'Hotel com deck e piscina, perto das agências de passeios.' },
      { tipo: 'Pousada', nome: 'Pousada Ninho Verde', img: 'pousada-campos-do-jordao', base: 280, km: 1.2, comodidades: ['cafe', 'wifi', 'pets'], cancelamento: false, descricao: 'Pousada familiar com jardim e café da manhã caseiro.' },
      { tipo: 'Hotel', nome: 'Hotel Centro Turístico', img: 'hotel-quarto', base: 240, km: 0.5, comodidades: ['cafe', 'wifi'], cancelamento: false, descricao: 'Hotel simples no centro, perto de restaurantes e lojas.' },
      { tipo: 'Apartamento', nome: 'Apartamento Família Natureza', img: 'apartamento', base: 320, km: 1.6, comodidades: ['wifi', 'cozinha', 'estacionamento'], cancelamento: true, descricao: 'Apartamento com dois quartos para grupos e famílias.' }
    ]
  };

  /* b: { lugar, entrada, saida, adultos, criancas, quartos } */
  function gerarHospedagens(b) {
    var modelos = HOSPEDAGENS[b.lugar.perfil] || HOSPEDAGENS.cidade;
    var noites = Math.max(1, diasEntre(b.entrada, b.saida));
    var porQuarto = Math.ceil((b.adultos + b.criancas) / b.quartos);
    var adicional = 1 + Math.max(0, porQuarto - 2) * 0.18;
    var lista = modelos.map(function (m, i) {
      var noite = arredondarPreco(m.base * (b.lugar.hotel || 1) * variacao(b.lugar.id + m.nome, 0.2) * adicional);
      return {
        id: 'hospedagem-' + i,
        tipo: 'hospedagem',
        nome: m.nome,
        categoria: m.tipo,
        img: 'img/hospedagens/' + m.img + '.jpg',
        km: Math.round(m.km * variacao(b.lugar.id + i, 0.5) * 10) / 10,
        comodidades: m.comodidades,
        cancelamento: m.cancelamento,
        cafe: m.comodidades.indexOf('cafe') > -1 || m.comodidades.indexOf('all-inclusive') > -1,
        descricao: m.descricao,
        lugar: b.lugar,
        noites: noites,
        quartos: b.quartos,
        precoNoite: noite,
        total: noite * noites * b.quartos,
        selos: []
      };
    });
    marcarSelos(lista, 'precoNoite');
    return lista;
  }

  /* ---------- Carros (categorias de locação) ---------- */
  var CARROS = [
    { categoria: 'Econômico', modelo: 'VW Polo', similar: true, img: 'economico', base: 119, pessoas: 5, malas: 2, cambio: 'Manual' },
    { categoria: 'Econômico', modelo: 'VW Polo', similar: true, img: 'economico', base: 139, pessoas: 5, malas: 2, cambio: 'Automático' },
    { categoria: 'Compacto', modelo: 'VW Golf', similar: true, img: 'compacto', base: 169, pessoas: 5, malas: 3, cambio: 'Automático' },
    { categoria: 'Sedan', modelo: 'Honda Civic', similar: true, img: 'sedan', base: 199, pessoas: 5, malas: 4, cambio: 'Automático' },
    { categoria: 'SUV', modelo: 'Jeep Renegade', similar: true, img: 'suv', base: 216, pessoas: 5, malas: 3, cambio: 'Automático' },
    { categoria: 'Minivan', modelo: 'Minivan 7 lugares', similar: false, img: 'minivan', base: 359, pessoas: 7, malas: 5, cambio: 'Automático' },
    { categoria: 'Esportivo', modelo: 'Chevrolet Camaro', similar: true, img: 'esportivo', base: 890, pessoas: 4, malas: 2, cambio: 'Automático' }
  ];

  /* b: { retirada, devolucao (lugar ou null), dataRetirada, horaRetirada, dataDevolucao, horaDevolucao, menor25 } */
  function gerarCarros(b) {
    var inicio = (lerData(b.dataRetirada) || new Date()).getTime() + horaParaMinutos(b.horaRetirada) * 60000;
    var fim = (lerData(b.dataDevolucao) || new Date()).getTime() + horaParaMinutos(b.horaDevolucao) * 60000;
    var diarias = Math.max(1, Math.ceil((fim - inicio) / 86400000));
    var outroLocal = !!b.devolucao && b.devolucao.id !== b.retirada.id;
    var aeroporto = ehAeroporto(b.retirada);
    var lista = CARROS.map(function (c, i) {
      var noAeroporto = aeroporto && i % 3 !== 2;
      var diaria = arredondarPreco(c.base * (b.retirada.carro || 1) * variacao(b.retirada.id + c.modelo + c.cambio, 0.16) * (noAeroporto ? 1 : 0.94));
      var taxas = (outroLocal ? 180 : 0) + (b.menor25 ? 30 * diarias : 0);
      return {
        id: 'carro-' + i,
        tipo: 'carro',
        categoria: c.categoria,
        modelo: c.modelo,
        similar: c.similar,
        img: 'img/carros/' + c.img + '.jpg',
        pessoas: c.pessoas,
        malas: c.malas,
        cambio: c.cambio,
        retiradaTipo: noAeroporto ? 'Aeroporto' : 'Loja na cidade',
        protecao: i % 2 === 0,
        cancelamento: i % 3 !== 1,
        diarias: diarias,
        precoDiaria: diaria,
        taxas: taxas,
        taxaOutroLocal: outroLocal ? 180 : 0,
        taxaJovem: b.menor25 ? 30 * diarias : 0,
        total: diaria * diarias + taxas,
        selos: []
      };
    });
    marcarSelos(lista, 'precoDiaria');
    return lista;
  }

  /* ---------- Pacotes (voo + hospedagem) ---------- */
  /* b: { origem (aeroporto), destino (lugar), ida, volta, adultos, criancas, quartos } */
  function gerarPacotes(b) {
    var aeroDestino = aeroportoDe(b.destino);
    var voos = gerarVoos({ origem: b.origem, destino: aeroDestino, ida: b.ida, volta: b.volta, adultos: b.adultos, criancas: b.criancas, bebes: 0, classe: 'Econômica' })
      .sort(function (a, c) { return a.precoAdulto - c.precoAdulto; });
    var hoteis = gerarHospedagens({ lugar: b.destino, entrada: b.ida, saida: b.volta, adultos: b.adultos, criancas: b.criancas, quartos: b.quartos });
    var pessoas = b.adultos + b.criancas;
    var lista = hoteis.map(function (h, i) {
      var voo = voos[i % voos.length];
      var porPessoa = arredondarPreco((voo.precoAdulto + h.total / pessoas) * 0.92);
      var porCrianca = arredondarPreco(porPessoa * 0.8);
      return {
        id: 'pacote-' + i,
        tipo: 'pacote',
        hotel: h,
        voo: voo,
        categoria: h.categoria,
        noites: h.noites,
        cafe: h.cafe,
        piscina: h.comodidades.indexOf('piscina') > -1,
        direto: voo.paradas === 0,
        precoPessoa: porPessoa,
        precoCrianca: porCrianca,
        taxas: voo.taxas,
        total: porPessoa * b.adultos + porCrianca * b.criancas + voo.taxas,
        selos: []
      };
    });
    marcarSelos(lista, 'precoPessoa');
    return lista;
  }

  /* ---------- Ofertas da página inicial (conteúdo do modal) ---------- */
  var OFERTAS = {
    'salvador': {
      tipo: 'passagem', titulo: 'Salvador', regiao: 'Bahia, Brasil', img: 'img/ofertas/salvador.jpg', alt: 'Casarões coloridos e igreja no Pelourinho, em Salvador',
      origem: 'GIG', destino: 'SSA', viagem: 'somente-ida', preco: 310, cia: 'GOL',
      descricao: 'A primeira capital do Brasil reúne arquitetura colonial, praias urbanas e uma das culinárias mais marcantes do país.',
      destaques: ['Pelourinho, centro histórico reconhecido pela UNESCO', 'Elevador Lacerda e a vista da Baía de Todos-os-Santos', 'Farol da Barra e as praias da orla'],
      epoca: 'Setembro a março, período com menos chuva.',
      inclui: ['Item pessoal e mala de mão de até 10 kg', 'Marcação de assento padrão']
    },
    'porto-seguro': {
      tipo: 'passagem', titulo: 'Porto Seguro', regiao: 'Bahia, Brasil', img: 'img/ofertas/porto-seguro.jpg', alt: 'Praia de areia clara com coqueiros em Porto Seguro',
      origem: 'GRU', destino: 'BPS', viagem: 'ida-volta', preco: 450, cia: 'LATAM',
      descricao: 'Litoral de águas calmas, recifes e vilarejos charmosos, com fácil acesso a Arraial d’Ajuda e Trancoso.',
      destaques: ['Piscinas naturais do Recife de Fora', 'Arraial d’Ajuda e Trancoso', 'Centro histórico da Cidade Alta'],
      epoca: 'Setembro a março, com dias mais secos.',
      inclui: ['Item pessoal e mala de mão de até 10 kg', 'Ida e volta na mesma companhia']
    },
    'recife': {
      tipo: 'passagem', titulo: 'Recife', regiao: 'Pernambuco, Brasil', img: 'img/ofertas/recife.jpg', alt: 'Prédios históricos do Recife Antigo às margens do rio',
      origem: 'GRU', destino: 'REC', viagem: 'ida-volta', preco: 590, cia: 'AZUL',
      descricao: 'Pontes, rios e o casario do Recife Antigo, com Olinda e as praias do litoral sul a poucos quilômetros.',
      destaques: ['Marco Zero e o bairro do Recife Antigo', 'Olinda, cidade histórica reconhecida pela UNESCO', 'Praia de Boa Viagem'],
      epoca: 'Setembro a fevereiro, fora do período de chuvas.',
      inclui: ['Item pessoal e mala de mão de até 10 kg', 'Ida e volta na mesma companhia']
    },
    'florianopolis': {
      tipo: 'passagem', titulo: 'Florianópolis', regiao: 'Santa Catarina, Brasil', img: 'img/ofertas/florianopolis.jpg', alt: 'Avenida Beira-Mar e prédios à beira da baía em Florianópolis',
      origem: 'GRU', destino: 'FLN', viagem: 'ida-volta', preco: 420, cia: 'GOL',
      descricao: 'Ilha com dezenas de praias para todos os estilos, lagoas, trilhas e uma gastronomia baseada em frutos do mar.',
      destaques: ['Lagoa da Conceição', 'Ponte Hercílio Luz', 'Praias do norte e do leste da ilha'],
      epoca: 'Dezembro a março para aproveitar as praias.',
      inclui: ['Item pessoal e mala de mão de até 10 kg', 'Ida e volta na mesma companhia']
    },
    'foz-do-iguacu': {
      tipo: 'passagem', titulo: 'Foz do Iguaçu', regiao: 'Paraná, Brasil', img: 'img/ofertas/foz-do-iguacu.jpg', alt: 'Cataratas do Iguaçu com arco-íris sob céu azul',
      origem: 'GRU', destino: 'IGU', viagem: 'ida-volta', preco: 520, cia: 'AZUL',
      descricao: 'As Cataratas do Iguaçu, a usina de Itaipu e a tríplice fronteira com Argentina e Paraguai em uma só viagem.',
      destaques: ['Cataratas pelos lados brasileiro e argentino', 'Usina Hidrelétrica de Itaipu', 'Parque das Aves'],
      epoca: 'O ano todo. No verão, as quedas costumam ficar mais volumosas.',
      inclui: ['Item pessoal e mala de mão de até 10 kg', 'Ida e volta na mesma companhia']
    },
    'santiago': {
      tipo: 'passagem', titulo: 'Santiago', regiao: 'Chile', img: 'img/ofertas/santiago.jpg', alt: 'Vista de Santiago com a Cordilheira dos Andes ao fundo',
      origem: 'GRU', destino: 'SCL', viagem: 'ida-volta', preco: 1390, cia: 'LATAM',
      descricao: 'Capital cercada pela Cordilheira dos Andes, com vinícolas próximas e estações de esqui no inverno.',
      destaques: ['Cerro San Cristóbal', 'Vinícolas do Vale do Maipo', 'Centros de esqui na temporada de inverno'],
      epoca: 'Junho a agosto para neve; setembro a novembro para passeios na cidade.',
      inclui: ['Item pessoal e mala de mão de até 10 kg', 'Documento: RG em bom estado ou passaporte']
    },
    'natal-pipa': {
      tipo: 'pacote', titulo: 'Natal e Pipa', regiao: 'Rio Grande do Norte, Brasil', img: 'img/ofertas/natal-pipa.jpg', alt: 'Praia de Ponta Negra e o Morro do Careca, em Natal',
      origem: 'GRU', destino: 'NAT', viagem: 'ida-volta', preco: 1680, cia: 'GOL', noites: 5,
      descricao: 'Dunas, falésias e praias de águas mornas, combinando a capital potiguar com o vilarejo de Pipa.',
      destaques: ['Passeio de buggy pelas dunas de Genipabu', 'Morro do Careca, em Ponta Negra', 'Baía dos Golfinhos, em Pipa'],
      epoca: 'Setembro a março, com mais sol.',
      inclui: ['Voo de ida e volta', '5 noites de hospedagem com café da manhã', 'Item pessoal e mala de mão de até 10 kg']
    },
    'maceio': {
      tipo: 'pacote', titulo: 'Maceió', regiao: 'Alagoas, Brasil', img: 'img/ofertas/maceio-pacote.jpg', alt: 'Barcos a vela no mar azul-turquesa de Maceió',
      origem: 'GRU', destino: 'MCZ', viagem: 'ida-volta', preco: 2450, cia: 'AZUL', noites: 5,
      descricao: 'Mar em tons de verde e azul, piscinas naturais e um resort all inclusive para descansar.',
      destaques: ['Piscinas naturais de Pajuçara', 'Praia do Francês', 'Passeio até as Galés de Maragogi'],
      epoca: 'Setembro a março, com mar mais claro.',
      inclui: ['Voo de ida e volta', '5 noites em resort all inclusive', 'Item pessoal e mala de mão de até 10 kg']
    },
    'bonito': {
      tipo: 'pacote', titulo: 'Bonito', regiao: 'Mato Grosso do Sul, Brasil', img: 'img/ofertas/bonito.jpg', alt: 'Lago de água azul dentro de uma gruta em Bonito',
      origem: 'VCP', destino: 'BYO', viagem: 'ida-volta', preco: 2190, cia: 'AZUL', noites: 4,
      descricao: 'Rios de água cristalina, grutas e cachoeiras em um dos destinos de ecoturismo mais conhecidos do país.',
      destaques: ['Flutuação no Rio da Prata', 'Gruta do Lago Azul', 'Buraco das Araras'],
      epoca: 'O ano todo, com passeios agendados com antecedência.',
      inclui: ['Voo de ida e volta', '4 noites de hospedagem com café da manhã', 'Item pessoal e mala de mão de até 10 kg']
    },
    'bariloche': {
      tipo: 'pacote', titulo: 'Bariloche', regiao: 'Argentina', img: 'img/ofertas/bariloche.jpg', alt: 'Lagos e montanhas com neve na região de Bariloche',
      origem: 'GRU', destino: 'BRC', viagem: 'ida-volta', preco: 3290, cia: 'LATAM', noites: 5,
      descricao: 'Lagos, montanhas e chocolates artesanais na Patagônia argentina, com esqui no inverno.',
      destaques: ['Cerro Catedral e a temporada de esqui', 'Circuito Chico, entre lagos e bosques', 'Chocolaterias do centro'],
      epoca: 'Julho a setembro para neve; dezembro a março para trilhas e lagos.',
      inclui: ['Voo de ida e volta', '5 noites de hospedagem com café da manhã', 'Documento: RG em bom estado ou passaporte']
    }
  };

  var HOSPEDAGENS_DESTAQUE = {
    'resort-maceio': {
      titulo: 'Resort all inclusive à beira-mar', tipo: 'Resort', lugar: 'MCZ', img: 'img/hospedagens/resort-maceio.jpg', alt: 'Piscina cercada por coqueiros em um resort à beira-mar', preco: 2052,
      descricao: 'Resort com piscinas de frente para o mar, restaurantes inclusos e atividades para crianças e adultos.',
      comodidades: ['all-inclusive', 'piscina', 'wifi', 'estacionamento']
    },
    'hotel-natal': {
      titulo: 'Hotel na orla de Ponta Negra', tipo: 'Hotel', lugar: 'NAT', img: 'img/hospedagens/hotel-natal.jpg', alt: 'Piscina e deck de madeira de um hotel no litoral', preco: 469,
      descricao: 'Hotel com deck, piscina e café da manhã regional, perto do Morro do Careca.',
      comodidades: ['cafe', 'piscina', 'wifi']
    },
    'pousada-campos': {
      titulo: 'Pousada com lareira na serra', tipo: 'Pousada', lugar: 'campos-do-jordao', img: 'img/hospedagens/pousada-campos-do-jordao.jpg', alt: 'Pousada em estilo europeu cercada por árvores na serra', preco: 297,
      descricao: 'Pousada cercada por araucárias, com lareira nos quartos e café colonial.',
      comodidades: ['lareira', 'cafe', 'estacionamento']
    },
    'hotel-sao-paulo': {
      titulo: 'Hotel executivo perto da Paulista', tipo: 'Hotel', lugar: 'GRU', img: 'img/hospedagens/hotel-sao-paulo.jpg', alt: 'Quarto de hotel com cama de casal e janelas amplas', preco: 316,
      descricao: 'Quartos amplos perto de museus, restaurantes e estações de metrô.',
      comodidades: ['wifi', 'cafe', 'estacionamento']
    }
  };

  // Ponto de foco das fotos verticais quando recortadas na horizontal
  var FOCO_IMAGENS = {
    'salvador': '50% 30%',
    'porto-seguro': '50% 62%',
    'pousada-campos-do-jordao': '50% 72%',
    'chale-serra': '50% 60%',
    'sedan': '50% 80%',
    'seguro-viagem': '50% 35%'
  };
  function foco(caminho) {
    var nome = String(caminho || '').split('/').pop().replace(/\.\w+$/, '');
    return FOCO_IMAGENS[nome] || '50% 50%';
  }

  global.PJ = {
    foco: foco,
    // dados
    LUGARES: LUGARES, COMPANHIAS: COMPANHIAS, CLASSES: CLASSES, COMODIDADES: COMODIDADES,
    OFERTAS: OFERTAS, HOSPEDAGENS_DESTAQUE: HOSPEDAGENS_DESTAQUE,
    // lugares
    lugarPorId: lugarPorId, encontrarLugar: encontrarLugar, ehAeroporto: ehAeroporto, aeroportoDe: aeroportoDe,
    mesmaCidade: mesmaCidade, rotulo: rotulo, rotuloAeroporto: rotuloAeroporto, rotuloCidade: rotuloCidade,
    descricaoAeroporto: descricaoAeroporto, regiao: regiao, distanciaKm: distanciaKm, tempoDeVoo: tempoDeVoo,
    // simulação
    gerarVoos: gerarVoos, gerarHospedagens: gerarHospedagens, gerarCarros: gerarCarros, gerarPacotes: gerarPacotes,
    // formatação
    normalizar: normalizar, numero: numero, moeda: moeda, plural: plural,
    lerData: lerData, dataISO: dataISO, somarDias: somarDias, hojeISO: hojeISO, diasEntre: diasEntre,
    dataCurta: dataCurta, dataLonga: dataLonga, minutosParaHora: minutosParaHora, horaParaMinutos: horaParaMinutos,
    duracaoTexto: duracaoTexto
  };
})(window);
