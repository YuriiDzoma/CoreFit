'use client';

import React, { useEffect, useState } from 'react';
import {ProfileType} from "../../../types/user";
import {fetchOwnProfile} from "../../../lib/userData";
import Profile from "./profile";
import {ProfileSkeleton} from "../../../ui/skeleton/skeleton";
import Friends from "./Friends";



export default function MyProfile() {
    const [profile, setProfile] = useState<ProfileType | null>(null);

    console.log(profile)

    useEffect(() => {
        fetchOwnProfile().then(setProfile);
    }, []);

    if (!profile) return <ProfileSkeleton />;

    return (
        <div>
            {profile && <Profile profile={profile} />}
            {profile && <Friends id={profile.id}/>}
        </div>
    );
}
