import styles from "../components/profiles.module.scss";
import { ProfileSkeleton, ProfileFriendsSkeleton, ProfileWallSkeleton } from "@/ui/skeleton/skeleton";

// Own `loading.tsx` for this segment, not just the parent `app/profile/
// loading.tsx` -- that one also previews a trainer-section skeleton, but
// this page's own composition (page.tsx) never renders a trainer block at
// all for someone else's profile, so reusing it verbatim would flash a
// skeleton for a section that was never going to appear.
export default function Loading() {
    return (
        <div className={styles.container}>
            <div style={{ marginBottom: 24 }}>
                <ProfileSkeleton />
            </div>
            <ProfileFriendsSkeleton />
            <ProfileWallSkeleton />
        </div>
    );
}
