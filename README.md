# Radar (Expo)

Application Expo/React Native minimaliste pour afficher des radars et la position de l'utilisateur.

Ce README décrit comment installer, démarrer et dépanner l'application, ainsi que les comportements liés à la géolocalisation utilisés par le projet.

## Prérequis

- Node.js (>= 18 recommandé)
- npm ou yarn
- Expo CLI (optionnel si vous utilisez `npx expo`) :
  ```bash
  npm install -g expo-cli
  ```
- Un appareil ou simulateur Android/iOS ou Expo Go

## Installer

Depuis la racine du projet :

```bash
npm install
```

## Exécuter en développement

- Démarrer le serveur Metro / Expo :

```bash
npm start
# ou
npx expo start
```

- Ouvrir l'application sur un appareil :
  - Scannez le QR code avec Expo Go
  - Ou lancez `npm run android` / `npm run ios` pour ouvrir un émulateur (si configuré)

## Comportement géolocalisation

L'application :

- Demande la permission de localisation au démarrage (foreground).
- Vérifie si le service de localisation de l'appareil est activé.
  - Si le service est désactivé, l'application affiche une alerte proposant :
    - Ouvrir les réglages (ouvre les réglages de l'app si possible)
    - Réessayer
    - Annuler
- Si l'utilisateur accorde la permission et que le service est activé, la carte :
  - Centre et zoome automatiquement sur la position de l'utilisateur.
  - Affiche un marqueur vert pour "Ma position" et le point bleu natif.

## Données des radars

Les radars sont chargés depuis un fichier CSV public (source : data.gouv.fr). Le parsing est fait côté client dans `components/MapComponent.tsx`.

Remarque : il y a un overlay de chargement pendant le téléchargement et le parsing.

## Fichiers importants

- `app/(tabs)/index.tsx` — écran principal : demande de permissions, récupération de la position et passage à `MapComponent`.
- `components/MapComponent.tsx` — composant Map : récupération des radars, affichage des marqueurs, recentrage/zoom sur la position.
- `package.json` — dépendances et scripts.

## Scripts utiles

- `npm start` — démarre Expo
- `npm run android` — ouvre sur un appareil/émulateur Android via Expo
- `npm run ios` — ouvre sur un simulateur iOS via Expo
- `npm run web` — ouvre la version web (limité par `react-native-maps`)
- `npm run reset-project` — script fourni par le template pour réinitialiser le projet

## Permissions & production

- En mode développement avec Expo Go, la plupart des autorisations sont gérées automatiquement et tu verras les invites au runtime.
- Pour les builds natifs (EAS / build), assure-toi d'ajouter les entrées nécessaires :
  - iOS (`Info.plist`): NSLocationWhenInUseUsageDescription
  - Android (`AndroidManifest.xml`): ACCESS_FINE_LOCATION / ACCESS_COARSE_LOCATION (ou configuration via app.json/app.config.js)

## Dépannage

- Pas d'invite de permission :
  - Sur iOS, vérifie que `Info.plist` contient `NSLocationWhenInUseUsageDescription`.
  - Sur Android, vérifie le manifest ou la config d'Expo.
- Position introuvable alors que la permission est accordée :
  - Vérifie que le service de localisation de l'appareil est activé.
  - Essaie de réessayer depuis l'alerte fournie par l'app.
- Erreur de chargement CSV :
  - Vérifie la connexion réseau et l'accessibilité de l'URL publique.

## Suggestions / améliorations possibles

- Utiliser `Location.watchPositionAsync` pour suivre la position en temps réel.
- Mettre en cache (localStorage/SQLite) la liste des radars pour éviter de recharger à chaque démarrage.
- Ajouter un bouton "Recentrer" dans l'UI plutôt que d'utiliser uniquement l'animation automatique.
- Améliorer le parser CSV en utilisant une librairie robuste si la structure du CSV change.

## Contribuer

- Ouvrir un MR / PR sur le repo.
- Respecter les conventions TypeScript et lint du projet.

## Licence

Code réservé au propriétaire du dépôt.
