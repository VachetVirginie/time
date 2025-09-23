# VDatePicker avec Navigation Clavier

Ce projet implémente un composant Vue.js qui enrichit le VDatePicker de Vuetify 3 avec une navigation au clavier complète et accessible.

## Fonctionnalités

### Navigation au clavier
- **Flèches gauche/droite** : Se déplacer d'un jour dans le calendrier
- **Flèches haut/bas** : Se déplacer d'une semaine dans le calendrier  
- **Home** : Aller au premier jour du mois
- **End** : Aller au dernier jour du mois
- **Entrée/Espace** : Sélectionner la date actuellement focusée
- **Échap** : Fermer le picker

### Accessibilité
- Focus visible sur la date sélectionnée
- Support des lecteurs d'écran
- Navigation intuitive au clavier
- Aide contextuelle affichable

## Installation

```bash
npm install
```

## Démarrage

```bash
npm run dev
```

Le projet sera accessible sur `http://localhost:5173`

## Utilisation

### Utilisation de base

```vue
<template>
  <KeyboardNavigationDatePicker 
    v-model="selectedDate"
    label="Sélectionner une date"
  />
</template>

<script setup>
import { ref } from 'vue'
import KeyboardNavigationDatePicker from './components/KeyboardNavigationDatePicker.vue'

const selectedDate = ref(null)
</script>
```

### Props disponibles

| Prop | Type | Défaut | Description |
|------|------|--------|-------------|
| `modelValue` | `String\|Date` | `null` | La date sélectionnée |
| `label` | `String` | `'Date'` | Label du champ de saisie |
| `placeholder` | `String` | `'Sélectionner une date'` | Placeholder du champ |
| `prependIcon` | `String` | `'mdi-calendar'` | Icône avant le texte |
| `appendIcon` | `String` | `null` | Icône après le texte |

### Événements

| Événement | Description |
|-----------|-------------|
| `update:modelValue` | Émis quand une date est sélectionnée |
| `update:menu` | Émis quand le menu s'ouvre/ferme |

## Structure du projet

```
src/
├── components/
│   └── KeyboardNavigationDatePicker.vue   # Composant principal
├── composables/
│   └── useKeyboardNavigation.js           # Logique de navigation
├── App.vue                                # Application de démonstration
└── main.js                               # Point d'entrée
```

## Architecture

### Composable `useKeyboardNavigation`

Le composable `useKeyboardNavigation` gère toute la logique de navigation au clavier :

- Gestion du focus sur les dates
- Calcul des déplacements (jour, semaine, mois)
- Mise à jour du DOM pour le focus visuel
- Observation des changements dans le picker

### Composant `KeyboardNavigationDatePicker`

Le composant principal qui :

- Encapsule le VDatePicker de Vuetify
- Intègre la navigation clavier
- Fournit une interface utilisateur accessible
- Affiche l'aide contextuelle

## Personnalisation

### Styles CSS

Le composant utilise des variables CSS de Vuetify et peut être personnalisé :

```css
/* Focus personnalisé */
:deep(.v-date-picker-month__day button.keyboard-focused) {
  outline: 2px solid your-color;
  transform: scale(1.05);
}
```

### Configuration Vuetify

Le projet utilise Vuetify 3 avec la configuration par défaut. Vous pouvez personnaliser le thème dans `src/main.js`.

## Compatibilité

- Vue.js 3.4+
- Vuetify 3.5+
- Navigateurs modernes avec support ES6+

## Intégration dans un projet existant

Pour intégrer ce composant dans un projet Vuetify 3 existant :

1. Copiez le fichier `KeyboardNavigationDatePicker.vue`
2. Copiez le composable `useKeyboardNavigation.js`
3. Importez et utilisez le composant dans vos pages

```vue
<script setup>
import KeyboardNavigationDatePicker from './path/to/KeyboardNavigationDatePicker.vue'
</script>
```

## Développement

### Structure des fichiers

- `src/components/` : Composants réutilisables
- `src/composables/` : Logique métier réutilisable
- `demo.html` : Page de démonstration
- `vite.config.js` : Configuration Vite

### Scripts disponibles

- `npm run dev` : Démarrer le serveur de développement
- `npm run build` : Construire pour la production
- `npm run preview` : Prévisualiser la build de production