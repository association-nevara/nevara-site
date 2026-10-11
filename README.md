# nevara-site

Site officiel de l'**Association NEVARA** (loi 1901, RNA W851002978, Niort), en ligne sur **https://www.nevara-asso.com**.

Le site présente l'association, son objet statutaire, sa structure esport FRACTURE ESPORT, et permet de la soutenir (don HelloAsso, adhésion) ou de la contacter.

## Fonctionnement

Le site est **statique** : des pages HTML, une feuille de style et un petit script. Il n'y a ni base de données, ni espace d'administration, ni serveur à maintenir.

```
GitHub (ce dépôt)  --push-->  Cloudflare Workers  --sert-->  www.nevara-asso.com
```

- **GitHub** conserve le code et l'historique de chaque modification.
- **Cloudflare Workers** est relié à ce dépôt : à chaque modification publiée sur la branche `main`, le site est reconstruit et mis en ligne automatiquement, en une minute environ.
- **Cloudflare** gère aussi les DNS du domaine `nevara-asso.com` (Gandi reste le registrar) ainsi que le HTTPS.
- **Web3Forms** transmet les messages du formulaire de contact par e-mail à `contact@nevara-asso.fr`.
- **HelloAsso** gère les dons. Aucun paiement ne passe par le site.

Tout est gratuit.

## Contenu du dépôt

| Fichier | Rôle |
|---|---|
| `index.html` | Accueil |
| `association.html` | L'association : objet, histoire, fonctionnement |
| `fracture.html` | FRACTURE ESPORT, la structure esport de NEVARA |
| `soutenir.html` | Don HelloAsso et adhésion |
| `contact.html` | Formulaire de contact et adresse e-mail |
| `mentions-legales.html`, `confidentialite.html` | Pages légales |
| `404.html` | Page affichée pour une adresse inexistante |
| `assets/site.css` | Toute la mise en forme (couleurs et polices dans `:root`) |
| `assets/site.js` | Menu mobile, bouton « Copier », envoi du formulaire |
| `assets/fonts/` | Polices Montserrat et Lora, hébergées sur le site (aucun appel à Google Fonts) |
| `assets/*.webp`, `*.png`, `*.jpg` | Logo, lys du héros, icônes, image de partage |
| `_headers` | En-têtes de sécurité et politique CSP |
| `_redirects` | Redirections d'anciennes adresses (vide pour l'instant) |
| `robots.txt`, `sitemap.xml` | Référencement |
| `manifest.json`, `sw.js` | Site installable sur téléphone (PWA) |
| `wrangler.jsonc` | Configuration Cloudflare Workers (indispensable au déploiement) |
| `.assetsignore` | Fichiers à ne pas publier (ce README, la configuration) |

## Modifier le site

Les pages sont générées par un script Python, `build.py`, conservé **hors de ce dépôt** dans le dossier de travail du site. Il contient tous les textes et un gabarit unique, pour que l'en-tête, le menu et le pied de page soient identiques sur toutes les pages.

1. Modifier le texte dans `build.py`.
2. Lancer `python3 build.py` : les fichiers `.html` sont régénérés.
3. Envoyer les fichiers modifiés sur ce dépôt : le site se met à jour tout seul.

Une petite correction directement dans un fichier `.html` fonctionne aussi, mais elle sera écrasée au prochain passage de `build.py`.

## Identité visuelle

- Couleurs tirées du logo : marine `#262F4A`, crème `#F7EEDE`, bleu-lys `#A3AEDB` (accent), or `#C78823` en touche minimale.
- Polices : Montserrat pour les titres, Lora pour le texte.
- Alternance de sections sombres (marine) et claires (papier crème).

## Conventions

- Pas de tiret long dans les textes (`build.py` refuse de générer une page qui en contient). Utiliser virgules, points médians (·) ou traits d'union.
- Pas de traits décoratifs ni d'ornements génériques.
- Écriture inclusive au point médian, ton institutionnel.
- Pas de noms de membres du bureau ni d'adresse complète sur les pages publiques. L'adresse du siège figure uniquement dans les mentions légales.
- Toute nouvelle intégration externe (script, iframe, API) doit être autorisée dans la CSP de `_headers`, sinon le navigateur la bloque.

## DNS (zone Cloudflare)

Ne jamais supprimer ni modifier sans raison les enregistrements de messagerie Google : les 5 MX, le SPF, le DKIM `google._domainkey`, le DMARC `_dmarc`, les TXT `google-site-verification` et `MS=`, et le CNAME de vérification Google. Ne jamais ajouter de MX ou de SPF Microsoft : les mails sont gérés par Google Workspace.

## Contacts

- Association : contact@nevara-asso.fr
- Directrice de la publication : la Présidente de l'association
- Responsable du site : le Secrétaire Général
