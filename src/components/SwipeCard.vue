<script setup lang="ts">
import { computed, ref, watch } from "vue";

type Decision = "like" | "dislike";

const props = defineProps<{
  cardKey: string;
}>();

const emit = defineEmits<{
  (e: "decision", d: Decision): void;
}>();

// Drag state
const dragging = ref(false);
const startX = ref(0);
const startY = ref(0);
const dx = ref(0);
const dy = ref(0);
const extraRot = ref(0);
const extraX = ref(0);

// Animation state
const isAnimatingOut = ref(false);

// Tuning
const SWIPE_X_THRESHOLD = 110;
const FLYOUT_X = 900;
const MAX_ROT_DEG = 12;

const likeIntensity = computed(() =>
  Math.min(1, Math.max(0, dx.value / SWIPE_X_THRESHOLD)),
);
const dislikeIntensity = computed(() =>
  Math.min(1, Math.max(0, -dx.value / SWIPE_X_THRESHOLD)),
);

const rotation = computed(() => {
  const ratio = Math.max(-1, Math.min(1, dx.value / 240));
  return ratio * MAX_ROT_DEG;
});

const transformStyle = computed(() => {
  const rot = rotation.value + extraRot.value;
  return `translate(${dx.value + extraX.value}px, ${dy.value}px) rotate(${rot}deg)`;
});

const transitionStyle = computed(() => {
  if (dragging.value) return "none";
  return "transform 220ms cubic-bezier(0.2, 0.9, 0.2, 1)";
});

function onPointerDown(e: PointerEvent) {
  if (isAnimatingOut.value) return;
  dragging.value = true;
  startX.value = e.clientX;
  startY.value = e.clientY;
  (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
}

function onPointerMove(e: PointerEvent) {
  if (!dragging.value || isAnimatingOut.value) return;
  dx.value = e.clientX - startX.value;
  dy.value = e.clientY - startY.value;
}

function resetPosition() {
  dx.value = 0;
  dy.value = 0;
}

function flyOut(decision: Decision) {
  isAnimatingOut.value = true;
  dragging.value = false;

  const dir = decision === "like" ? 1 : -1;
  dx.value = dir * FLYOUT_X;
  dy.value = dy.value * 0.35;

  window.setTimeout(() => {
    emit("decision", decision);
    isAnimatingOut.value = false;
    resetPosition();
  }, 220);
}

function onPointerUp() {
  if (isAnimatingOut.value) return;
  dragging.value = false;

  if (dx.value > SWIPE_X_THRESHOLD) return flyOut("like");
  if (dx.value < -SWIPE_X_THRESHOLD) return flyOut("dislike");

  resetPosition();
}

function trigger(decision: Decision) {
  if (isAnimatingOut.value) return;
  flyOut(decision);
}

defineExpose({ trigger, spinBack});

function spinBack(): Promise<void> {
  if (isAnimatingOut.value) return Promise.resolve();

  isAnimatingOut.value = true;
  dragging.value = false;

  extraX.value = -70;
  extraRot.value = -360;

  return new Promise((resolve) => {
    window.setTimeout(() => {
      extraX.value = 0;
      extraRot.value = 0;
      isAnimatingOut.value = false;
      resolve();
    }, 320);
  });
}

watch(
  () => props.cardKey,
  () => {
    isAnimatingOut.value = false;
    dragging.value = false;
    extraRot.value = 0;
    extraX.value = 0;
    resetPosition();
  },
);
</script>

<template>
  <div class="card-wrap">
    <div
      class="card"
      @pointerdown="onPointerDown"
      @pointermove="onPointerMove"
      @pointerup="onPointerUp"
      @pointercancel="onPointerUp"
      :style="{ transform: transformStyle, transition: transitionStyle }"
    >
      <div class="badge liked" :style="{ opacity: likeIntensity }">LIKED</div>
      <div class="badge disliked" :style="{ opacity: dislikeIntensity }">
        DISLIKED
      </div>

      <slot />
    </div>
  </div>
</template>

<style scoped>
.card-wrap {
  width: 100%;
  display: flex;
  justify-content: center;
  touch-action: none;
}

.card {
  width: min(420px, 92vw);
  border-radius: 22px;
  overflow: hidden;
  background: #0b0b0d;
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow:
    0 18px 55px rgba(0, 0, 0, 0.6),
    0 2px 10px rgba(0, 0, 0, 0.35);
  position: relative;
  user-select: none;
  cursor: grab;
}

.card:active {
  cursor: grabbing;
}

.badge {
  position: absolute;
  top: 14px;
  padding: 10px 14px;
  font-weight: 900;
  letter-spacing: 0.08em;
  font-size: 14px;
  border-radius: 10px;
  border: 2px solid rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(6px);
  z-index: 5;
}

.liked {
  left: 14px;
  background: rgba(0, 255, 120, 0.18);
  border-color: rgba(0, 255, 120, 0.55);
  color: rgba(190, 255, 220, 0.98);
}

.disliked {
  right: 14px;
  background: rgba(255, 64, 140, 0.18);
  border-color: rgba(255, 64, 140, 0.6);
  color: rgba(255, 210, 235, 0.98);
}
</style>
