### README - kw-js

## Contexte du Projet

Ce projet, vise à démontrer les capacités de reconnaissance vocale en temps réel à l'aide de TensorFlow.js. L'application web permet aux utilisateurs de télécharger des fichiers audio pour prédire des mots-clés spécifiques.

## Fonctionnalités 

- **Téléchargement de fichiers audio** : Les utilisateurs peuvent télécharger des fichiers audio pour analyse.
- **Prédiction de mots-clés** : Utilisation d'un modèle pré-entraîné pour prédire les mots-clés à partir des fichiers audio fournis.

## Technologies Utilisées

- **HTML5** : Structure de la page web.
- **CSS3** : Stylisation et mise en page.
- **JavaScript** : Logique de l'application.
- **TensorFlow.js** : Bibliothèque pour l'exécution du modèle de machine learning directement dans le navigateur.

## Détails du Modèle de Machine Learning

- **Entrée** :
  - Format : Fichier WAV ou enregistrement en temps réel
  - Canal : Mono
  - Taux d'échantillonnage : 16 kHz
  - Durée : Exactement 1 seconde (16 000 échantillons)

- **Sortie** :
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
- `app.js` : Logique principale de l'application, incluant l'interaction avec TensorFlow.js et les fonctionnalités d'enregistrement.
- `tfjs_model/` : Contient `model.json` et les fichiers `.bin` nécessaires pour le modèle TensorFlow.
- `images/` : Contient les images utilisées dans l'interface utilisateur.
- `samples/` : Exemple de fichiers audio pour les tests.

## Contributeurs

Ce projet a été développé par l'équipe Horizon. Nous sommes toujours ouverts aux contributions et aux suggestions pour améliorer ce projet.

