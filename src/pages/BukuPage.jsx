// BukuPage.jsx - Main component file
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import {
  fetchBooks,
  fetchStatusOptions,
  getTokenFromCookies,
} from "../services/api";
import BookForm from "../components/BukuForm";
import BookList from "../components/BookList";
import ErrorMessage from "../components/ErrorMessage";
import LoadingSpinner from "../components/LoadingSpinner";


const BukuPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [books, setBooks] = useState([]);
  const [statusOptions, setStatusOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editBook, setEditBook] = useState(null);

  // Initial fetch on component mount or when returning to the page
  useEffect(() => {
    loadBooks();
    loadStatusOptions();

    // Store books data in sessionStorage when component unmounts
    return () => {
      if (books.length > 0) {
        sessionStorage.setItem("booksData", JSON.stringify(books));
      }
    };
  }, []);

  // Load books from sessionStorage when navigation occurs
  useEffect(() => {
    const storedBooks = sessionStorage.getItem("booksData");
    if (storedBooks && books.length === 0) {
      setBooks(JSON.parse(storedBooks));
    }
  }, [location.pathname]);

  const loadBooks = async () => {
    setLoading(true);
    try {
      const data = await fetchBooks();
      setBooks(data);
      setError("");
    } catch (err) {
      console.error("Error fetching books:", err);
      setError("Gagal terhubung ke server: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadStatusOptions = async () => {
    try {
      const options = await fetchStatusOptions();
      setStatusOptions(options);
    } catch (err) {
      console.error("Error fetching status options:", err);
      // Try to get from sessionStorage if API fails
      const storedStatusOptions = sessionStorage.getItem("statusOptions");
      if (storedStatusOptions) {
        setStatusOptions(JSON.parse(storedStatusOptions));
      }
    }
  };

  const handleBookAdded = (newBookWithStatus) => {
    const updatedBooks = [...books, newBookWithStatus];
    setBooks(updatedBooks);
    sessionStorage.setItem("booksData", JSON.stringify(updatedBooks));
  };

  const handleBookUpdated = (updatedBookWithStatus) => {
    const updatedBooks = books.map((book) =>
      book.id === updatedBookWithStatus.id ? updatedBookWithStatus : book
    );
    setBooks(updatedBooks);
    sessionStorage.setItem("booksData", JSON.stringify(updatedBooks));
    setEditBook(null);
  };

  const handleBookDeleted = (bukuId) => {
    const filteredBooks = books.filter((book) => book.id !== bukuId);
    setBooks(filteredBooks);
    sessionStorage.setItem("booksData", JSON.stringify(filteredBooks));
  };

  const handleError = (errorMessage) => {
    setError(errorMessage);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation Bar */}
      <Navbar/>

      {/* Main Content */}
      <div className="container mx-auto p-6 flex-grow">
        <h2 className="text-3xl font-bold text-blue-600 mb-6">
          Book Collection
        </h2>

        {/* Error Message */}
        {error && <ErrorMessage message={error} />}

        {/* Form to Add or Edit Book */}
        <BookForm
          editBook={editBook}
          setEditBook={setEditBook}
          statusOptions={statusOptions}
          onBookAdded={handleBookAdded}
          onBookUpdated={handleBookUpdated}
          onError={handleError}
        />

        {/* Books List */}
        {loading && !editBook ? (
          <LoadingSpinner />
        ) : (
          <BookList
            books={books}
            statusOptions={statusOptions}
            onEditBook={setEditBook}
            onDeleteBook={handleBookDeleted}
            onError={handleError}
          />
        )}
      </div>
    </div>
  );
};

export default BukuPage;
