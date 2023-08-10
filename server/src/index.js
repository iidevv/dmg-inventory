import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import url from "url";
import path from "path";
import { bigcommerceRouter } from "./routes/bigcommerce.js";
import { WPSProductsRouter } from "./routes/wps-products.js";
import { WPSProductRouter } from "./routes/wps-product.js";
import { inventoryRouter } from "./routes/inventory.js";
import { SyncProductsRouter, updateProducts } from "./sync-products/index.js";
import { userRouter } from "./routes/user.js";
import { chatgptRouter } from "./routes/chatgpt.js";
import { CronJob } from "cron";
import { authenticate } from "./routes/user.js";
import cookieParser from "cookie-parser";
import { puProductsRouter } from "./routes/pu-products.js";
import { puProductRouter } from "./routes/pu-product.js";
import { puExternalProductRouter } from "./routes/external/pu-product.js";
import { puDropshipRouter } from "./routes/pu-dropship.js";
import { dropshipOrderRouter } from "./routes/dropship.js";
import { dashboardRouter } from "./routes/dashboard.js";
import { wpsDropshipRouter } from "./routes/wps-dropship.js";
import { externalOptimizationRouter } from "./routes/external/optimization.js";
import { processingRouter } from "./routes/external/processing.js";
import { ProductAvailabilityRouter } from "./routes/external/productAvailabilityChecker.js";
import { bulkActionRouter } from "./routes/external/bulk-actions.js";
import { sendNotification } from "./routes/tg-notifications.js";
import { testActionRouter } from "./routes/external/test-action.js";
import { hhProductsRouter } from "./routes/hh-products.js";
import { hhProductRouter } from "./routes/hh-product.js";
import { catalogRouter } from "./routes/catalog.js";

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const port = process.env.PORT || 3001;
const dbHost = process.env.DB_HOST;
const dbPort = process.env.DB_PORT;
const dbname = process.env.DB_NAME;
const dbUsername = process.env.DB_USERNAME;
const dbPassword = process.env.DB_PASSWORD;
const useHttps = process.env.USE_HTTPS === "true";
const app = express();
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "../client/build")));
app.use(express.json());

app.use("/external", puExternalProductRouter);
app.use("/external", externalOptimizationRouter);
app.use("/external", processingRouter);
app.use("/external", ProductAvailabilityRouter);
app.use("/external", bulkActionRouter);
app.use("/external", testActionRouter);

app.use("/api/images", express.static(path.join(__dirname, "../optimized")));

app.use(
  cors({
    origin: useHttps
      ? "https://warehouse.discountmotogear.com"
      : "http://localhost:3000",
    credentials: true,
  })
);

app.use("/api/auth", userRouter);

app.use(authenticate);
app.use("/api/inventory", inventoryRouter);

app.use("/api/inventory", SyncProductsRouter);
app.use("/api/catalog", catalogRouter);
app.use("/api/pu-dropship", puDropshipRouter);
app.use("/api/pu", puProductsRouter);
app.use("/api/pu", puProductRouter);
app.use("/api/hh", hhProductsRouter);
app.use("/api/hh", hhProductRouter);
app.use("/api/dashboard", dashboardRouter);
app.use("/api/gpt", chatgptRouter);
app.use("/api/products", bigcommerceRouter);
app.use("/api/wps", WPSProductsRouter);
app.use("/api/wps", WPSProductRouter);
app.use("/api/wps-dropship", wpsDropshipRouter);
app.use("/api/dropship", dropshipOrderRouter);

mongoose.connect(
  `mongodb://${dbUsername}:${dbPassword}@${dbHost}:${dbPort}/${dbname}?authMechanism=DEFAULT&authSource=${dbname}&ssl=true&sslValidate=false`
);

const job = new CronJob({
  cronTime: "0 7,14,18 * * *",
  onTick: async () => {
    try {
      sendNotification("scheduled update started");

      await updateProducts("WPS");
      await updateProducts("PU");
      await updateProducts("HH");

      sendNotification("scheduled update complete");
    } catch (error) {
      sendNotification(`Error during updating: ${error}`);
    }
  },
  timeZone: "America/Los_Angeles",
  start: false,
});

if (useHttps) job.start();

app.listen(port, () =>
  console.log(`Server started on http://localhost:${port}`)
);
