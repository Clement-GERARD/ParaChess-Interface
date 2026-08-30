# ParaChess Interface

> Version personnelle du projet **ParaChess-Interface**, développée sur une branche indépendante du fork.
>
> Cette version a notamment pour objectif de permettre l'expérimentation, la modification de l'interface et, potentiellement, le déploiement d'une version statique via GitHub Pages.

---

## 📋 À propos du projet

ParaChess est une interface web regroupant plusieurs fonctionnalités et jeux accessibles depuis une interface commune.

Le projet original repose sur une architecture Node.js comprenant notamment :

* **Node.js**
* **Express**
* **Socket.IO**
* **Vosk** pour certaines fonctionnalités de reconnaissance vocale
* HTML / CSS / JavaScript pour l'interface utilisateur

<<<<<<< Updated upstream
Le dépôt contient à la fois :

1. une **interface web statique** dans le dossier `interface/` ;
2. un **serveur Node.js** ;
3. différentes routes permettant d'accéder aux jeux et fonctionnalités ;
4. des fonctionnalités temps réel utilisant Socket.IO.

---

# 📁 Structure du projet

La structure principale du dépôt est la suivante :

```text
ParaChess-Interface/
│
├── games/                  # Logique et ressources liées aux jeux
│
├── interface/              # Interface web
│   │
│   ├── assets/             # Images, icônes et ressources
│   ├── games/              # Pages liées aux jeux
│   ├── parachess/          # Interface ParaChess
│   ├── disconnect4/        # Interface Disconnect4
│   ├── help/               # Page d'aide
│   ├── about-us/           # Page "À propos"
│   ├── credits/            # Crédits
│   ├── legal-notice/       # Mentions légales
│   ├── rules/              # Règles
│   │
│   ├── index.html          # Page principale
│   ├── portal.css          # Styles principaux
│   └── head-tracking.js    # Fonctionnalités de suivi
│
├── model-fr/               # Modèles utilisés pour certaines fonctionnalités
│
├── namespaces/             # Espaces / logique Socket.IO
│
├── routes/                 # Routes Express
│
├── index.js                # Point d'entrée du serveur Node.js
├── voice-recognition.js    # Reconnaissance vocale
│
├── package.json            # Dépendances du projet
└── README.md               # Documentation
```

---

# 🚀 Installation

## Prérequis

Avant de lancer le projet, il est nécessaire d'avoir installé :

* Node.js
* npm

Vous pouvez vérifier leur installation avec :

```bash
node --version
npm --version
```

Si ces commandes affichent un numéro de version, Node.js et npm sont correctement installés.

---

## Cloner le projet

Si vous n'avez pas encore cloné votre fork :

```bash
git clone https://github.com/VOTRE-UTILISATEUR/ParaChess-Interface.git
```

Puis :

```bash
cd ParaChess-Interface
```

Si vous utilisez une branche spécifique :

```bash
git switch Clement
```

---

# 📦 Installer les dépendances

Depuis la racine du projet :

```bash
npm install --ignore-scripts
```
=======
npm install
>>>>>>> Stashed changes

Cette commande installe les dépendances définies dans `package.json`.

Le projet utilise notamment :

* Express
* Socket.IO
* Socket.IO Client
* Vosk

---

# ▶️ Lancer le projet avec le serveur Node.js

La version complète du projet nécessite le serveur Node.js.

Depuis la racine du dépôt :

```bash
node ./index.js
```

Le serveur utilise par défaut le port :

```text
5000
```

Vous devriez voir dans le terminal un message similaire à :

```text
[✱] Démarrage du serveur sur le port 5000
```

Vous pouvez ensuite ouvrir dans votre navigateur :

```text
http://localhost:5000
```

---

# 🖥️ Comment fonctionne le serveur ?

Le fichier principal :

```text
index.js
```

crée un serveur Express.

Il sert notamment les fichiers de l'interface :

```text
interface/
```

via le chemin :

```text
/public/
```

Le serveur gère également plusieurs routes, notamment :

