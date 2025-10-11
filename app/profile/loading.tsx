import styles from "./components/profiles.module.scss";
import { ProfileSkeleton, ProfileFriendsSkeleton } from "@/ui/skeleton/skeleton";

export default function Loading() {
    return (
        <div className={styles.container}>
            <div style={{ marginBottom: 24 }}>
                <ProfileSkeleton />
            </div>
            <ProfileFriendsSkeleton />
        </div>
    );
}
