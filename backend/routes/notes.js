import express from 'express';
import Note from '../models/Note.js';
import { authenticateToken } from '../middleware/auth.js';
import mongoose from 'mongoose';


const router = express.Router();

// Create a new note
router.post('/notes', authenticateToken, async (req, res) => {
    console.log("POST /notes route hit");
    const { title, content } = req.body;
    const userId = req.user.userId; // from token

    try {
        const newNote = new Note({ userId, title, content });
        const savedNote = await newNote.save();
        res.status(201).json(savedNote);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to save note' });
    }
});

// Update note
router.put('/notes/:id', authenticateToken, async (req, res) => {
    const noteId = req.params.id;
    const { title, content } = req.body;

    try {
        const note = await Note.findOne({ _id: noteId, userId: req.user.userId });
        if (!note) return res.status(404).json({ message: 'Note not found' });

        note.title = title;
        note.content = content;
        await note.save();

        res.json({ message: 'Note updated successfully', note });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating note' });
    }
});

// Get all notes
router.get('/notes', authenticateToken, async (req, res) => {
    try {
        const notes = await Note.find({ userId: req.user.userId });
        res.json(notes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching notes' });
    }
});
// Delete note by ID
router.delete('/notes/:id', authenticateToken, async (req, res) => {
    console.log('hello in the deletion router');

    const noteId = req.params.id;
    const userId = req.user.userId;

    console.log('Note ID as ObjectId:', new mongoose.Types.ObjectId(noteId));
    console.log('User ID as ObjectId:', new mongoose.Types.ObjectId(userId));

    try {
        const deletedNote = await Note.findOneAndDelete({
            _id: new mongoose.Types.ObjectId(noteId),
            userId: new mongoose.Types.ObjectId(userId)
        });

        if (!deletedNote) {
            console.log('No note deleted - note not found or user unauthorized');
            return res.status(404).json({ message: 'Note not found or unauthorized' });
        }

        console.log('Note deleted:', deletedNote);
        res.json({ message: 'Note deleted successfully' });
    } catch (error) {
        console.error('Error deleting note:', error);
        res.status(500).json({ message: 'Error deleting note' });
    }
});




export default router;
