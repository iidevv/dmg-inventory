import express from "express";
import axios from "axios";
import { bigCommerceInstance } from "../../instances/index.js";
import { puInventoryModel } from "../../models/puInventory.js";
import { InventoryModel } from "../../models/Inventory.js";
import { sendNotification } from "../tg-notifications.js";

const router = express.Router();

router.post("/availability/", async (req, res) => {
  if (!req.body.data.cartId) res.json({ message: "Token not provided" });
  console.log(req.body.data.cartId);
//   const { data: cart } = await bigCommerceInstance.get(
//     `/carts/${req.body.data.cartId}`
//   ).catch(err => console.log(err));
//   const cartItemIds = cart.line_items.physical_items;

//   const updatePromises = cartItemIds.map(async (item) => {
//     const vendor_id = item.sku;
//     const name = item.name;
//     const puProduct = await puInventoryModel.findOne({
//       vendor_id,
//       product_name: name,
//     });
//     if (puProduct) await updatePuProducts(vendor_id, name);

//     const wpsProduct = await InventoryModel.findOne({
//       vendor_id,
//       product_name: name,
//     });
//   });

//   await Promise.all(updatePromises);
//   sendNotification("Availability checked!");

//   res.json({ message: "Operation completed" });
});

export { router as ProductAvailabilityRouter };
