import { Store } from "./store";
import { Emitter } from "mitt";

declare module "@vue/runtime-core" {
  interface ComponentCustomProperties {
    $store: Store;
    $emitter: Emitter;
  }
}
