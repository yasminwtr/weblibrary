'use client';
import { Button, Breadcrumbs, BreadcrumbItem, Divider, Chip } from "@heroui/react";
import BookReviews from "@/components/BookReviews";
import { useUser } from '@/contexts/UserContext';
import { api, baseURL } from "@/services/api";

export default function BookInfo({ book, availability, breadcrumbContext }) {
    const { id, title, author, publisher, year, synopsis, image } = book;
    const isAvaliable = availability.availableCopies > 0;
    const { category, search } = breadcrumbContext || {};
    const { user } = useUser();
    const intermediateCrumb = category ? category : search ? `"${search}"` : null;

    const handleReservation = async () => {
        const availabilityRes = await api.get(`/books/${book.id}/availability`);
        const { availableCopies } = availabilityRes.data;

        if (availableCopies < 1) {
            alert('Livro indisponível, todos os exemplares estão reservados.');
            return;
        }

        try {
            await api.post('/reservations', { bookId: id });
            alert('Reserva realizada com sucesso.');

        } catch (err) {
            alert(err?.response?.data?.error)
        }
    };

    return (
        <div className="page">
            <Breadcrumbs>
                <BreadcrumbItem href="/booklist">Inicial</BreadcrumbItem>
                {intermediateCrumb && (
                    <BreadcrumbItem href={`/booklist?${category ? `category=${category}` : `search=${search}`}`}>
                        {intermediateCrumb}
                    </BreadcrumbItem>
                )}
                <BreadcrumbItem>{title}</BreadcrumbItem>
            </Breadcrumbs>

            <div className="book-info-container">
                <div
                    className="book-info-image"
                    style={{
                        backgroundImage: book.image
                            ? `url(${baseURL}${book.image})`
                            : 'none',
                        backgroundColor: book.image ? 'transparent' : '#ddd',
                    }}
                />

                <div className="book-info">
                    <h1 className="text-2xl font-bold mb-1">{title}</h1>

                    <span className="block mb-3">{author}</span>

                    <div className="flex my-3 text-sm">
                        {isAvaliable ?
                            <Chip color="success" size="sm" variant="flat">Disponível</Chip>
                            :
                            <>
                                <Chip color="warning" size="sm" variant="flat">Indisponível</Chip>

                                {/* <div className="flex items-center ml-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 mr-1">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
                                    </svg>

                                    <span>Receber notificação quando disponível</span>
                                </div> */}
                            </>
                        }
                    </div>

                    <span className="block font-semibold text-sm mt-1">Editora: <span className="font-normal">{publisher}</span></span>
                    <span className="block font-semibold text-sm mt-1 mb-4">Ano: <span className="font-normal">{year}</span></span>

                    {user.userType === 'reader' && (
                        <Button color={isAvaliable ? "primary" : "default"} disabled={!isAvaliable} onPress={handleReservation}>Reservar</Button>
                    )}

                    <span className="block font-semibold text-sm mt-8">Sinopse: <span className="font-normal">{synopsis}</span></span>
                </div>
            </div>

            <Divider className="my-8" />

            <BookReviews bookId={id} />
        </div>
    );
}
