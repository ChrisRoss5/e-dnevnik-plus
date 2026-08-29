import type { Router, RouteLocationNormalizedLoaded } from "vue-router";

declare module "@vue/runtime-core" {
  interface ComponentCustomProperties {
    $router: Router;
    $route: RouteLocationNormalizedLoaded;
  }
}

export {};
