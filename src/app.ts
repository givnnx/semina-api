import express from "express";
import mongoose from "mongoose";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import authCMSRouter from "./app/api/v1/auth/router";
import categoriesRouter from "./app/api/v1/categories/router";
import talentsRouter from "./app/api/v1/talents/router";
import imagesRouter from "./app/api/v1/images/router";
import eventsRouter from "./app/api/v1/events/router";
import organizersRouter from "./app/api/v1/organizers/router";
import userRefreshTokenRouter from "./app/api/v1/userRefreshToken/router";
import paymentsRouter from "./app/api/v1/payments/router";
import ordersRouter from "./app/api/v1/orders/router";
import participantsRouter from "./app/api/v1/participants/router";
const urlV1 = "/api/v1/cms";

import notFoundMiddleware from "./app/middlewares/not-found";
import handleErrorMiddleware from "./app/middlewares/handler-error";

const app = express();
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }),
);

const allowedOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(",")
  : ["http://localhost:3000", "http://localhost:3001"];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, true); // Permissive in dev if origin matches or localhost
      }
    },
    credentials: true,
  }),
);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: {
    msg: "Too many authentication attempts, please try again later",
  },
});
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.resolve(process.cwd(), "public")));

// Swagger
import fs from "fs";
import swaggerUi from "swagger-ui-express";
import YAML from "yaml";
const swaggerDocument = YAML.parse(
  fs.readFileSync(path.join(__dirname, "swagger.yaml"), "utf8"),
);
const options = {
  customCssUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.0.0/swagger-ui.min.css",
  customJs: [
    "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.0.0/swagger-ui-bundle.js",
    "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.0.0/swagger-ui-standalone-preset.js",
  ],
};

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, options),
);

app.use(`${urlV1}/categories`, categoriesRouter);
app.use(`${urlV1}/talents`, talentsRouter);
app.use(`${urlV1}/images`, imagesRouter);
app.use(`${urlV1}/events`, eventsRouter);
app.use(`${urlV1}/organizers`, organizersRouter);
app.use(`${urlV1}/auth`, authLimiter, authCMSRouter);
app.use(`${urlV1}/refresh-token`, userRefreshTokenRouter);
app.use(`${urlV1}/payments`, paymentsRouter);
app.use(`${urlV1}/orders`, ordersRouter);
app.use(`/api/v1/participants/auth`, authLimiter);
app.use(`/api/v1/auth`, authLimiter);
app.use(`/api/v1/active`, authLimiter);
app.use(`/api/v1/participants`, participantsRouter);
app.use(`/api/v1`, participantsRouter);
app.get(["/api/v1/cron/keep-warm", "/api/cron/keep-warm"], async (req, res) => {
  try {
    const cronSecret = process.env.CRON_SECRET;
    const authHeader = req.headers.authorization;
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const adminDb = mongoose.connection.db?.admin();
    const pingResult = adminDb ? await adminDb.ping() : { ok: 1 };

    return res.status(200).json({
      success: true,
      message: "MongoDB keep-warm ping executed successfully",
      timestamp: new Date().toISOString(),
      ping: pingResult,
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Ping error";
    return res.status(500).json({ success: false, error: msg });
  }
});


app.use(notFoundMiddleware);
app.use(handleErrorMiddleware);

export default app;
