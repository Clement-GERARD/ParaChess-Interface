# TODO – Parachess Interface

## ✅ Fait aujourd'hui

- [x] Diagnostic du bug vocal et identification de la cause racine
- [x] Centralisation de l'écoute audio au point d'entrée unique
- [x] Suppression de la confusion entre les flux de reconnaissance (menu / échec / puissance 4)
- [x] Renforcement de la robustesse de la transformation audio
- [x] Séparation claire entre normalisation audio et interprétation des commandes
- [x] Ajout de tests de régression sur la reconnaissance vocale
- [x] Vérification explicite de l'existence du modèle Vosk
- [x] Gestion plus robuste des chemins de fichiers et du dossier de travail
- [x] Message de log clair si le modèle manque
- [x] Suppression du crash brutal sans contexte exploitable
- [x] Validation du fichier de modèle et de la commande de démarrage
- [x] Vérification de la disponibilité et de l'exécution réelle de Stockfish
- [x] Ajout d'un mode dégradé si Stockfish est absent ou inutilisable
- [x] Vérification de la compatibilité Windows pour le binaire Stockfish
- [x] Contrôle explicite du flux d'analyse dans le moteur d'échec
- [x] Documentation du projet mise à jour avec les prérequis runtime critiques

## 🔥 Bugs critiques corrigés

1. Reconnaissance vocale instable / silencieuse
2. Conflits logiques entre plusieurs traitements audio
3. Dépendances externes non validées (Vosk + Stockfish)
4. Démarrage fragile en présence de ports occupés ou de fichiers manquants

## 📱 Sous-projet mobile et qualité du code

- [x] Préparer l'écoute réseau locale sur `0.0.0.0` et le port configurable
- [x] Ajouter le test Docker local avec accès Wi-Fi et URL `ADVERTISED_HOST`
- [x] Vérifier la connexion Socket.IO depuis le navigateur mobile
- [x] Mettre à jour le README avec l'architecture et les procédures Node/Docker/mobile
- [x] Ajouter les descriptions de rôle aux principaux fichiers backend, jeu et interface
- [x] Documenter les fonctions backend et les fonctions vocales principales avec entrées/sorties
- [x] Réduire plusieurs logs de debug verbeux sans supprimer leur code
- [ ] Compléter la documentation des fonctions restantes de l'interface
- [ ] Réduire les derniers logs de debug identifiés après vérification fonctionnelle
- [ ] Vérifier séparément la verbosité des logs natifs générés par Vosk
- [ ] Remplacer `ffi-napi` par une dépendance maintenue et compatible avec Node.js
- [ ] Revalider le build et le démarrage Docker après remplacement de `ffi-napi`
- [ ] Mettre en place HTTPS local pour tester micro et caméra
- [ ] Valider le head tracking sur appareils mobiles réels

## 📌 Priorités actuelles

1. [ ] Tester le parcours complet du menu et des deux jeux après les corrections de documentation
2. [ ] Remplacer `ffi-napi` par une solution maintenue et compatible avec Node.js
3. [ ] Revalider le build, le démarrage et le fonctionnement Docker après ce remplacement
4. [ ] Mettre en place HTTPS local pour le microphone et la caméra
5. [ ] Tester le flux voix → interprétation → action sur téléphone et tablette
6. [ ] Adapter et valider le head tracking sur appareils mobiles réels
7. [ ] Finaliser le responsive et les interactions tactiles
8. [ ] Préparer Capacitor, puis les builds Android/iOS et les tests internes des stores

## ✅ Validations déjà réalisées

- [x] Syntaxe validée pour le backend, les routes, les namespaces, les jeux et les scripts
- [x] Tests de régression vocale : 4 tests réussis
- [x] Image Docker reconstruite avec Vosk et `ffi-napi`
- [x] Conteneur démarré sans crash après chargement du modèle Vosk
- [x] Interface servie par le conteneur avec réponse HTTP 200
- [x] Connexion Socket.IO observée dans les logs lors des tests précédents
- [ ] Accès caméra/micro en HTTPS
- [ ] Test complet depuis un appareil mobile réel dans le conteneur après les derniers changements

## ⚠️ Point de vigilance

Les éléments restants ne sont plus des bugs critiques de logique ; ils relèvent surtout de la validation réelle, du comportement en environnement réel et de la finition produit.
