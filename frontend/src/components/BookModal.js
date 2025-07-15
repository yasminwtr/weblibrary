'use client'
import { useState, useEffect, useRef } from "react";
import { Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Form, Input, Textarea, Select, SelectItem } from "@heroui/react";
import { api, baseURL } from "@/services/api";

const formInitialValues = {
    title: "",
    author: "",
    publisher: "",
    year: "",
    synopsis: "",
    totalCopies: "",
    image: null,
    categories: []
}

export default function BookModal({ isOpen, onOpenChange, book, fetchBooks, categories }) {
    const [errors, setErrors] = useState({});
    const fileInputRef = useRef(null);
    const [formValues, setFormValues] = useState(formInitialValues);
    const [imagePreview, setImagePreview] = useState(null);

    useEffect(() => {
        if (book) {
            setFormValues({
                title: book.title,
                author: book.author,
                publisher: book.publisher,
                year: book.year,
                synopsis: book.synopsis,
                totalCopies: book.totalCopies,
                image: book.image,
                categories: book.categories
            });

            if (book.image) {
                setImagePreview(`${baseURL}${book.image}`);
            } else {
                setImagePreview(null);
            }

        } else {
            setFormValues(formInitialValues);
            setImagePreview(null);
        }
    }, [book]);

    useEffect(() => {
        return () => {
            if (imagePreview) {
                URL.revokeObjectURL(imagePreview);
            }
        }
    }, [imagePreview]);

    const onSubmit = async (e) => {
        e.preventDefault();
        const newErrors = {};

        if (!formValues.title) newErrors.title = "O título é obrigatório.";
        if (!formValues.author) newErrors.author = "O autor é obrigatório.";
        if (!formValues.publisher) newErrors.publisher = "A data de publicação é obrigatória.";
        if (!formValues.year) newErrors.year = "O ano é obrigatório.";
        if (!formValues.synopsis) newErrors.synopsis = "A sinopse é obrigatória.";
        if (!formValues.totalCopies) newErrors.totalCopies = "A quantidade de cópias é obrigatória.";
        if (!formValues.image) newErrors.image = "A imagem do livro é obrigatória.";
        if (!formValues.categories.length) newErrors.categories = "Selecione pelo menos uma categoria.";
        if (!formValues.image || (typeof formValues.image === 'string' && !book)) newErrors.image = "A capa do livro é obrigatória.";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setErrors({});
        const formData = new FormData();
        formData.append("title", formValues.title);
        formData.append("author", formValues.author);
        formData.append("publisher", formValues.publisher);
        formData.append("year", String(formValues.year));
        formData.append("synopsis", formValues.synopsis);
        formData.append("totalCopies", String(formValues.totalCopies));
        formData.append("categories", JSON.stringify(formValues.categories));
        formData.append("image", formValues.image);

        if (formValues.image instanceof File) {
            formData.append("image", formValues.image);
        }

        try {
            if (book) {
                await api.patch(`/books/${book.id}`, formData);
                alert("Livro atualizado com sucesso.");

            } else {
                await api.post("/books", formData);
                alert("Livro cadastrado com sucesso.");
            }

            setFormValues(formInitialValues);
            setImagePreview(null);
            onOpenChange(false);
            fetchBooks();

        } catch (err) {
            alert(err.response?.data?.error || "Erro ao salvar.");
        }
    };

    const deleteBook = async (bookId) => {
        if (!confirm("Tem certeza que deseja deletar este livro?")) return;

        try {
            await api.delete(`/books/${bookId}`);
            alert("Livro deletado com sucesso.");
            setFormValues(formInitialValues);
            setImagePreview(null);
            onOpenChange(false);
            fetchBooks();

        } catch (err) {
            alert(err.response?.data?.error || "Erro ao deletar.");
        }
    };

    return (
        <Modal
            isDismissable={false}
            isKeyboardDismissDisabled={true}
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            scrollBehavior="outside"
            className="modal"
            size="2xl"
        >
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">{book ? 'Editar livro' : 'Adicionar livro'}</ModalHeader>

                        <ModalBody>
                            <Form
                                className="w-full max-w-xs flex flex-col gap-6 mb-4"
                                style={{ minWidth: '100%' }}
                                validationErrors={errors}
                                onSubmit={onSubmit}
                                id="book-form"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-medium text-gray-700">Capa do livro</label>

                                        <Button
                                            htmlFor="file-upload"
                                            color="primary"
                                            onPress={() => fileInputRef.current?.click()}
                                        >
                                            {formValues.image ? "Imagem selecionada" : "Escolher imagem"}
                                        </Button>

                                        <input
                                            ref={fileInputRef}
                                            id="file-upload"
                                            name="image"
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0] || null;
                                                setFormValues((f) => ({ ...f, image: file }));
                                                if (file) {
                                                    setImagePreview(URL.createObjectURL(file));
                                                } else {
                                                    setImagePreview(null);
                                                }
                                            }}
                                        />

                                        {formValues.image && (
                                            <span className="text-xs text-gray-500">{formValues.image.name}</span>
                                        )}

                                        {errors.image && (
                                            <span className="text-tiny text-danger">{errors.image}</span>
                                        )}
                                    </div>

                                    {imagePreview && (
                                        <img
                                            src={imagePreview}
                                            alt="Preview da imagem"
                                            style={{
                                                width: 100,
                                                height: 100,
                                                objectFit: "cover",
                                                borderRadius: 8,
                                            }}
                                        />
                                    )}
                                </div>

                                <div className="w-full flex gap-4">
                                    <Input
                                        label="Título do livro"
                                        labelPlacement="outside"
                                        name="title"
                                        placeholder="Título"
                                        value={formValues.title}
                                        onChange={(e) => setFormValues((f) => ({ ...f, title: e.target.value }))}
                                    />

                                    <Input
                                        label="Autor do livro"
                                        labelPlacement="outside"
                                        name="author"
                                        placeholder="Autor"
                                        value={formValues.author}
                                        onChange={(e) => setFormValues((f) => ({ ...f, author: e.target.value }))}
                                    />
                                </div>

                                <div className="w-full flex gap-4">
                                    <Input
                                        label="Editora"
                                        labelPlacement="outside"
                                        name="publisher"
                                        placeholder="Editora"
                                        value={formValues.publisher}
                                        onChange={(e) => setFormValues((f) => ({ ...f, publisher: e.target.value }))}
                                    />

                                    <Input
                                        label="Ano de publicação"
                                        labelPlacement="outside"
                                        name="year"
                                        placeholder="Ano"
                                        type="number"
                                        value={formValues.year}
                                        onChange={(e) => setFormValues((f) => ({ ...f, year: e.target.value }))}
                                    />
                                </div>

                                <Select
                                    label="Categoria"
                                    labelPlacement="outside"
                                    placeholder="Selecione uma categoria"
                                    name="categories"
                                    selectionMode="multiple"
                                    selectedKeys={new Set(formValues.categories.map(String))}
                                    onSelectionChange={(keys) => {
                                        setFormValues((f) => ({
                                            ...f,
                                            categories: Array.from(keys).map(Number),
                                        }));
                                    }}
                                >
                                    {categories.map((category) => (
                                        <SelectItem key={String(category.id)} value={String(category.id)}>{category.name}</SelectItem>
                                    ))}
                                </Select>

                                <Input
                                    label="Quantidade de cópias"
                                    labelPlacement="outside"
                                    name="totalCopies"
                                    placeholder="Ex: 5"
                                    type="number"
                                    value={formValues.totalCopies}
                                    onChange={(e) => setFormValues((f) => ({ ...f, totalCopies: e.target.value }))}
                                />

                                <Textarea
                                    name="synopsis"
                                    maxRows={3}
                                    label="Sinopse"
                                    labelPlacement="outside"
                                    placeholder="Breve descrição do livro"
                                    value={formValues.synopsis}
                                    onChange={(e) => setFormValues((f) => ({ ...f, synopsis: e.target.value }))}
                                />
                            </Form>
                        </ModalBody>

                        <ModalFooter>
                            <Button color="default" variant="light" onPress={onClose}>
                                Cancelar
                            </Button>

                            {book && (
                                <Button color="danger" onPress={() => deleteBook(book.id)}>
                                    Excluir
                                </Button>
                            )}

                            <Button color="primary" type="submit" form="book-form">
                                Salvar
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}
