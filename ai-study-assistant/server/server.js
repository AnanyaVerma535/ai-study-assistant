import app from "./src/app.js";
import { env } from "./src/config/env.js";

app.listen(env.PORT, () => {
  console.log(`AI Study Assistant server running on http://localhost:${env.PORT}`);
});
