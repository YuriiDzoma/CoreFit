'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { fetchUserProfileById } from '@/lib/userData';
import {User} from "../../../types/user";

export default function OtherUserProfilePage() {
    const { id } = useParams<{ id: string }>();
    const [profile, setProfile] = useState<User | null>(null);

    useEffect(() => {
        if (id) {
            fetchUserProfileById(id).then(setProfile);
        }
    }, [id]);

    if (!profile) return <p>Loading or not found...</p>;

    return (
        <div>
            <h2>Профіль користувача</h2>
            <img src={profile.avatar_url} alt="avatar" width={100} />
            <p>{profile.username}</p>
            <p>{new Date(profile.created_at).toLocaleString()}</p>
        </div>
    );
}
