import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";
import "./database/checkConnection";
import articlesRouter from "./router/articleRouter";

const app = express();

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Credentials", "true");
  if (req.method === "OPTIONS") {
    res.sendStatus(204);
    return;
  }
  next();
});

app.use(express.json());

// route articles
app.use(articlesRouter);

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

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
