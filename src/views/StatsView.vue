<script setup lang="ts">
import { useRouter } from "vue-router";
import { useSongsStore } from "../stores/songs";

const router = useRouter();
const store = useSongsStore();
</script>

<template>
  <div class="page">
    <div class="topbar">
      <button class="back" @click="router.push('/')">← Back</button>
      <div class="title">Your Stats</div>
      <div class="spacer" />
    </div>

    <div class="summary">
      <div class="pill like">
        Liked: <strong>{{ store.likedCount }}</strong>
      </div>
      <div class="pill dislike">
        Disliked: <strong>{{ store.dislikedCount }}</strong>
      </div>
    </div>

    <div class="cols">
      <section class="col red">
        <div class="colTitle">DISLIKED</div>
        <div class="list">
          <div v-for="s in store.disliked" :key="s.id" class="item">
            <div class="row">
              <div class="rank">#{{ s.this_week }}</div>
              <div class="main">
                <div class="song">{{ s.song }}</div>
                <div class="artist">{{ s.artist }}</div>
              </div>
            </div>

            <div class="chips">
              <div class="chip">LW: {{ s.last_week ?? "—" }}</div>
              <div class="chip">PEAK: {{ s.peak_position }}</div>
              <div class="chip">WEEKS: {{ s.weeks_on_chart }}</div>
            </div>
          </div>
        </div>
      </section>

      <section class="col green">
        <div class="colTitle">LIKED</div>
        <div class="list">
          <div v-for="s in store.liked" :key="s.id" class="item">
            <div class="row">
              <div class="rank">#{{ s.this_week }}</div>
              <div class="main">
                <div class="song">{{ s.song }}</div>
                <div class="artist">{{ s.artist }}</div>
              </div>
            </div>

            <div class="chips">
              <div class="chip">LW: {{ s.last_week ?? "—" }}</div>
              <div class="chip">PEAK: {{ s.peak_position }}</div>
              <div class="chip">WEEKS: {{ s.weeks_on_chart }}</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.page {
  min-height: 100vh;
  padding: 18px;
  background:
    radial-gradient(
      1200px 700px at 50% -20%,
      rgba(120, 60, 255, 0.16),
      transparent 60%
    ),
    #050507;
  color: rgba(255, 255, 255, 0.92);
}

.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}

.title {
  font-weight: 900;
  letter-spacing: 0.02em;
}

.spacer {
  width: 72px;
}

.back {
  cursor: pointer;
  padding: 10px 12px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: rgba(255, 255, 255, 0.92);
  font-weight: 800;
}

.back:hover {
  background: rgba(255, 255, 255, 0.1);
}

.summary {
  display: flex;
  gap: 10px;
  margin: 10px 0 16px;
}

.pill {
  padding: 10px 12px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.06);
  font-weight: 800;
}

.pill.like {
  border-color: rgba(0, 255, 120, 0.25);
  background: rgba(0, 255, 120, 0.1);
}

.pill.dislike {
  border-color: rgba(255, 64, 140, 0.25);
  background: rgba(255, 64, 140, 0.1);
}

.cols {
  display: grid;
  grid-template-columns: 1fr;
  gap: 14px;
}

@media (min-width: 900px) {
  .cols {
    grid-template-columns: 1fr 1fr;
  }
}

.col {
  border-radius: 18px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.04);
  overflow: hidden;
}

.colTitle {
  padding: 12px 14px;
  font-weight: 900;
  letter-spacing: 0.1em;
  font-size: 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.col.red .colTitle {
  background: rgba(255, 64, 140, 0.12);
  border-bottom-color: rgba(255, 64, 140, 0.2);
}

.col.green .colTitle {
  background: rgba(0, 255, 120, 0.12);
  border-bottom-color: rgba(0, 255, 120, 0.2);
}

.list {
  max-height: 70vh;
  overflow: auto;
  padding: 12px;
}

.item {
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(0, 0, 0, 0.25);
  padding: 12px;
  margin-bottom: 10px;
}

.row {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

.rank {
  opacity: 0.75;
  font-weight: 900;
  width: 46px;
}

.song {
  font-weight: 900;
  line-height: 1.15;
}

.artist {
  opacity: 0.8;
  margin-top: 4px;
  font-size: 13px;
}

.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 10px;
}

.chip {
  font-size: 12px;
  padding: 7px 10px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.07);
  border: 1px solid rgba(255, 255, 255, 0.1);
}
</style>
