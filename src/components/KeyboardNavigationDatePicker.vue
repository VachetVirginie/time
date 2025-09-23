<template>
  <v-menu
    v-model="isMenuOpen"
    :close-on-content-click="false"
    transition="scale-transition"
    offset-y
    min-width="auto"
  >
    <template v-slot:activator="{ props }">
      <v-text-field
        :model-value="formattedDate"
        :label="label"
        :placeholder="placeholder"
        readonly
        v-bind="props"
        :prepend-inner-icon="prependIcon"
        :append-inner-icon="appendIcon"
        variant="outlined"
        @click="openPicker"
        @keydown.enter="openPicker"
        @keydown.space="openPicker"
      />
    </template>

    <div ref="datePickerContainer" class="keyboard-navigation-date-picker">
      <v-date-picker
        v-model="internalValue"
        @update:model-value="handleDateSelection"
        @update:view-mode="handleViewModeChange"
        show-adjacent-months
        class="elevation-1"
      >
        <template v-slot:header>
          <div class="pa-2 text-center">
            <v-btn
              icon="mdi-keyboard"
              variant="text"
              size="small"
              @click="showKeyboardHelp = !showKeyboardHelp"
              :color="showKeyboardHelp ? 'primary' : 'default'"
            />
            <span class="text-caption ml-2">Navigation clavier disponible</span>
          </div>
        </template>
      </v-date-picker>

      <!-- Aide pour la navigation clavier -->
      <v-expand-transition>
        <v-card v-if="showKeyboardHelp" class="ma-2 keyboard-help" elevation="2">
          <v-card-title class="text-subtitle-1 pa-3">
            Navigation au clavier
          </v-card-title>
          <v-card-text class="pa-3 pt-0">
            <div class="text-caption">
              <div class="mb-1"><kbd>←</kbd> <kbd>→</kbd> Jour précédent/suivant</div>
              <div class="mb-1"><kbd>↑</kbd> <kbd>↓</kbd> Semaine précédente/suivante</div>
              <div class="mb-1"><kbd>Home</kbd> <kbd>End</kbd> Début/fin du mois</div>
              <div class="mb-1"><kbd>Entrée</kbd> <kbd>Espace</kbd> Sélectionner</div>
              <div><kbd>Échap</kbd> Fermer</div>
            </div>
          </v-card-text>
        </v-card>
      </v-expand-transition>
    </div>
  </v-menu>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue'
import { useKeyboardNavigation } from '../composables/useKeyboardNavigation.js'

const props = defineProps({
  modelValue: {
    type: [String, Date],
    default: null
  },
  label: {
    type: String,
    default: 'Date'
  },
  placeholder: {
    type: String,
    default: 'Sélectionner une date'
  },
  prependIcon: {
    type: String,
    default: 'mdi-calendar'
  },
  appendIcon: {
    type: String,
    default: null
  }
})

const emit = defineEmits(['update:modelValue', 'update:menu'])

const isMenuOpen = ref(false)
const showKeyboardHelp = ref(false)
const internalValue = ref(props.modelValue)

// Utiliser le composable pour la navigation clavier
const { 
  datePickerContainer, 
  initializeFocusedDate, 
  updateDateButtonFocus, 
  observeMonthChanges 
} = useKeyboardNavigation(
  computed(() => props.modelValue), 
  emit, 
  isMenuOpen
)

// Formater la date pour l'affichage
const formattedDate = computed(() => {
  if (!props.modelValue) return ''
  const date = props.modelValue instanceof Date ? props.modelValue : new Date(props.modelValue)
  return date.toLocaleDateString('fr-FR')
})

// Ouvrir le picker
const openPicker = () => {
  isMenuOpen.value = true
  initializeFocusedDate()
}

// Gérer la sélection de date
const handleDateSelection = (newDate) => {
  internalValue.value = newDate
  emit('update:modelValue', newDate)
  // Fermer le menu après sélection
  setTimeout(() => {
    isMenuOpen.value = false
  }, 100)
}

// Gérer les changements de mode de vue
const handleViewModeChange = () => {
  nextTick(() => {
    updateDateButtonFocus()
  })
}

// Watcher pour les changements de valeur externe
watch(() => props.modelValue, (newValue) => {
  internalValue.value = newValue
  if (isMenuOpen.value) {
    initializeFocusedDate()
    nextTick(() => {
      updateDateButtonFocus()
    })
  }
})

// Watcher pour l'ouverture/fermeture du menu
watch(isMenuOpen, (isOpen) => {
  emit('update:menu', isOpen)
  if (isOpen) {
    nextTick(() => {
      const disconnect = observeMonthChanges()
      // Nettoyer l'observer quand le menu se ferme
      const unwatch = watch(isMenuOpen, (newIsOpen) => {
        if (!newIsOpen) {
          disconnect()
          unwatch()
        }
      })
      updateDateButtonFocus()
    })
  } else {
    showKeyboardHelp.value = false
  }
})
</script>

<style scoped>
.keyboard-navigation-date-picker {
  position: relative;
}

.keyboard-help {
  max-width: 280px;
}

kbd {
  background-color: #f0f0f0;
  border: 1px solid #ccc;
  border-radius: 3px;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
  color: #333;
  display: inline-block;
  font-family: monospace;
  font-size: 0.75em;
  font-weight: bold;
  line-height: 1;
  padding: 2px 4px;
  white-space: nowrap;
}

/* Styles pour le focus clavier dans le calendrier */
:deep(.v-date-picker-month__day button.keyboard-focused) {
  outline: 2px solid rgb(var(--v-theme-primary));
  outline-offset: 2px;
  z-index: 1;
  position: relative;
}

:deep(.v-date-picker-month__day button:focus-visible) {
  outline: 2px solid rgb(var(--v-theme-primary));
  outline-offset: 2px;
}

/* Améliorer la visibilité du focus */
:deep(.v-date-picker-month__day button) {
  transition: all 0.2s ease;
}

:deep(.v-date-picker-month__day button.keyboard-focused),
:deep(.v-date-picker-month__day button:focus-visible) {
  transform: scale(1.1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}
</style>