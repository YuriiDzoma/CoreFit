import { notFound } from "next/navigation";
import { Suspense } from "react";
import styles from "./components/profiles.module.scss";

import ProfileClient from "./components/Profile.client";
import FriendsServer from "./components/Friends.server";
import TrainerClientsServer from "./components/TrainerClients.server";
import UserWall from "./components/UserWall";
import { getOwnProfile } from "@/lib/data/user";
import { ProfileFriendsSkeleton, ProfileTrainerSkeleton } from "@/ui/skeleton/skeleton";

export default async function Page() {
    const profile = await getOwnProfile();
    if (!profile) notFound();

    return (
        <div className={styles.container}>
            <ProfileClient profile={profile} />
            <Suspense fallback={<ProfileFriendsSkeleton />}>
                <FriendsServer id={profile.id} />
            </Suspense>
            <Suspense fallback={<ProfileTrainerSkeleton />}>
                <TrainerClientsServer id={profile.id} isTrainer={profile.is_trainer === true} />
            </Suspense>
            <UserWall userId={profile.id} />
        </div>
    );
}
