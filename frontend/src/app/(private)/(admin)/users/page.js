'use client';
import { useEffect, useState } from 'react';
import { api } from '@/services/api';
import { useRouter } from 'next/navigation';
import UsersAdmin from '@/components/UsersAdmin';

export default function UsersPage() {
  const [users, setUsers] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem('token');
      if (!token) return router.replace('/login');

      try {
        const res = await api.get('/users', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUsers(res.data);
      } catch (err) {
        console.error('Erro ao buscar os usuários:', err);
        router.replace('/login');
      }
    };

    fetchUsers();
  }, [router]);

  if (!users) return null;

  return <UsersAdmin initialUsers={users} />;
}