'use client';
import { useEffect, useState } from 'react';
import { api } from '@/services/api';
import { useRouter } from 'next/navigation';
import BooksAdmin from '@/components/BooksAdmin';

export default function BooksPage() {
  const [books, setBooks] = useState(null);
  const router = useRouter();

  const fetchBooks = async () => {
    const token = localStorage.getItem('token');
    if (!token) return router.replace('/login');

    try {
      const res = await api.get('/books');
      setBooks(res.data);
    } catch (err) {
      console.error('Erro ao buscar livros:', err);
      router.replace('/login');
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  if (!books) return null;

  return <BooksAdmin books={books} fetchBooks={fetchBooks} />;
}