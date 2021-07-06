<template>
  <div class="home">
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Home',
  mounted() {
    console.log("SENDING MSG");
    /* chrome.runtime.sendMessage({greeting: "hello"}, function(response: string) {
      console.log(response);
    }); */
  },
  components: {
  },
});
</script>
