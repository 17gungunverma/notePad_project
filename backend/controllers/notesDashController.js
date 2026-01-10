
const notesModel=require("../models/notesDashboard")
const { validationResult } = require("express-validator")


// ============================== CREATE NOTES ==================================
exports.createNote = async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  try {
    const { title, description } = req.body

    const note = await notesModel.create({
      title,
      description,
      userId: req.user._id, // from auth middleware
    })

    res.status(201).json({
      success: true,
      message: "Note created",
      note,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    })
  }
}

// ================= GET ALL NOTES =================
exports.getAllNotes = async (req, res) => {
  try {
    const notes = await notesModel
      .find({ userId: req.user._id })
      .sort({ createdAt: -1 })

    res.json({
      success: true,
      notes,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    })
  }
}


// ================= GET SINGLE NOTE =================
exports.getNoteById = async (req, res) => {
  try {
    const note = await notesModel.findById(req.params.id)

    if (!note) {
      return res.status(404).json({ success: false, message: "Note not found" })
    }

    if (note.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized" })
    }

    res.json({ success: true, note })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    })
  }
}

// ================= UPDATE NOTE =================
exports.updateNote = async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  try {
    const note = await notesModel.findById(req.params.id)

    if (!note) {
      return res.status(404).json({ success: false, message: "Note not found" })
    }

    if (note.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized" })
    }

    const { title, description } = req.body

    if (title) note.title = title
    if (description) note.description = description
    note.updatedAt = Date.now()

    await note.save()

    res.json({
      success: true,
      message: "Note updated",
      note,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    })
  }
}

// ================= DELETE NOTE =================
exports.deleteNote = async (req, res) => {
  try {
    const note = await notesModel.findById(req.params.id)

    if (!note) {
      return res.status(404).json({ success: false, message: "Note not found" })
    }

    if (note.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized" })
    }

    await note.deleteOne()

    res.json({
      success: true,
      message: "Note deleted",
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    })
  }
}