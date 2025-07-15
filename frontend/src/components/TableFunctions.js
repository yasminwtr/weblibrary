'use client'
import { useState, useMemo, useCallback } from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Input, Pagination, Button } from "@heroui/react";
import { SearchIcon, PlusIcon } from "@/components/Icons";

export default function TableFunctions({ columns, items, renderCell, addButton, handleOpenModal }) {
    const [filterValue, setFilterValue] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [sortDescriptor, setSortDescriptor] = useState({
        column: "age",
        direction: "ascending",
    });
    const [page, setPage] = useState(1);

    const hasSearchFilter = Boolean(filterValue);

    const filteredItems = useMemo(() => {
        let filteredItems = [...items];

        if (hasSearchFilter) {
            filteredItems = filteredItems.filter((user) =>
                user.userName.toLowerCase().includes(filterValue.toLowerCase()),
            );
        }
        if (statusFilter !== "all" && Array.from(statusFilter).length !== 2) {
            filteredItems = filteredItems.filter((user) =>
                Array.from(statusFilter).includes(user.status),
            );
        }

        return filteredItems;
    }, [items, filterValue, statusFilter]);

    const pages = Math.ceil(filteredItems.length / rowsPerPage);

    const paginatedItems = useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;

        return filteredItems.slice(start, end);
    }, [page, filteredItems, rowsPerPage]);

    const sortedItems = useMemo(() => {
        return [...paginatedItems].sort((a, b) => {
            const first = a[sortDescriptor.column];
            const second = b[sortDescriptor.column];
            const cmp = first < second ? -1 : first > second ? 1 : 0;

            return sortDescriptor.direction === "descending" ? -cmp : cmp;
        });
    }, [sortDescriptor, paginatedItems]);

    const onRowsPerPageChange = useCallback((e) => {
        setRowsPerPage(Number(e.target.value));
        setPage(1);
    }, []);

    const onSearchChange = useCallback((value) => {
        if (value) {
            setFilterValue(value);
            setPage(1);
        } else {
            setFilterValue("");
        }
    }, []);

    const onClear = useCallback(() => {
        setFilterValue("");
        setPage(1);
    }, []);

    const topContent = useMemo(() => {
        return (
            <div className="flex flex-col gap-4">
                <div className="flex justify-end gap-3 items-end mb-6"> 
                    {addButton && (
                        <Button color="primary" endContent={<PlusIcon />} onPress={() => handleOpenModal(null)}>
                            Adicionar
                        </Button>
                    )}
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-default-400 text-small">Total de registros: {sortedItems.length}</span>
                    <label className="flex items-center text-default-400 text-small">
                        Registros por página:
                        <select
                            className="bg-transparent outline-none text-default-400 text-small"
                            onChange={onRowsPerPageChange}
                        >
                            <option value="5">5</option>
                            <option value="10">10</option>
                            <option value="15">15</option>
                        </select>
                    </label>
                </div>
            </div>
        );
    }, [
        filterValue,
        statusFilter,
        onRowsPerPageChange,
        sortedItems.length,
        onSearchChange,
        hasSearchFilter,
    ]);

    const bottomContent = useMemo(() => {
        return (
            <div className="py-2 px-2 flex items-center justify-center">
                <Pagination
                    isCompact
                    showControls
                    color="primary"
                    page={page}
                    total={pages}
                    onChange={setPage}
                    boundaries={2}
                />
            </div>
        );
    }, [
        paginatedItems.length,
        page,
        pages,
        hasSearchFilter
    ]);

    return (
        <Table
            bottomContent={bottomContent}
            bottomContentPlacement="outside"
            selectionMode="none"
            sortDescriptor={sortDescriptor}
            topContent={topContent}
            topContentPlacement="outside"
            onSortChange={setSortDescriptor}
        >
            <TableHeader columns={columns}>
                {(column) => (
                    <TableColumn
                        key={column.uid}
                        align={column.uid === "actions" ? "center" : "start"}
                        allowsSorting={column.sortable}
                    >
                        {column.name}
                    </TableColumn>
                )}
            </TableHeader>
            <TableBody emptyContent={"Nenhum registro encontrado"} items={sortedItems}>
                {(item) => (
                    <TableRow key={item.id}>
                        {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
}
