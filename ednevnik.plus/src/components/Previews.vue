<template>
  <div id="previews">
    <div id="tour" class="flex-center">
      <div class="ed">
        e-Dnevnik <span class="plus">Plus App</span> — Obilazak
      </div>
      <div id="types">
        <a
          class="card"
          @click="mode = 'light'"
          :class="{ plus: mode == 'light' }"
          >Svijetli prikaz</a
        >
        <a class="card" @click="mode = 'dark'" :class="{ plus: mode == 'dark' }"
          >Tamni prikaz</a
        >
        <a
          class="card"
          @click="mode = 'double'"
          :class="{ plus: mode == 'double' }"
          >Dupli prikaz</a
        >
        <a class="card" @click="changeSpeed" :class="{ plus: fast }"
          >Brzina {{ fast ? "x2" : "x1" }}</a
        >
      </div>
    </div>
    <div id="videos" class="flex-center" :class="{ double: mode == 'double' }">
      <transition-group name="opacity">
        <video
          v-show="mode == 'light' || mode == 'double'"
          ref="light"
          src="~@/assets/mp4/light-tour.mp4"
          muted
          autoplay
          controls
          loop
          @timeupdate="timeUpdated"
          @play="timeUpdated"
          @pause="timeUpdated"
          key="1"
        ></video>
        <video
          v-show="mode == 'dark' || mode == 'double'"
          ref="dark"
          src="~@/assets/mp4/dark-tour.mp4"
          muted
          autoplay
          controls
          loop
          @timeupdate="timeUpdated"
          @play="timeUpdated"
          @pause="timeUpdated"
          key="2"
        ></video>
      </transition-group>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Previews",
  data() {
    return {
      mode: "light" as "light" | "dark" | "double",
      fast: false,
      lightVid: null as unknown as HTMLVideoElement,
      darkVid: null as unknown as HTMLVideoElement,
    };
  },
  mounted() {
    this.lightVid = this.$refs.light as HTMLVideoElement;
    this.darkVid = this.$refs.dark as HTMLVideoElement;
  },
  methods: {
    timeUpdated(e: Event) {
      const video = e.target as HTMLVideoElement;
      const video2 = video == this.lightVid ? this.darkVid : this.lightVid;
      if (e.type == "pause") {
        video2.pause();
      } else if (e.type == "play") {
        video2.play();
      } else {
        const diff = video.currentTime - video2.currentTime;
        if (e.type == "timeupdate" && Math.abs(diff) > 0.5) {
          video2.currentTime = video.currentTime;
        }
      }
    },
    changeSpeed() {
      this.fast = !this.fast;
      this.lightVid.playbackRate = this.darkVid.playbackRate = this.fast
        ? 2
        : 1;
    },
  },
});
</script>

<style lang="scss" scoped>
#previews {
  display: flex;
  flex-direction: column;
}

#tour {
  flex-direction: column;
  text-align: center;
  font-size: 1.3rem;
  padding-top: 60px;
}

#types {
  display: flex;
  padding-top: 20px;
  gap: 20px;

  a {
    background: white;
    padding: 10px 20px;
    cursor: pointer;
  }
}

#videos {
  flex: 1;
  position: relative;

  &.double video {
    width: 50%;
    transform: translateY(-50%);
    &:first-child {
      left: 0;
    }
  }
}

video {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  max-height: 70vh;
  outline: none;
}

@media only screen and (max-width: 768px) {
  #tour {
    padding-top: 20px;
  }

  #types {
    width: 100%;
    gap: 0;
  }

  video {
    width: 100% !important;
  }

  #videos {
    flex-direction: column;
    &.double video {
      transform: none !important;
      position: static !important;
    }
  }
}
</style>