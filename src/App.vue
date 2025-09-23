<template>
  <v-app>
    <v-main>
      <v-container class="py-8">
        <v-row justify="center">
          <v-col cols="12" md="8">
            <v-card class="pa-6">
              <v-card-title class="text-h4 mb-4">
                VDatePicker avec Navigation Clavier
              </v-card-title>
              
              <v-card-text>
                <p class="mb-4">
                  Ce composant permet de naviguer dans le calendrier avec le clavier :
                </p>
                <ul class="mb-4">
                  <li><strong>Flèches gauche/droite :</strong> déplacer d'un jour</li>
                  <li><strong>Flèches haut/bas :</strong> déplacer d'une semaine</li>
                  <li><strong>Home/End :</strong> aller au début/fin du mois</li>
                  <li><strong>Échap :</strong> fermer le picker</li>
                </ul>
                
                <KeyboardNavigationDatePicker 
                  v-model="selectedDate"
                  label="Sélectionner une date"
                />
                
                <div v-if="selectedDate" class="mt-4">
                  <v-chip color="primary" variant="elevated">
                    Date sélectionnée : {{ formatDate(selectedDate) }}
                  </v-chip>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref } from 'vue'
import KeyboardNavigationDatePicker from './components/KeyboardNavigationDatePicker.vue'

const selectedDate = ref(null)

const formatDate = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script>