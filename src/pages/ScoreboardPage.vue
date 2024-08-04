<template>
  <div>
    <div class="text-center sa-scoreboard-title">
      <h3>K&G Kamp Scorebord</h3>
    </div>
    <div v-if="tenten && scores" class="text-center sa-scoreboard q-pa-md">
      <div class="row">
        <div class="col-2"></div>
        <div class="col">
          <q-markup-table flat bordered>
            <thead>
              <tr class="bg-primary text-white">
                <th class="text-left">Tentnummer</th>
                <th class="text-left">Tentchef</th>
                <th class="text-left">Kampers</th>
                <th class="text-left">Score</th>
                <th class="text-left">Ranking</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(score, index) in scores"
                :key="`score-${score.tentnr}`"
              >
                <td class="text-left">{{ score.tentnr }}</td>
                <td class="text-left">{{ fetchTentchef(score.tentnr) }}</td>
                <td class="text-left">{{ fetchKampers(score.tentnr) }}</td>
                <td class="text-left">{{ score.score }}</td>
                <td class="text-left">#{{ index + 1 }}</td>
              </tr>
            </tbody>
          </q-markup-table>
        </div>
        <div class="col-2"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import axios from 'axios';
import { onMounted, ref } from 'vue';
import { useQuasar } from 'quasar';
import { API_URL } from '../constants';

const $q = useQuasar();
const tenten = ref();
const scores = ref();

const fetchTentchef = (tentnr: number) => {
  let tempTentchef = '';
  tenten.value.forEach((tent: any) => {
    if (tent.tentnr == tentnr) {
      tempTentchef = tent.tentchef;
    }
  });

  return tempTentchef;
};

const fetchKampers = (tentnr: number) => {
  let tempKampers = '';
  tenten.value.forEach((tent: any) => {
    if (tent.tentnr == tentnr) {
      tempKampers = tent.kampers;
    }
  });

  return tempKampers;
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

onMounted(async () => {
  await fetchScores();
  await fetchTenten();

  setInterval(async () => {
    await fetchScores();
    await fetchTenten();
  }, 100000);
});
</script>
