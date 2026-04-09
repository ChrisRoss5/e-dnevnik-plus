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
      <div id="list" v-if="day.attributes">
        <div
          class="item"
          v-for="(attr, i) in day.attributes.filter((attr) => attr.popover)"
          :key="i"
          :style="{ border: getBorder(attr) }"
        >
          <div class="text">
            {{ attr.popover.label }}
          </div>
          <div
            v-if="isCustomNote(attr)"
            class="button material-icons"
            @click="manageNote('remove', attr)"
            v-wave
          >
            remove
          </div>
        </div>
      </div>
      <div id="add-note">
        <input
          v-model="noteInputText"
          type="text"
          spellcheck="false"
          class="card"
          placeholder="Dodaj bilješku..."
          @keyup.enter="manageNote('add')"
        />
        <div class="button material-icons" @click="manageNote('add')" v-wave>
          add
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { capitalize } from "@/scripts/utils";
import { defineComponent } from "vue";

export default defineComponent({
  name: "CalendarNotes",
  props: ["day"],
  emits: ["close", "manageNote"],
  mounted() {
    this.$emitter.on("main-scrolled", this.moveScrollTop);
  },
  beforeUnmount() {
    this.$emitter.off("main-scrolled", this.moveScrollTop);
  },
  data() {
    return {
      scrollTop: document.querySelector("#main")!.scrollTop,
      noteInputText: "",
    };
  },
  methods: {
    moveScrollTop(scrollTop: number) {
      this.scrollTop = scrollTop;
    },
    getBorder(attr: any) {
      const originalBorder = this.isDarkTheme ? "#2f4053" : "#c3cfdd";
      const color = this.isCustomNote(attr) ? "#2296da" : originalBorder;
      return "1px solid " + color;
    },
    isCustomNote(attr: any) {
      return attr.dot && attr.dot.base.color == "blue";
    },
    manageNote(method: "add" | "remove", attr?: any) {
      const note = attr ? attr.popover.label : this.noteInputText;
      this.$emit("manageNote", { note, method });
    },
  },
  computed: {
    title(): string {
      return capitalize(this.day.ariaLabel);
    },
    isDarkTheme(): boolean {
      return this.$store.state.settings.darkTheme;
    },
  },
});
</script>

<style lang="scss" scoped>
#notes {
  z-index: 1;
}

#container {
  width: 40%;
  padding: 15px;

  @include themed() {
    background: t("alice-blue");
  }
}

#title {
  font-size: 24px;
  margin-bottom: 10px;
}

#list {
  margin: 15px 0 20px;
}

.item {
  margin: 5px 0;
}

.text {
  width: 100%;
  padding: 5px 10px;
  margin-right: 15px;
  overflow: hidden;
}

#add-note,
.item {
  display: flex;
  align-items: top;
  border-radius: 8px;
}

input {
  margin: 0 15px 0 0;
}

.button {
  height: 24px;
}
</style>
