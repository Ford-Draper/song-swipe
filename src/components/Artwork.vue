<script setup lang="ts">
import { computed } from "vue";
import { gradientFromId } from "../utils/gradient";

const props = defineProps<{
  id: string;
  artworkUrl?: string;
}>();

const bg = computed(() => gradientFromId(props.id));
</script>

<template>
  <div
    style="
      width: 100%;
      aspect-ratio: 1 / 1;
      border-radius: 16px;
      overflow: hidden;
      position: relative;
    "
  >
    <!-- real art -->
    <img
      v-if="artworkUrl"
      :src="artworkUrl"
      style="width: 100%; height: 100%; object-fit: cover"
    />

    <!-- fallback -->
    <div
      v-else
      :style="{
        background: bg,
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }"
    >
      <!-- double music note -->
      <div style="font-size: 64px; color: white">🎵</div>
    </div>
  </div>
</template>
