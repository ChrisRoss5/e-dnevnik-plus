<template>
  <div
    id="notes"
    class="abs-cover blur flex-center"
    @click.self="$emit('close')"
  >
    <div
      id="container"
      class="card"
      :style="{ transform: 'translateY(' + (scrollTop - 100) + 'px)' }"
    >
      <div id="title">{{ title }}</div>
      <div id="list">{{day}}</div>
      <div id="add-note">
        <input
          type="text"
          spellcheck="false"
          class="card"
          placeholder="Dodaj bilješku..."
        />
        <div class="button material-icons" v-wave>add</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { capitalize } from "@/scripts/utils";

export default defineComponent({
  name: "CalendarNotes",
  props: ["day"],
  emits: ["close"],
  mounted() {
    this.$emitter.on("main-scrolled", (scrollTop: number) => {
      this.scrollTop = scrollTop;
    });
  },
  data() {
    return {
      scrollTop: 0,
    };
  },
  computed: {
    title(): string {
      return capitalize(this.day.ariaLabel);
    },
  },
});
</script>

<style lang="scss" scoped>
#notes {
  z-index: 1;
}

#container {
  width: 50%;
  padding: 15px;

  @include themed() {
    background: t("alice-blue");
  }
}

#title {
  font-size: 24px;
  margin-bottom: 10px;
}

#add-note {
  display: flex;
  align-items: center;
}

input {
  margin: 0 15px 0 0;
}

.button {
  height: 24px;
}
</style>
