"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";

interface Entry {
  id: string;
  mood: string;
  title: string;
  text: string;
  createdAt: number;
}

export default function Home() {
  const [mood, setMood] = useState("😊");
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [entries, setEntries] = useState<Entry[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [notification, setNotification] = useState("");

  async function loadEntries() {
    const q = query(
      collection(db, "entries"),
      orderBy("createdAt", "desc")
    );

    const snapshot = await getDocs(q);

    const data: Entry[] = snapshot.docs.map((docItem) => ({
      id: docItem.id,
      ...(docItem.data() as Omit<Entry, "id">),
    }));

    setEntries(data);
  }

  useEffect(() => {
    loadEntries();
  }, []);

  function showNotification(message: string) {
    setNotification(message);

    setTimeout(() => {
      setNotification("");
    }, 3000);
  }

  async function saveEntry() {
    if (!title || !text) {
      showNotification("Vyplň nadpis i zápisek.");
      return;
    }

    try {
      const wasEditing = !!editingId;

      if (editingId) {
        await updateDoc(doc(db, "entries", editingId), {
          mood,
          title,
          text,
        });

        setEditingId(null);
      } else {
        await addDoc(collection(db, "entries"), {
          mood,
          title,
          text,
          createdAt: Date.now(),
        });
      }

      setTitle("");
      setText("");
      setMood("😊");

      await loadEntries();

      showNotification(
        wasEditing
          ? "🩷 Zápisek byl upraven."
          : "🌸 Zápisek byl uložen."
      );
    } catch (error) {
      console.error(error);
      showNotification("Něco se nepodařilo.");
    }
  }

  async function deleteEntry(id: string) {
    const confirmed = confirm(
      "Opravdu chceš tento zápisek smazat?"
    );

    if (!confirmed) return;

    try {
      await deleteDoc(doc(db, "entries", id));
      await loadEntries();

      showNotification("🗑️ Zápisek byl smazán.");
    } catch (error) {
      console.error(error);
      showNotification("Nepodařilo se smazat zápisek.");
    }
  }

  function editEntry(entry: Entry) {
    setEditingId(entry.id);
    setMood(entry.mood);
    setTitle(entry.title);
    setText(entry.text);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
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

          {notification && (
            <div className="mt-4 rounded-2xl border border-pink-300 bg-pink-100 px-4 py-3 text-center text-pink-700 shadow">
              {notification}
            </div>
          )}

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
            {editingId
              ? "💾 Uložit změny"
              : "🌸 Uložit zápisek"}
          </button>
        </div>

        <div className="mt-10">
          <h2 className="text-3xl font-bold text-pink-600 mb-6">
            📔 Moje zápisky
          </h2>

          <div className="space-y-4">
            {entries.map((entry) => (
              <div
                key={entry.id}
                className="bg-white rounded-3xl shadow-lg p-6"
              >
                <div className="flex items-center gap-4 mb-3">
                  <span className="text-4xl">
                    {entry.mood}
                  </span>

                  <div>
                    <h3 className="text-2xl font-bold">
                      {entry.title}
                    </h3>

                    <p className="text-sm text-gray-500">
                      {new Date(
                        entry.createdAt
                      ).toLocaleString("cs-CZ")}
                    </p>
                  </div>
                </div>

                <p className="text-gray-700 whitespace-pre-wrap mb-5">
                  {entry.text}
                </p>

                <div className="flex gap-3">
                  <button
                    onClick={() => editEntry(entry)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-xl hover:bg-blue-600 transition"
                  >
                    ✏️ Upravit
                  </button>

                  <button
                    onClick={() =>
                      deleteEntry(entry.id)
                    }
                    className="bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600 transition"
                  >
                    🗑️ Smazat
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}