import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import api from "../api/api"; // Import API instance
import { AuthContext } from "../context/AuthContext"; // Import AuthContext for user

const BookDetails = () => {
  const { id } = useParams(); // Get the book ID from the URL
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isBorrowed, setIsBorrowed] = useState(false); // Track if the user has borrowed the book
  const { user } = useContext(AuthContext); // Get the logged-in user (can be null if not logged in)

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const response = await api.get(`/books/${id}`); // Fetch book details by ID
        setBook(response.data);
        setLoading(false);

        // Check if the book is borrowed by the current user (if user is logged in)
        if (user && response.data.borrowedBy.includes(user._id)) {
          setIsBorrowed(true); // If the user has already borrowed the book
        }
      } catch (err) {
        setError("Error fetching book details");
        setLoading(false);
      }
    };

    fetchBookDetails();
  }, [id, user]);

  // Handle Borrow Book action (only for logged-in users)
  const handleBorrow = async () => {
    try {
      await api.post(`/books/${id}/borrow`);
      setIsBorrowed(true); // Update state to reflect the book has been borrowed
      setBook((prevBook) => ({
        ...prevBook,
        availableCopies: prevBook.availableCopies - 1,
      }));
    } catch (err) {
      setError("Error borrowing book");
    }
  };

  // Handle Return Book action (only for logged-in users)
  const handleReturn = async () => {
    try {
      await api.post(`/books/${id}/return`);
      setIsBorrowed(false); // Update state to reflect the book has been returned
      setBook((prevBook) => ({
        ...prevBook,
        availableCopies: prevBook.availableCopies + 1,
      }));
    } catch (err) {
      setError("Error returning book");
    }
  };

  if (loading) return <div className="text-white">Loading book details...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-6">
      <div className="bg-gray-800/30 backdrop-blur-md border border-gray-300 rounded-lg shadow-lg p-6 w-full max-w-4xl">
        <div className="text-center mb-8">
          <p className="text-white text-xl">
            Discover the story behind this book
          </p>
        </div>

        {book && (
          <div className="flex flex-col lg:flex-row items-center justify-center lg:justify-evenly lg:items-center p-6">
            {/* Book Details - Left Side */}
            <div className="lg:w-1/3 w-full text-left">
              <h2 className="text-4xl font-bold mb-4 text-white">
                {book.title}
              </h2>
              <p className="text-lg font-semibold text-gray-300 mb-4">
                By {book.author}
              </p>

              <div className="mb-6">
                <p className="text-lg text-gray-400">
                  <strong>Genre:</strong> {book.genre}
                </p>
                <p className="text-lg text-gray-400">
                  <strong>Published:</strong>{" "}
                  {new Date(book.publicationDate).toLocaleDateString()}
                </p>
                <p className="text-lg text-gray-400">
                  <strong>Available Copies:</strong> {book.availableCopies}
                </p>
              </div>

              <p className="text-lg text-gray-300 mb-6">{book.description}</p>

              {/* Borrow or Return Book Buttons */}
              {user && (
                <div className="mt-4">
                  {isBorrowed ? (
                    <button
                      onClick={handleReturn}
                      className="bg-black border border-white text-white px-6 py-3 rounded-md hover:bg-white hover:text-black transition duration-300"
                    >
                      Return Book
                    </button>
                  ) : book.availableCopies > 0 ? (
                    <button
                      onClick={handleBorrow}
                      className="bg-white text-black px-6 py-3 rounded-md hover:bg-black hover:text-white border hover:border-white transition duration-300"
                    >
                      Borrow Book
                    </button>
                  ) : (
                    <p className="text-red-500 text-lg">
                      No copies available for borrowing
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Book Image - Right Side */}
            <div className="lg:w-1/3 w-full flex justify-center lg:justify-end">
              <div className="relative p-6 rounded-lg shadow-lg">
                <img
                  src={
                    book.imageUrl
                      ? `http://localhost:5000${book.imageUrl}`
                      : "/no-image.png"
                  }
                  alt={book.title}
                  className="w-full h-auto object-cover rounded-lg"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookDetails;
