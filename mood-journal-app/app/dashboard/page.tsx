"use client";

import { useEffect, useState } from "react";
import { signOut } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";

interface Entry {
  id: string;
  mood: string;
  title: string;
  text: string;
  createdAt: number;
}

export default function Dashboard() {
  const router = useRouter();

  const [entries, setEntries] = useState<Entry[]>([]);
  const [notification, setNotification] =
    useState("");

  function showNotification(
    message: string
  ) {
    setNotification(message);

    setTimeout(() => {
      setNotification("");
    }, 3000);
  }

  async function loadEntries() {
    const q = query(
      collection(db, "entries"),
      orderBy("createdAt", "desc")
    );

    const snapshot = await getDocs(q);

    const data: Entry[] = snapshot.docs.map(
      (docItem) => ({
        id: docItem.id,
        ...(docItem.data() as Omit<
          Entry,
          "id"
        >),
      })
    );

    setEntries(data);
  }

  useEffect(() => {
    loadEntries();
  }, []);

  async function deleteEntry(id: string) {
    const confirmed = confirm(
      "Opravdu chceš tento zápisek smazat?"
    );

    if (!confirmed) return;

    try {
      await deleteDoc(
        doc(db, "entries", id)
      );

      await loadEntries();

      showNotification(
        "🗑️ Zápisek byl smazán."
      );
    } catch (error) {
      console.error(error);
      showNotification(
        "Nepodařilo se smazat zápisek."
      );
    }
  }

  async function logout() {
    await signOut(auth);
    router.push("/admin");
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-pink-100 to-purple-100 p-8">
      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-lg p-8">
        <div className="flex justify-between items-start gap-6 flex-wrap">
          <div>
            <h1 className="text-5xl font-bold text-pink-500">
              🌸 Admin Dashboard
            </h1>

            <p className="mt-4 text-gray-600">
              Jsi přihlášená jako
              administrátor.
            </p>

            <p className="mt-2 text-lg font-semibold text-pink-600">
              📊 Celkem zápisků:{" "}
              {entries.length}
            </p>
          </div>

          <button
            onClick={logout}
            className="bg-red-500 text-white px-6 py-3 rounded-2xl hover:bg-red-600 transition"
          >
            Odhlásit se
          </button>
        </div>

        {notification && (
          <div className="mt-6 rounded-2xl border border-pink-300 bg-pink-100 px-4 py-3 text-center text-pink-700 shadow">
            {notification}
          </div>
        )}

        <h2 className="text-3xl font-bold text-pink-600 mt-10 mb-6">
          📔 Všechny zápisky
        </h2>

        <div className="space-y-4">
          {entries.length === 0 && (
            <div className="bg-pink-50 rounded-3xl p-8 text-center text-gray-500">
              Zatím nejsou žádné
              zápisky.
            </div>
          )}

          {entries.map((entry) => (
            <div
              key={entry.id}
              className="bg-pink-50 rounded-3xl p-6 shadow"
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
                    ).toLocaleString(
                      "cs-CZ"
                    )}
                  </p>
                </div>
              </div>

              <p className="text-gray-700 whitespace-pre-wrap mb-5">
                {entry.text}
              </p>

              <button
                onClick={() =>
                  deleteEntry(entry.id)
                }
                className="bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600 transition"
              >
                🗑️ Smazat
              </button>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}