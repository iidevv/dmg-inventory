import express from "express";
import { bigCommerceInstance, wpsInstance } from "../../instances/index.js";


const router = express.Router();

const createOption = async (productId, optionName, optionValues, sortOrder) => {
  console.log(optionValues);
  try {
    const response = await bigCommerceInstance.post(
      `/catalog/products/${productId}/options`,
      {
        name: optionName,
        display_name: optionName,
        type: "rectangles",
        option_values: [
          {
            label: optionValues,
            sort_order: sortOrder,
          },
        ],
      }
    );
    return response.data;
  } catch (error) {
    console.log("Error createOption", error);
    throw error;
  }
};

const createOptionValue = async (productId, optionId, label, sortOrder) => {
  try {
    console.log(label);
    const response = await bigCommerceInstance.post(
      `/catalog/products/${productId}/options/${optionId}/values`,
      {
        label: label,
        sort_order: sortOrder,
      }
    );
    return response.data;
  } catch (error) {
    console.log("Error createOptionValue", error);
    throw error;
  }
};

const getProductOptions = async (productId) => {
  try {
    const response = await bigCommerceInstance.get(
      `/catalog/products/${productId}/options`
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.log("Error getProductOptions", error);
    throw error;
  }
};

const updateVariantOptions = async (productId, variantId, options) => {
  try {
    let allOptions;
    const existVariant = await bigCommerceInstance.get(
      `/catalog/products/${productId}/variants/${variantId}`
    );
    allOptions = [...existVariant.data.option_values, ...options];
    console.log("request: ", allOptions);
    const response = await bigCommerceInstance.put(
      `/catalog/products/${productId}/variants/${variantId}`,
      {
        option_values: allOptions,
      }
    );
    console.log("response: ", response.data.option_values);
  } catch (error) {
    console.error(`Failed to update variant: ${variantId} - ${error}`);
    throw error;
  }
};

// router.get("/bulk-action-one/", async (req, res) => {
//   const pageSize = 5;
//   let currentPage = 1;
//   let totalPages = 1;

//   try {
//     while (currentPage <= totalPages) {
//       const products = await bigCommerceInstance
//         .get(
//           `/catalog/products?limit=${pageSize}&page=${currentPage}&id:in=4957`
//         )
//         .catch((err) => console.log(err));

//       const productsToProcess = products.data;
//       totalPages = products.meta.pagination.total_pages;

//       await Promise.all(
//         productsToProcess.map(async (product) => {
//           try {
//             const brand = product.name.split(" ")[0];

//             const variants = await bigCommerceInstance.get(
//               `/catalog/products/${product.id}/variants`
//             );

//             const existingOptions = await getProductOptions(product.id);
//             await Promise.all(
//               variants.data.map(async (variant, i) => {
//                 if (i >= 1) return;
//                 if (variant.option_values.length === 1) {
//                   let newOptions = createOptions(
//                     variant.option_values[0].label,
//                     brand
//                   );
//                   let optionExists = [];
//                   let sortOrder = 0;
//                   for (let option of newOptions) {
//                     let optionFound = existingOptions.find(
//                       (opt) => opt.display_name === option.option_display_name
//                     );
//                     if (!optionFound) {
//                       const createdOption = await createOption(
//                         product.id,
//                         option.option_display_name,
//                         option.label,
//                         sortOrder
//                       );
//                       await createOptionValue(
//                         product.id,
//                         createdOption.id,
//                         option.label,
//                         sortOrder
//                       );
//                       sortOrder++;
//                     } else {
//                       optionExists.push(optionFound);
//                       console.log(
//                         `Option ${option.option_display_name} already exists for product ${product.id}`
//                       );
//                     }
//                   }
//                   newOptions = newOptions.map((option) => {
//                     console.log(option);
//                     const existOption = optionExists.find(
//                       (opt) => opt.display_name === option.option_display_name
//                     );
//                     option.id = existOption.id;
//                     return option;
//                   });
//                   console.log(newOptions);
//                   await updateVariantOptions(
//                     product.id,
//                     variant.id,
//                     newOptions
//                   );
//                 }
//               })
//             );

//             await new Promise((resolve) => setTimeout(resolve, 2000));
//           } catch (error) {
//             console.error(
//               `Failed to process product: ${product.id} - ${error}`
//             );
//           }
//         })
//       );
//       console.log(`current page: ${currentPage}`);
//       currentPage++;
//     }

//     res.json({ success: true });
//   } catch (error) {
//     res.json({ error: error.message });
//   }
// });

// wps updates
async function getVendorInfo(ids) {
  const chunkSize = 10;
  const chunks = [];
  for (let i = 0; i < ids.length; i += chunkSize) {
    chunks.push(ids.slice(i, i + chunkSize));
  }

  let allVendorInfo = [];
  for (const chunk of chunks) {
    try {
      const response = await wpsInstance.get(
        `/items?filter[id]=${chunk.join(",")}`
      );
      allVendorInfo = allVendorInfo.concat(response.data.data);
    } catch (error) {
      console.log(
        `Error retrieving vendor INFO for chunk ${chunk.join(",")}: ${error}`
      );
    }
  }
  return allVendorInfo;
}

router.get("/bulk-action-newdb/", async (req, res) => {
  const vendor = req.query.vendor;
  if (!vendor) return res.json({ error: "Vendor not provided" });

  // const Model = getInventoryModel(vendor);
  // const products = await Model.find();

  // let skusAdded = 0;
  // let totalProducts = 0;

  // try {
  //   for (const product of products) {
  //     await asyncForEach(product.variants, async (item) => {
  //       const data = {
  //         item_id: item.bigcommerce_id,
  //         product_id: product.bigcommerce_id,
  //         product_name: product.product_name,
  //         sku: item.vendor_id,
  //         inventory_level: item.inventory_level,
  //         price: item.variant_price,
  //         sale_price: null,
  //         update_status: product.status.toLowerCase(),
  //         update_log: "",
  //         discontinued: false,
  //       };

  //       try {
  //         await addProductItem(vendor, data);
  //         skusAdded++;
  //       } catch (error) {
  //         console.error(
  //           `Failed to process variant for product: ${product.product_name} with SKU ${item.vendor_id} - ${error}`
  //         );
  //       }
  //     });

  //     totalProducts++;
  //     console.log(
  //       `Processed product: ${product.product_name}. Total products processed: ${totalProducts}. Skus added: ${skusAdded}`
  //     );
  //   }

  //   console.log(`Total SKUs added: ${skusAdded}`);
  //   res.json({ totalSKUsAdded: skusAdded });
  // } catch (error) {
  //   res.json({ error: error.message });
  // }
});

export { router as bulkActionRouter };
