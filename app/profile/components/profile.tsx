'use client';

import React, { useEffect, useState } from 'react';
import {User} from "../../../types/user";
import {fetchOwnProfile} from "../../../lib/userData";



export default function Profile() {
    const [profile, setProfile] = useState<User | null>(null);

    useEffect(() => {
        fetchOwnProfile().then(setProfile);
    }, []);

    if (!profile) return <p>Loading or not found...</p>;

    return (
        <div>
            <h2>Мій профіль</h2>
            <img src={profile.avatar_url} alt="avatar" width={100} />
            <p>{profile.username}</p>
            <p>{new Date(profile.created_at).toLocaleString()}</p>
        </div>
    );
}
