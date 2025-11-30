const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// ENV Variables
const API_TOKEN = process.env.API_TOKEN;
const SECRET_KEY = process.env.SECRET_KEY;

// CREATE PAYMENT API
app.post("/create-payment", async (req, res) => {
    const { amount, userid } = req.body;

    if (!amount || !userid) {
        return res.status(400).json({ error: "Amount & UserID required" });
    }

    try {
        const response = await axios.post(
            "https://zapupi.com/api/deposit/create",
            {
                amount: amount,
                order_id: userid,
                remark: "Tournament Recharge"
            },
            {
                headers: {
                    "api-token": API_TOKEN,
                    "secret-key": SECRET_KEY,
                    "Content-Type": "application/json"
                }
            }
        );

        res.json({
            upi_link: response.data.upi_link,
            txn_id: response.data.txn_id,
            amount: amount,
            userid: userid
        });

    } catch (err) {
        console.log(err.response?.data || err);
        res.status(500).json({ error: "Failed to create payment" });
    }
});

// WEBHOOK
app.post("/zapupi-webhook", (req, res) => {
    const data = req.body;

    console.log("Webhook received:", data);

    if (data.status === "Success") {
        console.log(
            `Payment Success → User: ${data.order_id}, Amount: ${data.amount}, TXN: ${data.txn_id}`
        );
    }

    res.json({ message: "OK" });
});

// START SERVER
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("Backend running on PORT", PORT);
});
