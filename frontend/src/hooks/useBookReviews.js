import { useEffect, useState, useCallback } from 'react';
import { api } from '@/services/api';

export function useBookReviews(id) {
    const [bookReviews, setBookReviews] = useState({
        reviews: [],
        totalBookReviews: 0,
        totalPages: 1,
    });
    const [loading, setLoading] = useState(true);

    const fetchBookReviews = useCallback(async () => {
        if (!id) return;
        setLoading(true)
        try {
            const res = await api.get(`/bookreviews/${id}`)
            setBookReviews(res.data);
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }, [id])

    useEffect(() => {
        fetchBookReviews()
    }, [fetchBookReviews])

    return { fetchBookReviews, bookReviews, loading };
}