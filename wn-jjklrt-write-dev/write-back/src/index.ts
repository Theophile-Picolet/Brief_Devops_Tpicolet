import type {
  ErrorRequestHandler,
  NextFunction,
  Request,
  Response,
} from "express";
import express from "express";
import router from "./routes/router";

const app = express();

app.use(express.json());

// CORS for local
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") {
    res.sendStatus(204);
    return;
  }
  next();
});

/* ************************************************************************* */
const logErrors: ErrorRequestHandler = (err, req, _res, next) => {
  console.error(err);
  console.error("on req:", req.method, req.path);
  next(err);
};

app.use(logErrors);

/* ************************************************************************* */
app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  const message =
    err instanceof Error
      ? err.message
      : "Erreur lors de la création de l'utilisateur.";
  res.status(400).json({ error: message });
});

/* ************************************************************************* */

// Health check endpoint for Render
app.get("/", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/api", router);

/* ************************************************************************* */

import "./config/checkConnection";
// Get the port from the environment variables
const port = process.env.PORT;

// Start the server and listen on the specified port
// Ne démarre le serveur que si ce n'est pas un environnement de test
if (process.env.NODE_ENV !== "test") {
  app
    .listen(port, () => {
      console.info(`Server is listening on port ${port}`);
    })
    .on("error", (err: Error) => {
      console.error("Error:", err.message);
    });
}

export default app;
