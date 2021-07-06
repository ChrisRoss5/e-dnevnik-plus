<template>
  <div id="navbar">
    <div class="row first-row">
      <img id="carnet-logo" src="@/assets/img/carnet-logo-2.png" />
      <div class="title">e-Dnevnik</div>
    </div>
    <div class="row">
      <div class="title">
        Razred: <strong>{{ openedClass }}</strong>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Navbar",
  data() {
    return {
      openedClass: "4.C",
    };
  },
});
</script>

<style lang="scss" scoped>
#navbar {
  color: white;
  background-attachment: fixed;
  background-color: $main-color;
  background-image: url("~@/assets/img/nav-background.png");
  background-size: contain;
  display: flex;
  flex-direction: column;
  width: 20%;
  min-width: 320px;
}

#carnet-logo {
  height: 70px;
  /* animation: rotate 1s linear infinite; */
  transform-origin: 40% 50%;

  & + .title {
    font-size: 35px;
  }
}

.row {
  display: flex;
  align-items: center;
  padding: 20px 30px;

  img {
    margin-right: 25px;
  }

  title {
    font-size: 26px;
  }

  &.first-row {
    user-select: none;
    box-shadow: 0 -1px 0 #ffffff1a inset;
  }

  &:not(.first-row) {
    transition: background-color 150ms;

    &:hover {
      cursor: pointer;
      background-color: #ffffff14;
    }
  }
}

@keyframes rotate {
  to {
    transform: rotate(360deg);
  }
}
</style>