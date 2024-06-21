### README - kw-js

## Contexte du Projet

Le projet sert à démontrer les capacités de reconnaissance vocale en temps réel à l'aide de TensorFlow.js.
L'application web permet aux utilisateurs de télécharger des fichiers audio pour prédire des mots-clés spécifiques. 
Cette solution est conçue pour des démonstrations clients.

## Fonctionnalités Principales

- **Téléchargement de fichiers audio** : Les utilisateurs peuvent télécharger des fichiers audio pour analyse.
- **Prédiction de mots-clés** : Utilisation d'un modèle pré-entraîné pour prédire les mots-clés à partir des fichiers audio fournis.
- **Affichage des résultats** : Le mot reconnu est affiché sur la page après analyse.

## Utilisation de la Page

La page web est conçue pour offrir une interface intuitive, alignée avec l'image de marque de Surpuissant. Elle inclut les sections suivantes :

- **Explication du Wake Word** : Un texte explicatif détaillant ce qu'est un "wake word" (mot de réveil), son utilité et des exemples courants tels que "Hey Siri" ou "Ok Google".
- **Téléchargement de Fichiers Audio et Analyse Vocale** : Les utilisateurs peuvent télécharger un fichier audio pour lancer l'analyse vocale. Le résultat de la prédiction est ensuite affiché sur la page.

## Technologies Utilisées

- **HTML5** : Structure de la page web.
- **CSS3** : Stylisation et mise en page.
- **JavaScript** : Logique de l'application.
- **TensorFlow.js** : Bibliothèque pour l'exécution du modèle de machine learning directement dans le navigateur.

## Détails du Modèle de Machine Learning

- **Entrée** :
  - Format : Fichier WAV
  - Canal : Mono
  - Taux d'échantillonnage : 16 kHz
  - Durée : Exactement 1 seconde (16 000 échantillons)

- **Sortie** :
  - Tenseur représentant la distribution de probabilité sur diverses étiquettes prédéfinies.
  - L'étiquette avec la probabilité la plus élevée est affichée comme résultat de la prédiction.

## Instructions pour Lancer le Projet

### Pré-requis

- Un navigateur moderne (Chrome, Firefox) supportant TensorFlow.js.
- Connexion Internet pour charger TensorFlow.js depuis le CDN.

### Étapes

1. **Téléchargez les fichiers du projet** :
   - Clonez le dépôt ou téléchargez l'archive ZIP contenant tous les fichiers nécessaires.

2. **Ouvrez le fichier `index.html`** :
   - Utilisez un navigateur moderne pour ouvrir ce fichier. Cela lancera l'application web.

3. **Utilisez l'interface utilisateur** :
   - Pour télécharger un fichier audio, utilisez le bouton de téléchargement et sélectionnez un fichier `.wav`. Cliquez ensuite sur "Lancer l'analyse vocale".

### Structure du Répertoire

- `index.html` : Interface utilisateur principale.
- `style.css` : Styles CSS pour la mise en page et le design.
- `app.js` : Logique principale de l'application, incluant l'interaction avec TensorFlow.js et les fonctionnalités de téléchargement/analyse audio.
- `tfjs_model/` : Contient `model.json` et les fichiers `.bin` nécessaires pour le modèle TensorFlow.
- `images/` : Contient les images utilisées dans l'interface utilisateur.
- `samples/` : Exemple de fichiers audio pour les tests.

## Contributeurs

Ce projet a été développé par l'équipe Horizon. 
