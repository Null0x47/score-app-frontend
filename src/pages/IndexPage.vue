<template>
  <q-page class="fit wrap">
    <q-dialog v-model="showAddTentForm" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Maak een nieuwe tent aan</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input
            outlined
            label="Tentnummer"
            v-model="addTentForm.tentnr.value"
            autofocus
          /><br />
          <q-input
            outlined
            label="Tentchef"
            v-model="addTentForm.tentchef.value"
          /><br />
          <q-input
            outlined
            type="textarea"
            label="Kampers"
            v-model="addTentForm.kampers.value"
          /><br />
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat color="grey" label="Annuleren" v-close-popup />
          <q-btn flat label="Aanmaken" @click="addTent()" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="showAddActiviteitForm" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Maak een nieuwe activiteit aan</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input
            outlined
            label="Naam"
            v-model="addActiviteitForm.naam.value"
            autofocus
          /><br />
          <q-select
            outlined
            v-model="addActiviteitForm.type.value"
            :options="typeOptions"
            label="Type"
          /><br />
          <q-select
            outlined
            v-model="addActiviteitForm.dagdeel.value"
            :options="dagdeelOptions"
            label="Dagdeel"
          /><br />
          <q-checkbox
            v-model="addActiviteitForm.themadag_onderdeel.value"
            label="Themadag onderdeel"
          />
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat color="grey" label="Annuleren" v-close-popup />
          <q-btn flat label="Aanmaken" @click="addActiviteit()" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="showVerwijderTentDialog" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Weet je het zeker?</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          Weet je zeker dat je <b>"tent {{ tentOmTeVerwijderen }}"</b> wilt
          verwijderen? Deze actie kan je niet terugdraaien!
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn
            flat
            color="grey"
            label="Annuleren"
            @click="closeVerwijderTentDialog()"
            v-close-popup
          />
          <q-btn
            flat
            label="Verwijderen"
            @click="removeTent(tentOmTeVerwijderen)"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="showVerwijderActiviteitDialog" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Weet je het zeker?</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          Weet je zeker dat je de activiteit
          <b>"{{ (activiteitOmTeVerwijderen as any).naam }}"</b> wilt
          verwijderen? Deze actie kan je niet terugdraaien!
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn
            flat
            color="grey"
            label="Annuleren"
            @click="closeVerwijderActiviteitDialog()"
            v-close-popup
          />
          <q-btn
            flat
            label="Verwijderen"
            @click="removeActiviteit(activiteitOmTeVerwijderen)"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <div class="q-pa-md">
      <div class="sa-column">
        <h4 class="text-bold">
          <q-icon class="sa-icon-adjusted" name="sports_score" size="48px" />
          Scores
        </h4>
        <q-card>
          <q-card-section>
            <q-list padding>
              <q-item>
                <q-item-section>
                  <q-item-label overline>Totaal</q-item-label>
                  <q-item-label caption
                    >Scores bijgehouden over de hele week</q-item-label
                  >
                </q-item-section>
              </q-item>

              <q-separator spaced />

              <q-item v-for="tent in tenten" :key="`tent-${tent.id}-score`">
                <q-item-section top avatar>
                  <q-avatar rounded>
                    <img src="../assets/img/kamp.jpg" />
                  </q-avatar>
                </q-item-section>

                <q-item-section>
                  <q-item-label
                    >Tent {{ tent.tentnr }} ({{ tent.tentchef }})</q-item-label
                  >
                  <q-item-label caption>{{ tent.kampers }}</q-item-label>
                </q-item-section>

                <q-item-section side top>
                  <template v-if="scores">
                    <q-item-label caption
                      ><b>{{ getScore(tent.tentnr) }} punten</b></q-item-label
                    >
                  </template>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>

        <div>
          <h4 class="text-bold">
            <q-icon class="sa-icon-adjusted" name="bungalow" size="48px" />
            Tenten
            <q-btn
              color="grey"
              round
              icon="add"
              @click="showAddTentForm = true"
            />
          </h4>
        </div>
        <q-markup-table>
          <thead>
            <tr>
              <th class="text-left">Tentnummer</th>
              <th class="text-left">Tentchef</th>
              <th class="text-left">Kampers</th>
              <th class="text-right">Acties</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="tent in tenten" :key="`tent-${tent.id}`">
              <td class="text-left">{{ tent.tentnr }}</td>
              <td class="text-left">{{ tent.tentchef }}</td>
              <td class="text-left">{{ tent.kampers }}</td>
              <td class="text-right">
                <q-btn
                  color="primary"
                  round
                  flat
                  icon="delete"
                  @click="openVerwijderTentDialog(tent.tentnr)"
                />
              </td>
            </tr>
          </tbody>
        </q-markup-table>

        <div>
          <h4 class="text-bold">
            <q-icon class="sa-icon-adjusted" name="hiking" size="48px" />
            Activiteiten
            <q-btn
              color="grey"
              round
              icon="add"
              @click="showAddActiviteitForm = true"
            />
          </h4>
        </div>
        <q-markup-table>
          <thead>
            <tr>
              <th class="text-left">Naam</th>
              <th class="text-left">Type</th>
              <th class="text-left">Dagdeel</th>
              <th class="text-left">Themadag onderdeel</th>
              <th class="text-right">Acties</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="activiteit in activiteiten"
              :key="`activiteit-${activiteit.id}`"
            >
              <td class="text-left">{{ activiteit.naam }}</td>
              <td class="text-left">{{ activiteit.type }}</td>
              <td class="text-left">{{ activiteit.dagdeel }}</td>
              <td class="text-left">
                <template v-if="activiteit.themadag_onderdeel == 0">
                  Nee
                </template>
                <template v-else> Ja </template>
              </td>
              <td class="text-right">
                <q-btn
                  color="primary"
                  outline
                  flat
                  round
                  icon="delete"
                  @click="openVerwijderActiviteitDialog(activiteit)"
                />
              </td>
            </tr>
          </tbody>
        </q-markup-table>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import axios from 'axios';
