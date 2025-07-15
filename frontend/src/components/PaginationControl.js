'use client'
import { Pagination, Button } from "@heroui/react";
import { ChevronIcon } from "@/components/Icons";

export const PaginationControl = ({ currentPage, setCurrentPage, totalPages, boundaries = 2 }) => {
    return (
        <>
            <Button
                onPress={() => setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev))}
                className="pagination-button"
                disableAnimation={true}
            >
                <ChevronIcon />
            </Button>

            <Pagination variant='light' page={currentPage} total={totalPages} onChange={setCurrentPage} boundaries={boundaries} />

            <Button
                onPress={() => setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev))}
                className="pagination-button"
                disableAnimation={true}
            >
                <ChevronIcon className="rotate-180" />
            </Button>
        </>
    );
};