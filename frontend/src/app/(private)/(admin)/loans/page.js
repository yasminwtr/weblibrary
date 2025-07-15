'use client';
import { useEffect, useState } from 'react';
import { api } from '@/services/api';
import { useRouter } from 'next/navigation';
import LoansAdmin from '@/components/LoansAdmin';

export default function LoansPage() {
  const [loans, setLoans] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchLoans = async () => {
      const token = localStorage.getItem('token');
      if (!token) return router.replace('/login');

      try {
        const res = await api.get('/loans', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setLoans(res.data);
      } catch (err) {
        console.error('Erro ao buscar empréstimos:', err);
        router.replace('/login');
      }
    };

    fetchLoans();
  }, [router]);

  if (!loans) return null;

  return <LoansAdmin initialLoans={loans} />;
}