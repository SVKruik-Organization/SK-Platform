<script lang="ts">
import type { RouteLocation } from "vue-router";
import "~/assets/css/base.css";
import "~/assets/css/docpage.css";
import "~/assets/css/interaction.css";

export default defineComponent({
  name: "app",
  watch: {
    useRouter(to: RouteLocation, _from: RouteLocation) {
      let base: string = to.path.split("/")[1];
      if (base.length) {
        base = base.charAt(0).toUpperCase() + base.slice(1);
      } else base = "Home";
      document.title = `SK Platform | ${base}`;
    }
  }
});
</script>

<template>
  <NuxtPage />
</template>
