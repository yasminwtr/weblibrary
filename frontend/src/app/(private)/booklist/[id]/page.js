import { notFound } from 'next/navigation'
import { api } from "@/services/api";
import BookInfo from "@/components/BookInfo";

async function fetchBook(id) {
    try {
        const res = await api.get(`/books/${id}`);
        return res.data;
    } catch (err) {
        console.error('Erro ao buscar o livro:', err);
        return undefined;
    }
}

async function fetchBookAvailability(id) {
    try {
        const res = await api.get(`/books/${id}/availability`);
        return res.data;
    } catch (err) {
        console.error('Erro ao buscar a disponibilidade:', err);
        return undefined;
    }
}

export default async function BookPage({ params }) {
    const { id } = await params;
    const [book, availability] = await Promise.all([
        fetchBook(id),
        fetchBookAvailability(id),
    ]);

    if (!book || !availability) {
        notFound();
    }

    return <BookInfo book={book} availability={availability}/>;
}