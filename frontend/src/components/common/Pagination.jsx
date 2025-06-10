import React from "react";
import "../../style/pagination.css";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const goToPrevious = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const goToNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  return (
    <div className="pagination">
      <button onClick={goToPrevious} disabled={currentPage === 1}>
        &lt;
      </button>
      <span className="current-page">{currentPage}</span>
      <button onClick={goToNext} disabled={currentPage === totalPages}>
        &gt;
      </button>
    </div>
  );
};

export default Pagination;
