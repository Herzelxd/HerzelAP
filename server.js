import express from "express";
import dotenv from "dotenv";
import fetch from "node-fetch";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

app.post("/ask", async (req, res) => {
  const { message } = req.body;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-4-turbo",
      messages: [
        {
          role: "system",
          content: "Kamu adalah Lumina AI — AI reflektif yang membantu pengguna berpikir kritis. Balas dengan gaya ramah dan dalam, bantu pengguna menemukan makna di balik pertanyaannya, bukan sekadar memberi jawaban."
        },
        { role: "user", content: message }
      ]
    })
  });

  const data = await response.json();
  res.json({ reply: data.choices?.[0]?.message?.content || "Maaf, aku belum bisa memproses itu." });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Lumina AI aktif di port ${PORT}`));
