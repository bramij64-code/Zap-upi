const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// ---- ENV Variables (Render এ বসাবে) ----
const API_TOKEN = process.env.API_TOKEN;
const SECRET_KEY = process.env.SECRET_KEY;

// ---------- CREATE PAYMENT API ----------
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

// ---------- WEBHOOK ----------
app.post("/zapupi-webhook", (req, res) => {
    const data = req.body;

    console.log("Webhook Data:", data);

    if (data.status === "Success") {
        const userid = data.order_id;
        const amount = parseInt(data.amount);
        const txn = data.txn_id;

        console.log(`✔ Payment Success → User: ${userid}, Amount: ${amount}, TXN: ${txn}`);
    }

    res.json({ message: "OK" });
});

// ---------- START SERVER ----------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Backend running on PORT", PORT));        res.json({
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

// ---------- WEBHOOK ----------
app.post("/zapupi-webhook", (req, res) => {
    const data = req.body;

    console.log("Webhook Data:", data);

    if (data.status === "Success") {
        const userid = data.order_id;
        const amount = parseInt(data.amount);
        const txn = data.txn_id;

        console.log(`✔ Payment Success → User: ${userid}, Amount: ${amount}, TXN: ${txn}`);

        // এখানে তুমি wallet add করার code লিখবে
        // Example:
        // DB[user].coins += amount;
        // অথবা MongoDB/MySQL ব্যবহার করতে পারো
    }

    res.json({ message: "OK" });
});

// ---------- START SERVER ----------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Backend running on PORT", PORT));
