# ParaChess Interface

> Application web Node.js de jeux accessibles, avec communication temps réel Socket.IO,
> reconnaissance vocale Vosk et suivi facial côté navigateur.

> Version personnelle du projet **ParaChess-Interface**, développée sur une branche indépendante du fork.
>
> Cette version a notamment pour objectif de permettre l'expérimentation et la modification de l'interface.

---

## 📋 À propos du projet

ParaChess est une interface web regroupant plusieurs fonctionnalités et jeux accessibles depuis une interface commune.

Le projet original repose sur une architecture Node.js comprenant notamment :

* **Node.js**
* **Express**
* **Socket.IO**
* **Vosk** pour certaines fonctionnalités de reconnaissance vocale
* HTML / CSS / JavaScript pour l'interface utilisateur

Le dépôt contient à la fois :

1. une **interface web statique** dans le dossier `interface/` ;
2. un **serveur Node.js** ;
3. différentes routes permettant d'accéder aux jeux et fonctionnalités ;
4. des fonctionnalités temps réel utilisant Socket.IO.

## 📱 Préparation mobile et tablette

Le projet conserve son frontend web et son backend Node.js. La cible mobile est une
application hybride Capacitor, destinée à être publiée dans les stores, avec le backend
hébergé séparément. Cette application mobile n'est pas encore générée ni publiée.
La voix reste traitée par Vosk côté serveur et le suivi facial reste exécuté dans le navigateur
ou le WebView, sous réserve des permissions et des capacités de l'appareil.

### État actuel du test réseau local

Le backend et le conteneur Docker ont été validés sur un réseau Wi-Fi privé :

- l'image Docker se construit avec une base Debian et les dépendances natives de Vosk ;
- le conteneur écoute sur `0.0.0.0:5000` ;
- l'interface d'accueil est accessible depuis un téléphone avec l'IPv4 du PC ;
- Socket.IO établit une connexion visible dans les logs du conteneur ;
- caméra et microphone restent à tester en HTTPS, car une adresse IP locale en HTTP n'est pas
     un contexte sécurisé pour `getUserMedia`.

Le fichier `scripts/run-mobile-test.ps1` détecte l'IPv4 locale du PC et transmet
`ADVERTISED_HOST` au conteneur :

```powershell
docker build -t parachess-mobile-test .
powershell -ExecutionPolicy Bypass -File .\scripts\run-mobile-test.ps1
```

L'URL affichée par le serveur est celle à saisir sur le téléphone, par exemple
`http://172.16.2.165:5000`. L'adresse `172.17.x.x` d'un conteneur Docker n'est pas une adresse
à utiliser depuis le téléphone.

### Docker et dépendances vocales

Le `Dockerfile` utilise `node:20-bookworm-slim` et installe les outils de compilation nécessaires
aux modules natifs. Le modèle `model-fr/` est requis au démarrage. Le contournement actuel
`CXXFLAGS="-fpermissive"` permet le build de `ffi-napi`, mais reste temporaire : le remplacement
de `ffi-napi` doit être traité séparément puis suivi d'une nouvelle validation Docker.

### Logs

Les logs de démarrage, d'erreur, de permission et de connexion Socket.IO restent actifs.
Les traces de debug verbeuses sont commentées dans le code et peuvent être réactivées
ponctuellement pour diagnostiquer un problème.

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
├── scripts/                # Scripts d'installation et de test
│   ├── install-stockfish.js
│   └── run-mobile-test.ps1
│
├── Dockerfile              # Image Docker du backend
├── .dockerignore           # Fichiers exclus du contexte Docker
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

* Node.js 20 ou version compatible
* npm
* Docker Desktop avec moteur WSL 2, uniquement pour les tests Docker

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
npm install
```

Cette commande installe les dépendances définies dans `package.json`.

Le projet utilise notamment :

* Express
* Socket.IO
* Socket.IO Client
* Vosk

---

# ▶️ Lancer le projet avec Node.js

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
[✱] Démarrage du serveur sur 0.0.0.0:5000
```

Vous pouvez ensuite ouvrir dans votre navigateur :

```text
http://localhost:5000
```

## 🔧 Prérequis runtime du serveur

Le projet dépend de deux éléments externes présents à la racine du dépôt :

