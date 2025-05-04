// components/BookCard.jsx
import React from "react";

const BookCard = ({ book, statusOptions, onEdit, onDelete, isDeleting }) => {
  // Find status name from either the book object or statusOptions array
  const statusName =
    book.statusBuku?.nama ||
    statusOptions.find((s) => s.id === book.statusBukuId)?.nama ||
    "Unknown";

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="font-semibold text-lg mb-3">{book.judul}</h3>
      <div className="space-y-2">
        <p className="text-gray-700">
          <span className="font-medium">Judul:</span> {book.judul}
        </p>
        <p className="text-gray-700">
          <span className="font-medium">Pengarang:</span> {book.pengarang}
        </p>
        <p className="text-gray-700">
          <span className="font-medium">Penerbit:</span> {book.penerbit}
        </p>
        <p className="text-gray-700">
          <span className="font-medium">Tahun Terbit:</span> {book.tahunTerbit}
        </p>
        <p className="text-gray-700">
          <span className="font-medium">Status:</span> {statusName}
        </p>
      </div>

      <div className="mt-4 flex justify-between">
        <button
          onClick={onEdit}
          className="text-blue-500 hover:text-blue-600"
          disabled={isDeleting}
        >
          Edit
        </button>
        <button
          onClick={onDelete}
          className="text-red-500 hover:text-red-600"
          disabled={isDeleting}
        >
          {isDeleting ? "Deleting..." : "Delete"}
        </button>
      </div>
    </div>
  );
};

export default BookCard;
