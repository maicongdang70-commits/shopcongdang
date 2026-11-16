
const express = require("express");
const path = require("path");
const { Pool } = require("pg");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL
        ? { rejectUnauthorized: false }
        : false,
    max: 5
});

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/admin", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "admin.html"));
});

// KIỂM TRA SERVER VÀ DATABASE
app.get("/api/status", async (req, res) => {
    try {
        await pool.query("SELECT 1");

        res.json({
            success: true,
            server: "online",
            database: "connected",
            shop: "SHOPCONGDANG"
        });
    } catch (error) {
        console.error("Lỗi database:", error.message);

        res.status(500).json({
            success: false,
            server: "online",
            database: "disconnected"
        });
    }
});

app.listen(PORT, () => {
    console.log("SHOPCONGDANG đang chạy tại cổng " + PORT);
});
