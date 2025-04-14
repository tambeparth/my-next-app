'use client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

const Logout = () => {
    const router = useRouter();

    const { logout } = useAuth();

    useEffect(() => {
        logout();
        router.push('/');
    }, [logout, router]);

    return null;
};

export default Logout;