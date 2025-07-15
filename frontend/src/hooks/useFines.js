import { useState, useCallback } from 'react';
import { api } from "@/services/api";

export function useFines() {
    const [fines, setFines] = useState([]);

    const fetchFines = useCallback(async (id) => {
        try {
            const res = await api.get(`/loans/${id}/fines`);
            setFines(res.data);
        } catch (err) {
            console.error("Erro ao atualizar os empréstimos:", err);
        }
    }, []);

    return { fines, fetchFines };
}