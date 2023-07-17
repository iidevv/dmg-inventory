import BigCommerce from "node-bigcommerce";
import { Configuration } from "openai";
import axios from "axios";
import { config } from "dotenv";
import { CookieJar } from "tough-cookie";
import { wrapper } from "axios-cookiejar-support";
import { sendNotification } from "../routes/tg-notifications.js";
config();

const clientId = process.env.BIGCOMMERCE_CLIENT_ID;
const accessToken = process.env.BIGCOMMERCE_ACCESS_TOKEN;
const storeHash = process.env.BIGCOMMERCE_STORE_HASH;
const WPSToken = process.env.WPS_TOKEN;
const puAccessToken = process.env.PU_ACCESS_TOKEN;
const puCredentials = {
  username: process.env.PU_USER_ID,
  password: process.env.PU_PASSWORD,
  dealerCode: process.env.PU_DEALER_NUMBER,
};
const cookieJar = new CookieJar();

const useHttps = process.env.USE_HTTPS === "true";

export const bigCommerceInstance = new BigCommerce({
  clientId: clientId,
  accessToken: accessToken,
  storeHash: storeHash,
  responseType: "json",
  callback: useHttps
    ? "https://localhost:3001/auth"
    : "http://localhost:3001/auth",
  headers: {
    "Accept-Encoding": "*",
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  apiVersion: "v3",
});

export const bigCommerceInstanceV2 = new BigCommerce({
  clientId: clientId,
  accessToken: accessToken,
  storeHash: storeHash,
  responseType: "json",
  callback: useHttps
    ? "https://localhost:3001/auth"
    : "http://localhost:3001/auth",
  headers: {
    "Accept-Encoding": "*",
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  apiVersion: "v2",
});

export const gptInstance = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

export const wpsInstance = axios.create({
  baseURL: "https://api.wps-inc.com/",
  headers: {
    Authorization: `Bearer ${WPSToken}`,
  },
});

export const puDropshipInstance = axios.create({
  baseURL: "https://api.parts-unlimited.com/api/",
  headers: {
    "api-key": puAccessToken,
    "content-type": "application/json;charset=UTF-8",
  },
});

export const puInstance = wrapper(
  axios.create({
    baseURL: "https://dealer.parts-unlimited.com/api/",
    timeout: 10000,
    jar: cookieJar,
  })
);

export const puLogin = async () => {
  try {
    const response = await axios.put(
      `https://dealer.parts-unlimited.com/api/login`,
      puCredentials,
      {
        jar: cookieJar,
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    sendNotification(`PU login error: ${error}`);
    throw error;
  }
};

// export const puInstance = axios.create({
//   baseURL: "https://dealer.parts-unlimited.com/api/",
//   timeout: 10000,
// });
