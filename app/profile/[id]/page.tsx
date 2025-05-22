'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { fetchUserProfileById } from '@/lib/userData';
import {ProfileType} from "../../../types/user";
import Profile from "../components/profile";

export default function OtherUserProfilePage() {
    const { id } = useParams<{ id: string }>();
    const [profile, setProfile] = useState<ProfileType | null>(null);

    useEffect(() => {
        if (id) {
            fetchUserProfileById(id).then(setProfile);
        }
    }, [id]);

    if (!profile) return <p>Loading or not found...</p>;

    return (
        <div>
            {profile && <Profile profile={profile}/>}

        </div>
    );
}
