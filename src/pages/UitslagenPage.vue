<template>
  <q-page class="fit wrap">
    <q-dialog v-model="showAddUitslagDialog" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Uitslag toevoegen</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-select
            outlined
            v-model="addUitslagForm.activiteit.value"
            :options="activiteitenOptions"
            label="Activiteit"
          /><br />

          <template v-if="addUitslagForm.activiteit.value">
            <q-date
              v-model="addUitslagForm.datum.value"
              mask="DD-MM-YYYY"
              minimal
            /><br /><br />

            <template
              v-for="tent in tenten"
              :key="`uitslag-tent-${tent.tentnr}`"
            >
              <label
                >Uitslag {{ addUitslagForm.activiteit }}
                <b>tent {{ tent.tentnr }}</b></label
              >

              <!-- Ugly... But it works! -->
              <template v-if="tent.tentnr == 1">
                <q-input
                  outlined
                  label="Snelheid"
                  v-model="addUitslagForm.uitslag_tent_1.snelheid.value"
                /><br />
                <q-input
                  outlined
                  label="Punten"
                  v-model="addUitslagForm.uitslag_tent_1.punten.value"
                /><br />
              </template>

              <template v-if="tent.tentnr == 2">
                <q-input
                  outlined
                  label="Snelheid"
                  v-model="addUitslagForm.uitslag_tent_2.snelheid.value"
                /><br />
                <q-input
                  outlined
                  label="Punten"
                  v-model="addUitslagForm.uitslag_tent_2.punten.value"
                /><br />
              </template>

              <template v-if="tent.tentnr == 3">
                <q-input
                  outlined
                  label="Snelheid"
                  v-model="addUitslagForm.uitslag_tent_3.snelheid.value"
                /><br />
                <q-input
                  outlined
                  label="Punten"
                  v-model="addUitslagForm.uitslag_tent_3.punten.value"
                /><br />
              </template>

              <template v-if="tent.tentnr == 4">
                <q-input
                  outlined
                  label="Snelheid"
                  v-model="addUitslagForm.uitslag_tent_4.snelheid.value"
                /><br />
                <q-input
                  outlined
                  label="Punten"
                  v-model="addUitslagForm.uitslag_tent_4.punten.value"
                /><br />
              </template>
            </template>
          </template>
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat color="grey" label="Annuleren" v-close-popup />
          <q-btn flat label="Aanmaken" @click="addUitslag()" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="showVerwijderUitslagDialog" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Weet je het zeker?</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          Weet je zeker dat je uitslag voor
          <b>"{{ uitslagOmTeVerwijderen }}"</b> wilt verwijderen? Deze actie kan
          je niet terugdraaien!
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn
            flat
            color="grey"
            label="Annuleren"
            @click="closeVerwijderUitslagDialog()"
            v-close-popup
          />
          <q-btn
            flat
            label="Verwijderen"
            @click="removeUitslag(uitslagOmTeVerwijderen)"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <div class="q-pa-md">
      <div class="sa-column">
        <h4 class="text-bold">
          <q-icon class="sa-icon-adjusted" name="scoreboard" size="48px" />
          Uitslagen
          <q-btn
            color="grey"
            round
            icon="add"
            @click="showAddUitslagDialog = true"
          />
        </h4>

        <template v-for="(value, key) in uitslagenGrouped" :key="key">
          <div class="text-right sa-delete-uitslag">
            <q-btn
              color="primary"
              outline
              flat
              label="Verwijderen"
              @click="openVerwijderUitslagDialog(keyAsString(key))"
            />
          </div>
          <q-markup-table class="sa-uitslagen-table">
            <thead>
              <tr>
                <th class="text-left" style="max-width: 150px">Activiteit</th>
                <th class="text-right">Tent</th>
                <th class="text-right">Tentchef</th>
                <th class="text-right">Snelheid</th>
                <th class="text-right">Datum</th>
                <th class="text-right">Behaalde punten</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(uitslag, index) in value"
                :key="`uitslag-${uitslag.id}`"
              >
                <td class="text-left" style="max-width: 100px">
                  {{ uitslag.activiteit }}
                </td>
                <td class="text-right">{{ uitslag.tentnr }}</td>
                <td class="text-right">{{ uitslag.tentchef }}</td>
                <td class="text-right">{{ uitslag.snelheid }}</td>
                <td class="text-right">{{ uitslag.datum }}</td>
                <td class="text-right">
                  <template v-if="index == 0">
                    <b class="sa-highest-score">{{ uitslag.punten }}</b>
                  </template>
                  <template v-else>
                    {{ uitslag.punten }}
                  </template>
                </td>
              </tr>
            </tbody>
          </q-markup-table>
        </template>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import axios from 'axios';
