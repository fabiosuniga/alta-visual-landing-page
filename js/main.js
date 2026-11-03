/**
 * ALTA VISUAL COMUNICAÇÃO DIGITAL
 * js/main.js — Navegação, Scroll Reveal, Filtros Interativos, Galeria e Webform de E-mail
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    initScrollReveal();
    initHeaderAndMobileNav();
    initLabelFinishTabs();
    initGalleryFilter();
    initPhoneMask();
    initQuoteForm();
  });

  /* 0. Efeito Scroll Reveal conforme o usuário rola a página */
  function initScrollReveal() {
    const revealElements = document.querySelectorAll('[data-reveal]');
    if (revealElements.length === 0) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      revealElements.forEach((el) => el.classList.add('is-revealed', 'reveal-done'));
      return;
    }

    document.documentElement.classList.add('js-reveal-ready');

    revealElements.forEach((el) => {
      const delay = el.getAttribute('data-reveal-delay');
      if (delay) {
        el.style.setProperty('--reveal-delay', `${delay}ms`);
      }
    });

    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const target = entry.target;
            const delayMs = parseInt(target.getAttribute('data-reveal-delay') || '0', 10);

            target.classList.add('is-revealed');
            observer.unobserve(target);

            setTimeout(() => {
              target.classList.add('reveal-done');
            }, delayMs + 750);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -45px 0px'
      }
    );

    revealElements.forEach((el) => revealObserver.observe(el));
  }

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
          if (shouldShow) {
            card.classList.add('is-revealed', 'reveal-done');
          }
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
          const shouldShow = filter === 'todos' || cat === filter;
          item.hidden = !shouldShow;
          if (shouldShow) {
            item.classList.add('is-revealed', 'reveal-done');
          }
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

  /* 5. Formulário Principal de Orçamento Exclusivo para E-mail / Webform (US6.1) */
  function initQuoteForm() {
    const form = document.getElementById('quote-form');
    const feedback = document.getElementById('quote-feedback');
    const submitBtn = document.getElementById('quote-submit-btn');

    if (!form) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const payload = {
        name: document.getElementById('quote-name')?.value.trim() || '',
        phone: document.getElementById('quote-phone')?.value.trim() || '',
        email: document.getElementById('quote-email')?.value.trim() || '',
        product: document.getElementById('quote-product')?.value || '',
        shape: document.getElementById('quote-shape')?.value || '',
        dimensions: document.getElementById('quote-dimensions')?.value.trim() || 'A definir',
        quantity: document.getElementById('quote-quantity')?.value.trim() || 'A definir',
        notes: document.getElementById('quote-notes')?.value.trim() || ''
      };

      const endpoint = form.getAttribute('data-webform-endpoint')?.trim() || '';
      const originalBtnHTML = submitBtn ? submitBtn.innerHTML : '';

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin" aria-hidden="true"></i> Enviando pedido por e-mail...';
      }

      try {
        if (endpoint) {
          const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify(payload)
          });

          if (!response.ok) {
            throw new Error('Falha no envio do Webform');
          }
        } else {
          // Simulação pronta enquanto o endpoint do Webform de e-mail não está configurado
          await new Promise((resolve) => setTimeout(resolve, 600));
        }

        if (feedback) {
          feedback.hidden = false;
          feedback.innerHTML =
            `<i class="fa-solid fa-circle-check" aria-hidden="true"></i> ` +
            `Solicitação de orçamento enviada por e-mail com sucesso! Responderemos em breve para <strong>${payload.email}</strong>.`;
        }

        form.reset();
      } catch (err) {
        if (feedback) {
          feedback.hidden = false;
          feedback.innerHTML =
            `<i class="fa-solid fa-triangle-exclamation" aria-hidden="true"></i> ` +
            `Não foi possível enviar no momento. Por favor, tente novamente ou envie para atendimento@altavisual.com.br.`;
        }
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnHTML;
        }
      }
    });
  }
})();