import { useQuasar } from 'quasar';
import { onMounted, ref } from 'vue';
import { API_URL } from '../constants';

enum Dagdeel {
  Ochtend = 'Ochtend',
  Middag = 'Middag',
  Vooravond = 'Vooravond',
  OchtendEnMiddag = 'Ochtend en middag',
  Avond = 'Avond',
}

const dagdeelOptions = [
  Dagdeel.Ochtend,
  Dagdeel.Middag,
  Dagdeel.Vooravond,
  Dagdeel.Avond,
  Dagdeel.OchtendEnMiddag,
];

enum ActiviteitType {
  Tocht = 'Tocht',
  Spel = 'Spel',
  Vooravond = 'Vooravond programma',
}

const typeOptions = [
  ActiviteitType.Tocht,
  ActiviteitType.Spel,
  ActiviteitType.Vooravond,
];

const $q = useQuasar();
const tenten = ref();
const activiteiten = ref();
const scores = ref();

const showVerwijderTentDialog = ref(false);
const tentOmTeVerwijderen = ref(0);

const showVerwijderActiviteitDialog = ref(false);
const activiteitOmTeVerwijderen = ref({});

const showAddTentForm = ref(false);
const addTentForm = {
  tentnr: ref(''),
  tentchef: ref(''),
  kampers: ref(''),
};

const showAddActiviteitForm = ref(false);
const addActiviteitForm = {
  naam: ref(''),
  type: ref(ActiviteitType.Tocht),
  dagdeel: ref(Dagdeel.Ochtend),
  themadag_onderdeel: ref(false),
};

const openVerwijderTentDialog = (tentnr: number) => {
  tentOmTeVerwijderen.value = tentnr;
  showVerwijderTentDialog.value = true;
};

const closeVerwijderTentDialog = () => {
  tentOmTeVerwijderen.value = 0;
  showVerwijderTentDialog.value = false;
};

const openVerwijderActiviteitDialog = (activiteit: object) => {
  activiteitOmTeVerwijderen.value = activiteit;
  showVerwijderActiviteitDialog.value = true;
};