import { onMounted, ref, Ref } from 'vue';
import { useQuasar } from 'quasar';
import { API_URL } from '../constants';

enum UpdateOperator {
  Subtract,
  Add,
}

const $q = useQuasar();
const uitslagen = ref();
const uitslagenGrouped = ref();
const activiteiten = ref();
const uitslagOmTeVerwijderen = ref();
const tenten = ref();

const activiteitenOptions: Ref<string[]> = ref([]);
const tentenOptions: Ref<number[]> = ref([]);
const showAddUitslagDialog = ref(false);
const showVerwijderUitslagDialog = ref(false);

const getCurrDate = () => {
  let today = new Date();
  let date = today.toJSON().slice(0, 10);
  let nDate =
    date.slice(8, 10) + '-' + date.slice(5, 7) + '-' + date.slice(0, 4);

  return nDate;
};

const addUitslagForm = {
  activiteit: ref(''),
  datum: ref(getCurrDate()),
  uitslag_tent_1: {
    snelheid: ref('n.v.t.'),
    punten: ref(0),
  },
  uitslag_tent_2: {
    snelheid: ref('n.v.t.'),
    punten: ref(0),
  },
  uitslag_tent_3: {
    snelheid: ref('n.v.t.'),
    punten: ref(0),
  },
  uitslag_tent_4: {
    snelheid: ref('n.v.t.'),
    punten: ref(0),
  },
};

const keyAsString = (key: unknown) => {
  return key as string;
};

const openVerwijderUitslagDialog = (activiteit: string) => {
  uitslagOmTeVerwijderen.value = activiteit;
  showVerwijderUitslagDialog.value = true;
};

const closeVerwijderUitslagDialog = () => {
  uitslagOmTeVerwijderen.value = '';
  showVerwijderUitslagDialog.value = false;
};

const removeUitslag = async (activiteitNaam: string) => {
  let failed = false;

  uitslagen.value.forEach(async (uitslag: any) => {
    if (uitslag.activiteit == activiteitNaam) {
      await axios
        .delete(`${API_URL}/uitslagen/${uitslag.tentnr}/${uitslag.activiteit}`)
        .then(async (_) => {
          await updateScore(
            uitslag.tentnr,
            uitslag.punten,
            UpdateOperator.Subtract
          );
        })
        .catch((err) => {
          $q.notify({ message: err, type: 'negative' });
          failed = true;
        });
    }
  });

  if (!failed) {
    $q.notify({ message: 'Uitslag verwijderd!', type: 'positive' });
    showVerwijderUitslagDialog.value = false;

    setTimeout(async () => {
      await refetchUitslagen();
    }, 200);
  }
};

