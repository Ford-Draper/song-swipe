import { createRouter, createWebHistory } from "vue-router";
import SwipeView from "../views/SwipeView.vue";
import StatsView from "../views/StatsView.vue";

export default createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", name: "swipe", component: SwipeView },
    { path: "/stats", name: "stats", component: StatsView },
  ],
});
