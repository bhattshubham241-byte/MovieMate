/*----- FILE: vite.config.js | CONTENT: Vite configuration for the React client. | PURPOSE: Enables the React plugin and provides the development/build configuration for the frontend. -----*/

import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

/*----- VITE CONFIG: React plugin is required for JSX transformation. -----*/
export default defineConfig({
  plugins: [react()],
});
