# Site de l'association NEVARA · nevara-asso.com

Site statique (HTML, CSS, JS), sans base de données ni admin. Hébergé gratuitement sur Cloudflare, code sur GitHub.

## Contenu du dossier

| Fichier | Rôle |
|---|---|
| `index.html` | Accueil |
| `association.html` | L'association (objet, histoire, fonctionnement) |
| `fracture.html` | FRACTURE ESPORT (pôle esport, réseaux) |
| `soutenir.html` | Don HelloAsso + devenir membre |
| `contact.html` | Formulaire (Web3Forms) + adresse e-mail |
| `mentions-legales.html`, `confidentialite.html` | Pages légales |
| `404.html` | Page d'erreur |
| `assets/site.css` | Toute la mise en forme (couleurs dans `:root`) |
| `assets/site.js` | Menu mobile, bouton Copier, envoi du formulaire |
| `assets/fonts/` | Montserrat + Lora hébergées sur le site (pas de Google Fonts, donc RGPD tranquille) |
| `_headers` | Sécurité + CSP (autorise `api.web3forms.com` pour le formulaire) |
| `robots.txt`, `sitemap.xml` | Référencement |
| `manifest.json`, `sw.js` | Site installable sur téléphone (PWA) |

Les pages sont générées par `build.py` (livré à côté de ce dossier, pas dedans) à partir d'un gabarit unique : en-tête et pied de page identiques partout. Pour modifier un texte, le plus simple est de modifier `build.py` puis de relancer `python3 build.py`. Une petite retouche directe dans un `.html` marche aussi, mais elle sera écrasée au prochain build.

---

## 1. Formulaire de contact

Déjà actif : la clé Web3Forms (liée à contact@nevara-asso.fr) est dans `build.py` (`WEB3FORMS_CLE`) et dans `contact.html`. Elle est publique par nature, ce n'est pas un secret.
Le jour où on passe à `contact@nevara-asso.com` : changer `MAIL` dans `build.py`, créer une nouvelle clé Web3Forms avec cette adresse, relancer `python3 build.py`.

## 2. Mettre en ligne (Cloudflare Workers, relié à GitHub)

Pas besoin de Supabase : le site est entièrement statique.

1. GitHub : dépôt `nevara-site` (compte de l'asso) contenant **le contenu du dossier `site`** à la racine, y compris `wrangler.jsonc` et `.assetsignore` (indispensables : sans eux, le build Cloudflare échoue). Ne pas y mettre `build.py` ni le zip.
2. Cloudflare > Workers et Pages > le Worker `nevara-site`, relié au dépôt : chaque push redéploie le site.
3. `wrangler.jsonc` indique de servir les fichiers du dossier tels quels et d'afficher `404.html` pour les adresses inconnues. `.assetsignore` évite de publier le README et la config.

## 3. Brancher le domaine (DNS gérés par Cloudflare)

Choix retenu : le domaine nevara-asso.com est ajouté à Cloudflare et ses serveurs de noms passent de Gandi à Cloudflare. Gandi reste le registrar (renouvellement du domaine).

Avant la bascule, dans Cloudflare > DNS, la zone doit contenir (MX et TXT en « DNS uniquement ») :
- les 5 MX Google (1 aspmx, 5 alt1, 5 alt2, 10 alt3, 10 alt4) ;
- TXT `@` : `v=spf1 include:_spf.google.com ~all` (un seul SPF) ;
- TXT `google._domainkey` : la clé DKIM complète (vérifier qu'elle n'est pas tronquée) ;
- TXT `@` : `MS=ms72903211` et le ou les `google-site-verification` ;
- CNAME `2zcstrgtqsze` → `gv-iey35bvytlgksw.dv.googlehosted.com` (DNS uniquement).
Supprimer : le A `@ 217.70.184.55` et le CNAME `www → webredir.gandi.net` (anciennes redirections Gandi). Inutile de recréer `fracture` et `_dnsauth.fracture`.

Bascule :
1. Gandi > nevara-asso.com : si DNSSEC est activé, le désactiver d'abord.
2. Gandi > Serveurs de noms > Externes : coller les 2 serveurs donnés par Cloudflare.
3. Attendre que Cloudflare passe le domaine en « Actif ».
4. Projet Pages > Custom domains : ajouter `www.nevara-asso.com` puis `nevara-asso.com` (Cloudflare crée les enregistrements lui-même).
5. Règles > Règles de redirection : `nevara-asso.com/*` → `https://www.nevara-asso.com/${1}`, 301 (le site est prévu en www).
6. Envoyer un mail de test depuis une adresse extérieure vers une adresse @nevara-asso.com.

**Ne jamais ajouter** : MX Microsoft, autodiscover, SPF Microsoft, enregistrements Teams.

## 4. Après la mise en ligne

- Google Search Console : ajouter la propriété (le domaine est déjà vérifié par le TXT Google), soumettre `https://www.nevara-asso.com/sitemap.xml`.
- Tester le formulaire avec un vrai message.
- Donner l'adresse du site dans la demande Google for Nonprofits.

## Règles à garder

- Pas de tirets longs (le build refuse de générer une page qui en contient).
- Pas de noms du bureau ni d'adresse complète sur les pages publiques (adresse complète uniquement dans les mentions légales).
- Toute nouvelle intégration externe (iframe, script, API) doit être ajoutée dans la CSP de `_headers`, sinon elle est bloquée.
