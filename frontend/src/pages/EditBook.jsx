import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/api"; // Axios instance for API requests

const EditBook = () => {
  const { id } = useParams(); // Get the book ID from the URL
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    genre: "",
    publicationDate: "",
    availableCopies: 1,
  });
  const [image, setImage] = useState(null); // State for storing the new image
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch the current book details using the book ID
  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const response = await api.get(`/books/${id}`);
        const book = response.data;
        setFormData({
          title: book.title,
          author: book.author,
          genre: book.genre,
          publicationDate: book.publicationDate.split("T")[0], // Format for date input
          availableCopies: book.availableCopies,
        });
        setLoading(false);
      } catch (error) {
        console.error("Error fetching book details:", error);
        setError("Failed to load book details.");
        setLoading(false);
      }
    };

    fetchBookDetails();
  }, [id]);

  // Handle input changes for the form fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle file input change for the image
  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedData = new FormData();
    updatedData.append("title", formData.title);
    updatedData.append("author", formData.author);
    updatedData.append("genre", formData.genre);
    updatedData.append("publicationDate", formData.publicationDate);
    updatedData.append("availableCopies", formData.availableCopies);

    if (image) {
      updatedData.append("image", image); // Append the image only if it's updated
    }

    try {
      await api.put(`/books/${id}`, updatedData, {
        headers: {
          "Content-Type": "multipart/form-data", // For handling file uploads
        },
      });
      navigate("/my-books"); // Redirect to "My Books" page after successful update
    } catch (error) {
      console.error("Error updating the book:", error);
      setError("Failed to update the book. Please try again.");
    }
  };

  if (loading) {
    return <div className="text-white">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="bg-gray-800/30 backdrop-blur-md border border-gray-300 rounded-lg shadow-lg p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-6 text-white">
          Edit Book
        </h2>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-white font-semibold">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
              required
            />
          </div>
          <div>
            <label className="block text-white font-semibold">Author</label>
            <input
              type="text"
              name="author"
              value={formData.author}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
              required
            />
          </div>
          <div>
            <label className="block text-white font-semibold">Genre</label>
            <input
              type="text"
              name="genre"
              value={formData.genre}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
              required
            />
          </div>
          <div>
            <label className="block text-white font-semibold">
              Publication Date
            </label>
            <input
              type="date"
              name="publicationDate"
              value={formData.publicationDate}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
              required
            />
          </div>
          <div>
            <label className="block text-white font-semibold">
              Available Copies
            </label>
            <input
              type="number"
              name="availableCopies"
              value={formData.availableCopies}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
              min="1"
              required
            />
          </div>
          <div>
            <label className="block text-white font-semibold">
              Upload New Image
            </label>
            <input
              type="file"
              name="image"
              onChange={handleImageChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gray-800 text-white py-2 rounded-lg font-semibold hover:bg-gray-900 transition duration-300"
          >
            Update Book
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditBook;
