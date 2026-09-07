function Pagination({
    currentPage,
    totalPages,
    onPageChange,
}) {

    if (totalPages <= 1) {
        return null;
    }

    return (

        <div className="flex items-center justify-center gap-2 mt-10">

            {/* Previous */}

            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="
                    px-4 py-2
                    rounded-lg
                    border border-gray-200
                    bg-white
                    text-sm font-medium
                    text-gray-600
                    hover:bg-gray-50
                    disabled:opacity-40
                    disabled:cursor-not-allowed
                    transition
                "
            >
                Previous
            </button>


            {/* Page Numbers */}

            {Array.from(
                { length: totalPages },
                (_, index) => index + 1
            ).map((page) => (

                <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={`
                        w-10 h-10
                        rounded-lg
                        text-sm font-medium
                        transition
                        ${
                            currentPage === page
                                ? "bg-blue-600 text-white shadow-sm"
                                : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                        }
                    `}
                >
                    {page}
                </button>

            ))}


            {/* Next */}

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="
                    px-4 py-2
                    rounded-lg
                    border border-gray-200
                    bg-white
                    text-sm font-medium
                    text-gray-600
                    hover:bg-gray-50
                    disabled:opacity-40
                    disabled:cursor-not-allowed
                    transition
                "
            >
                Next
            </button>

        </div>

    );

}

export default Pagination;