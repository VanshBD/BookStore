import React, { useEffect, useState } from "react";
import api from "../api/api"; // Import the Axios instance for making API requests
import { FaEdit, FaTrash } from "react-icons/fa"; // Import icons for edit and delete
import { useNavigate } from "react-router-dom"; // Import useNavigate for routing

const MyBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch books added by the logged-in user
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await api.get("/books/mycreatedbooks");
        setBooks(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch books:", error);
      }
    };

    fetchBooks();
  }, []);

  // Handle Delete book
  const handleDelete = async (bookId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this book?"
    );
    if (confirmDelete) {
      try {
        await api.delete(`/books/${bookId}`);
        setBooks(books.filter((book) => book._id !== bookId)); // Update UI by removing deleted book
      } catch (error) {
        console.error("Failed to delete book:", error);
      }
    }
  };

  // Navigate to edit book page
  const handleEdit = (bookId) => {
    navigate(`/edit-book/${bookId}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen py-12">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold text-center text-white mb-12">
          This is no book
        </h1>
        {books.length === 0 ? (
          <p className="text-center text-white">
            You have not added any books yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {books.map((book) => (
              <div
                key={book._id}
                className="bg-white/20 backdrop-blur-lg border border-white/20 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                {/* Book Image */}
                <img
                  src={
                    book.imageUrl
                      ? `http://localhost:5000${book.imageUrl}`
                      : "/no-image.png"
                  }
                  alt={book.title}
                  className="w-full h-96 object-cover transition-transform duration-300 hover:scale-105"
                />

                {/* Book Details */}
                <div className="p-6">
                  <h2 className="text-2xl font-semibold text-white mb-2">
                    {book.title}
                  </h2>
                  <p className="text-white mb-2">By {book.author}</p>
                  <p className="text-white text-sm mb-2">
                    Genre: {book.genre}
                  </p>
                  <p className="text-white text-sm mb-2">
                    Published:{" "}
                    {new Date(book.publicationDate).toLocaleDateString()}
                  </p>
                  <p className="text-white text-sm mb-2">
                    Available Copies: {book.availableCopies}
                  </p>
                  <p className="text-white text-sm mb-4">
                    Status: {book.available ? "Available" : "Not Available"}
                  </p>

                  {/* Borrowed By (List of users who borrowed the book) */}
                  {book.borrowedBy && book.borrowedBy.length > 0 ? (
                    <div className="text-left">
                      <h3 className="text-lg font-semibold mb-2 text-white">
                        Borrowed by:
                      </h3>
                      <ul className="text-white text-sm">
                        {book.borrowedBy.map((user) => (
                          <li key={user._id}>
                            {user.name} ({user.email})
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <p className="text-white mb-4">Not borrowed yet</p>
                  )}

                  {/* Edit and Delete buttons */}
                  <div className="flex justify-between mt-6">
                    <button
                      onClick={() => handleEdit(book._id)}
                      className="bg-black hover:bg-white hover:text-black hover:border-black border text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition duration-300"
                    >
                      <FaEdit />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDelete(book._id)}
                      className="bg-black hover:bg-white hover:text-black hover:border-black border text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition duration-300"
                    >
                      <FaTrash />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBooks;
