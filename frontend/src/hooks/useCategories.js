import { useState, useCallback } from 'react';
import { api } from "@/services/api";

export function useCategories() {
    const [categories, setCategories] = useState([]);

    const fetchCategories = useCallback(async () => {
        try {
            const res = await api.get(`/categories`);
            setCategories(res.data);

        } catch (err) {
            console.error("Erro em categorias:", err);
        }
    }, []);

    return { categories, fetchCategories };
}