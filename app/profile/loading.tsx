import styles from "./components/profiles.module.scss";
import {
    ProfileSkeleton,
    ProfileFriendsSkeleton,
    ProfileTrainerSkeleton,
    ProfileWallSkeleton,
} from "@/ui/skeleton/skeleton";

// This is the route-level transition skeleton (shown while the page's own
// async Server Component -- getOwnProfile() -- is still resolving, before
// page.tsx and its own per-section Suspense boundaries even mount) -- so
// it previews the full page shape, not just the two sections that used to
// be here. Without the trainer/wall blocks, the very first paint looked
// complete, then two more sections popped in once page.tsx's own
// boundaries took over, each with their own (now-matching) skeleton.
export default function Loading() {
    return (
        <div className={styles.container}>
            <div style={{ marginBottom: 24 }}>
                <ProfileSkeleton />
            </div>
            <ProfileFriendsSkeleton />
            <ProfileTrainerSkeleton />
            <ProfileWallSkeleton />
        </div>
    );
}
