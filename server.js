const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://abubakrsiddik9043_db_user:H4R3ECv4oYy02KTe@cluster0.uqrevs4.mongodb.net/bkb_college?appName=Cluster0';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ MongoDB Atlas-এর সাথে ব্যাকএন্ড সফলভাবে সংযুক্ত হয়েছে!'))
  .catch(err => console.error('❌ MongoDB কানেকশন ত্রুটি:', err));

// Schema & Models
const noticeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: String, default: new Date().toLocaleDateString('bn-BD') },
  pdfUrl: String
});

const teacherSchema = new mongoose.Schema({
  sl: Number,
  name: { type: String, required: true },
  role: String,
  dept: String,
  photo: String
});

const Notice = mongoose.model('Notice', noticeSchema);
const Teacher = mongoose.model('Teacher', teacherSchema);

// API Endpoints

// ১. টেস্ট রুট
app.get('/', (req, res) => {
  res.send('Bikrampur K. B. Govt. College API Server is Running!');
});

// ২. নোটিশ পাওয়ার API
app.get('/api/notices', async (req, res) => {
  try {
    const notices = await Notice.find().sort({ _id: -1 });
    res.json(notices);
  } catch (err) {
    res.status(500).json({ error: 'নোটিশ লোড করতে ব্যর্থ হয়েছে।' });
  }
});

// ৩. নতুন নোটিশ যোগ করার API
app.post('/api/notices', async (req, res) => {
  try {
    const newNotice = new Notice(req.body);
    await newNotice.save();
    res.status(201).json(newNotice);
  } catch (err) {
    res.status(400).json({ error: 'নোটিশ সেভ করা যায়নি।' });
  }
});

// ৪. শিক্ষকদের তালিকা পাওয়ার API
app.get('/api/teachers', async (req, res) => {
  try {
    const teachers = await Teacher.find().sort({ sl: 1 });
    res.json(teachers);
  } catch (err) {
    res.status(500).json({ error: 'শিক্ষকদের তথ্য লোড করা যায়নি।' });
  }
});

// ৫. নতুন শিক্ষক যোগ করার API
app.post('/api/teachers', async (req, res) => {
  try {
    const newTeacher = new Teacher(req.body);
    await newTeacher.save();
    res.status(201).json(newTeacher);
  } catch (err) {
    res.status(400).json({ error: 'শিক্ষকের তথ্য সেভ করা যায়নি।' });
  }
});

// Server Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 সার্ভার চালু হয়েছে পোর্ট নম্বর: ${PORT}`);
});