```text
/api
/parachess
/disconnect4
/games
/about-us
/legal-notice
/credits
/rules
/help
```

Il gère également une connexion Socket.IO utilisée pour certaines fonctionnalités interactives et de reconnaissance vocale.

---

# ❓ Puis-je lancer le projet sans serveur ?

## Oui, mais avec des limitations importantes.

Il faut distinguer deux cas.

---

# 1️⃣ Version complète — avec serveur

Architecture :

```text
Navigateur
     │
     ▼
Node.js / Express
     │
     ├── Interface HTML / CSS / JS
     ├── Routes
     ├── Jeux
     ├── Socket.IO
     └── Reconnaissance vocale
```

Dans cette configuration, vous lancez :

```bash
node ./index.js
```

Puis vous accédez au projet sur :

```text
http://localhost:5000
```

C'est la manière recommandée pour tester le projet original.

---

# 2️⃣ Version statique — sans serveur

Il est également possible d'utiliser uniquement les fichiers présents dans :

```text
interface/
```

Dans ce cas, vous pouvez ouvrir directement :

```text
interface/index.html
```

ou utiliser une extension comme **Live Server** dans Visual Studio Code.

Cependant, certaines fonctionnalités peuvent ne pas fonctionner.

Notamment :

* les routes Express ;
* les API ;
* Socket.IO ;
* certaines fonctionnalités multijoueur ou temps réel ;
* la reconnaissance vocale côté serveur ;
* toute fonctionnalité nécessitant Node.js.

---

# 🌐 Utiliser Live Server dans Visual Studio Code

Pour tester uniquement l'interface :

1. Ouvrez le projet dans VS Code.
2. Installez l'extension **Live Server**.
3. Ouvrez :

```text
interface/index.html
```

4. Faites un clic droit sur le fichier.
5. Cliquez sur :

```text
Open with Live Server
```

Vous pourrez alors accéder à l'interface via une adresse similaire à :

```text
http://127.0.0.1:5500/interface/
```

Cette méthode est utile pour :

* modifier le HTML ;
* modifier le CSS ;
* modifier certaines fonctionnalités JavaScript côté navigateur ;
* tester rapidement les changements visuels.

Elle ne remplace toutefois pas le serveur Node.js.

---

# ☁️ GitHub Pages

## Important

GitHub Pages ne peut héberger que des fichiers statiques.

Il peut servir :

* HTML ;
* CSS ;
* JavaScript exécuté dans le navigateur ;
* images ;
* fichiers statiques.

GitHub Pages ne peut pas exécuter :

* Node.js ;
* Express ;
* Socket.IO côté serveur ;
* Vosk côté serveur ;
* les routes présentes dans `index.js`.

---

## Architecture GitHub Pages

Si le contenu du dossier :

```text
interface/
```

est déployé comme racine GitHub Pages :

```text
interface/index.html
```

devient :

```text
https://VOTRE-UTILISATEUR.github.io/ParaChess-Interface/
```

Par exemple :

```text
interface/
├── index.html
├── portal.css
├── assets/
├── games/
├── parachess/
└── help/
```

est publié comme :

```text
https://VOTRE-UTILISATEUR.github.io/ParaChess-Interface/
│
├── index.html
├── portal.css
├── assets/
├── games/
├── parachess/
└── help/
```

---

# ⚠️ Différence entre chemins locaux et GitHub Pages

Le projet original utilise le serveur Express pour servir l'interface via :

```text
/public/
```

Par exemple, un fichier peut être référencé ainsi :

```html
<link rel="stylesheet" href="/public/portal.css">
```

Cela fonctionne lorsque le serveur Express est actif.

Pour une version GitHub Pages, ces chemins devront probablement être adaptés.

Par exemple :

```html
<link rel="stylesheet" href="./portal.css">
```

Ou, selon l'emplacement du fichier :

```html
<link rel="stylesheet" href="../portal.css">
```

Les chemins devront être vérifiés individuellement afin de garantir que l'interface fonctionne correctement sur GitHub Pages.

---

# 🔀 Organisation Git

Ce dépôt est un fork du projet original.

