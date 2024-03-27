
const Pagination = ({ totalPages, currentPage, handlePageChange }) => {
    return (
        <div className="flex items-center justify-center pt-20">
            {Array.from({ length: totalPages }, (_, index) => (
                <button
                    key={index + 1}
                    className={`btn ${currentPage === index ? 'btn-active' : ''}`}
                    onClick={() => handlePageChange(index + 1)}
                >
                    {index + 1}
                </button>
            ))}
        </div>
    );
};

export default Pagination;