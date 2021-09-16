<template>
  <Dropdown
    :visible="visible"
    :sourceElementId="sourceElementId"
    @close="$emit('close')"
  >
    <input
      v-model="searchInput"
      type="text"
      spellcheck="false"
      class="card"
      placeholder="Pretraži..."
      @keyup.enter="
        $event.target.nextElementSibling &&
          $event.target.nextElementSibling.click()
      "
      ref="input"
    />
    <div
      v-for="(item, i) in filterList(searchInput, list)"
      :key="i"
      v-html="item.html"
      @click="$emit('close', item.text)"
      v-wave
    ></div>
  </Dropdown>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Dropdown from "@/components/Dropdown.vue";

export default defineComponent({
  name: "CustomDropdown",
  components: { Dropdown },
  props: ["visible", "sourceElementId", "list"],
  // emits: ["close"],
  data() {
    return {
      searchInput: "",
    };
  },
  methods: {
    filterList(input: string, list: string[]) {
      return list.flatMap((row) => {
        const html = [...row];
        let lastIndex = 0;
        for (const char1 of input) {
          let matchFound = false;
          for (let i = lastIndex; i < row.length; i++) {
            const char2 = row.charAt(i);
            if (char1.toLowerCase() != char2.toLowerCase()) continue;
            lastIndex = i + 1;
            html[i] = "<span style='color: #669df6'>" + char2 + "</span>";
            matchFound = true;
            break;
          }
          if (!matchFound) return [];
        }
        return [{ text: row, html: html.join("") }];
      });
    },
  },
  watch: {
    visible() {
      this.$nextTick(() => {
        const input = this.$refs.input as HTMLElement;
        if (input) input.focus();
        this.searchInput = "";
      });
    },
  },
});
</script>

<style lang="scss" scoped>
.dropdown {
  max-height: 400px;
  padding: 0;
  right: 0;
  overflow: auto;

  input {
    position: sticky;
    top: 0;
    font-size: 18px;
    padding: 10px 20px;
    margin: 0 0 5px 0;
    border-radius: 0;
  }

  & > div {
    padding: 5px 20px;
    text-align: left;
    transition: color 150ms;

    @include themed() {
      color: t("light-gray");

      &:first-of-type,
      &:hover {
        cursor: pointer;
        color: t("dark-blue") !important;
      }
    }
  }
}
</style>
