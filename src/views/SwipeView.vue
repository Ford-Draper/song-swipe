<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useSongsStore } from "../stores/songs";
import Artwork from "../components/Artwork.vue";
import SwipeCard from "../components/SwipeCard.vue";

const store = useSongsStore();
const router = useRouter();

const cardRef = ref<InstanceType<typeof SwipeCard> | null>(null);

onMounted(() => {
  if (!store.songs.length && !store.isLoading) store.loadRecent();
});

async function onRewind() {
  if (!store.history.length) return;
  await cardRef.value?.spinBack();
  store.rewind();
}
</script>

<template>
  <div class="screen">
    <div class="topbar">
      <div>
        <div class="title">Hot 100</div>
        <div class="subtitle">Chart date: {{ store.chartDate || "—" }}</div>
      </div>

      <button class="stats-btn" @click="router.push('/stats')">Stats</button>
    </div>

    <div style="margin-top: 16px">
      <div v-if="store.isLoading">Loading…</div>
      <div v-else-if="store.error">Error: {{ store.error }}</div>
      <div v-else-if="store.done">You swiped all songs ✅</div>

      <div v-else>
        <SwipeCard
          ref="cardRef"
          :cardKey="store.currentSong!.id"
          @decision="(d) => store.decide(d)"
        >
          <div class="art">
            <Artwork
              :key="store.currentSong?.id"
              :id="store.currentSong!.id"
              :artworkUrl="(store.currentSong as any)?.artworkUrl"
            />
          </div>

          <div class="info">
            <div class="rank">#{{ store.currentSong?.this_week }}</div>
            <div class="song">{{ store.currentSong?.song }}</div>
            <div class="artist">{{ store.currentSong?.artist }}</div>

            <div class="chips">
              <div class="chip">
                LW: {{ store.currentSong?.last_week ?? "—" }}
              </div>
              <div class="chip">
                PEAK: {{ store.currentSong?.peak_position }}
              </div>
              <div class="chip">
                WEEKS: {{ store.currentSong?.weeks_on_chart }}
              </div>
            </div>
          </div>
        </SwipeCard>

        <div class="actions">
          <button class="btn dislike" @click="cardRef?.trigger('dislike')">
            ✕
          </button>
          <button class="btn rewind" @click="onRewind">⟲</button>
          <button class="btn like" @click="cardRef?.trigger('like')">❤</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.screen {
  min-height: 100vh;
  background:
    radial-gradient(
      1200px 700px at 50% -20%,
      rgba(120, 60, 255, 0.18),
      transparent 60%
    ),
    #050507;
  color: rgba(255, 255, 255, 0.92);
  padding: 18px;
}

.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}

.title {
  font-size: 18px;
  font-weight: 800;
  letter-spacing: 0.02em;
}
.subtitle {
  font-size: 12px;
  opacity: 0.7;
  margin-top: 2px;
}

.stats-btn {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: rgba(255, 255, 255, 0.9);
  padding: 10px 12px;
  border-radius: 12px;
  font-weight: 700;
}

.art {
  padding: 14px;
}

.info {
  padding: 14px 16px 16px;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.55));
  border-top: 1px solid rgba(255, 255, 255, 0.06);
}

.rank {
  font-size: 12px;
  opacity: 0.7;
}
.song {
  font-size: 20px;
  font-weight: 900;
  margin-top: 6px;
  line-height: 1.15;
}
.artist {
  font-size: 14px;
  opacity: 0.82;
  margin-top: 6px;
}

.chips {
  display: flex;
  gap: 10px;
  margin-top: 14px;
  flex-wrap: wrap;
}

.chip {
  font-size: 12px;
  padding: 8px 10px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.1);
  opacity: 0.95;
}

.actions {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 18px;
  padding-bottom: 10px;
}

.btn {
  width: 56px;
  height: 56px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.06);
  color: rgba(255, 255, 255, 0.9);
  font-size: 18px;
  font-weight: 900;
  cursor: pointer;
}

.btn.like {
  background: rgba(0, 255, 120, 0.14);
  border-color: rgba(0, 255, 120, 0.35);
}

.btn.dislike {
  background: rgba(255, 64, 140, 0.14);
  border-color: rgba(255, 64, 140, 0.35);
}

.btn.rewind {
  background: rgba(140, 140, 255, 0.12);
  border-color: rgba(140, 140, 255, 0.3);
}
</style>
