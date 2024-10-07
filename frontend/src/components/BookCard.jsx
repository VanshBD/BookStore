import React from "react";
import { useNavigate } from "react-router-dom";

const BookCard = ({ book }) => {
  const navigate = useNavigate();

  // Redirect to book details on click
  const handleClick = () => {
    navigate(`/books/${book._id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-xl transition-shadow duration-300"
    >
      {/* Book Image */}
      <img
        src={
          book.imageUrl
            ? `http://localhost:5000${book.imageUrl}`
            : "/no-image.png"
        }
        alt={book.title}
        className="w-full h-96 object-fit"
      />

      {/* Book Details */}
      <div className="p-6 text-left">
        <h3 className="text-2xl font-semibold text-gray-100 mb-2">
          {book.title}
        </h3>
        <p className="text-gray-300 mb-1">Genre: {book.genre}</p>
        <p className="text-gray-300 mb-1">
          Published: {new Date(book.publicationDate).toLocaleDateString()}
        </p>
        <p className="text-gray-300 mb-1 font-medium">By: {book.author}</p>
        <p className="text-gray-100 mb-4">
          Available Copies: {book.availableCopies}
        </p>

        {/* Button */}
        <button className="text-white font-medium border border-white rounded-full py-2 px-6 hover:bg-white hover:text-black transition duration-300">
          View Details
        </button>
      </div>
    </div>
  );
};

export default BookCard;
