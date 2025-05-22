'use client';

import React, { useEffect, useState } from 'react';
import {User} from "../../../types/user";
import {fetchOwnProfile} from "../../../lib/userData";
import Profile from "./profile";
import {ProfileSkeleton} from "../../../ui/skeleton/skeleton";



export default function MyProfile() {
    const [profile, setProfile] = useState<User | null>(null);

    useEffect(() => {
        fetchOwnProfile().then(setProfile);
    }, []);

    if (!profile) return <ProfileSkeleton />;

    return (
        <div>
            {profile && <Profile profile={profile} />}
        </div>
    );
}
