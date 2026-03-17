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

// Health check endpoint for Render
app.get("/", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

// Mount API routes
app.use("/api", router);

/* ************************************************************************* */
// Log errors from routes
app.use(logErrors);

/* ************************************************************************* */
// Central error handler: detect DB connection issues and return a clear 500 response
app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  const message = err instanceof Error ? err.message : String(err);

  const isDbError =
    message.includes("ECONNREFUSED") ||
    message.includes("connect ECONNREFUSED") ||
    message.includes("Failed to establish a database connection");

  if (isDbError) {
    console.warn("Controler la connexion à la base de données (erreur 500)");
    res.status(500).json({
      error: "Controler la connexion à la base de données (erreur 500)",
    });
    return;
  }

  res.status(400).json({ error: message });
});

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
