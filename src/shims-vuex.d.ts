import { Store } from "./store";
import { Emitter } from "mitt";
import { User, Settings } from "@/store/state";

declare module "@vue/runtime-core" {
  interface ComponentCustomProperties {
    $store: Store;
    $emitter: Emitter;
    $reactive: { userOffsetWidth: string };

    // TODO: fix global mixin types @GlobalMixin.ts
    user: User | undefined;
    updateUserSettings: <T extends keyof Settings>(
      settingsKey: T,
      settingsValue: Settings[T],
    ) => void;
  }
}