- `model-fr/` pour la reconnaissance vocale Vosk
- `.stockfish/` pour le moteur d'analyse d'échecs Stockfish

### Modèle Vosk

Le dossier `model-fr/` doit être présent et complet. S'il manque, le démarrage affiche un message explicite indiquant le chemin attendu et la commande recommandée.

Commande recommandée :

```bash
cd C:\chemin\vers\ParaChess-Interface
node ./index.js
```

### Stockfish

Le binaire Stockfish est attendu dans :

- Windows : `.stockfish/stockfish.exe`
- Linux/macOS : `.stockfish/stockfish`

Le projet accepte aussi un override explicite via la variable d'environnement :

```powershell
$env:STOCKFISH_PATH="C:\chemin\vers\stockfish.exe"
node ./index.js
```

Le script d'installation permet de télécharger et valider le moteur :

```bash
node ./scripts/install-stockfish.js
```

Si Stockfish est absent, le moteur bascule automatiquement en mode dégradé et la partie reste jouable sans analyse de position.

### Ports utilisés

Le projet écoute :

- HTTP / Socket.IO : port `5000`
- flux audio UDP : port `5001`

Si l'un de ces ports est déjà utilisé, le démarrage affiche un message clair au lieu d'échouer silencieusement.

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

# 🐳 Lancer le projet avec Docker

Depuis la racine du projet, dans le terminal intégré de VS Code ou PowerShell :

```powershell
docker build -t parachess-mobile-test .
```

Le `Dockerfile` utilise une image Debian et installe les outils nécessaires aux dépendances
nat​​ives de Vosk et de `ffi-napi`. Le modèle `model-fr/` est inclus dans l'image. Le flag
`CXXFLAGS="-fpermissive"` est un contournement temporaire du build de `ffi-napi` ; son
remplacement est prévu dans le TODO.

Pour lancer un test local accessible depuis un téléphone sur le même Wi-Fi :

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\run-mobile-test.ps1
```

Le script détecte l'IPv4 du PC, transmet `ADVERTISED_HOST` au conteneur et affiche l'URL à
ouvrir sur le téléphone. Le serveur écoute sur `0.0.0.0:5000`, mais l'IP interne Docker
`172.17.x.x` ne doit pas être utilisée par le téléphone.

Pour arrêter le conteneur, utiliser `Ctrl+C` dans le terminal qui l'exécute.

## Limitations du test HTTP local

La page et Socket.IO fonctionnent sur le réseau local. En revanche, les navigateurs mobiles
peuvent refuser caméra et microphone sur une URL HTTP utilisant une adresse IP. Il faudra
mettre en place HTTPS local avant de tester `getUserMedia`, le microphone et le head tracking.

Les logs `LOG (VoskAPI:...)` sont produits par la bibliothèque native Vosk et ne sont pas des
`console.log` du projet. Leur verbosité doit être étudiée séparément.

### Vérifications utiles

Depuis la racine du projet :

```powershell
node --check .\index.js
node --test .\voice-recognition.test.js
docker build -t parachess-mobile-test .
```

Pour vérifier le conteneur en cours d'exécution :

```powershell
docker ps
docker logs -f parachess-mobile-test
```

Une connexion mobile doit produire un log `[Socket] Nouvelle connexion`. L'adresse affichée
par `socket.handshake.address` peut rester une adresse Docker (`172.17.x.x`) lorsque Docker
Desktop effectue une translation réseau ; elle ne doit pas être interprétée comme l'adresse
réelle du téléphone.

---

# ❓ Lancer l'interface sans le serveur

## Oui, avec des limitations importantes.

# Version complète — avec serveur

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

Cette méthode est utile pour vérifier rapidement certains changements HTML/CSS, mais elle ne
remplace pas le serveur Node.js : les routes, les jeux, Socket.IO et Vosk ne fonctionneront pas
comme dans l'application complète.

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
git commit -m "Documentation et préparation mobile"
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

---

# Projet original

Le projet d'origine est disponible ici :

[ParaChess-Interface — dépôt original](https://github.com/Parachess/ParaChess-Interface?utm_source=chatgpt.com)

Cette version constitue un fork destiné à des expérimentations et développements indépendants.


