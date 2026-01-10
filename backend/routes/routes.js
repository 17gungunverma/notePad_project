
const db=require("../config/db")
const express=require("express")
const router=express.Router()

const { register, login } = require("../controllers/authController")
const {createNote,getAllNotes,getNoteById,updateNote,deleteNote}=require("../controllers/notesDashController")
const { protect } = require("../middleware/auth")
const { body } = require("express-validator")






router.post("/register", register)
router.post("/login", login)

router.get("/profile", protect, (req, res) => {
  res.json({
    success: true,
    user: req.user
  })
})

// create notes
router.post( "/notes/createNotes",protect,
  [
    body("title").trim().notEmpty().withMessage("Title is required"),
    body("description").trim().notEmpty().withMessage("Description is required"),
  ],
  createNote
);

//get all notes
router.get("/notes/",protect,getAllNotes);

// GET single note
router.get("/notes/:id", protect, getNoteById)

// UPDATE note
router.put( "/notes/:id", protect,
  [
    body("title").optional().trim().notEmpty().withMessage("Title cannot be empty"),
    body("description")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("Description cannot be empty"),
  ],
  updateNote
)

// DELETE note
router.delete("/notes/:id", protect, deleteNote)



module.exports=router