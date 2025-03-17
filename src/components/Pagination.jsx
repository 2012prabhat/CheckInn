import React from "react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center space-x-2">
      <button
        className="px-3 py-2 bg-gray-700 text-white rounded disabled:opacity-50"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Previous
      </button>

      {Array.from({ length: totalPages }, (_, index) => (
        <button
          key={index}
          onClick={() => onPageChange(index + 1)}
          className={`px-3 py-2 rounded ${
            currentPage === index + 1 ? "bg-blue-500 text-white" : "bg-gray-700 text-white"
          }`}
        >
          {index + 1}
        </button>
      ))}

      <button
        className="px-3 py-2 bg-gray-700 text-white rounded disabled:opacity-50"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
