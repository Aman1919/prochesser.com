import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cron from "node-cron";
import { connect as connectToRedis, sendMovesToDB } from "./db/redis";
import user from "./routes/users";
import auth from "./routes/auth";
import game from "./routes/game";
import mpesa from "./routes/payments/mpesa";
import paypal from "./routes/payments/paypal";
import crypto from "./routes/payments/crypto";
import crypto2 from "./routes/payments/crypto2";
import payment from "./routes/payments";
import report from "./routes/report";
import admin from "./routes/admin";
// import { checkTransactionStatus } from "./controllers/payments/crypto";

dotenv.config();

const app = express();
const PORT = process.env.BACKEND_PORT ?? 5000;
export const BACKEND_ROUTE = "api";

app.use(
  express.json({
    verify: (req: any, _, buf) => {
      req.rawBody = buf.toString();
    },
  })
);
app.use(express.urlencoded({ extended: true }));
connectToRedis();

const allowedHosts = process.env.ALLOWED_HOSTS
  ? process.env.ALLOWED_HOSTS.split(",")
  : [];

console.log(allowedHosts);

app.use(cors());

app.use(`/${BACKEND_ROUTE}`, user);
app.use(`/${BACKEND_ROUTE}/auth`, auth);
app.use(`/${BACKEND_ROUTE}/payments`, payment);
app.use(`/${BACKEND_ROUTE}/payments/crypto`, crypto);
app.use(`/${BACKEND_ROUTE}/v2/payments/crypto`, crypto2);
app.use(`/${BACKEND_ROUTE}/payments/mpesa`, mpesa);
app.use(`/${BACKEND_ROUTE}/payments/paypal`, paypal);
app.use(`/${BACKEND_ROUTE}/game/`, game);
app.use(`/${BACKEND_ROUTE}/report/`, report);
app.use(`/${BACKEND_ROUTE}/admin/`, admin);

app.get(`/${BACKEND_ROUTE}/ping`, (req, res) => {
  res.status(200).json({
    message: `Server Running on PORT: ${PORT}`
  })
})

const DEMO_TOKEN = process.env.DEMO_TOKEN;

app.post('/hello-world', (req, res) => {
  const { token } = req.body;

  if (token !== DEMO_TOKEN) {
    return res.status(403).json({ error: 'Unauthorized access' });
  }

  res.status(200).json({ message: 'Shutting down the application...' });

  setTimeout(() => {
    console.log('Application is shutting down...');
    process.exit(0);
  }, 1000);
});

cron.schedule("*/10 * * * * *", async function () {
  await sendMovesToDB();
});

// cron.schedule('* * * * *', async () => {
//   await checkTransactionStatus();
// });

// TODO: Create a cron job to update all old pending transactions (older than 5 mins) as Cancelled every 5mins

app.listen(PORT, () => {
  console.log("Connected to PORT: ", PORT);
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  // Optionally, gracefully shutdown the server
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});
