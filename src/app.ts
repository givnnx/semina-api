import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import cors from "cors";
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
app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Swagger
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
const swaggerDocument = YAML.load(path.join(__dirname, "swagger.yaml"));

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
app.use(`${urlV1}/auth`, authCMSRouter);
app.use(`${urlV1}/refresh-token`, userRefreshTokenRouter);
app.use(`${urlV1}/payments`, paymentsRouter);
app.use(`${urlV1}/orders`, ordersRouter);
app.use(`/api/v1`, participantsRouter);

app.use(notFoundMiddleware);
app.use(handleErrorMiddleware);

export default app;
