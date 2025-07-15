export const dynamic = 'force-dynamic';
import { notFound } from 'next/navigation'
import { api } from "@/services/api";
import BookList from "@/components/Booklist";

async function fetchBookList(searchParams) {
    try {
        const res = await api.get(`/books`, { params: searchParams });
        return res.data;
    } catch (err) {
        console.error('Erro ao buscar os livros:', err);
        return undefined;
    }
}

export default async function BookListPage({ searchParams }) {
    const books = await fetchBookList(searchParams);

    if (!books) {
        notFound();
    }

    return <BookList booksValues={books}/>;
}