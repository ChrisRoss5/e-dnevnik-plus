import { Store } from "./store";
import { Emitter } from "mitt";
import { Settings } from "@/store/state";


declare module "@vue/runtime-core" {
  interface ComponentCustomProperties {
    $store: Store;
    $emitter: Emitter;
    $reactive: { userOffsetWidth: string };
    updateUserSettings: <T extends keyof Settings>(
      settingsKey: T,
      settingsValue: Settings[T],
    ) => void; // TODO: fix global mixin types @GlobalMixin.ts
  }
}