const closeVerwijderActiviteitDialog = () => {
  activiteitOmTeVerwijderen.value = {};
  showVerwijderActiviteitDialog.value = false;
};

const getScore = (tentnr: number) => {
  let tempScore = 0;

  scores.value.forEach((score: any) => {
    if (score.tentnr == tentnr) {
      tempScore = score.score;
    }
  });

  return tempScore;
};

const fetchTenten = async () => {
  await axios
    .get(`${API_URL}/tenten/`)
    .then((response) => (tenten.value = response.data['tenten']))
    .catch((err) => $q.notify({ message: err.message, type: 'negative' }));
};

const fetchScores = async () => {
  await axios
    .get(`${API_URL}/scores/`)
    .then((response) => (scores.value = response.data['scores']))
    .catch((err) => $q.notify({ message: err.message, type: 'negative' }));
};

const fetchActiviteiten = async () => {
  await axios
    .get(`${API_URL}/activiteiten/`)
    .then((response) => (activiteiten.value = response.data['activiteiten']))
    .catch((err) => $q.notify({ message: err.message, type: 'negative' }));
};

const removeTent = async (tentnr: number) => {
  await axios
    .delete(`${API_URL}/tenten/${tentnr}`)
    .then(async (_) => {
      await axios
        .delete(`${API_URL}/scores/${tentnr}`)
        .catch((err) => $q.notify({ message: err.message, type: 'negative' }));

      $q.notify({ message: 'Tent verwijderd!', type: 'positive' });
      await fetchTenten();
    })
    .catch((err) => $q.notify({ message: err.message, type: 'negative' }));

  showVerwijderTentDialog.value = false;
};

const removeActiviteit = async (activiteit: object) => {
  await axios
    .delete(`${API_URL}/activiteiten/${(activiteit as any).id}`)
    .then(async (_) => {
      $q.notify({ message: 'Activiteit verwijderd!', type: 'positive' });
      await fetchActiviteiten();
    })
    .catch((err) => $q.notify({ message: err.message, type: 'negative' }));

  showVerwijderActiviteitDialog.value = false;
};

const addActiviteit = async () => {
  const themadag = addActiviteitForm.themadag_onderdeel.value ? 1 : 0;
  await axios
    .post(`${API_URL}/activiteiten/`, {
      naam: addActiviteitForm.naam.value,
      type: addActiviteitForm.type.value,
      dagdeel: addActiviteitForm.dagdeel.value,
      themadag_onderdeel: themadag,
    })
    .then(async (_) => {
      $q.notify({ message: 'Activiteit aangemaakt!', type: 'positive' });
      await fetchActiviteiten();
    })
    .catch((err) => $q.notify({ message: err.message, type: 'negative' }));

  showAddActiviteitForm.value = false;

  // Reset values
  addActiviteitForm.naam.value = '';
  addActiviteitForm.type.value = ActiviteitType.Tocht;
  addActiviteitForm.dagdeel.value = Dagdeel.Ochtend;
  addActiviteitForm.themadag_onderdeel.value = false;
};

const addTent = async () => {
  await axios
    .post(`${API_URL}/tenten/`, {
      tentnr: +addTentForm.tentnr.value,
      tentchef: addTentForm.tentchef.value,
      kampers: addTentForm.kampers.value,
    })
    .then(async (_) => {
      await axios
        .post(`${API_URL}/scores/`, {
          tentnr: +addTentForm.tentnr.value,
          score: 0,
        })
        .catch((err) => $q.notify({ message: err.message, type: 'negative' }));

      $q.notify({ message: 'Tent aangemaakt!', type: 'positive' });
      await fetchTenten();
    })
    .catch((err) => $q.notify({ message: err.message, type: 'negative' }));

  showAddTentForm.value = false;

  // Reset values
  addTentForm.tentnr.value = '';
  addTentForm.tentchef.value = '';
  addTentForm.kampers.value = '';
};

onMounted(async () => {
  await fetchTenten();
  await fetchActiviteiten();
  await fetchScores();
});
</script>
