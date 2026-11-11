/* =====================================================================
   PREÇO JUSTO — Interações de interface
   ---------------------------------------------------------------------
   Projeto acadêmico exclusivamente visual: nada aqui consulta servidores,
   cria reservas ou processa pagamentos. As buscas são validadas no
   navegador e levam à página de resultados (busca.html), que monta
   opções fictícias com os dados de dados.js.
   Cada bloco verifica se os elementos existem, então o mesmo arquivo
   é usado em todas as páginas.
   ===================================================================== */
(function () {
  'use strict';

  var doc = document;
  var PJ = window.PJ || null;
  var $ = function (sel, ctx) { return (ctx || doc).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || doc).querySelectorAll(sel)); };
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var DEMO_MSG = 'Ambiente demonstrativo: este conteúdo é apenas ilustrativo.';

  function esc(texto) {
    return String(texto == null ? '' : texto).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function icone(id, classe) {
    return '<svg class="icon' + (classe ? ' ' + classe : '') + '" aria-hidden="true"><use href="#' + id + '"/></svg>';
  }

  /* ---------- Armazenamento local (protegido contra bloqueios) ---------- */
  var storage = {
    get: function (key) { try { return window.localStorage.getItem(key); } catch (e) { return null; } },
    set: function (key, value) { try { window.localStorage.setItem(key, value); } catch (e) { /* sem armazenamento */ } },
    remove: function (key) { try { window.localStorage.removeItem(key); } catch (e) { /* sem armazenamento */ } }
  };

  /* ---------- Aviso flutuante (toast) ---------- */
  var toastTimer;
  function getToast() {
    var toast = $('#toast');
    if (!toast) {
      toast = doc.createElement('div');
      toast.className = 'toast';
      toast.id = 'toast';
      toast.setAttribute('role', 'status');
      toast.setAttribute('aria-live', 'polite');
      toast.hidden = true;
      toast.innerHTML = icone('i-info') + '<span data-toast-text></span>';
      doc.body.appendChild(toast);
    }
    return toast;
  }
  function showToast(message, duration) {
    var toast = getToast();
    $('[data-toast-text]', toast).textContent = message || DEMO_MSG;
    toast.hidden = false;
    void toast.offsetWidth; // reinicia a transição
    toast.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toast.classList.remove('is-visible');
      setTimeout(function () { toast.hidden = true; }, 300);
    }, duration || 4200);
  }

  // Links e botões demonstrativos
  doc.addEventListener('click', function (event) {
    var demo = event.target.closest('[data-demo]');
    if (!demo) return;
    event.preventDefault();
    showToast(demo.getAttribute('data-message'));
  });

  /* ---------- Modal (elemento <dialog>) ---------- */
  var modal = $('#modal');
  var modalOrigem = null;
  function abrirModal(html, classe) {
    if (!modal) return;
    modal.className = 'modal' + (classe ? ' ' + classe : '');
    modal.innerHTML =
      '<button type="button" class="modal-close" data-modal-close aria-label="Fechar">' + icone('i-x') + '</button>' +
      '<div class="modal-scroll">' + html + '</div>';
    modalOrigem = doc.activeElement;
    if (typeof modal.showModal === 'function') modal.showModal();
    else modal.setAttribute('open', '');
    doc.documentElement.classList.add('modal-aberto');
    var titulo = $('#modal-title', modal);
    if (titulo) { titulo.setAttribute('tabindex', '-1'); titulo.focus(); }
  }
  function fecharModal() {
    if (!modal || !modal.open) return;
    if (typeof modal.close === 'function') modal.close();
    else { modal.removeAttribute('open'); aoFecharModal(); }
  }
  function aoFecharModal() {
    doc.documentElement.classList.remove('modal-aberto');
    if (modalOrigem && doc.body.contains(modalOrigem)) modalOrigem.focus();
  }
  if (modal) {
    modal.addEventListener('close', aoFecharModal);
    modal.addEventListener('click', function (event) {
      if (event.target === modal || event.target.closest('[data-modal-close]')) fecharModal();
    });
  }

  // Disponível para resultados.js
  window.PJUI = { mostrarAviso: showToast, abrirModal: abrirModal, fecharModal: fecharModal, esc: esc, icone: icone };
  window.mostrarAviso = showToast;

  /* ---------- Navegação por teclado em listas de abas ---------- */
  function bindTablist(tabs, activate) {
    tabs.forEach(function (tab, index) {
      tab.addEventListener('click', function () { activate(tab, false); });
      tab.addEventListener('keydown', function (event) {
        var next = null;
        if (event.key === 'ArrowRight') next = tabs[(index + 1) % tabs.length];
        else if (event.key === 'ArrowLeft') next = tabs[(index - 1 + tabs.length) % tabs.length];
        else if (event.key === 'Home') next = tabs[0];
        else if (event.key === 'End') next = tabs[tabs.length - 1];
        if (next) {
          event.preventDefault();
          activate(next, true);
        }
      });
    });
  }

  /* ---------- Cabeçalho ---------- */
  var header = $('.site-header');
  if (header) {
    var onScroll = function () { header.classList.toggle('is-scrolled', window.scrollY > 8); };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------- Menu mobile ---------- */
  var menu = $('#mobileMenu');
  var menuToggle = $('.nav-toggle');
  function openMenu() {
    if (!menu) return;
    menu.hidden = false;
    requestAnimationFrame(function () { menu.classList.add('is-open'); });
    menuToggle.setAttribute('aria-expanded', 'true');
    menuToggle.setAttribute('aria-label', 'Fechar menu');
    doc.body.style.overflow = 'hidden';
    var closeBtn = $('[data-close-menu].icon-btn', menu);
    if (closeBtn) closeBtn.focus();
  }
  function closeMenu(returnFocus) {
    if (!menu || menu.hidden) return;
    menu.classList.remove('is-open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Abrir menu');
    doc.body.style.overflow = '';
    setTimeout(function () { menu.hidden = true; }, reduceMotion ? 0 : 280);
    if (returnFocus) menuToggle.focus();
  }
  if (menu && menuToggle) {
    menuToggle.addEventListener('click', function () {
      if (menu.hidden) openMenu(); else closeMenu(true);
    });
    $$('[data-close-menu]', menu).forEach(function (el) {
      el.addEventListener('click', function () { closeMenu(true); });
    });
    $$('a', menu).forEach(function (link) {
      link.addEventListener('click', function () { closeMenu(false); });
    });
    // Mantém o foco do teclado dentro do menu aberto
    menu.addEventListener('keydown', function (event) {
      if (event.key !== 'Tab') return;
      var focaveis = $$('a[href], button:not([disabled])', $('.mobile-menu-panel', menu));
      if (!focaveis.length) return;
      var primeiro = focaveis[0], ultimo = focaveis[focaveis.length - 1];
      if (event.shiftKey && doc.activeElement === primeiro) { event.preventDefault(); ultimo.focus(); }
      else if (!event.shiftKey && doc.activeElement === ultimo) { event.preventDefault(); primeiro.focus(); }
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth >= 1080) closeMenu(false);
    });
  }

  /* ---------- Estado de login simulado (definido em login.html) ---------- */
  var authSlot = $('#authActionContainer');
  if (authSlot && storage.get('usuarioLogado') === 'true') {
    authSlot.innerHTML =
      '<div class="account">' +
        '<button type="button" class="btn btn-header" aria-expanded="false" aria-controls="accountMenu" data-account-toggle>' +
          icone('i-user') + '<span>Minha conta</span>' + icone('i-chevron-down', 'chevron') +
        '</button>' +
        '<div class="account-menu" id="accountMenu" hidden>' +
          '<a href="#" data-demo>' + icone('i-luggage') + 'Minhas viagens</a>' +
          '<a href="#" data-demo>' + icone('i-heart') + 'Favoritos</a>' +
          '<button type="button" data-logout>' + icone('i-logout') + 'Sair</button>' +
        '</div>' +
      '</div>';

    var accountToggle = $('[data-account-toggle]', authSlot);
    var accountMenu = $('#accountMenu');
    accountToggle.addEventListener('click', function () {
      var open = accountMenu.hidden;
      accountMenu.hidden = !open;
      accountToggle.setAttribute('aria-expanded', String(open));
    });
    doc.addEventListener('click', function (event) {
      if (!accountMenu.hidden && !event.target.closest('.account')) {
        accountMenu.hidden = true;
        accountToggle.setAttribute('aria-expanded', 'false');
      }
    });

    var mobileAuth = $('#mobileAuthLink');
    if (mobileAuth) {
      mobileAuth.innerHTML = icone('i-logout') + 'Sair da conta';
      mobileAuth.setAttribute('href', '#');
      mobileAuth.setAttribute('data-logout', '');
    }
  }
  doc.addEventListener('click', function (event) {
    if (!event.target.closest('[data-logout]')) return;
    event.preventDefault();
    storage.remove('usuarioLogado');
    window.location.reload();
  });

  /* =====================================================================
     BUSCA DA PÁGINA INICIAL
     ===================================================================== */

  // Sugestões de cidades e aeroportos (geradas a partir de dados.js)
  if (PJ) {
    var listaAeroportos = $('#lista-aeroportos');
    if (listaAeroportos) {
      listaAeroportos.innerHTML = PJ.LUGARES.filter(function (l) { return !l.oculto && PJ.ehAeroporto(l); })
        .map(function (l) { return '<option value="' + esc(PJ.rotuloAeroporto(l)) + '">' + esc(PJ.descricaoAeroporto(l)) + '</option>'; })
        .join('');
    }
    var listaCidades = $('#lista-cidades');
    if (listaCidades) {
      var cidadesVistas = {};
      listaCidades.innerHTML = PJ.LUGARES.filter(function (l) {
        var chave = PJ.normalizar(l.cidade);
        if (l.oculto || cidadesVistas[chave]) return false;
        cidadesVistas[chave] = true;
        return true;
      }).map(function (l) {
        var info = l.proximo ? 'Aeroporto mais próximo: ' + PJ.lugarPorId(l.proximo).cidade : PJ.regiao(l);
        return '<option value="' + esc(PJ.rotuloCidade(l)) + '">' + esc(info) + '</option>';
      }).join('');
    }
  }

  /* ---------- Abas da busca (Voos, Hospedagem, Pacotes, Carros) ---------- */
  var searchTabs = $$('[data-search-tab]');
  function ativarAbaBusca(tab, focus) {
    searchTabs.forEach(function (t) {
      var selected = t === tab;
      t.setAttribute('aria-selected', String(selected));
      t.tabIndex = selected ? 0 : -1;
      var panel = doc.getElementById(t.getAttribute('aria-controls'));
      if (panel) panel.hidden = !selected;
    });
    closeAllPopovers();
    if (focus) tab.focus();
  }
  if (searchTabs.length) bindTablist(searchTabs, ativarAbaBusca);

  // Ida e volta / somente ida
  function sincronizarTipoViagem(form) {
    var somenteIda = $('[data-trip-type][value="somente-ida"]', form);
    var field = $('[data-return-field]', form);
    if (!somenteIda || !field) return;
    var input = $('input', field);
    field.classList.toggle('is-disabled', somenteIda.checked);
    input.disabled = somenteIda.checked;
    if (somenteIda.checked) {
      input.value = '';
      limparErroCampo(input);
    }
    markEmptyDate(input);
  }
  $$('[data-trip-type]').forEach(function (radio) {
    radio.addEventListener('change', function () { sincronizarTipoViagem(radio.form); });
  });

  // Inverter origem e destino
  $$('[data-swap]').forEach(function (button) {
    button.addEventListener('click', function () {
      var ids = button.getAttribute('data-swap').split(' ');
      var a = doc.getElementById(ids[0]);
      var b = doc.getElementById(ids[1]);
      if (!a || !b) return;
      var temp = a.value;
      a.value = b.value;
      b.value = temp;
      limparErroCampo(a);
      limparErroCampo(b);
      button.classList.remove('is-spinning');
      void button.offsetWidth;
      button.classList.add('is-spinning');
    });
  });

  // Datas: mínimo = hoje, volta nunca antes da ida, calendário ao clicar
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function localISO(date) { return date.getFullYear() + '-' + pad(date.getMonth() + 1) + '-' + pad(date.getDate()); }
  function markEmptyDate(input) {
    if (!input || input.type !== 'date') return;
    if (input.value) input.removeAttribute('data-empty');
    else input.setAttribute('data-empty', '');
  }
  var today = localISO(new Date());
  function ajustarFimDoPeriodo(input) {
    var endId = input.getAttribute('data-date-start');
    var end = endId && doc.getElementById(endId);
    if (!end) return;
    end.min = input.value || today;
    if (end.value && input.value && end.value < input.value) {
      end.value = '';
      markEmptyDate(end);
    }
  }
  $$('.field input[type="date"]').forEach(function (input) {
    input.min = today;
    markEmptyDate(input);
    input.addEventListener('change', function () {
      markEmptyDate(input);
      ajustarFimDoPeriodo(input);
    });
    input.addEventListener('click', function () {
      if (typeof input.showPicker === 'function') {
        try { input.showPicker(); } catch (e) { /* navegador sem suporte */ }
      }
    });
  });

  // Campo extra de devolução do carro
  $$('[data-toggle-field]').forEach(function (checkbox) {
    var field = doc.getElementById(checkbox.getAttribute('data-toggle-field'));
    if (!field) return;
    var grid = field.closest('.fields');
    var sync = function () {
      field.hidden = !checkbox.checked;
      if (grid) grid.classList.toggle('has-return', checkbox.checked);
      if (!checkbox.checked) limparErroCampo($('input', field));
    };
    checkbox.addEventListener('change', sync);
    sync();
  });

  /* ---------- Popovers com contadores (passageiros, hóspedes, viajantes) ---------- */
  function plural(n, one, many) { return n + ' ' + (n === 1 ? one : many); }
  var summaries = {
    passageiros: function (v) {
      var total = v.adultos + v.criancas + v.bebes;
      return total === v.adultos ? plural(v.adultos, 'adulto', 'adultos') : plural(total, 'passageiro', 'passageiros');
    },
    hospedes: function (v) {
      return plural(v.adultos + v.criancas, 'hóspede', 'hóspedes') + ', ' + plural(v.quartos, 'quarto', 'quartos');
    },
    viajantes: function (v) {
      return plural(v.adultos + v.criancas, 'viajante', 'viajantes') + ', ' + plural(v.quartos, 'quarto', 'quartos');
    }
  };

  var popovers = [];
  function closePopover(pop, returnFocus) {
    if (pop.hidden) return;
    pop.hidden = true;
    pop._trigger.setAttribute('aria-expanded', 'false');
    if (returnFocus) pop._trigger.focus();
  }
  function closeAllPopovers(except) {
    popovers.forEach(function (pop) { if (pop !== except) closePopover(pop, false); });
  }

  function initCounters(pop) {
    var counters = $$('.counter', pop);
    var initial = counters.map(function (c) { return c.getAttribute('data-value'); });
    var summaryEl = $('[data-summary]', pop._trigger);
    var format = summaries[pop.getAttribute('data-counter-group')];

    function values() {
      var v = {};
      counters.forEach(function (c) { v[c.getAttribute('data-key')] = Number(c.getAttribute('data-value')); });
      return v;
    }
    function render() {
      counters.forEach(function (c) {
        var value = Number(c.getAttribute('data-value'));
        $('output', c).textContent = value;
        $('[data-step="-1"]', c).disabled = value <= Number(c.getAttribute('data-min'));
        $('[data-step="1"]', c).disabled = value >= Number(c.getAttribute('data-max'));
      });
      if (summaryEl && format) summaryEl.textContent = format(values());
      limparErroCampo(pop._trigger);
    }
    function definir(novos) {
      counters.forEach(function (c) {
        var key = c.getAttribute('data-key');
        if (novos[key] == null || isNaN(novos[key])) return;
        var min = Number(c.getAttribute('data-min')), max = Number(c.getAttribute('data-max'));
        c.setAttribute('data-value', String(Math.min(max, Math.max(min, Number(novos[key])))));
      });
      render();
    }

    counters.forEach(function (c) {
      c.addEventListener('click', function (event) {
        var button = event.target.closest('[data-step]');
        if (!button || button.disabled) return;
        var min = Number(c.getAttribute('data-min'));
        var max = Number(c.getAttribute('data-max'));
        var value = Number(c.getAttribute('data-value')) + Number(button.getAttribute('data-step'));
        c.setAttribute('data-value', String(Math.min(max, Math.max(min, value))));
        render();
        if (button.disabled) {
          var other = $('[data-step]:not(:disabled)', c);
          if (other) other.focus();
        }
      });
    });

    var reset = $('[data-reset]', pop);
    if (reset) {
      reset.addEventListener('click', function () {
        counters.forEach(function (c, i) { c.setAttribute('data-value', initial[i]); });
        $$('input[type="checkbox"]', pop).forEach(function (chk) { chk.checked = false; });
        render();
      });
    }
    var confirm = $('[data-confirm]', pop);
    if (confirm) confirm.addEventListener('click', function () { closePopover(pop, true); });

    pop._valores = values;
    pop._definir = definir;
    render();
  }

  $$('.field-button[aria-controls]').forEach(function (trigger) {
    var pop = doc.getElementById(trigger.getAttribute('aria-controls'));
    if (!pop) return;
    pop._trigger = trigger;
    popovers.push(pop);
    initCounters(pop);
    trigger.addEventListener('click', function () {
      if (pop.hidden) {
        closeAllPopovers(pop);
        pop.hidden = false;
        trigger.setAttribute('aria-expanded', 'true');
        var first = $('button:not(:disabled)', pop);
        if (first) first.focus();
      } else {
        closePopover(pop, false);
      }
    });
  });

  doc.addEventListener('click', function (event) {
    popovers.forEach(function (pop) {
      if (!pop.hidden && !pop.contains(event.target) && !pop._trigger.contains(event.target)) {
        closePopover(pop, false);
      }
    });
  });

  doc.addEventListener('keydown', function (event) {
    if (event.key !== 'Escape') return;
    if (modal && modal.open) return; // o <dialog> fecha sozinho
    var openPop = popovers.filter(function (p) { return !p.hidden; })[0];
    if (openPop) { closePopover(openPop, true); return; }
    var accountMenu = $('#accountMenu');
    if (accountMenu && !accountMenu.hidden) {
      accountMenu.hidden = true;
      $('[data-account-toggle]').setAttribute('aria-expanded', 'false');
      $('[data-account-toggle]').focus();
      return;
    }
    closeMenu(true);
  });

  /* ---------- Validação da busca ---------- */
  function limparErroCampo(campo) {
    if (!campo) return;
    var field = campo.closest('.field');
    if (!field || !field.classList.contains('is-invalid')) return;
    field.classList.remove('is-invalid');
    campo.removeAttribute('aria-invalid');
    if (field._erroItem) {
      var lista = field._erroItem.parentNode;
      field._erroItem.remove();
      field._erroItem = null;
      if (lista && !lista.children.length) {
        var alerta = lista.closest('.form-alert');
        if (alerta) alerta.remove();
      }
    }
  }
  function limparErros(form) {
    $$('.form-alert', form).forEach(function (a) { a.remove(); });
    $$('.field.is-invalid', form).forEach(function (f) {
      f.classList.remove('is-invalid');
      f._erroItem = null;
      $$('[aria-invalid]', f).forEach(function (c) { c.removeAttribute('aria-invalid'); });
    });
  }
  function mostrarErros(form, erros) {
    limparErros(form);
    var alerta = doc.createElement('div');
    alerta.className = 'form-alert';
    alerta.setAttribute('role', 'alert');
    alerta.innerHTML = icone('i-alert') + '<div><strong>Confira os dados da busca</strong><ul></ul></div>';
    var ul = $('ul', alerta);
    erros.forEach(function (erro) {
      var li = doc.createElement('li');
      li.textContent = erro.msg;
      ul.appendChild(li);
      var field = erro.campo && erro.campo.closest('.field');
      if (field && !field.classList.contains('is-invalid')) {
        field.classList.add('is-invalid');
        field._erroItem = li;
        erro.campo.setAttribute('aria-invalid', 'true');
      }
    });
    form.insertBefore(alerta, $('.fields', form));
    var primeiro = erros[0].campo;
    if (primeiro && typeof primeiro.focus === 'function') primeiro.focus({ preventScroll: true });
    var painel = form.closest('.search-panel') || form;
    var topo = painel.getBoundingClientRect().top;
    if (topo < 80 || topo > window.innerHeight * 0.6) {
      window.scrollTo({ top: window.scrollY + topo - 96, behavior: reduceMotion ? 'auto' : 'smooth' });
    }
  }
  // Limpa o destaque assim que o campo é corrigido
  $$('.search-form').forEach(function (form) {
    form.addEventListener('input', function (event) { limparErroCampo(event.target); });
    form.addEventListener('change', function (event) { limparErroCampo(event.target); });
  });

  function lerLugar(input, erros, opcoes) {
    var valor = input.value.trim();
    if (!valor) {
      erros.push({ campo: input, msg: opcoes.vazio });
      return null;
    }
    var lugar = PJ.encontrarLugar(valor, { somenteAeroportos: !!opcoes.aeroporto });
    if (!lugar && opcoes.aeroporto) {
      var cidade = PJ.encontrarLugar(valor);
      if (cidade) {
        erros.push({ campo: input, msg: cidade.cidade + ' não tem aeroporto nesta demonstração. Que tal ' + PJ.rotuloAeroporto(PJ.aeroportoDe(cidade)) + '?' });
        return null;
      }
    }
    if (!lugar) {
      erros.push({ campo: input, msg: 'Não encontramos “' + valor + '”. Escolha uma opção da lista de sugestões.' });
      return null;
    }
    return lugar;
  }
  function lerData(input, erros, msgVazia, rotuloData) {
    var valor = input.value;
    if (!valor) {
      erros.push({ campo: input, msg: msgVazia });
      return '';
    }
    if (valor < today) {
      erros.push({ campo: input, msg: 'A data de ' + rotuloData + ' não pode estar no passado.' });
      return '';
    }
    if (PJ.diasEntre(today, valor) > 330) {
      erros.push({ campo: input, msg: 'Escolha uma data de ' + rotuloData + ' dentro dos próximos 11 meses.' });
      return '';
    }
    return valor;
  }
  function valoresContador(id) {
    var pop = doc.getElementById(id);
    return pop && pop._valores ? pop._valores() : {};
  }

  var validadores = {
    voos: function (form) {
      var erros = [];
      var origemEl = $('#voo-origem'), destinoEl = $('#voo-destino');
      var idaEl = $('#voo-ida'), voltaEl = $('#voo-volta');
      var origem = lerLugar(origemEl, erros, { aeroporto: true, vazio: 'Informe de onde você vai sair.' });
      var destino = lerLugar(destinoEl, erros, { aeroporto: true, vazio: 'Informe para onde você vai.' });
      if (origem && destino && PJ.mesmaCidade(origem, destino)) {
        erros.push({ campo: destinoEl, msg: 'Origem e destino precisam ser cidades diferentes.' });
      }
      var somenteIda = $('[data-trip-type][value="somente-ida"]', form).checked;
      var ida = lerData(idaEl, erros, 'Escolha a data de ida.', 'ida');
      var volta = '';
      if (!somenteIda) {
        if (!voltaEl.value) erros.push({ campo: voltaEl, msg: 'Escolha a data de volta ou marque “Somente ida”.' });
        else if (ida && voltaEl.value < ida) erros.push({ campo: voltaEl, msg: 'A volta precisa ser no mesmo dia ou depois da ida.' });
        else volta = voltaEl.value;
      }
      var pax = valoresContador('pop-voo-pax');
      if (pax.bebes > pax.adultos) {
        erros.push({ campo: $('[aria-controls="pop-voo-pax"]'), msg: 'Cada bebê viaja no colo de um adulto. Adicione mais adultos ou remova bebês.' });
      }
      if (erros.length) return { erros: erros };
      var params = { tipo: 'voos', origem: origem.id, destino: destino.id, ida: ida, adultos: pax.adultos, criancas: pax.criancas, bebes: pax.bebes, classe: $('#voo-classe').value };
      if (volta) params.volta = volta;
      if ($('#voo-direto') && $('#voo-direto').checked) params.direto = '1';
      return { params: params };
    },

    hospedagem: function () {
      var erros = [];
      var destinoEl = $('#stayDestino'), entradaEl = $('#stayDataEntrada'), saidaEl = $('#stayDataSaida');
      var lugar = lerLugar(destinoEl, erros, { vazio: 'Informe a cidade ou região da hospedagem.' });
      var entrada = lerData(entradaEl, erros, 'Escolha a data de check-in.', 'check-in');
      var saida = saidaEl.value;
      if (!saida) erros.push({ campo: saidaEl, msg: 'Escolha a data de check-out.' });
      else if (entrada && saida <= entrada) erros.push({ campo: saidaEl, msg: 'O check-out precisa ser pelo menos um dia depois do check-in.' });
      else if (entrada && PJ.diasEntre(entrada, saida) > 30) erros.push({ campo: saidaEl, msg: 'Nesta demonstração, as estadias podem ter até 30 noites.' });
      var h = valoresContador('guestModal');
      if (h.quartos && (h.adultos + h.criancas) / h.quartos > 4) {
        erros.push({ campo: $('[aria-controls="guestModal"]'), msg: 'Cada quarto acomoda até 4 hóspedes. Adicione mais quartos.' });
      }
      if (erros.length) return { erros: erros };
      var params = { tipo: 'hospedagem', destino: lugar.id, entrada: entrada, saida: saida, adultos: h.adultos, criancas: h.criancas, quartos: h.quartos };
      if ($('#chkPets') && $('#chkPets').checked) params.pets = '1';
      return { params: params };
    },

    pacotes: function () {
      var erros = [];
      var origemEl = $('#pac-origem'), destinoEl = $('#pac-destino');
      var idaEl = $('#pac-ida'), voltaEl = $('#pac-volta');
      var origem = lerLugar(origemEl, erros, { aeroporto: true, vazio: 'Informe de onde você vai sair.' });
      var destino = lerLugar(destinoEl, erros, { vazio: 'Informe o destino do pacote.' });
      if (origem && destino && (PJ.mesmaCidade(origem, destino) || PJ.aeroportoDe(destino) === origem)) {
        erros.push({ campo: destinoEl, msg: 'Escolha um destino em outra cidade para montar o pacote.' });
      }
      var ida = lerData(idaEl, erros, 'Escolha a data de ida.', 'ida');
      var volta = voltaEl.value;
      if (!volta) erros.push({ campo: voltaEl, msg: 'Pacotes incluem ida e volta: escolha a data de volta.' });
      else if (ida && volta <= ida) erros.push({ campo: voltaEl, msg: 'A volta precisa ser pelo menos um dia depois da ida.' });
      else if (ida && PJ.diasEntre(ida, volta) > 30) erros.push({ campo: voltaEl, msg: 'Nesta demonstração, os pacotes podem ter até 30 noites.' });
      var v = valoresContador('pop-pac-pax');
      if (v.quartos && (v.adultos + v.criancas) / v.quartos > 4) {
        erros.push({ campo: $('[aria-controls="pop-pac-pax"]'), msg: 'Cada quarto acomoda até 4 viajantes. Adicione mais quartos.' });
      }
      if (erros.length) return { erros: erros };
      return { params: { tipo: 'pacotes', origem: origem.id, destino: destino.id, ida: ida, volta: volta, adultos: v.adultos, criancas: v.criancas, quartos: v.quartos } };
    },

    carros: function () {
      var erros = [];
      var retiradaEl = $('#car-retirada'), devolucaoEl = $('#car-devolucao');
      var dataRetEl = $('#car-data-ret'), dataDevEl = $('#car-data-dev');
      var horaRet = $('#car-hora-ret').value, horaDev = $('#car-hora-dev').value;
      var retirada = lerLugar(retiradaEl, erros, { vazio: 'Informe onde você vai retirar o carro.' });
      var outroLocal = $('#car-outro-local').checked;
      var devolucao = outroLocal ? lerLugar(devolucaoEl, erros, { vazio: 'Informe onde você vai devolver o carro.' }) : null;
      var dataRet = lerData(dataRetEl, erros, 'Escolha a data de retirada.', 'retirada');
      var dataDev = dataDevEl.value;
      if (!dataDev) erros.push({ campo: dataDevEl, msg: 'Escolha a data de devolução.' });
      else if (dataRet && (dataDev < dataRet || (dataDev === dataRet && horaDev <= horaRet))) {
        erros.push({ campo: dataDevEl, msg: 'A devolução precisa ser depois da retirada.' });
      } else if (dataRet && PJ.diasEntre(dataRet, dataDev) > 30) {
        erros.push({ campo: dataDevEl, msg: 'Nesta demonstração, as locações podem ter até 30 diárias.' });
      }
      if (erros.length) return { erros: erros };
      var params = { tipo: 'carros', retirada: retirada.id, dataRet: dataRet, horaRet: horaRet, dataDev: dataDev, horaDev: horaDev };
      if (devolucao) params.devolucao = devolucao.id;
      if (!$('#car-idade').checked) params.menor25 = '1';
      return { params: params };
    }
  };

  $$('[data-search-form]').forEach(function (form) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      if (!PJ) { showToast(); return; }
      closeAllPopovers();
      var resultado = validadores[form.getAttribute('data-search-form')](form);
      if (resultado.erros) {
        mostrarErros(form, resultado.erros);
        return;
      }
      limparErros(form);
      var botao = $('.btn-search', form);
      if (botao) {
        botao.classList.add('is-loading');
        botao.setAttribute('aria-busy', 'true');
      }
      window.location.href = 'busca.html?' + new URLSearchParams(resultado.params).toString();
    });
  });

  /* ---------- Preenchimento da busca (ofertas, destinos e "Alterar busca") ---------- */
  function definirValor(id, valor) {
    var el = doc.getElementById(id);
    if (!el || valor == null) return;
    el.value = valor;
    el.dispatchEvent(new Event('change', { bubbles: true }));
  }
  function definirMarcado(el, marcado) {
    if (!el || el.checked === marcado) return;
    el.checked = marcado;
    el.dispatchEvent(new Event('change', { bubbles: true }));
  }
  function rotuloPorId(id, aeroporto) {
    var l = PJ && PJ.lugarPorId(id);
    if (!l) return null;
    return aeroporto ? PJ.rotuloAeroporto(PJ.aeroportoDe(l)) : PJ.rotulo(l);
  }

  function preencherBusca(tipo, v) {
    var tab = doc.getElementById('tab-' + tipo);
    if (!tab) return;
    ativarAbaBusca(tab, false);
    var form = doc.getElementById(tab.getAttribute('aria-controls'));
    limparErros(form);
    var numeros = function (obj) {
      var r = {};
      Object.keys(obj).forEach(function (k) { if (obj[k] != null && obj[k] !== '') r[k] = Number(obj[k]); });
      return r;
    };
    if (tipo === 'voos') {
      if (v.origem) definirValor('voo-origem', v.origem);
      if (v.destino) definirValor('voo-destino', v.destino);
      if (v.viagem) definirMarcado($('[data-trip-type][value="' + (v.viagem === 'somente-ida' ? 'somente-ida' : 'ida-volta') + '"]', form), true);
      if (v.ida) definirValor('voo-ida', v.ida);
      if (v.volta && v.viagem !== 'somente-ida') definirValor('voo-volta', v.volta);
      if (v.classe) definirValor('voo-classe', v.classe);
      if (v.direto != null) definirMarcado($('#voo-direto'), v.direto === '1');
      $('#pop-voo-pax')._definir(numeros({ adultos: v.adultos, criancas: v.criancas, bebes: v.bebes }));
    } else if (tipo === 'hospedagem') {
      if (v.destino) definirValor('stayDestino', v.destino);
      if (v.entrada) definirValor('stayDataEntrada', v.entrada);
      if (v.saida) definirValor('stayDataSaida', v.saida);
      $('#guestModal')._definir(numeros({ adultos: v.adultos, criancas: v.criancas, quartos: v.quartos }));
      if (v.pets != null) $('#chkPets').checked = v.pets === '1';
    } else if (tipo === 'pacotes') {
      if (v.origem) definirValor('pac-origem', v.origem);
      if (v.destino) definirValor('pac-destino', v.destino);
      if (v.ida) definirValor('pac-ida', v.ida);
      if (v.volta) definirValor('pac-volta', v.volta);
      $('#pop-pac-pax')._definir(numeros({ adultos: v.adultos, criancas: v.criancas, quartos: v.quartos }));
    } else if (tipo === 'carros') {
      if (v.retirada) definirValor('car-retirada', v.retirada);
      definirMarcado($('#car-outro-local'), !!v.devolucao);
      if (v.devolucao) definirValor('car-devolucao', v.devolucao);
      if (v.dataRet) definirValor('car-data-ret', v.dataRet);
      if (v.horaRet) definirValor('car-hora-ret', v.horaRet);
      if (v.dataDev) definirValor('car-data-dev', v.dataDev);
      if (v.horaDev) definirValor('car-hora-dev', v.horaDev);
      if (v.menor25 != null) definirMarcado($('#car-idade'), v.menor25 !== '1');
    }
    return form;
  }

  function irParaBusca(form, focoId) {
    var painel = $('.search-panel');
    if (!painel) return;
    var topo = painel.getBoundingClientRect().top + window.scrollY - 96;
    window.scrollTo({ top: Math.max(0, topo), behavior: reduceMotion ? 'auto' : 'smooth' });
    var alvo = focoId ? doc.getElementById(focoId) : $('.btn-search', form);
    if (alvo) setTimeout(function () { alvo.focus({ preventScroll: true }); }, reduceMotion ? 0 : 450);
    var botao = form && $('.btn-search', form);
    if (botao && !focoId) {
      botao.classList.remove('is-attention');
      void botao.offsetWidth;
      botao.classList.add('is-attention');
    }
  }

  // Busca enviada de volta pela página de resultados ("Alterar busca")
  if (PJ && $('.search-panel')) {
    var params = new URLSearchParams(window.location.search);
    var tipoUrl = params.get('tipo');
    if (tipoUrl && validadores[tipoUrl]) {
      var v = {};
      params.forEach(function (valor, chave) { v[chave] = valor; });
      if (tipoUrl === 'voos' || tipoUrl === 'pacotes') {
        v.origem = rotuloPorId(v.origem, true) || '';
        v.destino = rotuloPorId(v.destino, tipoUrl === 'voos') || '';
        v.viagem = v.volta ? 'ida-volta' : 'somente-ida';
        if (tipoUrl === 'voos') v.direto = v.direto === '1' ? '1' : '0';
      } else if (tipoUrl === 'hospedagem') {
        v.destino = rotuloPorId(v.destino) || '';
        v.pets = v.pets === '1' ? '1' : '0';
      } else if (tipoUrl === 'carros') {
        v.retirada = rotuloPorId(v.retirada) || '';
        v.devolucao = v.devolucao ? rotuloPorId(v.devolucao) : '';
        v.menor25 = v.menor25 === '1' ? '1' : '0';
      }
      preencherBusca(tipoUrl, v);
    }
  }

  /* ---------- Atalhos da página inicial ---------- */
  // Abre uma aba da busca e leva o usuário até ela
  doc.addEventListener('click', function (event) {
    var atalho = event.target.closest('[data-search-open]');
    if (!atalho) return;
    event.preventDefault();
    var tipo = atalho.getAttribute('data-search-open');
    var tab = doc.getElementById('tab-' + tipo);
    if (!tab) return;
    ativarAbaBusca(tab, false);
    var form = doc.getElementById(tab.getAttribute('aria-controls'));
    var primeiro = $('.fields input:not([disabled])', form);
    irParaBusca(form, primeiro && primeiro.id);
    if (atalho.getAttribute('data-message')) showToast(atalho.getAttribute('data-message'));
  });

  // Destinos populares: preenchem o destino da busca de voos
  doc.addEventListener('click', function (event) {
    var card = event.target.closest('[data-destino]');
    if (!card || !PJ) return;
    event.preventDefault();
    var lugar = PJ.lugarPorId(card.getAttribute('data-destino'));
    if (!lugar) return;
    var aeroporto = PJ.aeroportoDe(lugar);
    var form = preencherBusca('voos', { destino: PJ.rotuloAeroporto(aeroporto) });
    var origemVazia = !$('#voo-origem').value.trim();
    irParaBusca(form, origemVazia ? 'voo-origem' : 'voo-ida');
    showToast(aeroporto === lugar
      ? 'Destino escolhido: ' + PJ.rotuloAeroporto(lugar) + '. Agora informe a origem e as datas.'
      : lugar.cidade + ' não tem aeroporto nesta demonstração: preenchemos ' + PJ.rotuloAeroporto(aeroporto) + ', o mais próximo.');
  });

  /* ---------- Modal das ofertas ---------- */
  function listaComChecks(itens) {
    return '<ul class="check-list">' + itens.map(function (t) { return '<li>' + icone('i-check') + esc(t) + '</li>'; }).join('') + '</ul>';
  }
  function htmlOferta(chave) {
    var o = PJ.OFERTAS[chave];
    if (!o) return '';
    var origem = PJ.lugarPorId(o.origem), destino = PJ.lugarPorId(o.destino);
    var cia = PJ.COMPANHIAS[o.cia];
    var duracao = PJ.duracaoTexto(PJ.tempoDeVoo(PJ.distanciaKm(origem, destino)));
    var pacote = o.tipo === 'pacote';
    var tipoTexto = pacote ? 'Voo + hospedagem · ' + o.noites + ' noites' : (o.viagem === 'somente-ida' ? 'Passagem somente ida' : 'Passagem ida e volta');
    return '' +
      '<div class="modal-media"><img src="' + esc(o.img) + '" alt="' + esc(o.alt) + '" style="object-position:' + PJ.foco(o.img) + '"><span class="tag">' + esc(tipoTexto) + '</span></div>' +
      '<div class="modal-body">' +
        '<p class="modal-eyebrow">' + esc(o.regiao) + '</p>' +
        '<h2 id="modal-title">' + esc(o.titulo) + '</h2>' +
        '<p class="modal-lead">' + esc(o.descricao) + '</p>' +
        '<div class="modal-route">' +
          '<div><strong>' + origem.id + '</strong><span>' + esc(origem.cidade) + '</span></div>' +
          '<div class="modal-route-line">' + icone('i-plane') + '<span>cerca de ' + duracao + ' de voo direto</span></div>' +
          '<div><strong>' + destino.id + '</strong><span>' + esc(destino.cidade) + '</span></div>' +
        '</div>' +
        '<div class="modal-columns">' +
          '<section><h3>Destaques do destino</h3>' + listaComChecks(o.destaques) + '</section>' +
          '<section><h3>O que está incluído</h3>' + listaComChecks(o.inclui) + '</section>' +
        '</div>' +
        '<dl class="facts">' +
          '<div><dt>' + icone('i-plane') + 'Companhia de exemplo</dt><dd><img src="' + cia.logo + '" alt="' + esc(cia.nome) + '" class="facts-logo"></dd></div>' +
          '<div><dt>' + icone('i-sun') + 'Melhor época</dt><dd>' + esc(o.epoca) + '</dd></div>' +
        '</dl>' +
        '<p class="modal-note">' + icone('i-info') + 'Duração estimada pela distância entre as cidades. Preço ilustrativo, sem garantia de disponibilidade.</p>' +
      '</div>' +
      '<div class="modal-foot">' +
        '<p class="price"><span class="price-from">' + (pacote ? 'Pacote a partir de' : 'A partir de') + '</span><strong><small>R$</small> ' + PJ.numero(o.preco) + '</strong><span class="price-note">por pessoa · valor ilustrativo</span></p>' +
        '<div class="modal-actions">' +
          '<button type="button" class="btn btn-ghost" data-modal-close>Fechar</button>' +
          '<button type="button" class="btn btn-sun" data-offer-search="' + esc(chave) + '">' + icone('i-search') + 'Pesquisar esta viagem</button>' +
        '</div>' +
      '</div>';
  }

  doc.addEventListener('click', function (event) {
    if (!PJ) return;
    var botao = event.target.closest('[data-offer-open]');
    var card = event.target.closest('.ticket[data-offer]');
    if (!botao && !card) return;
    if (!botao && event.target.closest('a, button')) return;
    var chave = (botao && botao.closest('[data-offer]') || card).getAttribute('data-offer');
    abrirModal(htmlOferta(chave), 'modal--offer');
  });

  doc.addEventListener('click', function (event) {
    var botao = event.target.closest('[data-offer-search]');
    if (!botao || !PJ) return;
    var o = PJ.OFERTAS[botao.getAttribute('data-offer-search')];
    if (!o) return;
    var ida = PJ.somarDias(today, 30);
    var volta = PJ.somarDias(ida, o.noites || 7);
    var origem = PJ.rotuloAeroporto(PJ.lugarPorId(o.origem));
    var destino = PJ.rotuloAeroporto(PJ.lugarPorId(o.destino));
    fecharModal();
    var form = o.tipo === 'pacote'
      ? preencherBusca('pacotes', { origem: origem, destino: destino, ida: ida, volta: volta })
      : preencherBusca('voos', { origem: origem, destino: destino, ida: ida, volta: volta, viagem: o.viagem });
    irParaBusca(form);
    showToast('Busca preenchida com a oferta de ' + o.titulo + '. Confira as datas e clique em Buscar.', 5200);
  });

  /* ---------- Modal das hospedagens em destaque ---------- */
  function htmlHospedagem(chave) {
    var h = PJ.HOSPEDAGENS_DESTAQUE[chave];
    if (!h) return '';
    var lugar = PJ.lugarPorId(h.lugar);
    var comodidades = h.comodidades.map(function (c) {
      var info = PJ.COMODIDADES[c];
      return '<li>' + icone(info.icone) + esc(info.nome) + '</li>';
    }).join('');
    return '' +
      '<div class="modal-media"><img src="' + esc(h.img) + '" alt="' + esc(h.alt) + '" style="object-position:' + PJ.foco(h.img) + '"><span class="tag tag--light">' + esc(h.tipo) + '</span></div>' +
      '<div class="modal-body">' +
        '<p class="modal-eyebrow">' + esc(lugar.cidade + ', ' + (lugar.uf || lugar.pais)) + '</p>' +
        '<h2 id="modal-title">' + esc(h.titulo) + '</h2>' +
        '<p class="modal-lead">' + esc(h.descricao) + '</p>' +
        '<h3 class="modal-subtitle">Comodidades</h3>' +
        '<ul class="amenities amenities--lg">' + comodidades + '</ul>' +
        '<p class="modal-note">' + icone('i-info') + 'Hospedagem ilustrativa: fotos, comodidades e valores servem apenas para demonstração.</p>' +
      '</div>' +
      '<div class="modal-foot">' +
        '<p class="price"><span class="price-from">Diária a partir de</span><strong><small>R$</small> ' + PJ.numero(h.preco) + '</strong><span class="price-note">para 2 pessoas · valor ilustrativo</span></p>' +
        '<div class="modal-actions">' +
          '<button type="button" class="btn btn-ghost" data-modal-close>Fechar</button>' +
          '<button type="button" class="btn btn-sun" data-stay-search="' + esc(chave) + '">' + icone('i-search') + 'Ver hospedagens em ' + esc(lugar.cidade) + '</button>' +
        '</div>' +
      '</div>';
  }
  doc.addEventListener('click', function (event) {
    if (!PJ) return;
    var botao = event.target.closest('[data-stay-open]');
    if (botao) {
      abrirModal(htmlHospedagem(botao.closest('[data-stay]').getAttribute('data-stay')), 'modal--offer');
      return;
    }
    var buscar = event.target.closest('[data-stay-search]');
    if (!buscar) return;
    var h = PJ.HOSPEDAGENS_DESTAQUE[buscar.getAttribute('data-stay-search')];
    var lugar = PJ.lugarPorId(h.lugar);
    var entrada = PJ.somarDias(today, 30);
    fecharModal();
    var form = preencherBusca('hospedagem', { destino: PJ.rotuloCidade(lugar), entrada: entrada, saida: PJ.somarDias(entrada, 3) });
    irParaBusca(form);
    showToast('Preenchemos uma estadia de 3 noites em ' + lugar.cidade + '. Ajuste as datas se quiser e clique em Buscar.', 5200);
  });

  /* ---------- Ofertas: abas Passagens/Pacotes e carrossel ---------- */
  var offerTabs = $$('[data-offer-tab]');
  var railPrev = $('[data-rail-prev]');
  var railNext = $('[data-rail-next]');

  function activeRail() {
    return $$('.rail--offers').filter(function (r) { return !r.hidden; })[0];
  }
  function railStep(rail) {
    var card = rail.firstElementChild;
    var gap = parseFloat(window.getComputedStyle(rail).columnGap) || 0;
    return card ? card.getBoundingClientRect().width + gap : rail.clientWidth;
  }
  function updateRailNav() {
    var rail = activeRail();
    if (!rail || !railPrev || !railNext) return;
    var max = rail.scrollWidth - rail.clientWidth - 2;
    railPrev.disabled = rail.scrollLeft <= 2;
    railNext.disabled = rail.scrollLeft >= max;
  }
  function activateOffer(name, focus) {
    offerTabs.forEach(function (tab) {
      var selected = tab.getAttribute('data-offer-tab') === name;
      tab.setAttribute('aria-selected', String(selected));
      tab.tabIndex = selected ? 0 : -1;
      var panel = doc.getElementById(tab.getAttribute('aria-controls'));
      if (panel) {
        panel.hidden = !selected;
        if (selected) panel.scrollLeft = 0;
      }
      if (selected && focus) tab.focus();
    });
    updateRailNav();
  }

  if (offerTabs.length) {
    bindTablist(offerTabs, function (tab, focus) { activateOffer(tab.getAttribute('data-offer-tab'), focus); });
    $$('[data-offer-link]').forEach(function (link) {
      link.addEventListener('click', function () { activateOffer(link.getAttribute('data-offer-link'), false); });
    });
  }
  if (railPrev && railNext) {
    railPrev.addEventListener('click', function () {
      var rail = activeRail();
      if (rail) rail.scrollBy({ left: -railStep(rail), behavior: reduceMotion ? 'auto' : 'smooth' });
    });
    railNext.addEventListener('click', function () {
      var rail = activeRail();
      if (rail) rail.scrollBy({ left: railStep(rail), behavior: reduceMotion ? 'auto' : 'smooth' });
    });
    var ticking = false;
    var scheduleUpdate = function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () { ticking = false; updateRailNav(); });
    };
    $$('.rail--offers').forEach(function (rail) { rail.addEventListener('scroll', scheduleUpdate, { passive: true }); });
    window.addEventListener('resize', scheduleUpdate);
    updateRailNav();
  }

  /* ---------- Favoritos (somente visual) ---------- */
  doc.addEventListener('click', function (event) {
    var button = event.target.closest('.fav');
    if (!button) return;
    var saved = button.getAttribute('aria-pressed') !== 'true';
    button.setAttribute('aria-pressed', String(saved));
    button.setAttribute('aria-label', saved ? 'Remover dos favoritos' : 'Salvar nos favoritos');
    showToast(saved ? 'Salvo nos favoritos (somente nesta demonstração).' : 'Removido dos favoritos.', 2600);
  });

  /* ---------- Acordeão de dúvidas ---------- */
  $$('.acc-trigger').forEach(function (button) {
    var item = button.closest('.acc-item');
    var panel = doc.getElementById(button.getAttribute('aria-controls'));
    if (!item || !panel) return;
    var set = function (open) {
      button.setAttribute('aria-expanded', String(open));
      item.classList.toggle('is-open', open);
      if ('inert' in panel) panel.inert = !open;
    };
    set(button.getAttribute('aria-expanded') === 'true');
    button.addEventListener('click', function () { set(button.getAttribute('aria-expanded') !== 'true'); });
  });

  /* ---------- Mostrar/ocultar senha ---------- */
  $$('[data-toggle-password]').forEach(function (button) {
    var input = doc.getElementById(button.getAttribute('data-toggle-password'));
    if (!input) return;
    button.addEventListener('click', function () {
      var show = input.type === 'password';
      input.type = show ? 'text' : 'password';
      button.textContent = show ? 'Ocultar' : 'Mostrar';
      button.setAttribute('aria-pressed', String(show));
      button.setAttribute('aria-label', show ? 'Ocultar senha' : 'Mostrar senha');
    });
  });

  /* =====================================================================
     VALIDAÇÃO DOS FORMULÁRIOS (login e cadastro de parceiro)
     Regras declaradas nos próprios campos:
       data-req="mensagem"        campo obrigatório
       data-email="mensagem"      formato de e-mail
       data-usuario="mensagem"    e-mail válido ou nome com 3+ caracteres
       data-min="4" data-min-msg  tamanho mínimo
       data-doc="mensagem"        CPF (11 dígitos) ou CNPJ (14 dígitos)
       data-positivo="mensagem"   número maior que zero
     ===================================================================== */
  var REGRAS = '[data-req],[data-email],[data-usuario],[data-min],[data-doc],[data-positivo]';
  var emailValido = function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v); };

  function erroDoCampo(input) {
    var v = (input.value || '').trim();
    if (input.hasAttribute('data-req') && !v) return input.getAttribute('data-req');
    if (!v) return '';
    if (input.hasAttribute('data-email') && !emailValido(v)) return input.getAttribute('data-email');
    if (input.hasAttribute('data-usuario')) {
      if (v.indexOf('@') > -1 && !emailValido(v)) return input.getAttribute('data-usuario');
      if (v.indexOf('@') === -1 && v.length < 3) return 'Use pelo menos 3 caracteres no nome de usuário.';
    }
    if (input.hasAttribute('data-min') && v.length < Number(input.getAttribute('data-min'))) return input.getAttribute('data-min-msg');
    if (input.hasAttribute('data-doc')) {
      var digitos = v.replace(/\D/g, '').length;
      if (digitos !== 11 && digitos !== 14) return input.getAttribute('data-doc');
    }
    if (input.hasAttribute('data-positivo') && !(Number(v) > 0)) return input.getAttribute('data-positivo');
    return '';
  }
  function mostrarErroCampo(input, msg) {
    var wrap = input.closest('.form-field');
    if (!wrap) return;
    var el = $('.field-msg', wrap);
    if (!el) {
      el = doc.createElement('p');
      el.className = 'field-msg';
      el.id = input.id + '-erro';
      wrap.appendChild(el);
    }
    el.innerHTML = msg ? icone('i-alert') + esc(msg) : '';
    el.hidden = !msg;
    wrap.classList.toggle('has-error', !!msg);
    if (msg) {
      input.setAttribute('aria-invalid', 'true');
      input.setAttribute('aria-describedby', el.id);
    } else {
      input.removeAttribute('aria-invalid');
      input.removeAttribute('aria-describedby');
    }
  }

  doc.addEventListener('submit', function (event) {
    var form = event.target;
    if (!form.matches || !form.matches('[data-validate]')) return;
    var primeiro = null;
    $$(REGRAS, form).forEach(function (campo) {
      var msg = erroDoCampo(campo);
      mostrarErroCampo(campo, msg);
      if (msg && !primeiro) primeiro = campo;
    });
    if (primeiro) {
      event.preventDefault();
      event.stopImmediatePropagation();
      primeiro.focus();
      showToast('Revise os campos destacados para continuar.', 3200);
    }
  }, true);

  // Revalida ao sair do campo e enquanto o usuário corrige
  doc.addEventListener('focusout', function (event) {
    var campo = event.target;
    if (!campo.matches || !campo.matches(REGRAS) || !campo.closest('[data-validate]')) return;
    if (campo.value.trim() || campo.closest('.form-field.has-error')) mostrarErroCampo(campo, erroDoCampo(campo));
  });
  doc.addEventListener('input', function (event) {
    var campo = event.target;
    if (!campo.matches || !campo.matches(REGRAS) || !campo.closest('.form-field.has-error')) return;
    mostrarErroCampo(campo, erroDoCampo(campo));
  });
  doc.addEventListener('change', function (event) {
    var campo = event.target;
    if (campo.tagName === 'SELECT' && campo.matches(REGRAS) && campo.closest('.form-field.has-error')) {
      mostrarErroCampo(campo, erroDoCampo(campo));
    }
  });

  // Máscara de CPF/CNPJ
  doc.addEventListener('input', function (event) {
    var campo = event.target;
    if (!campo.matches || !campo.matches('[data-doc]')) return;
    var d = campo.value.replace(/\D/g, '').slice(0, 14);
    var f;
    if (d.length <= 11) {
      f = d.replace(/^(\d{3})(\d)/, '$1.$2').replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3').replace(/\.(\d{3})(\d{1,2})$/, '.$1-$2');
    } else {
      f = d.replace(/^(\d{2})(\d)/, '$1.$2').replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
        .replace(/^(\d{2})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3/$4').replace(/\/(\d{4})(\d{1,2})$/, '/$1-$2');
    }
    campo.value = f;
  });

  /* ---------- Revelação suave das seções ---------- */
  var revealEls = $$('[data-reveal]');
  if (revealEls.length) {
    if (reduceMotion || !('IntersectionObserver' in window)) {
      revealEls.forEach(function (el) { el.classList.add('is-visible'); });
    } else {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      }, { rootMargin: '0px 0px -6% 0px', threshold: 0.06 });
      revealEls.forEach(function (el) { observer.observe(el); });
    }
  }
})();
