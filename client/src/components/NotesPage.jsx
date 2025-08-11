import React, { useState, useEffect } from "react";
import { FaTrash, FaCheck } from "react-icons/fa";

export default function NotesDashboard() {

  const [notes, setNotes] = useState([
    { id: `temp-${Date.now()}`, title: "", content: "" }
  ]);


  // Fetch saved notes from backend when component mounts
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    fetch('http://localhost:5000/api/notes', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setNotes(data.map(n => ({
            id: n._id,  // backend note id
            title: n.title,
            content: n.content,
          })));
        }
      })
      .catch(err => {
        console.error('Failed to fetch notes', err);
      });
  }, []);



  const addNote = () => {
    setNotes([...notes, { id: `temp-${Date.now()}`, title: "", content: "" }]);
  };




  const updateNoteTitle = (id, value) => {
    setNotes(notes.map(note => note.id === id ? { ...note, title: value } : note));
  };

  const updateNoteContent = (id, value) => {
    setNotes(notes.map(note => note.id === id ? { ...note, content: value } : note));
  };


  const deleteNote = async (id) => {
    alert("in the delete node function client")
    const token = localStorage.getItem('token');
    if (!token) {
      alert('You must be logged in to delete notes.');
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/notes/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!res.ok) {
        throw new Error(`Failed to delete note: ${res.status}`);
      }

      // Remove note locally after successful backend delete
      setNotes(notes.filter(note => note.id !== id));
    } catch (error) {
      console.error('Error deleting note:', error);
      alert('Failed to delete note from server.');
    }
  };




  // Save a single note by id
  const saveSingleNote = (id) => {
    const token = localStorage.getItem('token');
    console.log("Token sent:", token);

    const noteToSave = notes.find(note => note.id === id);

    if (!noteToSave) {
      alert("Note not found!");
      return;
    }

    const isNewNote = String(id).startsWith('temp-');
    const url = isNewNote ? 'http://localhost:5000/api/notes' : `http://localhost:5000/api/notes/${id}`;
    const method = isNewNote ? 'POST' : 'PUT';

    const bodyData = {
      title: noteToSave.title,
      content: noteToSave.content,
    };

    fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(bodyData),
    })
      .then(res => {
        if (!res.ok) {
          throw new Error(`Server error: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        alert('Note saved successfully!');
        if (isNewNote && data._id) {
          setNotes(notes.map(note => note.id === id ? { ...note, id: data._id } : note));
        }
      })
      .catch(err => {
        console.error('Failed to save note', err);
        alert('Failed to save note');
      });
  };







  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="space-y-6 max-h-[500px] overflow-y-auto">
        {notes.length === 0 ? (
          <p className="text-white text-center opacity-70 select-none">
            No notes yet. Click 'Add Note' to create one.
          </p>
        ) : (
          notes.map(({ id, title, content }) => (
            <div key={id} className="relative bg-white/20 backdrop-blur-md rounded-md p-4">
              {/* Delete icon */}
              <FaTrash
                onClick={() => deleteNote(id)}
                className="absolute top-2 right-2 cursor-pointer text-white hover:text-red-500"
                title="Delete note"
              />

              {/* Save icon (tick) */}
              <FaCheck
                onClick={() => saveSingleNote(id)}
                className="absolute top-2 right-10 cursor-pointer text-white hover:text-green-400"
                title="Save note"
              />

              {/* Title input */}
              <input
                type="text"
                value={title}
                onChange={(e) => updateNoteTitle(id, e.target.value)}
                placeholder="Title of note"
                className="w-full mb-2 p-2 rounded bg-white/30 text-white font-extrabold placeholder-white focus:outline-none focus:ring-2 focus:ring-pink-400"
              />

              {/* Content textarea */}
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

      <button
        onClick={addNote}
        className="mt-4 px-5 py-2 bg-blue-500 bg-opacity-40 text-white rounded hover:bg-opacity-60 transition"
      >
        Add Note
      </button>
    </div>
  );
}
