import { notFound } from "next/navigation";
import { Suspense } from "react";
import styles from "../components/profiles.module.scss";
import ProfileClient from "../components/Profile.client";
import FriendsServer from "../components/Friends.server";
import UserWall from "../components/UserWall";
import { getProfileById } from "@/lib/data/user";
import { ProfileFriendsSkeleton } from "@/ui/skeleton/skeleton";

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ id: string }> };

export default async function OtherProfile({ params }: PageProps) {
    const { id } = await params;
    const profile = await getProfileById(id);

    if (!profile) notFound();

    return (
        <div className={styles.container}>
            <ProfileClient profile={profile} />
            <Suspense fallback={<ProfileFriendsSkeleton />}>
                <FriendsServer id={profile.id} />
            </Suspense>
            <UserWall userId={profile.id} />
        </div>
    );
}