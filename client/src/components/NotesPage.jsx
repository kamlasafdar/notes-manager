import React, { useState, useEffect, useRef } from "react";
import { FaTrash, FaCheck } from "react-icons/fa";

export default function NotesDashboard() {
  const [notes, setNotes] = useState([
    { id: `temp-${Date.now()}`, title: "", content: "" }
  ]);
  const [searchTerm, setSearchTerm] = useState("");

  const notesContainerRef = useRef(null);
  const lastActionRef = useRef("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch("http://localhost:5000/api/notes", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setNotes(
            data.map(n => ({
              id: n._id,
              title: n.title,
              content: n.content
            }))
          );
        }
      })
      .catch(err => {
        console.error("Failed to fetch notes", err);
      });
  }, []);

  useEffect(() => {
    if (lastActionRef.current === "add" && notesContainerRef.current) {
      notesContainerRef.current.scrollTop =
        notesContainerRef.current.scrollHeight;
    }
  }, [notes]);

  const addNote = () => {
    lastActionRef.current = "add";
    setNotes(prev => [
      ...prev,
      { id: `temp-${Date.now()}`, title: "", content: "" }
    ]);
  };

  const updateNoteTitle = (id, value) => {
    lastActionRef.current = "update";
    setNotes(
      notes.map(note => (note.id === id ? { ...note, title: value } : note))
    );
  };

  const updateNoteContent = (id, value) => {
    lastActionRef.current = "update";
    setNotes(
      notes.map(note => (note.id === id ? { ...note, content: value } : note))
    );
  };

  const deleteNote = async id => {
    lastActionRef.current = "delete";
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to delete notes.");
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/notes/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!res.ok) {
        throw new Error(`Failed to delete note: ${res.status}`);
      }

      setNotes(notes.filter(note => note.id !== id));
    } catch (error) {
      console.error("Error deleting note:", error);
      alert("Failed to delete note from server.");
    }
  };

  const saveSingleNote = id => {
    lastActionRef.current = "save";
    const token = localStorage.getItem("token");
    const noteToSave = notes.find(note => note.id === id);

    if (!noteToSave) {
      alert("Note not found!");
      return;
    }

    const isNewNote = String(id).startsWith("temp-");
    const url = isNewNote
      ? "http://localhost:5000/api/notes"
      : `http://localhost:5000/api/notes/${id}`;
    const method = isNewNote ? "POST" : "PUT";

    const bodyData = {
      title: noteToSave.title,
      content: noteToSave.content
    };

    fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(bodyData)
    })
      .then(res => {
        if (!res.ok) {
          throw new Error(`Server error: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        alert("Note saved successfully!");
        if (isNewNote && data._id) {
          setNotes(
            notes.map(note =>
              note.id === id ? { ...note, id: data._id } : note
            )
          );
        }
      })
      .catch(err => {
        console.error("Failed to save note", err);
        alert("Failed to save note");
      });
  };

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

return (
  <div className="p-6 max-w-3xl mx-auto flex flex-col h-[calc(100vh-100px)]">
    {/* Search Bar - stays fixed above notes */}
    <div className="py-2 mb-4 flex-shrink-0">
      <input
        type="text"
        placeholder="Search notes by title..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full p-2 rounded bg-white text-black placeholder-gray-500 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
    </div>

    {/* Scrollable Notes Container */}
    <div
      ref={notesContainerRef}
      className="flex-1 overflow-y-auto"
      style={{
        scrollbarWidth: "thin",
        scrollbarColor: "rgba(255,255,255,0.3) transparent",
      }}
    >
      <style>
        {`
          div::-webkit-scrollbar {
            width: 8px;
          }
          div::-webkit-scrollbar-track {
            background: transparent;
          }
          div::-webkit-scrollbar-thumb {
            background-color: rgba(255, 255, 255, 0.3);
            border-radius: 10px;
          }
          div::-webkit-scrollbar-thumb:hover {
            background-color: rgba(255, 255, 255, 0.5);
          }
        `}
      </style>

      {/* Notes List */}
      <div className="space-y-6">
        {filteredNotes.length === 0 ? (
          <p className="text-white text-center opacity-70 select-none">
            No notes found.
          </p>
        ) : (
          filteredNotes.map(({ id, title, content }) => (
            <div
              key={id}
              className="relative bg-white/20 backdrop-blur-md rounded-md p-4"
            >
              <FaTrash
                onClick={() => deleteNote(id)}
                className="absolute top-2 right-2 cursor-pointer text-white hover:text-red-500"
                title="Delete note"
              />

              <FaCheck
                onClick={() => saveSingleNote(id)}
                className="absolute top-2 right-10 cursor-pointer text-white hover:text-green-400"
                title="Save note"
              />

              <input
                type="text"
                value={title}
                onChange={(e) => updateNoteTitle(id, e.target.value)}
                placeholder="Title of note"
                className="w-full mb-2 p-2 rounded bg-white/30 text-white font-extrabold placeholder-white focus:outline-none focus:ring-2 focus:ring-pink-400"
              />

              <textarea
                value={content}
                onChange={(e) => updateNoteContent(id, e.target.value)}
                placeholder="Write your note here..."
                className="w-full h-24 p-3 rounded bg-white/20 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-pink-400 resize-none"
              />
            </div>
          ))
        )}
      </div>
    </div>

    {/* Add Note Button */}
    <button
      onClick={addNote}
      className="mt-4 px-5 py-2 bg-blue-500 bg-opacity-40 text-white rounded hover:bg-opacity-60 transition"
    >
      Add Note
    </button>
  </div>
);

}
