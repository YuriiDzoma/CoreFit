'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';

type User = {
    id: string;
    username: string;
    avatar_url: string;
    created_at: string;
};

export default function UserList() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const supabase = createClient();

        const fetchUsers = async () => {

            const { data, error } = await supabase
                .from('profiles')
                .select('id, username, avatar_url, created_at');
            console.log(data)
            if (!error && data) {
                setUsers(data);
            }
            setLoading(false);
        };

        fetchUsers();
    }, []);

    if (loading) return <p>Завантаження...</p>;

    return (
        <ul>
            {users.map((user) => (
                <li key={user.id}>
                    <strong>{user.username}</strong><br />
                    <small>{new Date(user.created_at).toLocaleString()}</small>
                </li>
            ))}
        </ul>
    );
}
