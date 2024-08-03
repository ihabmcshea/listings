import "dotenv/config";
import "reflect-metadata";
import fs from "fs";
import path from "path";

import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";

import "./utils/response/customSuccess";
import { errorHandler } from "./middleware/errorHandler";
import { dbCreateConnection } from "./orm/dbCreateConnection";
import routes from "./routes";

export const app = express();
app.use(
  cors({
    origin: ["http://nextjs_frontend:3000", "http://localhost:3000"], // Allow the frontend to access resources
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

try {
  const accessLogStream = fs.createWriteStream(
    path.join(__dirname, "../log/access.log"),
    {
      flags: "a",
    }
  );
  app.use(morgan("combined", { stream: accessLogStream }));
} catch (err) {
  console.log(err);
}
app.use(morgan("combined"));

app.use("/", routes);

// const publicFolder = path.join(__dirname, 'public');
app.use(
  "/public",
  express.static(__dirname + "/public", {
    setHeaders: (res) => {
      res.setHeader("Access-Control-Allow-Origin", "*"); // Adjust accordingly
    },
  })
);

app.use(errorHandler);

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

(async () => {
  await dbCreateConnection();
})();
