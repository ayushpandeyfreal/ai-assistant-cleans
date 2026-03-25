import express from "express";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// ✅ Simple & safe CORS (no error)
app.use(cors());

app.use(express.json());

app.post("/chat", async (req, res) => {
  try {
    const { messages } = req.body;

    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.1-8b-instant",
        messages: messages,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.json(response.data.choices[0].message);
  } catch (err) {
    console.error("ERROR:", err.message);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.get("/", (req, res) => {
  res.send("AI Backend is Running 🚀");
});

app.listen(5000, () => console.log("Server running on port 5000"));