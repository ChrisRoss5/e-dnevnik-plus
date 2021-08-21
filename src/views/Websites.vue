<template>
  <div id="websites">
    <div
      v-if="activeFrames.length > 1"
      id="urls"
      class="flex-center card"
      @click.self="showDropdown = !showDropdown"
    >
      <span class="material-icons"> link </span>
      <Dropdown
        :visible="showDropdown"
        :list="dropdown"
        sourceElementId="urls"
        @close="dropdownClosed"
      ></Dropdown>
    </div>
    <div id="iframe">
      <iframe
        :src="activeFrame.url"
        @load="iframeLoaded"
        @error="iframeError"
        ref="iframe"
      ></iframe>
      <Spinner :visible="showSpinner"></Spinner>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Dropdown, { DropdownItem } from "@/components/Dropdown.vue";
import Spinner from "@/components/Spinner.vue";

interface Website {
  name: string;
  url: string;
  tooltip?: string;
}

export default defineComponent({
  name: "Website",
  components: {
    Dropdown,
    Spinner,
  },
  data() {
    return {
      showSpinner: false,
      showDropdown: false,
      frames: {
        "školska-stranica": [
          {
            name: "Školska stranica",
            url: "http://www.ss-elektrotehnicka-zg.skole.hr/",
          },
        ],
        "školski-e-rudnik": [
          {
            name: "ŠeR - Školski e-Rudnik (Vol. 2)",
            url: "https://app.powerbi.com/view?r=eyJrIjoiM2Q1NjVmZDEtMGUyMy00MDBiLTkzYWItYjBhMTA3MDFlOWUxIiwidCI6IjJjMTFjYmNjLWI3NjEtNDVkYi1hOWY1LTRhYzc3ZTk0ZTFkNCIsImMiOjh9",
            tooltip:
              "Prikazuje statističke podatke o općem uspjehu učenika, njihovim ocjenama,<br> " +
              "opravdanim i neopravdanim izostancima, pedagoškim mjerama<br> " +
              "te trendove po školskim godinama.",
          },
          {
            name: "ŠeR - Školski e-Rudnik",
            url: "https://app.powerbi.com/view?r=eyJrIjoiZWE3YTE4OWQtOWJmNC00OTJmLWE2MjktYTQ5MWJlNDNlZDQ0IiwidCI6IjJjMTFjYmNjLWI3NjEtNDVkYi1hOWY1LTRhYzc3ZTk0ZTFkNCIsImMiOjh9",
            tooltip:
              "Prikazuje adresar školskih ustanova, geografsku distribuciju škola i učenika,<br> " +
              "razne statističke podatke o školama, učenicima i o obrazovnim programima<br> " +
              "te demografske trendove po školskim godinama.",
          },

          {
            name: "ŠeR - Školski e-Rudnik (Vol. 3)",
            url: "https://app.powerbi.com/view?r=eyJrIjoiOTUxNTE3YmQtM2E3MC00MDc0LTg3OTQtYTExZWZhYzU3Y2FlIiwidCI6IjJjMTFjYmNjLWI3NjEtNDVkYi1hOWY1LTRhYzc3ZTk0ZTFkNCIsImMiOjh9",
            tooltip:
              "Prikazuje rezultate učenika na državnoj maturi, njihove ocjene u završnim<br> " +
              "razredima osnovnih i srednjih škola, trendove po školskim godinama<br> " +
              "te upise na visoka učilišta.",
          },
        ],
        loomen: [{ name: "Loomen", url: "https://loomen.carnet.hr/" }],
        "srednja.hr": [{ name: "Srednja.hr", url: "https://www.srednja.hr/" }],
      } as Record<string, Website[]>,
      activeFrames: [] as Website[],
      activeFrame: {} as Website,
    };
  },
  beforeMount() {
    this.$emitter.emit("show-user-card", true);
    this.changeFrame();
  },
  methods: {
    changeFrame() {
      const site = this.$route.params.website as string;
      if (!site) return;
      this.activeFrames = this.frames[site];
      this.activeFrame = this.frames[site][0];
      this.showFrame(false);
    },
    iframeLoaded() {
      this.showFrame(true);
    },
    iframeError() {
      this.showFrame(false);
    },
    showFrame(show: boolean) {
      this.showSpinner = !show;
      const frame = this.$refs.iframe as HTMLElement;
      if (frame) frame.className = show ? "visible" : "";
    },
    dropdownClosed(rowName?: string) {
      this.showDropdown = false;
      if (!rowName) return;
      this.activeFrame = this.activeFrames.find(
        (f) => f.name == rowName,
      ) as Website;
    },
  },
  computed: {
    dropdown(): DropdownItem[] {
      return this.activeFrames.map((frame) => ({
        name: frame.name,
        tooltip: frame.tooltip,
        active: frame.url == this.activeFrame.url,
      }));
    },
  },
  watch: {
    $route() {
      this.changeFrame();
    },
  },
});
</script>

<style lang="scss" scoped>
#websites,
#iframe,
iframe {
  width: 100%;
  height: 100%;
}

iframe {
  opacity: 0;
  transition: opacity $views-transition;

  &.visible {
    opacity: 1;
  }
}

#urls {
  position: absolute;
  top: 20px;
  left: 20px;
  width: 44px;
  height: 44px;
  border-radius: 8px;
  cursor: pointer;

  & > span {
    pointer-events: none;
  }

  @include themed() {
    background: t("white-background");
  }
}
</style>
