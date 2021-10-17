<template>
  <div id="heading">
    <div id="title">
      <div id="ed" class="ed">e-Dnevnik</div>
      <div id="plus" class="plus">Plus</div>
    </div>
    <div id="subtitle">Proširenje za e-Dnevnik</div>
  </div>
  <router-view />
</template>

<style lang="scss" >
#app {
  min-height: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
}

#heading {
  text-align: center;
  margin: 40px 0 40px;
}

#title {
  font-size: 3.5rem;
  display: flex;
  justify-content: center;
}

#ed {
  transform: translateX(10px);
  opacity: 0;
  animation: show-ed 1s forwards;
}

#plus {
  transform: translateX(-5px);
  opacity: 0;
  animation: show-plus 600ms 400ms forwards;
}

@keyframes show-ed {
  to {
    transform: translateX(-5px);
    opacity: 1;
  }
}

@keyframes show-plus {
  to {
    transform: translateX(10px);
    opacity: 1;
  }
}

#subtitle {
  font-size: 1.3rem;
  letter-spacing: 3px;
  font-style: italic;
  color: $ed-color;
}
</style>
