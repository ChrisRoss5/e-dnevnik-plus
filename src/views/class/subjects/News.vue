<template>
  <transition name="opacity">
    <div v-if="news.length" id="news-container" class="toolbar-options">
      <div
        id="news"
        class="hovered-text-button flex-center"
        @click="newsDropdownVisible = true"
        v-wave
      >
        Novi zapisi: {{ news.reduce((a, b) => a + b.subjectNews.length, 0) }}
        <div class="material-icons">arrow_drop_down</div>
        <Dropdown
          :visible="newsDropdownVisible"
          sourceElementId="news"
          @close="newsDropdownVisible = false"
        >
          <div id="news-list">
            <div
              class="subject"
              v-for="({ subjectName, subjectNews }, i) in news"
              :key="i"
            >
              <div class="subject-name">{{ subjectName }}</div>
              <div
                class="subject-news"
                v-for="({ note, grade }, j) in subjectNews"
                :key="j"
              >
                <div>{{ note }}</div>
                <div>{{ grade }}</div>
              </div>
            </div>
          </div>
        </Dropdown>
      </div>
      <div
        id="clear-news"
        class="material-icons flex-center"
        @click="clearNews"
        v-tooltip.top="'Ukloni novosti'"
        v-wave
      >
        done_all
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import Dropdown from "@/components/Dropdown.vue";
import { MutationTypes } from "@/store/mutations";
import { ClassNews } from "@/store/state";
import { defineComponent } from "vue";

export default defineComponent({
  name: "News",
  components: {
    Dropdown,
  },
  data() {
    return {
      newsDropdownVisible: false,
    };
  },
  methods: {
    clearNews() {
      if (!this.user) return;
      this.$store.commit(MutationTypes.UPDATE_CLASS_NEWS, {
        user: this.user,
        classNews: [],
      });
    },
  },
  computed: {
    news(): ClassNews[] {
      return this.user ? this.user.classNews : [];
    },
  },
});
</script>

<style lang="scss" scoped>
#news-container {
  display: flex;
  height: 100%;
}

#news {
  position: relative;
  width: auto;
  height: 44px;
  margin-left: 30px;
}

#news-list {
  width: 30vw;
  max-height: 200px;
  font-size: 1rem;
  overflow: auto;

  @include themed() {
    color: t("body-color");
  }
}

.subject {
  padding: 0 20px;

  &:not(:first-child) {
    padding-top: 20px;
  }
}

.subject-name {
  text-align: center;
}

.subject-news {
  display: flex;
  padding: 5px 0;

  div:first-child {
    white-space: normal;
    padding-right: 15px;
  }

  div:last-child {
    margin-left: auto;
  }

  @include themed() {
    border-bottom: 1px solid t("light-border-color");
  }
}
</style>
