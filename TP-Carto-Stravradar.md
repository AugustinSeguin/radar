# TP - Carto - Stravradar

## Objectifs

Créer une application au format "page d'accueil / principale avec une carte"
Afficher radars récupérés via l'API du gouvernement sur une carte
Faire un affichage pertinent avec des notions de cartes (MapView, Marker, etc.)
Utiliser la position de l'utilisateur avec des degrés de précision différents
Rajouter l'utilisation d'une API maison pour la faculté à prototyper rapidement une POC

## Idée

0. Générer via IA une maquette pertinente pour une application type "carte"
1. Afficher la position de l'utilisateur sur la carte
2. Afficher les radars sur la carte
3. Ajouter des filtres sur les radars (type, distance, etc.)
4. Gérer l'affichage de radars de manière optimisée (déplacements sur la carte)
5. Dessiner des zones pour la compétition type strava (carré ou rond)
6. Afficher des informations détaillées sur un radar au clic (classement, nombre de passages)
7. En bonus, sécuriser l'application (authentification, autorisations, etc.)

## Setup initial

Pour pouvoir utiliser les cartes depuis les dernières versions d'expo sur Android, un build de développement est nécessaire.

Initialisez un projet expo puis suivez ces instructions:

A ce stade, la configuration initiale est terminée.
L'application est maintenant prête à être "buildée".

Voici les dernières étapes à suivre :

  0. Installer le plugin nécessaire pour les cartes :
    https://docs.expo.dev/versions/latest/sdk/map-view
    
    * dans la configuration d'expo rajouter votre clé d'api
      google maps pour iOS et Android comme suit :
    ```json
    "android": {
      "config": {
        "googleMaps": {
          "apiKey": "VOTRE_GOOGLE_MAPS_API_KEY",
        },
      },
    }
    ```

  1. Ajoutez votre clé d'API Google Maps :
      * Ouvrez le fichier map-teacher-app/app.json
      * Remplacez VOTRE_CLE_API_GOOGLE_MAPS_ICI par
        votre véritable clé d'API Google Maps à deux
        endroits (pour iOS et pour Android).

  2. Installez EAS CLI (si ce n'est pas déjà fait) :
      * Exécutez la commande : npm install -g eas-cli

  3. Connectez-vous à votre compte Expo :
      * Dans le dossier map-teacher-app, exécutez : npx 
        eas login

  4. Configurez le projet pour EAS Build :
      * Toujours dans le dossier map-teacher-app,
        exécutez : npx eas build:configure
      * Cela va créer un fichier eas.json dans votre
        projet.

  5. Créez le "Development Build" :
      * Exécutez la commande suivante pour la
        plateforme de votre choix (vous pouvez répéter
        l'opération pour l'autre).
      * Pour Android : npx eas build --profile 
        development --platform android
      * Pour iOS : npx eas build --profile development 
        --platform ios
      * EAS va vous donner une URL pour télécharger et
        installer l'application sur votre téléphone ou
        simulateur/émulateur.

  6. Lancez votre application :
      * Une fois l'application installée sur votre
        appareil, lancez le serveur de développement
        avec la commande : npx expo start --dev-client
      * Scannez le QR code depuis l'application que
        vous venez d'installer.

Votre carte devrait maintenant s'afficher correctement. N'hésitez pas si vous avez d'autres questions.

## Lien de l'application héberger sur EAS Build :

- exemple sur Android : https://expo.dev/accounts/thomaslaforge/projects/template-map-app/builds/9bf4ffac-a000-4ad1-a3be-108d3bd60746

- IOS : A vous de la build si vous avez un compte ou alors mettez-vous en mode Expo Go :
```bash
npx expo start
```
Puis avec la touche `s` changer le mode de lancement en `Expo Go`.

## API Radars

https://github.com/ThomasLaforge/api-radar