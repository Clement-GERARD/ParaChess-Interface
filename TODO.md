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

## 📌 Ordre de priorité pour la suite

1. [ ] Valider le lancement réel en navigateur sur le menu et les deux jeux
2. [ ] Tester le micro en conditions réelles sur PC / téléphone / tablette
3. [ ] Vérifier le flux complet voix → interprétation → action dans le jeu
4. [ ] Contrôler le comportement en cas de modèle Vosk ou Stockfish indisponible
5. [ ] Finaliser la documentation utilisateur / développeur si besoin
6. [ ] Faire une passe de polish responsive et ergonomie finale

## 📱 Sous-projet mobile et qualité du code

- [x] Préparer l'écoute réseau locale sur `0.0.0.0` et le port configurable
- [x] Ajouter le test Docker local avec accès Wi-Fi et URL `ADVERTISED_HOST`
- [x] Vérifier la connexion Socket.IO depuis le navigateur mobile
- [ ] Mettre à jour et compléter la documentation du code et du README
- [ ] Réduire les logs de debug verbeux tout en conservant les erreurs, permissions et démarrage
- [ ] Vérifier séparément la verbosité des logs natifs générés par Vosk
- [ ] Remplacer `ffi-napi` par une dépendance maintenue et compatible avec Node.js
- [ ] Revalider le build et le démarrage Docker après remplacement de `ffi-napi`
- [ ] Mettre en place HTTPS local pour tester micro et caméra
- [ ] Valider le head tracking sur appareils mobiles réels

## ⚠️ Point de vigilance

Les éléments restants ne sont plus des bugs critiques de logique ; ils relèvent surtout de la validation réelle, du comportement en environnement réel et de la finition produit.
