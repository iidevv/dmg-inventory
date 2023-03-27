import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import https from "https";
import fs from "fs";
import { bigcommerceRouter } from "./routes/bigcommerce.js";
import { WPSProductsRouter } from "./routes/wps-products.js";
import { WPSProductRouter } from "./routes/wps-product.js";
import { inventoryRouter } from "./routes/inventory.js";
import { SyncProductsRouter } from "./sync-products/index.js";
import { userRouter } from "./routes/user.js";

const port = process.env.PORT || 3001;
const dbname = process.env.DB_NAME;
const dbUsername = process.env.DB_USERNAME;
const dbPassword = process.env.DB_PASSWORD;
const useHttps = process.env.USE_HTTPS === "true";
const app = express();

app.use(express.json());
app.use(cors());

app.use('/api/auth', userRouter);
app.use("/api/inventory", inventoryRouter);
app.use("/api/inventory", SyncProductsRouter);
app.use("/api/products", bigcommerceRouter);
app.use("/api/wps", WPSProductsRouter);
app.use("/api/wps", WPSProductRouter);

mongoose.connect(
  `mongodb+srv://${dbUsername}:${dbPassword}@dmg.eqxtdze.mongodb.net/${dbname}?retryWrites=true&w=majority`
);

if (useHttps) {
  const privateKey = fs.readFileSync(process.env.SSL_KEY_PATH, "utf8");
  const certificate = fs.readFileSync(process.env.SSL_CERT_PATH, "utf8");
  const credentials = { key: privateKey, cert: certificate };

  const httpsServer = https.createServer(credentials, app);

  httpsServer.listen(port, () => console.log(`Server started on https://localhost:${port}`));
} else {
  app.listen(port, () => console.log(`Server started on http://localhost:${port}`));
}