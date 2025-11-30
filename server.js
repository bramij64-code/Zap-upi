const qs = require("qs");

app.post("/create-payment", async (req, res) => {
    const { amount, userid } = req.body;

    if (!amount || !userid) {
        return res.status(400).json({ error: "Amount & UserID required" });
    }

    try {
        const data = qs.stringify({
            amount: amount,
            order_id: userid,
            remark: "Tournament Recharge"
        });

        const response = await axios.post(
            "https://zapupi.com/api/deposit/create",
            data,
            {
                headers: {
                    "api-token": API_TOKEN,
                    "secret-key": SECRET_KEY,
                    "Content-Type": "application/x-www-form-urlencoded"
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
