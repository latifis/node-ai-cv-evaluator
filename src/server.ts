import { ENV } from "./config/env";
import app from "./app";

app.listen(ENV.PORT, () => {
  console.log(`Server running on port ${ENV.PORT}`);
});
