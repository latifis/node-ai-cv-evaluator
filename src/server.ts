import { ENV } from "./config/env";
import app from "./app";
import { startEvaluationWorker } from "./modules/evaluation/evaluation.worker";

app.listen(ENV.PORT, () => {
  console.log(`Server running on port ${ENV.PORT}`);
});

startEvaluationWorker();
