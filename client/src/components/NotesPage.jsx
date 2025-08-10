// import React, { useState } from "react";
// import { FaTrash } from "react-icons/fa";

// export default function NotesDashboard() {
//   const [notes, setNotes] = useState([{ id: Date.now(), content: "" }]);

//   const addNote = () => {
//     setNotes([...notes, { id: Date.now(), content: "" }]);
//   };

//   const updateNote = (id, value) => {
//     setNotes(
//       notes.map(note => (note.id === id ? { ...note, content: value } : note))
//     );
//   };

//   const deleteNote = (id) => {
//     setNotes(notes.filter(note => note.id !== id));
//   };

//   return (
//     <div className="p-6 max-w-3xl mx-auto">
//       <div className="space-y-4 max-h-[400px] overflow-y-auto">
//         {notes.length === 0 ? (
//           <p className="text-white text-center opacity-70 select-none">
//             No notes yet. Click 'Add Note' to create one.
//           </p>
//         ) : (
//           notes.map(({ id, content }) => (
//             <div key={id} className="relative">
//               <textarea
//                 value={content}
//                 onChange={(e) => updateNote(id, e.target.value)}
//                 placeholder="Write your note here..."
//                 className="w-96 h-32 p-3 rounded-md bg-white/20 backdrop-blur-md text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none overflow-y-auto"
//               />
//               <FaTrash
//                 onClick={() => deleteNote(id)}
//                 className="absolute top-1 right-1 cursor-pointer text-white hover:text-red-500"
//                 title="Delete note"
//               />
//             </div>
//           ))
//         )}
//       </div>

//       {/* Add Note button should always be visible */}
//       <button
//         onClick={addNote}
//         className="mt-4 px-5 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//       >
//         Add Note
//       </button>
//     </div>


//   );
// }



import React, { useState } from "react";
import { FaTrash } from "react-icons/fa";

export default function NotesDashboard() {
  const [notes, setNotes] = useState([
    { id: Date.now(), title: "", content: "" }
  ]);

  const addNote = () => {
    setNotes([...notes, { id: Date.now(), title: "", content: "" }]);
  };

  const updateNoteTitle = (id, value) => {
    setNotes(notes.map(note => note.id === id ? { ...note, title: value } : note));
  };

  const updateNoteContent = (id, value) => {
    setNotes(notes.map(note => note.id === id ? { ...note, content: value } : note));
  };

  const deleteNote = (id) => {
    setNotes(notes.filter(note => note.id !== id));
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
