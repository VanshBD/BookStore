const Book = require("../models/bookModel");
const multer = require("multer");

// Set up multer for image upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage: storage });

/// Create Book with Image Upload
const addBook = async (req, res) => {
  try {
    const { title, author, genre, publicationDate, availableCopies } = req.body;

    // Multer image upload
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    // Create the book
    const book = await Book.create({
      title,
      author,
      genre,
      publicationDate,
      availableCopies,
      imageUrl,
      createdBy: req.user.id, // Assign logged-in user as the creator
    });

    res.status(201).json(book);
  } catch (error) {
    res.status(400).json({ message: "Error creating book", error });
  }
};


// Update Book with Image Upload
const updateBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    // Only the creator can update the book
    if (book.createdBy.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    // Update fields
    const { title, author, genre, publicationDate, availableCopies } = req.body;
    book.title = title || book.title;
    book.author = author || book.author;
    book.genre = genre || book.genre;
    book.publicationDate = publicationDate || book.publicationDate;
    book.availableCopies = availableCopies || book.availableCopies;

    // Update image if a new one is uploaded
    if (req.file) {
      book.imageUrl = `/uploads/${req.file.filename}`;
    }

    await book.save();
    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ message: "Error updating book", error });
  }
};


// Get all books (Public)
const getBooks = async (req, res) => {
  try {
    const books = await Book.find();
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving books", error });
  }
};

// Get book by ID (Public)
const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving book", error });
  }
};

// Delete book (Only the creator can delete)
const deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    // Ensure only the creator can delete the book
    if (book.createdBy.toString() !== req.user.id) {
      return res
        .status(401)
        .json({ message: "User not authorized to delete this book" });
    }

    await Book.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: "Book deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting book", error });
  }
};
// Borrow book
const borrowBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    if (book.availableCopies <= 0) {
      return res.status(400).json({ message: "No copies available to borrow" });
    }

    // Add the user to borrowedBy array and decrease available copies
    if (!book.borrowedBy.includes(req.user.id)) {
      book.borrowedBy.push(req.user.id);
      book.availableCopies -= 1;
      await book.save();
    }

    res.status(200).json({ message: "Book borrowed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error borrowing book", error });
  }
};


// Return book
const returnBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    // Check if the user actually borrowed the book
    const index = book.borrowedBy.indexOf(req.user.id);
    if (index === -1) {
      return res.status(400).json({ message: "You haven't borrowed this book" });
    }

    // Remove user from the borrowedBy array and increase available copies
    book.borrowedBy.splice(index, 1);
    book.availableCopies += 1;

    await book.save();
    res.status(200).json({ message: "Book returned successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error returning book", error });
  }
};


// Get all books added by the logged-in user
// Get all books added by the logged-in user
const getBooksByCreator = async (req, res) => {
  try {
    const books = await Book.find({ createdBy: req.user.id })
      .populate("createdBy", "name email") // Populate creator info
      .populate("borrowedBy", "name email"); // Populate borrower info

    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving books", error });
  }
};


// Get all books borrowed by the logged-in user
const getBooksByBorrowedUser = async (req, res) => {
  try {
    const books = await Book.find({ borrowedBy: req.user.id });
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving borrowed books", error });
  }
};

module.exports = {
  addBook,
  getBooks,
  getBookById,
  updateBook,
  deleteBook,
  borrowBook,
  returnBook,
  getBooksByCreator,
  getBooksByBorrowedUser,
};
