/// <reference types="node" />
import { defineConfig } from "vite";

export default defineConfig(({ command }) => ({
    base: command === "build" && !process.env.CF_PAGES ? "/ie-design-website/" : "/",
}));
