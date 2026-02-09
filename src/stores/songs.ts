import { defineStore } from "pinia";

export type SwipeDecision = "like" | "dislike";

export interface SongEntry {
  id: string;
  song: string;
  artist: string;
  this_week: number;
  last_week: number;
  peak_position: number;
  weeks_on_chart: number;
}

interface HistoryItem {
  songId: string;
  decision: SwipeDecision;
}

export const useSongsStore = defineStore("songs", {
  state: () => ({
    chartDate: "" as string,
    songs: [] as SongEntry[],
    currentIndex: 0,
    liked: [] as SongEntry[],
    disliked: [] as SongEntry[],
    history: [] as HistoryItem[],
    isLoading: false,
    error: "" as string,
  }),

  getters: {
    currentSong(state): SongEntry | null {
      return state.songs[state.currentIndex] ?? null;
    },
    done(state): boolean {
      return state.currentIndex >= state.songs.length;
    },
    likedCount(state): number {
      return state.liked.length;
    },
    dislikedCount(state): number {
      return state.disliked.length;
    },
  },

  actions: {
    async loadRecent() {
      this.isLoading = true;
      this.error = "";
      try {
        const res = await fetch(
          "https://raw.githubusercontent.com/mhollingshead/billboard-hot-100/main/recent.json",
        );
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const json = await res.json();
        this.chartDate = json.date;
        this.songs = (json.data as any[]).map((x) => {
          const lastWeek =
            x.last_week === "-" || x.last_week == null
              ? null
              : Number(x.last_week);

          const id = `${json.date}|${x.this_week}|${x.song}|${x.artist}`;

          return {
            id,
            song: x.song,
            artist: x.artist,
            this_week: Number(x.this_week),
            last_week: lastWeek,
            peak_position: Number(x.peak_position),
            weeks_on_chart: Number(x.weeks_on_chart),
          } as SongEntry;
        });
        this.currentIndex = 0;
        this.liked = [];
        this.disliked = [];
        this.history = [];
      } catch (e: any) {
        this.error = e?.message ?? "Failed to load chart";
      } finally {
        this.isLoading = false;
      }
    },

    decide(decision: SwipeDecision) {
      const song = this.currentSong;
      if (!song) return;

      if (decision === "like") this.liked.push(song);
      else this.disliked.push(song);

      this.history.push({ songId: song.id, decision });
      this.currentIndex++;
    },

    rewind() {
      const last = this.history.pop();
      if (!last) return;

      this.currentIndex = Math.max(0, this.currentIndex - 1);

      const removeLastById = (arr: SongEntry[], id: string) => {
        const i = arr.map((s) => s.id).lastIndexOf(id);
        if (i >= 0) arr.splice(i, 1);
      };

      if (last.decision === "like") removeLastById(this.liked, last.songId);
      else removeLastById(this.disliked, last.songId);
    },
  },
});
