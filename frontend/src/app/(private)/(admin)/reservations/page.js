'use client';
import { useEffect, useState } from 'react';
import { api } from '@/services/api';
import { useRouter } from 'next/navigation';
import ReservationsAdmin from '@/components/ReservationsAdmin';

export default function ReservationsPage() {
  const [reservations, setReservations] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchReservations = async () => {
      const token = localStorage.getItem('token');
      if (!token) return router.replace('/login');

      try {
        const res = await api.get('/reservations', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setReservations(res.data);
      } catch (err) {
        console.error('Erro ao buscar reservas:', err);
        router.replace('/login');
      }
    };

    fetchReservations();
  }, [router]);

  if (!reservations) return null;

  return <ReservationsAdmin initialReservations={reservations} />;
}