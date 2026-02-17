import express from "express";

const app = express();

app.use(express.json());

// CORS for local
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3001");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") {
    res.sendStatus(204);
    return;
  }
  next();
});

/* ************************************************************************* */
import type { ErrorRequestHandler } from "express";
const logErrors: ErrorRequestHandler = (err, req, res, next) => {
  console.error(err);
  console.error("on req:", req.method, req.path);
  next(err);
};

app.use(logErrors);

/* ************************************************************************* */

import type { Request, Response, NextFunction } from "express";
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  res
    .status(400)
    .json({
      error: err.message || "Erreur lors de la création de l'utilisateur.",
    });
});

/* ************************************************************************* */

import router from "./routes/router";
app.use(router);

/* ************************************************************************* */

import "./config/checkConnection";
// Get the port from the environment variables
const port = process.env.APP_PORT;

// Start the server and listen on the specified port
app
  .listen(port, () => {
    console.info(`Server is listening on port ${port}`);
  })
  .on("error", (err: Error) => {
    console.error("Error:", err.message);
  });
