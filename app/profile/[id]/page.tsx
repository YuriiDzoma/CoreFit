'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { fetchUserProfileById } from '@/lib/userData';
import {User} from "../../../types/user";
import Profile from "../components/profile";

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
            <Profile profile={profile} />
        </div>
    );
}
