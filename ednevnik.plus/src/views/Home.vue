<template>
  <div id="content">
    <div id="main">
      <div id="downloads">
        <div class="card">
          <img src="~@/assets/img/download-icon.png" />
          <span class="ed">e-Dnevnik</span><span class="plus">Plus</span> za
          učenike i roditelje
        </div>
        <div class="card">
          <img src="~@/assets/img/download-icon.png" />
          <span class="ed">e-Dnevnik</span><span class="plus">Plus</span> za
          nastavnike
        </div>
      </div>
      <div id="browsers" class="card">
        <div class="title">Kompatibilni preglednici:</div>
        <div id="browser-icons">
          <div class="flex-center">
            <img src="~@/assets/img/chrome-icon.png" />
            Chrome
          </div>
          <div class="flex-center">
            <img src="~@/assets/img/edge-icon.png" />
            Edge
          </div>
        </div>
      </div>
    </div>
    <img id="browser" src="~@/assets/img/browser.png" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Home",
});
</script>

<style lang="scss" scoped>
#content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}

#main {
  display: flex;
  flex-wrap: wrap;

  img {
    margin-right: 10px;
  }
}

#downloads {
  margin-right: 40px;

  .card {
    display: flex;
    align-items: center;
    cursor: pointer;

    span {
      margin-right: 5px;
    }
  }
}

#browsers {
  display: flex;
  justify-content: center;
  flex-direction: column;
}

#browser-icons {
  display: flex;

  div {
    margin: 10px 20px 0 0;
  }
}

.title {
  padding-bottom: 10px;
}

.card {
  padding: 10px 20px;
  margin: 10px 0;
}

#browser {
  align-self: flex-end;
  margin-top: auto;
  margin-right: calc(50% - 395px);
  border: 1px solid #777777;
  box-shadow: 0 0 25px 20px #ccc;
}

@media only screen and (max-width: 768px) {
  #downloads {
    margin: 0 !important;
  }

  #downloads,
  #browsers {
    width: 100%;
  }
}
</style>
