'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { fetchUserProfileById } from '@/lib/userData';
import {ProfileType} from "../../../types/user";
import Profile from "../components/profile";
import {ProfileSkeleton} from "../../../ui/skeleton/skeleton";
import Friends from "../components/Friends";

export default function OtherUserProfilePage() {
    const { id } = useParams<{ id: string }>();
    const [profile, setProfile] = useState<ProfileType | null>(null);

    useEffect(() => {
        if (id) {
            fetchUserProfileById(id).then(setProfile);
        }
    }, [id]);

    if (!profile) return <ProfileSkeleton />;

    return (
        <div>
            {profile && <Profile profile={profile}/>}
            {id && (
                <Friends id={id} />
            )}
        </div>
    );
}
