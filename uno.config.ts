import { defineConfig, presetUno, presetTypography } from "unocss";
import presetDaisy from "unocss-preset-daisyui";

export default defineConfig({
  presets: [
    presetUno(),
    presetTypography(),
    presetDaisy({
      styled: true,
      themes: ["cupcake"],
    }),
  ],
});
