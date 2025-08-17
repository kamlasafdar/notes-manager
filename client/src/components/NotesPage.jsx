import React, { useState, useEffect, useRef } from "react";
import { FaTrash, FaCheck, FaPlus } from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";
import "react-toastify/dist/ReactToastify.css";
import { jwtDecode } from "jwt-decode";

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
              content: n.content,
              image: n.image || ""   // image 
            }))
          );
        }
      })
      .catch(err => {
        console.error("Failed to fetch notes", err);
        toast.error("Failed to fetch notes");
      });
  }, []);

  useEffect(() => {
    if (lastActionRef.current === "add" && notesContainerRef.current) {
      notesContainerRef.current.scrollTop =
        notesContainerRef.current.scrollHeight;
    }
  }, [notes]);
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      window.location.href = "/login"; // agar token hi nahi mila
      return;
    }

    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000; // seconds

      if (decoded.exp < currentTime) {
        // Token already expired
        localStorage.removeItem("token");
        window.location.href = "/login";
      } else {
        // Auto logout jab exact expiry time aaye
        const expiryTime = decoded.exp * 1000 - Date.now();

        const timer = setTimeout(() => {
          localStorage.removeItem("token");
          window.location.href = "/login";
        }, expiryTime);

        // cleanup
        return () => clearTimeout(timer);
      }
    } catch (error) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
  }, []);

  const addNote = () => {
    lastActionRef.current = "add";
    setNotes(prev => [
      ...prev,
      { id: `temp-${Date.now()}`, title: "", content: "" }
    ]);
    toast.success("New note added");
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
      toast.error("You must be logged in to delete notes.");
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
      toast.success("Note deleted");
    } catch (error) {
      console.error("Error deleting note:", error);
      toast.error("Failed to delete note from server.");
    }
  };

  const saveSingleNote = (id) => {
    lastActionRef.current = "save";
    const token = localStorage.getItem("token");
    const noteToSave = notes.find(note => note.id === id);

    if (!noteToSave) {
      toast.error("Note not found!");
      return;
    }

    const isNewNote = String(id).startsWith("temp-");
    const url = isNewNote
      ? "http://localhost:5000/api/notes"
      : `http://localhost:5000/api/notes/${id}`;
    const method = isNewNote ? "POST" : "PUT";

    // 👇 JSON ki jagah FormData banate hain
    const formData = new FormData();
    formData.append("title", noteToSave.title);
    formData.append("content", noteToSave.content);

    // agar image file hai to usko append karo
    if (noteToSave.imageFile) {
      formData.append("image", noteToSave.imageFile);
    }

    fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${token}` 
      },
      body: formData
    })
      .then(res => {
        if (!res.ok) {
          throw new Error(`Server error: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        toast.success("Note saved successfully!");
        if (isNewNote && data._id) {
          setNotes(
            notes.map(note =>
              note.id === id ? { ...note, id: data._id, image: data.image } : note
            )
          );
        } else {
          setNotes(
            notes.map(note =>
              note.id === id ? { ...note, image: data.image } : note
            )
          );
        }
      })

      .catch(err => {
        console.error("Failed to save note", err);
        toast.error("Failed to save note");
      });
  };


  const handleImageUpload = (id, file) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setNotes(notes.map(note =>
        note.id === id
          ? { ...note, image: reader.result, imageFile: file } // preview + file dono save
          : note
      ));
    };
    reader.readAsDataURL(file); // preview ke liye
  };


  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 max-w-3xl mx-auto flex flex-col h-[calc(100vh-100px)]">
      {/* Toaster Notifications */}
      <Toaster position="top-right" reverseOrder={false} />

      {/* Search Bar */}
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
            filteredNotes.map(({ id, title, content, image }) => (
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
                  className={`absolute top-2 right-10 cursor-pointer ${!title && !content ? "opacity-40 cursor-not-allowed" : "text-white hover:text-green-400"
                    }`}
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

                {/* Add Image */}
                <div className="mt-3 flex items-center gap-2">
                  <label
                    htmlFor={`upload-${id}`}
                    className="cursor-pointer flex items-center gap-2 text-white hover:text-blue-300"
                  >
                    <FaPlus /> Add Image
                  </label>
                  <input
                    id={`upload-${id}`}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleImageUpload(id, e.target.files[0])}
                  />
                </div>

                {/* Image Preview */}
                {image && (
                  <img
                    src={image}
                    alt="Note attachment"
                    className="mt-3 rounded-lg max-h-48 object-cover border border-white/40"
                  />
                )}
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
