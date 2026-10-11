/* NEVARA · script commun (menu mobile, copie d'adresse, formulaire, PWA) */
(function () {
  'use strict';

  // ── Menu mobile ────────────────────────────────────────────
  var burger = document.querySelector('.burger');
  var nav = document.getElementById('nav');
  if (burger && nav) {
    burger.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  // ── Année du pied de page ──────────────────────────────────
  var an = document.getElementById('annee');
  if (an) an.textContent = new Date().getFullYear();

  // ── Boutons « Copier » ─────────────────────────────────────
  document.querySelectorAll('[data-copier]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var cible = document.getElementById(btn.getAttribute('data-copier'));
      if (!cible) return;
      var texte = cible.textContent.trim();
      var fini = function () { btn.textContent = 'Copié'; setTimeout(function () { btn.textContent = 'Copier'; }, 1800); };
      var repli = function () {
        var r = document.createRange(); r.selectNodeContents(cible);
        var s = window.getSelection(); s.removeAllRanges(); s.addRange(r);
        btn.textContent = 'Sélectionné';
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(texte).then(fini, repli);
      } else { repli(); }
    });
  });

  // ── Formulaire de contact (Web3Forms) ──────────────────────
  var form = document.getElementById('form-contact');
  if (form) {
    // Sujet pré-rempli depuis l'adresse : contact.html?sujet=adhesion
    try {
      var sujet = new URLSearchParams(location.search).get('sujet');
      var sel = document.getElementById('c-sujet');
      if (sujet && sel && sel.querySelector('option[value="' + sujet + '"]')) sel.value = sujet;
    } catch (e) { /* sans effet */ }

    var statut = document.getElementById('c-statut');
    var bouton = form.querySelector('button[type="submit"]');
    var dire = function (msg, type) { statut.hidden = false; statut.className = 'statut ' + type; statut.textContent = msg; };

    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      if (!form.reportValidity()) return;
      if (form.querySelector('[name="botcheck"]').checked) return; // robot

      var cle = form.getAttribute('data-cle');
      if (!cle || cle.indexOf('A_REMPLACER') !== -1) {
        dire("Le formulaire n'est pas encore activé. Écrivez-nous directement à l'adresse indiquée ci-contre.", 'err');
        return;
      }
      var sel2 = document.getElementById('c-sujet');
      var data = new FormData(form);
      data.append('access_key', cle);
      data.append('subject', '[Site NEVARA] ' + sel2.options[sel2.selectedIndex].text);
      data.append('from_name', 'Site nevara-asso.com');

      bouton.disabled = true; bouton.textContent = 'Envoi…';
      fetch('https://api.web3forms.com/submit', { method: 'POST', body: data, headers: { Accept: 'application/json' } })
        .then(function (r) { return r.json(); })
        .then(function (res) {
          if (res && res.success) {
            form.reset();
            dire('Message envoyé. Nous vous répondrons par e-mail dès que possible.', 'ok');
          } else {
            throw new Error('refus');
          }
        })
        .catch(function () {
          dire("L'envoi n'a pas abouti. Réessayez dans quelques minutes, ou écrivez-nous directement à l'adresse indiquée ci-contre.", 'err');
        })
        .then(function () { bouton.disabled = false; bouton.textContent = 'Envoyer le message'; });
    });
  }

  // ── PWA : service worker (réseau d'abord) ──────────────────
  if ('serviceWorker' in navigator && location.protocol === 'https:') {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('/sw.js').catch(function () {});
    });
  }
})();
