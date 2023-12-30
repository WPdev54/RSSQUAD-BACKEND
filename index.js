// app.js
import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';

const app = express();
const port = 3000;

// MongoDB Atlas connection string (replace with your actual connection string)
const mongoUri = 'mongodb+srv://novanetworkofficial77:UT06kikTcpIRAEKl@database.tbbz93w.mongodb.net/?retryWrites=true&w=majority';

// MongoDB connection
mongoose.connect(mongoUri, {
  dbName: 'Rssquad', // Specify the database name
});

// Video Schema
const videoSchema = new mongoose.Schema({
  name: String,
  description: String,
  videoUrl: String,
  author: String,
});

// Specify the 'Video' collection in the 'Rssquad' database
const Video = mongoose.model('Video', videoSchema, 'Video');

// Express Middleware
app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({extended:false}))

// Routes
app.get('/videos', async (req, res) => {
  try {
    const videos = await Video.find();
    res.json(videos);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/videos/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const video = await Video.findById(id);

    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }

    res.json(video);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/videos', async (req, res) => {
  const { name, description, videoUrl, author } = req.body;

  try {
    const newVideo = new Video({ name, description, videoUrl, author });
    const savedVideo = await newVideo.save();
    res.json(savedVideo);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Update a video by ID
app.put('/videos/:id', async (req, res) => {
  const { id } = req.params;
  const { name, description, videoUrl, author } = req.body;

  try {
    const updatedVideo = await Video.findByIdAndUpdate(
      id,
      { name, description, videoUrl, author },
      { new: true }
    );

    if (!updatedVideo) {
      return res.status(404).json({ error: 'Video not found' });
    }

    res.json(updatedVideo);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete a video by ID
app.delete('/videos/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedVideo = await Video.findByIdAndDelete(id);

    if (!deletedVideo) {
      return res.status(404).json({ error: 'Video not found' });
    }

    res.json({ message: 'Video deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});