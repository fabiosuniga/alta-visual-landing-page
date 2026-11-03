/**
 * ALTA VISUAL COMUNICAÇÃO DIGITAL
 * js/label-calculator.js — Calculadora / Seletor Interativo de Formatos & Acabamentos (US3.4)
 */

(function () {
  'use strict';

  const WHATSAPP_NUMBER = '551124736001';

  const FINISH_DETAILS = {
    'Etiquetas em Vinil Brilho': {
      shortName: 'Vinil Brilho',
      durability: 'Alta nitidez + proteção impermeável',
      recommendedFor: 'Embalagens comerciais, potes, sacolas, cosméticos e brindes vibrantes.'
    },
    'Etiquetas em Vinil Fosco': {
      shortName: 'Vinil Fosco',
      durability: 'Toque acetinado antirreflexo',
      recommendedFor: 'Vinhos, cafés especiais, linha gourmet, cosméticos premium e leitura de código de barras.'
    },
    'Etiquetas Transparentes': {
      shortName: 'Transparente',
      durability: 'Efeito No-Label Look impermeável',
      recommendedFor: 'Frascos de vidro, acrílico, bebidas, perfumaria e embalagens onde o produto aparece.'
    },
    'Etiquetas e Stickers UV': {
      shortName: 'Impressão UV',
      durability: 'Ultra resistência solar, chuva e abrasão',
      recommendedFor: 'Uso externo, equipamentos, capacetes, maquinário, veículos e exposição direta ao tempo.'
    },
    'Etiquetas de Troca de Óleo': {
      shortName: 'Troca de Óleo (Oficinas)',
      durability: 'Adesivo para para-brisa que não deixa resíduo e permite escrita a caneta',
      recommendedFor: 'Oficinas mecânicas, auto centers, centros de lubrificação e concessionárias (controle de KM, data e filtros).'
    }
  };

  const state = {
    finish: 'Etiquetas em Vinil Brilho',
    shape: 'Redondo',
    size: '5x5 cm',
    quantity: '1.000 unidades'
  };

  function initLabelCalculator() {
    const finishBtns = document.querySelectorAll('[data-calc-finish]');
    const shapeBtns = document.querySelectorAll('[data-calc-shape]');
    const sizeInput = document.getElementById('calc-size-input');
    const qtySelect = document.getElementById('calc-qty-select');

    const liveBadge = document.getElementById('calc-live-badge');
    const liveBadgeTitle = document.getElementById('calc-live-title');
    const liveBadgeMeta = document.getElementById('calc-live-meta');

    const summaryFinish = document.getElementById('summary-finish');
    const summaryShape = document.getElementById('summary-shape');
    const summarySize = document.getElementById('summary-size');
    const summaryQty = document.getElementById('summary-qty');
    const summaryTip = document.getElementById('summary-tip');

    const applyToFormBtn = document.getElementById('calc-apply-form-btn');
    const sendDirectWhatsappBtn = document.getElementById('calc-whatsapp-btn');

    function updateCalculatorUI() {
      const info = FINISH_DETAILS[state.finish] || FINISH_DETAILS['Etiquetas em Vinil Brilho'];

      if (liveBadge) {
        liveBadge.setAttribute('data-finish', state.finish);
        liveBadge.setAttribute('data-shape', state.shape);
      }
      if (liveBadgeTitle) {
        liveBadgeTitle.textContent = info.shortName;
      }
      if (liveBadgeMeta) {
        liveBadgeMeta.textContent = `${state.size} • ${state.shape.split(' ')[0]}`;
      }

      if (summaryFinish) summaryFinish.textContent = info.shortName;
      if (summaryShape) summaryShape.textContent = state.shape;
      if (summarySize) summarySize.textContent = state.size || 'Sob medida';
      if (summaryQty) summaryQty.textContent = state.quantity;
      if (summaryTip) summaryTip.textContent = info.recommendedFor;
    }

    finishBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        finishBtns.forEach((b) => b.classList.remove('is-selected'));
        btn.classList.add('is-selected');
        state.finish = btn.getAttribute('data-calc-finish');
        updateCalculatorUI();
      });
    });

    shapeBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        shapeBtns.forEach((b) => b.classList.remove('is-selected'));
        btn.classList.add('is-selected');
        state.shape = btn.getAttribute('data-calc-shape');
        updateCalculatorUI();
      });
    });

    if (sizeInput) {
      sizeInput.addEventListener('input', (e) => {
        state.size = e.target.value.trim() || 'Sob medida';
        updateCalculatorUI();
      });
    }

    if (qtySelect) {
      qtySelect.addEventListener('change', (e) => {
        state.quantity = e.target.value;
        updateCalculatorUI();
      });
    }

    // Envia configuração direto para o WhatsApp da Alta Visual
    if (sendDirectWhatsappBtn) {
      sendDirectWhatsappBtn.addEventListener('click', () => {
        const message =
          `Olá! Configurei minhas etiquetas no site da *Alta Visual* e gostaria de um orçamento:\n\n` +
          `• *Acabamento:* ${state.finish}\n` +
          `• *Formato/Corte:* ${state.shape}\n` +
          `• *Medidas:* ${state.size}\n` +
          `• *Tiragem estimada:* ${state.quantity}`;
        const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank', 'noopener,noreferrer');
      });
    }

    // Botões de cards de produtos/acabamentos que abrem o WhatsApp diretamente
    const productTriggers = document.querySelectorAll('[data-select-product]');
    productTriggers.forEach((trigger) => {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        const productValue = trigger.getAttribute('data-select-product');
        const message = `Olá, equipe *Alta Visual*! Gostaria de solicitar um orçamento para *${productValue}*.`;
        const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank', 'noopener,noreferrer');
      });
    });

    updateCalculatorUI();
  }

  document.addEventListener('DOMContentLoaded', initLabelCalculator);
})();