const addUitslag = async () => {
  let failed = false;

  tenten.value.forEach(async (tent: any) => {
    let snelheid = '';
    if (tent.tentnr == 1) {
      snelheid = addUitslagForm.uitslag_tent_1.snelheid.value;
    } else if (tent.tentnr == 2) {
      snelheid = addUitslagForm.uitslag_tent_2.snelheid.value;
    } else if (tent.tentnr == 3) {
      snelheid = addUitslagForm.uitslag_tent_3.snelheid.value;
    } else if (tent.tentnr == 4) {
      snelheid = addUitslagForm.uitslag_tent_4.snelheid.value;
    }

    let punten = 0;
    if (tent.tentnr == 1) {
      punten = addUitslagForm.uitslag_tent_1.punten.value;
    } else if (tent.tentnr == 2) {
      punten = addUitslagForm.uitslag_tent_2.punten.value;
    } else if (tent.tentnr == 3) {
      punten = addUitslagForm.uitslag_tent_3.punten.value;
    } else if (tent.tentnr == 4) {
      punten = addUitslagForm.uitslag_tent_4.punten.value;
    }

    const uitslag = {
      activiteit: addUitslagForm.activiteit.value,
      tentnr: tent.tentnr,
      tentchef: tent.tentchef,
      snelheid,
      datum: addUitslagForm.datum.value,
      punten,
    };

    await axios
      .post(`${API_URL}/uitslagen/`, uitslag)
      .then(async (_) => {
        await updateScore(tent.tentnr, punten);
      })
      .catch((err) => {
        $q.notify({ message: err, type: 'negative' });
        failed = true;
      });
  });

  if (!failed) $q.notify({ message: 'Uitslag toegevoegd!', type: 'positive' });
  showAddUitslagDialog.value = false;

  setTimeout(async () => {
    await refetchUitslagen();
  }, 200);
};

const fetchUitslagen = async () => {
  axios
    .get(`${API_URL}/uitslagen/`)
    .then((response) => (uitslagen.value = response.data['uitslagen']))
    .catch((err) => $q.notify({ message: err.message, type: 'negative' }));
};

const groupUitslagenByActiviteit = () => {
  setTimeout(() => {
    let grouped: any = {};

    uitslagen.value.forEach((uitslag: any) => {
      activiteitenOptions.value.forEach((activiteit: string) => {
        if (activiteit == uitslag.activiteit) {
          if (!grouped[activiteit]) {
            grouped[activiteit] = [];
          }
          grouped[activiteit].push(uitslag);
        }
      });

      if (grouped[uitslag.activiteit]) {
        grouped[uitslag.activiteit]
          .sort((a: any, b: any) => a.punten - b.punten)
          .reverse();
      }
    });

    uitslagenGrouped.value = grouped;
  }, 200);
};

const refetchUitslagen = async () => {
  axios
    .get(`${API_URL}/uitslagen/`)
    .then((response) => (uitslagen.value = response.data['uitslagen']))
    .catch((err) => $q.notify({ message: err.message, type: 'negative' }));

  groupUitslagenByActiviteit();
};

const fetchActiviteiten = async () => {
  axios
    .get(`${API_URL}/activiteiten/`)
    .then((response) => (activiteiten.value = response.data['activiteiten']))
    .catch((err) => $q.notify({ message: err.message, type: 'negative' }));
};

const fetchTenten = async () => {
  axios
    .get(`${API_URL}/tenten/`)
    .then((response) => (tenten.value = response.data['tenten']))
    .catch((err) => $q.notify({ message: err.message, type: 'negative' }));
};

const updateScore = async (
  tentnr: number,
  punten: number,
  operator: UpdateOperator = UpdateOperator.Add
) => {
  await axios
    .get(`${API_URL}/scores/${tentnr}`)
    .then(async (response) => {
      let score = response.data['scores'];
      let newScore = 0;

      if (operator == UpdateOperator.Add) {
        newScore = +score.score + +punten;
      } else if (operator == UpdateOperator.Subtract) {
        newScore = +score.score - +punten;
      }

      await axios
        .put(`${API_URL}/scores/${tentnr}?score=${newScore}`)
        .catch((err) => $q.notify({ message: err.message, type: 'negative' }));
    })
    .catch((err) => $q.notify({ message: err.message, type: 'negative' }));
};

onMounted(async () => {
  await fetchUitslagen();
  await fetchActiviteiten();
  await fetchTenten();

  // Needs to be debounced to prevent race conditions
  setTimeout(() => {
    if (activiteiten.value) {
      activiteiten.value.forEach((activiteit: any) => {
        activiteitenOptions.value.push(activiteit.naam);
      });
    }

    if (tenten.value) {
      tenten.value.forEach((tent: any) => {
        tentenOptions.value.push(tent.tentnr);
      });
    }
  }, 200);

  groupUitslagenByActiviteit();
});
</script>
