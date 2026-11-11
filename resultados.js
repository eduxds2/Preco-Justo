/* =====================================================================
   PREÇO JUSTO — Página de resultados (busca.html)
   ---------------------------------------------------------------------
   Lê a busca enviada pela página inicial (parâmetros da URL), gera
   resultados fictícios com dados.js e permite filtrar, ordenar e ver
   o resumo de cada opção. Nada é enviado a servidores.
   ===================================================================== */
(function () {
  'use strict';

  var PJ = window.PJ;
  var UI = window.PJUI;
  var doc = document;
  var lista = doc.getElementById('listaResultados');
  if (!PJ || !UI || !lista) return;

  var $ = function (sel, ctx) { return (ctx || doc).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || doc).querySelectorAll(sel)); };
  var esc = UI.esc, icone = UI.icone;
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var params = new URLSearchParams(window.location.search);
  var hoje = PJ.hojeISO();

  function inteiro(chave, padrao, min, max) {
    var n = parseInt(params.get(chave), 10);
    if (isNaN(n)) n = padrao;
    return Math.min(max, Math.max(min, n));
  }
  function dataValida(iso) { return !!PJ.lerData(iso) && iso >= hoje; }
  function horaValida(h) { return /^([01]\d|2[0-3]):[0-5]\d$/.test(h || ''); }
  function lugar(chave, somenteAeroporto) {
    var l = PJ.lugarPorId(params.get(chave) || '');
    if (!l || l.oculto || (somenteAeroporto && !PJ.ehAeroporto(l))) return null;
    return l;
  }
  function preco(valor) { return '<small>R$</small> ' + PJ.numero(valor); }
  function pessoasTexto(a, c, b) {
    var partes = [PJ.plural(a, 'adulto', 'adultos')];
    if (c) partes.push(PJ.plural(c, 'criança', 'crianças'));
    if (b) partes.push(PJ.plural(b, 'bebê', 'bebês'));
    return partes.join(', ');
  }

  /* ---------- 1. Interpretar a busca ---------- */
  function lerBusca() {
    var tipo = params.get('tipo');
    var b = { tipo: tipo };
    if (tipo === 'voos') {
      b.origem = lugar('origem', true);
      b.destino = lugar('destino', true);
      b.ida = params.get('ida');
      b.volta = params.get('volta') || '';
      b.adultos = inteiro('adultos', 1, 1, 9);
      b.criancas = inteiro('criancas', 0, 0, 8);
      b.bebes = Math.min(inteiro('bebes', 0, 0, 4), b.adultos);
      b.classe = PJ.CLASSES[params.get('classe')] ? params.get('classe') : 'Econômica';
      if (!b.origem || !b.destino) return { erro: 'Não conseguimos identificar a origem ou o destino desta busca.' };
      if (PJ.mesmaCidade(b.origem, b.destino)) return { erro: 'A origem e o destino precisam ser cidades diferentes.' };
      if (!dataValida(b.ida)) return { erro: 'A data de ida não é válida ou já passou.' };
      if (b.volta && (!PJ.lerData(b.volta) || b.volta < b.ida)) return { erro: 'A data de volta precisa ser igual ou posterior à ida.' };
      return b;
    }
    if (tipo === 'hospedagem') {
      b.lugar = lugar('destino');
      b.entrada = params.get('entrada');
      b.saida = params.get('saida');
      b.adultos = inteiro('adultos', 2, 1, 12);
      b.criancas = inteiro('criancas', 0, 0, 8);
      b.quartos = inteiro('quartos', 1, 1, 6);
      if (!b.lugar) return { erro: 'Não conseguimos identificar o destino da hospedagem.' };
      if (!dataValida(b.entrada) || !PJ.lerData(b.saida) || b.saida <= b.entrada) return { erro: 'As datas de check-in e check-out não são válidas.' };
      return b;
    }
    if (tipo === 'pacotes') {
      b.origem = lugar('origem', true);
      b.destino = lugar('destino');
      b.ida = params.get('ida');
      b.volta = params.get('volta');
      b.adultos = inteiro('adultos', 2, 1, 9);
      b.criancas = inteiro('criancas', 0, 0, 6);
      b.quartos = inteiro('quartos', 1, 1, 4);
      if (!b.origem || !b.destino) return { erro: 'Não conseguimos identificar a origem ou o destino do pacote.' };
      if (PJ.mesmaCidade(b.origem, b.destino) || PJ.aeroportoDe(b.destino) === b.origem) return { erro: 'Escolha um destino em outra cidade para montar o pacote.' };
      if (!dataValida(b.ida) || !PJ.lerData(b.volta) || b.volta <= b.ida) return { erro: 'As datas de ida e volta do pacote não são válidas.' };
      return b;
    }
    if (tipo === 'carros') {
      b.retirada = lugar('retirada');
      b.devolucao = params.get('devolucao') ? lugar('devolucao') : null;
      b.dataRetirada = params.get('dataRet');
      b.horaRetirada = horaValida(params.get('horaRet')) ? params.get('horaRet') : '10:00';
      b.dataDevolucao = params.get('dataDev');
      b.horaDevolucao = horaValida(params.get('horaDev')) ? params.get('horaDev') : '10:00';
      b.menor25 = params.get('menor25') === '1';
      if (!b.retirada || (params.get('devolucao') && !b.devolucao)) return { erro: 'Não conseguimos identificar o local de retirada ou devolução.' };
      if (!dataValida(b.dataRetirada) || !PJ.lerData(b.dataDevolucao) ||
        b.dataDevolucao + b.horaDevolucao <= b.dataRetirada + b.horaRetirada) return { erro: 'As datas de retirada e devolução não são válidas.' };
      return b;
    }
    return { erro: 'Nenhuma busca foi informada.' };
  }

  /* ---------- 2. Configuração por tipo de busca ---------- */
  var TIPOS = {
    voos: {
      icone: 'i-plane',
      gerar: function (b) { return PJ.gerarVoos(b); },
      titulo: function (b) {
        return esc(PJ.rotuloAeroporto(b.origem)) + icone('i-arrow-right', 'results-arrow') + esc(PJ.rotuloAeroporto(b.destino));
      },
      tituloPagina: function (b) { return 'Voos ' + b.origem.cidade + ' → ' + b.destino.cidade; },
      detalhes: function (b) {
        return [
          b.volta ? 'Ida e volta' : 'Somente ida',
          PJ.dataCurta(b.ida) + (b.volta ? ' a ' + PJ.dataCurta(b.volta) : ''),
          pessoasTexto(b.adultos, b.criancas, b.bebes),
          b.classe
        ];
      },
      filtros: [
        { id: 'preco', tipo: 'faixa', titulo: 'Preço por adulto', campo: 'precoAdulto' },
        { id: 'paradas', tipo: 'opcoes', titulo: 'Paradas', valor: function (i) { return i.paradas === 0 ? 'direto' : (i.paradas === 1 ? '1' : '2+'); },
          opcoes: [['direto', 'Voo direto'], ['1', '1 parada'], ['2+', '2 ou mais paradas']] },
        { id: 'cia', tipo: 'opcoes', titulo: 'Companhias', valor: function (i) { return i.cia.id; }, rotuloOpcao: function (i) { return i.cia.nome; } },
        { id: 'periodo', tipo: 'opcoes', titulo: 'Horário de saída (ida)', valor: function (i) { return i.periodo; },
          opcoes: [['madrugada', 'Madrugada (0h às 6h)'], ['manha', 'Manhã (6h às 12h)'], ['tarde', 'Tarde (12h às 18h)'], ['noite', 'Noite (18h às 24h)']] },
        { id: 'mala', tipo: 'marcar', titulo: 'Bagagem', rotulo: 'Mala despachada incluída', teste: function (i) { return i.mala; } }
      ],
      ordens: [['preco', 'Menor preço'], ['duracao', 'Menor duração'], ['saida-cedo', 'Saída mais cedo'], ['saida-tarde', 'Saída mais tarde']],
      ordenar: {
        'preco': function (a, b) { return a.precoAdulto - b.precoAdulto; },
        'duracao': function (a, b) { return a.duracao - b.duracao; },
        'saida-cedo': function (a, b) { return a.ida.saida - b.ida.saida; },
        'saida-tarde': function (a, b) { return b.ida.saida - a.ida.saida; }
      },
      card: cardVoo,
      resumo: resumoVoo,
      inicial: function (b, estado) { if (params.get('direto') === '1') estado.paradas = ['direto']; }
    },

    hospedagem: {
      icone: 'i-bed',
      gerar: function (b) { return PJ.gerarHospedagens(b); },
      titulo: function (b) { return 'Hospedagens em ' + esc(PJ.rotuloCidade(b.lugar)); },
      tituloPagina: function (b) { return 'Hospedagens em ' + b.lugar.cidade; },
      detalhes: function (b) {
        return [
          PJ.dataCurta(b.entrada) + ' a ' + PJ.dataCurta(b.saida),
          PJ.plural(PJ.diasEntre(b.entrada, b.saida), 'noite', 'noites'),
          PJ.plural(b.adultos + b.criancas, 'hóspede', 'hóspedes') + ', ' + PJ.plural(b.quartos, 'quarto', 'quartos')
        ];
      },
      filtros: [
        { id: 'preco', tipo: 'faixa', titulo: 'Diária por quarto', campo: 'precoNoite' },
        { id: 'categoria', tipo: 'opcoes', titulo: 'Tipo de hospedagem', valor: function (i) { return i.categoria; } },
        { id: 'comodidades', tipo: 'todas', titulo: 'Comodidades', valores: function (i) { return i.comodidades.concat(i.comodidades.indexOf('all-inclusive') > -1 ? ['cafe'] : []); },
          opcoes: [['cafe', 'Café da manhã'], ['piscina', 'Piscina'], ['wifi', 'Wi-Fi'], ['estacionamento', 'Estacionamento'], ['pets', 'Aceita pets']] },
        { id: 'distancia', tipo: 'unica', titulo: 'Distância do centro', opcoes: [['', 'Qualquer distância'], ['2', 'Até 2 km'], ['5', 'Até 5 km']],
          teste: function (i, v) { return !v || i.km <= Number(v); } },
        { id: 'cancelamento', tipo: 'marcar', titulo: 'Política', rotulo: 'Cancelamento grátis', teste: function (i) { return i.cancelamento; } }
      ],
      ordens: [['preco', 'Menor preço'], ['preco-desc', 'Maior preço'], ['distancia', 'Mais perto do centro']],
      ordenar: {
        'preco': function (a, b) { return a.precoNoite - b.precoNoite; },
        'preco-desc': function (a, b) { return b.precoNoite - a.precoNoite; },
        'distancia': function (a, b) { return a.km - b.km; }
      },
      card: cardHospedagem,
      resumo: resumoHospedagem,
      inicial: function (b, estado) { if (params.get('pets') === '1') estado.comodidades = ['pets']; }
    },

    pacotes: {
      icone: 'i-luggage',
      gerar: function (b) { return PJ.gerarPacotes(b); },
      titulo: function (b) {
        return esc(PJ.rotuloAeroporto(b.origem)) + icone('i-arrow-right', 'results-arrow') + esc(b.destino.cidade);
      },
      tituloPagina: function (b) { return 'Pacotes para ' + b.destino.cidade; },
      detalhes: function (b) {
        return [
          'Voo + hospedagem',
          PJ.dataCurta(b.ida) + ' a ' + PJ.dataCurta(b.volta),
          PJ.plural(PJ.diasEntre(b.ida, b.volta), 'noite', 'noites'),
          pessoasTexto(b.adultos, b.criancas, 0) + ', ' + PJ.plural(b.quartos, 'quarto', 'quartos')
        ];
      },
      filtros: [
        { id: 'preco', tipo: 'faixa', titulo: 'Preço por adulto', campo: 'precoPessoa' },
        { id: 'categoria', tipo: 'opcoes', titulo: 'Tipo de hospedagem', valor: function (i) { return i.categoria; } },
        { id: 'direto', tipo: 'marcar', titulo: 'Voo', rotulo: 'Somente voos diretos', teste: function (i) { return i.direto; } },
        { id: 'cafe', tipo: 'marcar', titulo: 'Refeições', rotulo: 'Café da manhã ou all inclusive', teste: function (i) { return i.cafe; } },
        { id: 'piscina', tipo: 'marcar', titulo: 'Lazer', rotulo: 'Hospedagem com piscina', teste: function (i) { return i.piscina; } }
      ],
      ordens: [['preco', 'Menor preço'], ['preco-desc', 'Maior preço']],
      ordenar: {
        'preco': function (a, b) { return a.precoPessoa - b.precoPessoa; },
        'preco-desc': function (a, b) { return b.precoPessoa - a.precoPessoa; }
      },
      card: cardPacote,
      resumo: resumoPacote
    },

    carros: {
      icone: 'i-car',
      gerar: function (b) { return PJ.gerarCarros(b); },
      titulo: function (b) { return 'Carros em ' + esc(PJ.rotulo(b.retirada)); },
      tituloPagina: function (b) { return 'Aluguel de carros em ' + b.retirada.cidade; },
      detalhes: function (b) {
        var d = [
          'Retirada ' + PJ.dataCurta(b.dataRetirada) + ', ' + b.horaRetirada,
          'Devolução ' + PJ.dataCurta(b.dataDevolucao) + ', ' + b.horaDevolucao
        ];
        if (b.devolucao && b.devolucao.id !== b.retirada.id) d.push('Devolução em ' + b.devolucao.cidade);
        if (b.menor25) d.push('Condutor com menos de 25 anos');
        return d;
      },
      filtros: [
        { id: 'preco', tipo: 'faixa', titulo: 'Diária', campo: 'precoDiaria' },
        { id: 'categoria', tipo: 'opcoes', titulo: 'Categoria', valor: function (i) { return i.categoria; } },
        { id: 'cambio', tipo: 'opcoes', titulo: 'Câmbio', valor: function (i) { return i.cambio; } },
        { id: 'capacidade', tipo: 'unica', titulo: 'Passageiros', opcoes: [['', 'Qualquer quantidade'], ['5', '5 ou mais'], ['7', '7 ou mais']],
          teste: function (i, v) { return !v || i.pessoas >= Number(v); } },
        { id: 'retirada', tipo: 'opcoes', titulo: 'Local de retirada', valor: function (i) { return i.retiradaTipo; } },
        { id: 'cancelamento', tipo: 'marcar', titulo: 'Política', rotulo: 'Cancelamento grátis', teste: function (i) { return i.cancelamento; } }
      ],
      ordens: [['preco', 'Menor preço'], ['preco-desc', 'Maior preço'], ['capacidade', 'Mais espaço']],
      ordenar: {
        'preco': function (a, b) { return a.precoDiaria - b.precoDiaria; },
        'preco-desc': function (a, b) { return b.precoDiaria - a.precoDiaria; },
        'capacidade': function (a, b) { return (b.pessoas * 10 + b.malas) - (a.pessoas * 10 + a.malas); }
      },
      card: cardCarro,
      resumo: resumoCarro
    }
  };

  /* ---------- 3. Cartões de resultado ---------- */
  function selos(item) {
    return item.selos.map(function (s) { return '<span class="badge">' + esc(s) + '</span>'; }).join('');
  }

  function htmlTrecho(t, rotulo, data) {
    var extra = t.diasExtras ? '<sup title="Chegada ' + (t.diasExtras === 1 ? 'no dia seguinte' : t.diasExtras + ' dias depois') + '">+' + t.diasExtras + '</sup>' : '';
    var paradas = t.paradas === 0 ? 'Direto' : PJ.plural(t.paradas, 'parada', 'paradas') + ' · ' + t.escalas.map(function (e) { return e.id; }).join(', ');
    return '<div class="leg">' +
      '<p class="leg-label">' + rotulo + ' · ' + PJ.dataCurta(data) + '</p>' +
      '<div class="flight-times">' +
        '<div><p class="time">' + PJ.minutosParaHora(t.saida) + '</p><p class="code">' + t.de.id + '</p></div>' +
        '<p class="flight-path"><span>' + PJ.duracaoTexto(t.duracao) + '</span><span class="stops' + (t.paradas ? '' : ' stops--direct') + '">' + paradas + '</span></p>' +
        '<div><p class="time">' + PJ.minutosParaHora(t.chegada) + extra + '</p><p class="code">' + t.para.id + '</p></div>' +
      '</div>' +
    '</div>';
  }
  function htmlSegmentos(t, rotulo) {
    var itens = t.segmentos.map(function (s, i) {
      var html = '<li><span class="seg-time">' + PJ.minutosParaHora(s.saida) + ' – ' + PJ.minutosParaHora(s.chegada) + '</span>' +
        '<span class="seg-route">' + esc(s.de.cidade) + ' (' + s.de.id + ') → ' + esc(s.para.cidade) + ' (' + s.para.id + ')</span>' +
        '<span class="seg-dur">' + PJ.duracaoTexto(s.duracao) + '</span></li>';
      if (t.conexoes[i]) {
        html += '<li class="seg-wait">' + icone('i-clock') + 'Conexão em ' + esc(t.conexoes[i].lugar.cidade) + ': ' + PJ.duracaoTexto(t.conexoes[i].duracao) + '</li>';
      }
      return html;
    }).join('');
    return '<div class="details-leg"><h4>' + rotulo + '</h4><ol class="segments">' + itens + '</ol></div>';
  }

  function cardVoo(v, b) {
    var pax = b.adultos + b.criancas + b.bebes;
    return '<li class="result flight">' +
      '<div class="flight-main">' +
        '<div class="flight-top">' +
          '<span class="flight-airline"><img src="' + v.cia.logo + '" alt="' + esc(v.cia.nome) + '" loading="lazy"></span>' +
          selos(v) + (v.mala ? '<span class="badge badge--muted">' + icone('i-briefcase') + 'Mala incluída</span>' : '') +
        '</div>' +
        htmlTrecho(v.ida, 'Ida', b.ida) +
        (v.volta ? htmlTrecho(v.volta, 'Volta', b.volta) : '') +
        '<button type="button" class="details-toggle" aria-expanded="false" aria-controls="det-' + v.id + '">Detalhes do voo' + icone('i-chevron-down') + '</button>' +
        '<div class="details" id="det-' + v.id + '" hidden>' +
          htmlSegmentos(v.ida, 'Ida') + (v.volta ? htmlSegmentos(v.volta, 'Volta') : '') +
          '<ul class="policies">' +
            '<li class="ok">' + icone('i-check') + 'Item pessoal e mala de mão de até 10 kg</li>' +
            '<li' + (v.mala ? ' class="ok">' + icone('i-check') + 'Mala despachada de 23 kg incluída' : '>' + icone('i-info') + 'Mala despachada não incluída') + '</li>' +
            '<li>' + icone('i-info') + 'Remarcação sujeita às regras da tarifa (ilustrativo)</li>' +
          '</ul>' +
        '</div>' +
      '</div>' +
      '<div class="flight-side">' +
        '<p class="price"><span class="price-from">' + (v.volta ? 'Ida e volta por adulto' : 'Por adulto') + '</span><strong>' + preco(v.precoAdulto) + '</strong>' +
        '<span class="price-note">Total ' + PJ.moeda(v.total) + ' · ' + PJ.plural(pax, 'pessoa', 'pessoas') + '</span></p>' +
        '<button type="button" class="btn btn-primary btn-sm" data-selecionar="' + v.id + '">Selecionar</button>' +
      '</div>' +
    '</li>';
  }

  function chipsComodidades(lista) {
    return '<ul class="amenities">' + lista.map(function (c) {
      var info = PJ.COMODIDADES[c];
      return info ? '<li>' + icone(info.icone) + esc(info.nome) + '</li>' : '';
    }).join('') + '</ul>';
  }

  function cardHospedagem(h, b) {
    return '<li class="result result--media">' +
      '<div class="result-media"><img src="' + h.img + '" alt="" style="object-position:' + PJ.foco(h.img) + '" loading="lazy"><span class="tag tag--light">' + esc(h.categoria) + '</span></div>' +
      '<div class="result-body">' +
        '<div class="result-badges">' + selos(h) + '</div>' +
        '<h3>' + esc(h.nome) + '</h3>' +
        '<p class="result-place">' + icone('i-pin') + 'A ' + String(h.km).replace('.', ',') + ' km do centro de ' + esc(h.lugar.cidade) + '</p>' +
        '<p class="result-desc">' + esc(h.descricao) + '</p>' +
        chipsComodidades(h.comodidades) +
        '<ul class="policies">' +
          (h.cancelamento ? '<li class="ok">' + icone('i-check') + 'Cancelamento grátis (ilustrativo)</li>' : '<li>' + icone('i-info') + 'Cancelamento com taxa</li>') +
        '</ul>' +
      '</div>' +
      '<div class="result-side">' +
        '<p class="price"><span class="price-from">Diária por quarto</span><strong>' + preco(h.precoNoite) + '</strong>' +
        '<span class="price-note">Total ' + PJ.moeda(h.total) + ' · ' + PJ.plural(h.noites, 'noite', 'noites') + (h.quartos > 1 ? ', ' + h.quartos + ' quartos' : '') + '</span></p>' +
        '<button type="button" class="btn btn-primary btn-sm" data-selecionar="' + h.id + '">Ver detalhes</button>' +
      '</div>' +
    '</li>';
  }

  function cardPacote(p, b) {
    var v = p.voo;
    var paradas = v.paradas === 0 ? 'direto' : PJ.plural(v.paradas, 'parada', 'paradas');
    return '<li class="result result--media">' +
      '<div class="result-media"><img src="' + p.hotel.img + '" alt="" style="object-position:' + PJ.foco(p.hotel.img) + '" loading="lazy"><span class="tag">Voo + hotel</span></div>' +
      '<div class="result-body">' +
        '<div class="result-badges">' + selos(p) + '</div>' +
        '<h3>' + esc(p.hotel.nome) + '</h3>' +
        '<p class="result-place">' + icone('i-pin') + esc(p.hotel.categoria) + ' em ' + esc(b.destino.cidade) + ' · ' + PJ.plural(p.noites, 'noite', 'noites') + '</p>' +
        '<div class="package-flight">' +
          '<img src="' + v.cia.logo + '" alt="' + esc(v.cia.nome) + '" loading="lazy">' +
          '<p><strong>Ida</strong> ' + PJ.dataCurta(b.ida) + ', ' + PJ.minutosParaHora(v.ida.saida) + ' · ' + v.ida.de.id + ' → ' + v.ida.para.id + '<br>' +
          '<strong>Volta</strong> ' + PJ.dataCurta(b.volta) + ', ' + PJ.minutosParaHora(v.volta.saida) + ' · voo ' + paradas + '</p>' +
        '</div>' +
        '<ul class="policies">' +
          '<li class="ok">' + icone('i-check') + 'Voo de ida e volta + ' + PJ.plural(p.noites, 'noite', 'noites') + '</li>' +
          (p.cafe ? '<li class="ok">' + icone('i-check') + (p.hotel.comodidades.indexOf('all-inclusive') > -1 ? 'All inclusive' : 'Café da manhã incluído') + '</li>' : '<li>' + icone('i-info') + 'Refeições não incluídas</li>') +
        '</ul>' +
      '</div>' +
      '<div class="result-side">' +
        '<p class="price"><span class="price-from">Por adulto</span><strong>' + preco(p.precoPessoa) + '</strong>' +
        '<span class="price-note">Total ' + PJ.moeda(p.total) + ' com taxas</span></p>' +
        '<button type="button" class="btn btn-primary btn-sm" data-selecionar="' + p.id + '">Ver pacote</button>' +
      '</div>' +
    '</li>';
  }

  function cardCarro(c, b) {
    return '<li class="result result--media result--car">' +
      '<div class="result-media"><img src="' + c.img + '" alt="" style="object-position:' + PJ.foco(c.img) + '" loading="lazy"><span class="tag tag--light">' + esc(c.categoria) + '</span></div>' +
      '<div class="result-body">' +
        '<div class="result-badges">' + selos(c) + '</div>' +
        '<h3>' + esc(c.modelo) + (c.similar ? ' <span>ou similar</span>' : '') + '</h3>' +
        '<p class="result-place">' + icone('i-key') + 'Retirada: ' + esc(c.retiradaTipo.toLowerCase()) + ' · ' + esc(b.retirada.cidade) + '</p>' +
        '<ul class="car-specs">' +
          '<li>' + icone('i-users') + c.pessoas + ' pessoas</li>' +
          '<li>' + icone('i-briefcase') + PJ.plural(c.malas, 'mala', 'malas') + '</li>' +
          '<li>' + icone('i-gauge') + c.cambio + '</li>' +
          '<li>' + icone('i-snowflake') + 'Ar-condicionado</li>' +
        '</ul>' +
        '<ul class="policies">' +
          '<li class="ok">' + icone('i-check') + 'Quilometragem livre</li>' +
          (c.protecao ? '<li class="ok">' + icone('i-shield') + 'Proteção básica incluída</li>' : '<li>' + icone('i-info') + 'Proteção opcional</li>') +
          (c.cancelamento ? '<li class="ok">' + icone('i-check') + 'Cancelamento grátis (ilustrativo)</li>' : '') +
        '</ul>' +
      '</div>' +
      '<div class="result-side">' +
        '<p class="price"><span class="price-from">Diária</span><strong>' + preco(c.precoDiaria) + '</strong>' +
        '<span class="price-note">Total ' + PJ.moeda(c.total) + ' · ' + PJ.plural(c.diarias, 'diária', 'diárias') + '</span></p>' +
        '<button type="button" class="btn btn-primary btn-sm" data-selecionar="' + c.id + '">Selecionar</button>' +
      '</div>' +
    '</li>';
  }

  /* ---------- 4. Resumo no modal ---------- */
  function linhas(itens, total) {
    return '<table class="breakdown"><tbody>' +
      itens.filter(Boolean).map(function (l) { return '<tr><th scope="row">' + l[0] + '</th><td>' + PJ.moeda(l[1]) + '</td></tr>'; }).join('') +
      '</tbody><tfoot><tr><th scope="row">Total ilustrativo</th><td>' + PJ.moeda(total) + '</td></tr></tfoot></table>';
  }
  function rodapeResumo() {
    return '<div class="modal-foot">' +
      '<p class="modal-note">' + icone('i-info') + 'Valores fictícios, sem garantia de disponibilidade. Nenhuma reserva é feita nesta demonstração.</p>' +
      '<div class="modal-actions">' +
        '<button type="button" class="btn btn-ghost" data-modal-close>Voltar aos resultados</button>' +
        '<button type="button" class="btn btn-sun" data-continuar>Continuar</button>' +
      '</div>' +
    '</div>';
  }

  function resumoVoo(v, b) {
    return '<div class="modal-body">' +
      '<p class="modal-eyebrow">Resumo do voo · ' + esc(v.cia.nome) + '</p>' +
      '<h2 id="modal-title">' + esc(b.origem.cidade) + ' → ' + esc(b.destino.cidade) + '</h2>' +
      '<div class="modal-legs">' + htmlTrecho(v.ida, 'Ida', b.ida) + (v.volta ? htmlTrecho(v.volta, 'Volta', b.volta) : '') + '</div>' +
      '<h3 class="modal-subtitle">Valores para ' + esc(pessoasTexto(b.adultos, b.criancas, b.bebes)) + '</h3>' +
      linhas([
        [PJ.plural(b.adultos, 'adulto', 'adultos') + ' × ' + PJ.moeda(v.precoAdulto), v.precoAdulto * b.adultos],
        b.criancas ? [PJ.plural(b.criancas, 'criança', 'crianças') + ' × ' + PJ.moeda(v.precoCrianca), v.precoCrianca * b.criancas] : null,
        b.bebes ? [PJ.plural(b.bebes, 'bebê', 'bebês') + ' × ' + PJ.moeda(v.precoBebe), v.precoBebe * b.bebes] : null,
        ['Taxas de embarque (ilustrativas)', v.taxas]
      ], v.total) +
    '</div>' + rodapeResumo();
  }

  function resumoHospedagem(h) {
    return '<div class="modal-media"><img src="' + h.img + '" alt="" style="object-position:' + PJ.foco(h.img) + '"><span class="tag tag--light">' + esc(h.categoria) + '</span></div>' +
      '<div class="modal-body">' +
        '<p class="modal-eyebrow">' + esc(PJ.rotuloCidade(h.lugar)) + ' · a ' + String(h.km).replace('.', ',') + ' km do centro</p>' +
        '<h2 id="modal-title">' + esc(h.nome) + '</h2>' +
        '<p class="modal-lead">' + esc(h.descricao) + '</p>' +
        chipsComodidades(h.comodidades) +
        '<h3 class="modal-subtitle">Valores da estadia</h3>' +
        linhas([
          [PJ.moeda(h.precoNoite) + ' × ' + PJ.plural(h.noites, 'noite', 'noites') + (h.quartos > 1 ? ' × ' + h.quartos + ' quartos' : ''), h.total]
        ], h.total) +
      '</div>' + rodapeResumo();
  }

  function resumoPacote(p, b) {
    return '<div class="modal-media"><img src="' + p.hotel.img + '" alt="" style="object-position:' + PJ.foco(p.hotel.img) + '"><span class="tag">Voo + hotel</span></div>' +
      '<div class="modal-body">' +
        '<p class="modal-eyebrow">Pacote para ' + esc(b.destino.cidade) + ' · ' + PJ.plural(p.noites, 'noite', 'noites') + '</p>' +
        '<h2 id="modal-title">' + esc(p.hotel.nome) + '</h2>' +
        '<p class="modal-lead">' + esc(p.hotel.descricao) + '</p>' +
        '<div class="modal-legs">' + htmlTrecho(p.voo.ida, 'Ida · ' + esc(p.voo.cia.nome), b.ida) + htmlTrecho(p.voo.volta, 'Volta', b.volta) + '</div>' +
        '<h3 class="modal-subtitle">Valores do pacote</h3>' +
        linhas([
          [PJ.plural(b.adultos, 'adulto', 'adultos') + ' × ' + PJ.moeda(p.precoPessoa), p.precoPessoa * b.adultos],
          b.criancas ? [PJ.plural(b.criancas, 'criança', 'crianças') + ' × ' + PJ.moeda(p.precoCrianca), p.precoCrianca * b.criancas] : null,
          ['Taxas de embarque (ilustrativas)', p.taxas]
        ], p.total) +
      '</div>' + rodapeResumo();
  }

  function resumoCarro(c, b) {
    return '<div class="modal-media"><img src="' + c.img + '" alt="" style="object-position:' + PJ.foco(c.img) + '"><span class="tag tag--light">' + esc(c.categoria) + '</span></div>' +
      '<div class="modal-body">' +
        '<p class="modal-eyebrow">Locação em ' + esc(b.retirada.cidade) + ' · ' + esc(c.retiradaTipo.toLowerCase()) + '</p>' +
        '<h2 id="modal-title">' + esc(c.modelo) + (c.similar ? ' ou similar' : '') + '</h2>' +
        '<p class="modal-lead">Retirada em ' + PJ.dataLonga(b.dataRetirada) + ' às ' + b.horaRetirada + ' e devolução em ' + PJ.dataLonga(b.dataDevolucao) + ' às ' + b.horaDevolucao + '.</p>' +
        '<h3 class="modal-subtitle">Valores da locação</h3>' +
        linhas([
          [PJ.moeda(c.precoDiaria) + ' × ' + PJ.plural(c.diarias, 'diária', 'diárias'), c.precoDiaria * c.diarias],
          c.taxaOutroLocal ? ['Devolução em outro local (ilustrativa)', c.taxaOutroLocal] : null,
          c.taxaJovem ? ['Condutor com menos de 25 anos (ilustrativa)', c.taxaJovem] : null
        ], c.total) +
      '</div>' + rodapeResumo();
  }

  /* ---------- 5. Montagem da página ---------- */
  var busca = lerBusca();
  var cfg = TIPOS[busca.tipo];
  var itens = [];
  var estado = {};
  var filtrosEl = doc.getElementById('filtrosConteudo');
  var ordenarEl = doc.getElementById('ordenar');
  var contagemEl = doc.getElementById('contagem');
  var vazioEl = doc.getElementById('semResultados');
  var asideEl = doc.getElementById('filtros');
  var toggleFiltros = $('.filters-toggle');

  function mostrarErroBusca(msg) {
    doc.getElementById('resumoTitulo').textContent = 'Não foi possível mostrar resultados';
    doc.getElementById('resumoDetalhes').textContent = 'Volte à página inicial e faça uma nova busca.';
    doc.getElementById('layoutResultados').innerHTML =
      '<div class="empty-state empty-state--page">' +
        '<span class="empty-icon">' + icone('i-search-x') + '</span>' +
        '<h2>' + esc(msg) + '</h2>' +
        '<p>Os resultados desta demonstração são criados a partir dos dados escolhidos no formulário de busca.</p>' +
        '<a href="index.html#busca" class="btn btn-primary">' + icone('i-arrow-left') + 'Fazer uma nova busca</a>' +
      '</div>';
  }

  if (busca.erro || !cfg) {
    mostrarErroBusca(busca.erro || 'Nenhuma busca foi informada.');
    return;
  }

  // Cabeçalho da busca
  doc.title = cfg.tituloPagina(busca) + ' | Preço Justo';
  doc.getElementById('resumoTitulo').innerHTML = cfg.titulo(busca);
  doc.getElementById('resumoDetalhes').textContent = cfg.detalhes(busca).join(' · ');
  $('#resumoIcone use').setAttribute('href', '#' + cfg.icone);
  doc.getElementById('alterarBusca').setAttribute('href', 'index.html?' + params.toString() + '#busca');
  if (busca.tipo === 'hospedagem' || busca.tipo === 'pacotes') {
    doc.getElementById('avisoDemo').textContent = 'Hospedagens e valores fictícios, criados para esta demonstração. Não representam estabelecimentos ou ofertas reais.';
  } else if (busca.tipo === 'carros') {
    doc.getElementById('avisoDemo').textContent = 'Categorias e valores fictícios, criados para esta demonstração. Os modelos são apenas exemplos de cada categoria.';
  }

  itens = cfg.gerar(busca);

  // Estado inicial dos filtros
  function estadoInicial() {
    var e = {};
    cfg.filtros.forEach(function (f) {
      if (f.tipo === 'faixa') e[f.id] = maximo(f.campo);
      else if (f.tipo === 'opcoes' || f.tipo === 'todas') e[f.id] = [];
      else if (f.tipo === 'unica') e[f.id] = '';
      else if (f.tipo === 'marcar') e[f.id] = false;
    });
    return e;
  }
  function minimo(campo) { return Math.floor(Math.min.apply(null, itens.map(function (i) { return i[campo]; })) / 10) * 10; }
  function maximo(campo) { return Math.ceil(Math.max.apply(null, itens.map(function (i) { return i[campo]; })) / 10) * 10; }

  function opcoesDoFiltro(f) {
    if (f.opcoes) return f.opcoes;
    var vistas = {}, resultado = [];
    itens.forEach(function (i) {
      var v = f.valor(i);
      if (vistas[v]) return;
      vistas[v] = true;
      resultado.push([v, f.rotuloOpcao ? f.rotuloOpcao(i) : v]);
    });
    return resultado;
  }
  function contar(f, valor) {
    return itens.filter(function (i) {
      if (f.tipo === 'opcoes') return f.valor(i) === valor;
      if (f.tipo === 'todas') return f.valores(i).indexOf(valor) > -1;
      if (f.tipo === 'unica') return f.teste(i, valor);
      return true;
    }).length;
  }

  function desenharFiltros() {
    filtrosEl.innerHTML = cfg.filtros.map(function (f) {
      var id = 'filtro-' + f.id;
      if (f.tipo === 'faixa') {
        var min = minimo(f.campo), max = maximo(f.campo);
        return '<div class="filter-group">' +
          '<h3><label for="' + id + '">' + f.titulo + '</label></h3>' +
          '<input type="range" class="range" id="' + id + '" data-filtro="' + f.id + '" min="' + min + '" max="' + max + '" step="10" value="' + estado[f.id] + '">' +
          '<div class="range-labels"><span>' + PJ.moeda(min) + '</span><output for="' + id + '" id="' + id + '-valor">até ' + PJ.moeda(estado[f.id]) + '</output></div>' +
        '</div>';
      }
      if (f.tipo === 'marcar') {
        return '<div class="filter-group"><h3>' + f.titulo + '</h3>' +
          '<label class="check"><input type="checkbox" data-filtro="' + f.id + '"' + (estado[f.id] ? ' checked' : '') + '><span>' + f.rotulo + '</span>' +
          '<span class="count">' + itens.filter(f.teste).length + '</span></label></div>';
      }
      var tipoInput = f.tipo === 'unica' ? 'radio' : 'checkbox';
      var opcoes = opcoesDoFiltro(f).map(function (o) {
        var n = contar(f, o[0]);
        var marcado = f.tipo === 'unica' ? estado[f.id] === o[0] : estado[f.id].indexOf(o[0]) > -1;
        var desabilitado = n === 0 && !marcado;
        return '<label class="check' + (desabilitado ? ' is-disabled' : '') + '">' +
          '<input type="' + tipoInput + '" name="' + id + '" data-filtro="' + f.id + '" value="' + esc(o[0]) + '"' + (marcado ? ' checked' : '') + (desabilitado ? ' disabled' : '') + '>' +
          '<span>' + esc(o[1]) + '</span>' + (f.tipo === 'unica' ? '' : '<span class="count">' + n + '</span>') + '</label>';
      }).join('');
      return '<fieldset class="filter-group"><legend>' + f.titulo + '</legend>' + opcoes + '</fieldset>';
    }).join('');
  }

  function passaNoFiltro(item) {
    return cfg.filtros.every(function (f) {
      var v = estado[f.id];
      if (f.tipo === 'faixa') return item[f.campo] <= v;
      if (f.tipo === 'opcoes') return !v.length || v.indexOf(f.valor(item)) > -1;
      if (f.tipo === 'todas') {
        var tem = f.valores(item);
        return v.every(function (x) { return tem.indexOf(x) > -1; });
      }
      if (f.tipo === 'unica') return f.teste(item, v);
      if (f.tipo === 'marcar') return !v || f.teste(item);
      return true;
    });
  }

  function filtrosAtivos() {
    var inicial = estadoInicial();
    return cfg.filtros.filter(function (f) {
      var v = estado[f.id];
      if (f.tipo === 'faixa') return v < inicial[f.id];
      if (f.tipo === 'opcoes' || f.tipo === 'todas') return v.length > 0;
      return !!v;
    }).length;
  }

  function desenharLista() {
    var filtrados = itens.filter(passaNoFiltro).sort(cfg.ordenar[ordenarEl.value] || cfg.ordenar.preco);
    lista.innerHTML = filtrados.map(function (i) { return cfg.card(i, busca); }).join('');
    lista.setAttribute('aria-busy', 'false');
    vazioEl.hidden = filtrados.length > 0;
    var total = itens.length;
    contagemEl.innerHTML = '<strong>' + PJ.plural(filtrados.length, 'opção', 'opções') + '</strong>' +
      (filtrados.length < total ? ' de ' + total : (filtrados.length === 1 ? ' encontrada' : ' encontradas'));
    var ativos = filtrosAtivos();
    if (toggleFiltros) $('span', toggleFiltros).textContent = ativos ? 'Filtros (' + ativos + ')' : 'Filtros';
    var verResultados = doc.getElementById('verResultados');
    if (verResultados) verResultados.textContent = filtrados.length ? 'Ver ' + PJ.plural(filtrados.length, 'opção', 'opções') : 'Nenhuma opção com esses filtros';
    if (!reduceMotion) {
      $$('.result', lista).forEach(function (el, n) {
        el.style.animationDelay = Math.min(n, 8) * 40 + 'ms';
        el.classList.add('is-entering');
      });
    }
  }

  // Ordenação
  ordenarEl.innerHTML = cfg.ordens.map(function (o) { return '<option value="' + o[0] + '">' + o[1] + '</option>'; }).join('');
  ordenarEl.addEventListener('change', desenharLista);

  // Filtros
  estado = estadoInicial();
  if (cfg.inicial) cfg.inicial(busca, estado);
  desenharFiltros();

  function aoMudarFiltro(event) {
    var campo = event.target;
    // A faixa de preço reage enquanto arrasta; caixas e opções reagem ao "change"
    if ((campo.type === 'range') !== (event.type === 'input')) return;
    var f = cfg.filtros.filter(function (x) { return x.id === campo.getAttribute('data-filtro'); })[0];
    if (!f) return;
    if (f.tipo === 'faixa') {
      estado[f.id] = Number(campo.value);
      doc.getElementById(campo.id + '-valor').textContent = 'até ' + PJ.moeda(estado[f.id]);
    } else if (f.tipo === 'marcar') {
      estado[f.id] = campo.checked;
    } else if (f.tipo === 'unica') {
      estado[f.id] = campo.value;
    } else {
      var marcados = $$('input[data-filtro="' + f.id + '"]:checked', filtrosEl).map(function (c) { return c.value; });
      estado[f.id] = marcados;
    }
    desenharLista();
  }
  filtrosEl.addEventListener('input', aoMudarFiltro);
  filtrosEl.addEventListener('change', aoMudarFiltro);

  doc.addEventListener('click', function (event) {
    if (!event.target.closest('[data-limpar-filtros]')) return;
    estado = estadoInicial();
    desenharFiltros();
    desenharLista();
    UI.mostrarAviso('Filtros limpos: mostrando todas as opções.', 2600);
  });

  // Filtros no celular: gaveta que sobe da base da tela
  var fundoFiltros = $('.filters-backdrop');
  function abrirFiltros() {
    asideEl.classList.add('is-open');
    if (fundoFiltros) fundoFiltros.hidden = false;
    toggleFiltros.setAttribute('aria-expanded', 'true');
    doc.documentElement.classList.add('modal-aberto');
    var fechar = $('.filters-close', asideEl);
    if (fechar) fechar.focus();
  }
  function fecharFiltros(devolverFoco) {
    if (!asideEl.classList.contains('is-open')) return;
    asideEl.classList.remove('is-open');
    if (fundoFiltros) fundoFiltros.hidden = true;
    toggleFiltros.setAttribute('aria-expanded', 'false');
    doc.documentElement.classList.remove('modal-aberto');
    if (devolverFoco) toggleFiltros.focus();
  }
  if (toggleFiltros) {
    toggleFiltros.addEventListener('click', function () {
      if (asideEl.classList.contains('is-open')) fecharFiltros(true); else abrirFiltros();
    });
    doc.addEventListener('click', function (event) {
      if (event.target.closest('[data-fechar-filtros]')) fecharFiltros(true);
    });
    doc.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && asideEl.classList.contains('is-open')) fecharFiltros(true);
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > 960) fecharFiltros(false);
    });
  }

  // Detalhes do voo e seleção
  lista.addEventListener('click', function (event) {
    var detalhes = event.target.closest('.details-toggle');
    if (detalhes) {
      var painel = doc.getElementById(detalhes.getAttribute('aria-controls'));
      var aberto = detalhes.getAttribute('aria-expanded') !== 'true';
      detalhes.setAttribute('aria-expanded', String(aberto));
      painel.hidden = !aberto;
      detalhes.firstChild.textContent = aberto ? 'Ocultar detalhes' : 'Detalhes do voo';
      return;
    }
    var selecionar = event.target.closest('[data-selecionar]');
    if (!selecionar) return;
    var item = itens.filter(function (i) { return i.id === selecionar.getAttribute('data-selecionar'); })[0];
    if (item) UI.abrirModal(cfg.resumo(item, busca), item.tipo === 'voo' ? 'modal--summary' : 'modal--offer');
  });

  doc.addEventListener('click', function (event) {
    if (!event.target.closest('[data-continuar]')) return;
    UI.fecharModal();
    UI.mostrarAviso('Esta é uma demonstração: a etapa de reserva e pagamento não está disponível.', 4600);
  });

  // Simula o tempo de busca com cartões de carregamento
  lista.innerHTML = [1, 2, 3].map(function () {
    return '<li class="result skeleton" aria-hidden="true"><span class="sk sk-media"></span><span class="sk-lines"><span class="sk"></span><span class="sk"></span><span class="sk sk--short"></span></span></li>';
  }).join('');
  setTimeout(desenharLista, reduceMotion ? 0 : 650);
})();
