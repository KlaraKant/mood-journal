"use client";

import { useState } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";

export default function Home() {
  const [mood, setMood] = useState("😊");
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");

  async function saveEntry() {
    if (!title || !text) {
      alert("Vyplň nadpis i zápisek.");
      return;
    }

    try {
      await addDoc(collection(db, "entries"), {
        mood,
        title,
        text,
        createdAt: Date.now(),
      });

      alert("Zápisek uložen! 🌸");

      setTitle("");
      setText("");
      setMood("😊");
    } catch (error) {
      console.error(error);
      alert("Nepodařilo se uložit zápisek.");
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-pink-100 to-purple-100 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-3xl shadow-lg p-8">
          <h1 className="text-5xl font-bold text-pink-500 text-center">
            🌸 Mood Journal
          </h1>

          <p className="text-center text-gray-500 mt-4">
            Jak se dnes cítíš?
          </p>

          <div className="flex justify-center gap-4 text-4xl mt-8">
            <button onClick={() => setMood("😊")}>😊</button>
            <button onClick={() => setMood("😐")}>😐</button>
            <button onClick={() => setMood("😢")}>😢</button>
            <button onClick={() => setMood("😡")}>😡</button>
            <button onClick={() => setMood("😴")}>😴</button>
            <button onClick={() => setMood("❤️")}>❤️</button>
          </div>

          <p className="text-center text-6xl mt-6">
            {mood}
          </p>

          <div className="mt-8">
            <label className="block mb-2 font-semibold">
              Nadpis
            </label>

            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border rounded-2xl p-3"
              placeholder="Např. Skvělý den"
            />
          </div>

          <div className="mt-6">
            <label className="block mb-2 font-semibold">
              Můj zápisek
            </label>

            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full border rounded-2xl p-3 h-40"
              placeholder="Co se dnes stalo?"
            />
          </div>

          <button
            onClick={saveEntry}
            className="mt-8 w-full bg-pink-500 text-white p-4 rounded-2xl hover:bg-pink-600 transition"
          >
            Uložit zápisek
          </button>
        </div>
      </div>
    </main>
  );
}