L'organisation recommandée est :

```text
Projet original
Parachess/ParaChess-Interface
          │
          │ fork
          ▼
Fork personnel
Clement-GERARD/ParaChess-Interface
          │
          ├── main
          │
          └── Clement
                │
                └── Développements personnels
```

La branche :

```text
Clement
```

est utilisée pour les modifications personnelles.

---

# 💻 Workflow de développement

Vérifier la branche actuelle :

```bash
git branch
```

Vous devriez voir :

```text
  main
* Clement
```

L'astérisque indique la branche actuellement utilisée.

---

## Vérifier les modifications

```bash
git status
```

---

## Ajouter les modifications

```bash
git add .
```

---

## Créer un commit

```bash
git commit -m "Description des modifications"
```

Exemple :

```bash
git commit -m "Adaptation de l'interface pour GitHub Pages"
```

---

## Envoyer les modifications sur GitHub

```bash
git push
```

La branche locale `Clement` étant liée à :

```text
origin/Clement
```

les modifications seront envoyées sur la branche `Clement` du fork personnel.

---

# 🔄 Mettre à jour le fork depuis le projet original

Si le projet original évolue, il est possible de récupérer ses modifications.

Ajouter une fois le dépôt original :

```bash
git remote add upstream https://github.com/Parachess/ParaChess-Interface.git
```

Vérifier les dépôts distants :

```bash
git remote -v
```

Vous devriez obtenir quelque chose de similaire à :

```text
origin      https://github.com/VOTRE-UTILISATEUR/ParaChess-Interface.git
upstream    https://github.com/Parachess/ParaChess-Interface.git
```

Récupérer les modifications :

```bash
git fetch upstream
```

Puis mettre à jour `main` :

```bash
git switch main
git merge upstream/main
git push origin main
```

Les modifications peuvent ensuite être intégrées dans la branche personnelle si nécessaire.

---

# 🛠️ Dépannage

## `node` n'est pas reconnu

Node.js n'est probablement pas installé ou n'est pas présent dans le `PATH`.

Vérifiez :

```bash
node --version
```

Installez Node.js si nécessaire, puis redémarrez le terminal.

---

## `npm install` échoue

Essayez :

```bash
npm install --ignore-scripts
```

C'est également la commande indiquée dans le README du projet original.

---

## Le navigateur ne se connecte pas au projet

Vérifiez que le serveur est lancé :

```bash
node ./index.js
```

Puis ouvrez :

```text
http://localhost:5000
```

---

## GitHub Pages fonctionne mais certaines fonctionnalités sont cassées

C'est attendu si ces fonctionnalités nécessitent :

* Express ;
* Socket.IO côté serveur ;
* Vosk ;
* des API ;
* des routes Node.js.

Dans ce cas, il faut soit :

1. adapter la fonctionnalité pour fonctionner entièrement côté navigateur ;
2. héberger un backend séparément ;
3. conserver le serveur Node.js pour la version complète.

---

# 📌 Résumé rapide

### Développer l'interface uniquement

```text
VS Code
↓
interface/index.html
↓
Live Server
```

### Tester la version complète

```bash
npm install --ignore-scripts
node ./index.js
```

Puis :

```text
http://localhost:5000
```

### Déployer une version statique

```text
interface/
↓
GitHub Actions
↓
GitHub Pages
```

⚠️ Les fonctionnalités nécessitant le backend Node.js devront être adaptées ou désactivées.

---

# Projet original

Le projet d'origine est disponible ici :

[ParaChess-Interface — dépôt original](https://github.com/Parachess/ParaChess-Interface?utm_source=chatgpt.com)

Cette version constitue un fork destiné à des expérimentations et développements indépendants.
:::

**Point important pour la suite :** avant de transformer tout le projet pour GitHub Pages, je te conseille de commencer par lancer `node ./index.js` localement et vérifier ce qui fonctionne réellement. Ensuite, on pourra identifier précisément **quelles fonctionnalités dépendent du serveur et lesquelles peuvent fonctionner entièrement sur GitHub Pages**.


