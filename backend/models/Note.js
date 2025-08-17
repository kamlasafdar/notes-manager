import mongoose from 'mongoose';
const noteSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: String,
  content: String,
  tags: [String],
  image: { type: String },  // Cloudinary URL
  createdAt: { type: Date, default: Date.now },
});



export default mongoose.model('Note', noteSchema);