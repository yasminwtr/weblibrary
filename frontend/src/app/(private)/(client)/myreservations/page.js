'use client';
import { useEffect, useState } from 'react';
import { api } from '@/services/api';
import { useRouter } from 'next/navigation';
import ReservationsInfo from '@/components/ReservationsInfo';

export default function UserReservationsPage() {
  const [userReservationsLoans, setUserReservationsLoans] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) return router.replace('/login');

      try {
        const res = await api.get('/users/reservations-and-loans', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserReservationsLoans(res.data);
      } catch (err) {
        console.error('Erro ao buscar as reservas:', err);
        router.replace('/login');
      }
    };

    fetchData();
  }, [router]);

  if (!userReservationsLoans) return null;

  return <ReservationsInfo userReservationsLoans={userReservationsLoans} />;
}