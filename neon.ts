import { defineConfig } from "@neon/config/v1";

export default defineConfig({
  // The app only requires Lakebase Postgres (which is enabled by default for all projects)
  // No auth, data API, or object storage is used in the current app iteration.
});
