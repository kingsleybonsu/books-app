const express = require("express");
const Book = require("../models/Book");
const auth = require("../middleware/auth");

const router = express.Router();

router.use(auth);

router.get("/", async (req, res) => {
  try {
    const books = await Book.find({ user: req.userId }).sort({ createdAt: -1 });
    res.json(books);
  } catch {
    res.status(500).json({ message: "Could not fetch books" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { title, author, year } = req.body;

    if (!title || !author || !year) {
      return res.status(400).json({ message: "Title, author and year are required" });
    }

    const book = await Book.create({
      title,
      author,
      year: Number(year),
      user: req.userId
    });

    res.status(201).json(book);
  } catch {
    res.status(500).json({ message: "Could not add book" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { title, author, year } = req.body;

    const book = await Book.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      { title, author, year: Number(year) },
      { new: true, runValidators: true }
    );

    if (!book) return res.status(404).json({ message: "Book not found" });

    res.json(book);
  } catch {
    res.status(500).json({ message: "Could not update book" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const book = await Book.findOneAndDelete({
      _id: req.params.id,
      user: req.userId
    });

    if (!book) return res.status(404).json({ message: "Book not found" });

    res.json({ message: "Book deleted" });
  } catch {
    res.status(500).json({ message: "Could not delete book" });
  }
});

module.exports = router;
