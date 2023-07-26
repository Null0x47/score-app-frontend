<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar class="bg-secondary">
        <q-avatar square size="48px" @click="router.push('/')">
          <img src="../assets/img/KG_logo.png">
        </q-avatar>
        <q-toolbar-title class="sa-toolbar-title text-primary">
          KAMP SCORE APP
        </q-toolbar-title>
        <q-btn flat color="primary" @click="drawerRight = !drawerRight" round dense icon="menu" />
      </q-toolbar>
    </q-header>

  <q-drawer
      side="right"
      bordered
      overlay
      v-model="drawerRight"
      class="bg-primary"
      :width="300"
      :breakpoint="500"
    >
      <q-item clickable @click="router.push('/')">
        <q-item-section>
          <q-icon name="home" color="secondary" size="48px"/>
        </q-item-section>
        <q-item-section class="text-secondary text-bold sa-menu-item">Home</q-item-section>
      </q-item>
      <q-item clickable @click="router.push('/uitslagen')">
        <q-item-section>
          <q-icon name="scoreboard" color="secondary" size="48px"/>
        </q-item-section>
        <q-item-section class="text-secondary text-bold sa-menu-item">Uitslagen</q-item-section>
      </q-item>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router'

const router = useRouter()
const drawerRight = ref(false);
</script>
