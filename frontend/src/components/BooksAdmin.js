'use client'
import { useCallback, useState } from "react";
import { Button, DropdownTrigger, Dropdown, DropdownMenu, DropdownItem, User, useDisclosure } from "@heroui/react";
import TableFunctions from "./TableFunctions";
import { PointsIcon } from "@/components/Icons";
import BookModal from "@/components/BookModal";
import ModalInfo from "@/components/ModalInfo";
import { api, baseURL } from "@/services/api";
import { useCategories } from "@/hooks/useCategories";

export const columns = [
    { name: "ID", uid: "id" },
    { name: "LIVRO", uid: "book" },
    { name: "EDITORA", uid: "publisher" },
    { name: "ANO", uid: "year" },
    { name: "AÇÕES", uid: "actions" },
];

export default function BooksAdmin({ books, fetchBooks }) {
    const [book, setBook] = useState(null);
    const { categories, fetchCategories } = useCategories();
    const bookModal = useDisclosure();
    const deleteBookModal = useDisclosure();

    const deleteBook = async () => {
        if (!confirm("Tem certeza que deseja deletar este livro?")) return;

        try {
            await api.delete(`/books/${book.id}`);
            alert("Livro deletado com sucesso.");
            deleteBookModal.onOpenChange(false);
            fetchBooks();

        } catch (err) {
            alert(err.response?.data?.error || "Erro ao deletar.");
        }
    };

    const handleOpenBookModal = async (data) => {
        setBook(data);
        await new Promise((resolve) => setTimeout(resolve, 0));
        await fetchCategories();
        bookModal.onOpen();
    };

    const handleOpenDeleteBookModal = async (data) => {
        setBook(data);
        await new Promise((resolve) => setTimeout(resolve, 0));
        await fetchCategories();
        deleteBookModal.onOpen();
    };

    const renderCell = useCallback((book, columnKey) => {
        const cellValue = book[columnKey];

        switch (columnKey) {
            case "book":
                return (
                    <User
                        avatarProps={{
                            src: `${baseURL}${book.image}`,
                            className: "rounded-sm"
                        }}
                        description={book.author}
                        name={book.title}
                    >
                    </User>
                );
            case "actions":
                return (
                    <div className="relative flex justify-center items-center gap-2">
                        <Dropdown>
                            <DropdownTrigger>
                                <Button isIconOnly size="sm" variant="light">
                                    <PointsIcon />
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu>
                                <DropdownItem key="edit" onPress={() => handleOpenBookModal(book)}>Editar</DropdownItem>
                                <DropdownItem key="delete" onPress={() => handleOpenDeleteBookModal(book)}>Excluir</DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                );
            default:
                return cellValue;
        }
    }, []);

    return (
        <div className="page">
            <h1 className="text-lg font-semibold mb-4">Livros</h1>

            <TableFunctions
                items={books.books}
                columns={columns}
                renderCell={renderCell}
                addButton={true}
                handleOpenModal={handleOpenBookModal}
            >
            </TableFunctions>

            <BookModal
                book={book}
                isOpen={bookModal.isOpen}
                onOpenChange={bookModal.onOpenChange}
                fetchBooks={fetchBooks}
                categories={categories}
            />

            <ModalInfo
                isOpen={deleteBookModal.isOpen}
                onOpenChange={deleteBookModal.onOpenChange}
                modalTitle="Deletar livro"
                modalText="Prosseguir com a exclusão do livro?"
                actionButtonText="Sim"
                actionButtonFunction={deleteBook}
            />
        </div>
    );
}
