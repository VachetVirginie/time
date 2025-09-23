import { ref, onMounted, onUnmounted } from 'vue'

/**
 * Composable pour gérer la navigation au clavier dans un VDatePicker
 * @param {Ref} modelValue - La date sélectionnée
 * @param {Function} emit - Fonction pour émettre les événements
 * @param {Ref} isMenuOpen - État d'ouverture du menu
 */
export function useKeyboardNavigation(modelValue, emit, isMenuOpen) {
  const focusedDate = ref(null)
  const datePickerContainer = ref(null)

  // Initialiser la date focus avec la date actuelle ou aujourd'hui
  const initializeFocusedDate = () => {
    focusedDate.value = modelValue.value ? new Date(modelValue.value) : new Date()
  }

  // Déplacer le focus d'un certain nombre de jours
  const moveFocus = (days) => {
    if (!focusedDate.value) return
    const newDate = new Date(focusedDate.value)
    newDate.setDate(newDate.getDate() + days)
    focusedDate.value = newDate
    updateDateButtonFocus()
  }

  // Déplacer le focus au début du mois
  const moveToStartOfMonth = () => {
    if (!focusedDate.value) return
    const newDate = new Date(focusedDate.value)
    newDate.setDate(1)
    focusedDate.value = newDate
    updateDateButtonFocus()
  }

  // Déplacer le focus à la fin du mois
  const moveToEndOfMonth = () => {
    if (!focusedDate.value) return
    const newDate = new Date(focusedDate.value)
    newDate.setMonth(newDate.getMonth() + 1, 0) // Dernier jour du mois
    focusedDate.value = newDate
    updateDateButtonFocus()
  }

  // Sélectionner la date actuellement focusée
  const selectFocusedDate = () => {
    if (focusedDate.value) {
      emit('update:modelValue', focusedDate.value)
      emit('update:menu', false)
    }
  }

  // Mettre à jour le focus visuel sur le bouton de date
  const updateDateButtonFocus = () => {
    if (!datePickerContainer.value || !focusedDate.value) return
    
    // Attendre le prochain tick pour que le DOM soit mis à jour
    setTimeout(() => {
      const targetDate = focusedDate.value.getDate()
      const buttons = datePickerContainer.value.querySelectorAll('.v-date-picker-month__day button')
      
      // Retirer le focus de tous les boutons
      buttons.forEach(btn => {
        btn.classList.remove('keyboard-focused')
        btn.setAttribute('tabindex', '-1')
      })
      
      // Trouver et focuser le bon bouton
      buttons.forEach(btn => {
        const buttonText = btn.textContent?.trim()
        if (buttonText === targetDate.toString()) {
          btn.classList.add('keyboard-focused')
          btn.setAttribute('tabindex', '0')
          btn.focus()
        }
      })
    }, 50)
  }

  // Gestionnaire d'événements clavier
  const handleKeydown = (event) => {
    if (!isMenuOpen.value) return

    switch (event.key) {
      case 'ArrowLeft':
        event.preventDefault()
        moveFocus(-1)
        break
      case 'ArrowRight':
        event.preventDefault()
        moveFocus(1)
        break
      case 'ArrowUp':
        event.preventDefault()
        moveFocus(-7)
        break
      case 'ArrowDown':
        event.preventDefault()
        moveFocus(7)
        break
      case 'Home':
        event.preventDefault()
        moveToStartOfMonth()
        break
      case 'End':
        event.preventDefault()
        moveToEndOfMonth()
        break
      case 'Enter':
      case ' ':
        event.preventDefault()
        selectFocusedDate()
        break
      case 'Escape':
        event.preventDefault()
        emit('update:menu', false)
        break
    }
  }

  // Observer les changements de mois dans le picker
  const observeMonthChanges = () => {
    if (!datePickerContainer.value) return

    const observer = new MutationObserver(() => {
      if (isMenuOpen.value) {
        updateDateButtonFocus()
      }
    })

    observer.observe(datePickerContainer.value, {
      childList: true,
      subtree: true
    })

    return () => observer.disconnect()
  }

  onMounted(() => {
    initializeFocusedDate()
    document.addEventListener('keydown', handleKeydown)
  })

  onUnmounted(() => {
    document.removeEventListener('keydown', handleKeydown)
  })

  return {
    focusedDate,
    datePickerContainer,
    initializeFocusedDate,
    updateDateButtonFocus,
    observeMonthChanges
  }
}