/**
 * ALTA VISUAL COMUNICAÇÃO DIGITAL
 * js/main.js — Navegação, Filtros Interativos, Galeria e Integração WhatsApp (11) 2473-6001
 */

(function () {
  'use strict';

  const WHATSAPP_PHONE = '551124736001';

  document.addEventListener('DOMContentLoaded', () => {
    initHeaderAndMobileNav();
    initLabelFinishTabs();
    initGalleryFilter();
    initPhoneMask();
    initQuoteForm();
  });

  /* 1. Header Fixo e Menu Mobile (US1.2) */
  function initHeaderAndMobileNav() {
    const header = document.getElementById('site-header');
    const menuToggle = document.getElementById('menu-toggle');
    const mainNav = document.getElementById('main-nav');
    const navLinks = document.querySelectorAll('.nav__link');

    window.addEventListener('scroll', () => {
      if (!header) return;
      header.classList.toggle('is-scrolled', window.scrollY > 20);
    }, { passive: true });

    if (menuToggle && mainNav) {
      menuToggle.addEventListener('click', () => {
        const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
        menuToggle.setAttribute('aria-expanded', String(!isOpen));
        mainNav.classList.toggle('is-open', !isOpen);
      });

      navLinks.forEach((link) => {
        link.addEventListener('click', () => {
          menuToggle.setAttribute('aria-expanded', 'false');
          mainNav.classList.remove('is-open');
        });
      });

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mainNav.classList.contains('is-open')) {
          menuToggle.setAttribute('aria-expanded', 'false');
          mainNav.classList.remove('is-open');
          menuToggle.focus();
        }
      });
    }

    // Destaque automático da seção ativa no menu durante o scroll
    const sections = document.querySelectorAll('section[id]');
    if ('IntersectionObserver' in window && sections.length > 0) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const id = entry.target.getAttribute('id');
              navLinks.forEach((link) => {
                link.classList.toggle('is-active', link.getAttribute('href') === `#${id}`);
              });
            }
          });
        },
        { rootMargin: '-35% 0px -55% 0px' }
      );

      sections.forEach((sec) => observer.observe(sec));
    }
  }

  /* 2. Filtro de Abas do Showcase de Etiquetas (US3.1) */
  function initLabelFinishTabs() {
    const tabs = document.querySelectorAll('[data-label-filter]');
    const cards = document.querySelectorAll('[data-label-category]');

    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        const filter = tab.getAttribute('data-label-filter');

        tabs.forEach((t) => {
          t.classList.toggle('is-active', t === tab);
          t.setAttribute('aria-selected', String(t === tab));
        });

        cards.forEach((card) => {
          const category = card.getAttribute('data-label-category');
          const shouldShow = filter === 'todos' || category === filter;
          card.hidden = !shouldShow;
        });
      });
    });
  }

  /* 3. Filtro da Galeria de Projetos (US5.2) */
  function initGalleryFilter() {
    const tabs = document.querySelectorAll('[data-gallery-filter]');
    const items = document.querySelectorAll('[data-gallery-category]');

    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        const filter = tab.getAttribute('data-gallery-filter');

        tabs.forEach((t) => t.classList.toggle('is-active', t === tab));

        items.forEach((item) => {
          const cat = item.getAttribute('data-gallery-category');
          item.hidden = !(filter === 'todos' || cat === filter);
        });
      });
    });
  }

  /* 4. Máscara de Telefone/WhatsApp */
  function initPhoneMask() {
    const phoneInput = document.getElementById('quote-phone');
    if (!phoneInput) return;

    phoneInput.addEventListener('input', (e) => {
      let digits = e.target.value.replace(/\D/g, '').slice(0, 11);
      if (digits.length > 10) {
        e.target.value = digits.replace(/^(\d{2})(\d{5})(\d{4}).*/, '($1) $2-$3');
      } else if (digits.length > 6) {
        e.target.value = digits.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, '($1) $2-$3');
      } else if (digits.length > 2) {
        e.target.value = digits.replace(/^(\d{2})(\d{0,5})/, '($1) $2');
      } else if (digits.length > 0) {
        e.target.value = digits.replace(/^(\d*)/, '($1');
      }
    });
  }

  /* 5. Formulário Inteligente de Orçamento com Envio via WhatsApp (US6.1 & US6.2) */
  function initQuoteForm() {
    const form = document.getElementById('quote-form');
    const feedback = document.getElementById('quote-feedback');

    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('quote-name')?.value.trim() || '';
      const email = document.getElementById('quote-email')?.value.trim() || '';
      const phone = document.getElementById('quote-phone')?.value.trim() || '';
      const product = document.getElementById('quote-product')?.value || '';
      const shape = document.getElementById('quote-shape')?.value || '';
      const dimensions = document.getElementById('quote-dimensions')?.value.trim() || 'A definir';
      const quantity = document.getElementById('quote-quantity')?.value.trim() || 'A definir';
      const notes = document.getElementById('quote-notes')?.value.trim() || '';

      let message =
        `Olá, equipe *Alta Visual*! Gostaria de solicitar um orçamento:\n\n` +
        `• *Nome/Empresa:* ${name}\n` +
        `• *WhatsApp/Telefone:* ${phone}\n` +
        (email ? `• *E-mail:* ${email}\n` : '') +
        `• *Produto/Acabamento:* ${product}\n` +
        `• *Formato/Corte:* ${shape}\n` +
        `• *Medidas aproximadas:* ${dimensions}\n` +
        `• *Quantidade/Tiragem:* ${quantity}`;

      if (notes) {
        message += `\n• *Observações:* ${notes}`;
      }

      if (feedback) {
        feedback.hidden = false;
        feedback.innerHTML = '<i class="fa-solid fa-circle-check"></i> Pedido formatado com sucesso! Abrindo o WhatsApp oficial da Alta Visual...';
      }

      const whatsappUrl = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    });
  }
})();

