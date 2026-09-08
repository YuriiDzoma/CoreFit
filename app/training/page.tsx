'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { useAppSelector } from '@/app/hooks/redux';
import { getText } from '@/store/selectors';
import { ProgramCreateSkeleton, ProgramsListSkeleton } from '@/ui/skeleton/skeleton';
import styles from './components/programs/programs.module.scss';

const TrainingRedirect = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const { training } = useAppSelector(getText);

    useEffect(() => {
        const redirectToOwnTrainings = async () => {
            const supabase = createClient();
            const {
                data: { user },
            } = await supabase.auth.getUser();

            if (user?.id) {
                router.replace(`/training/${user.id}`);
            } else {
                router.replace('/signin');
            }
        };

        redirectToOwnTrainings().finally(() => setLoading(false));
    }, [router]);

    // This page only ever redirects (to /training/{userId} or /signin) --
    // it never renders real content of its own. Rendering nothing here
    // (an earlier version of this fix) left a blank gap before
    // /training/[id]'s own skeleton appeared -- title, then empty space,
    // then skeleton, then content. Rendering the *exact same* skeleton
    // Programs itself shows while loading (same wrapper class too) makes
    // the two stages visually indistinguishable: skeleton appears
    // immediately, then real content replaces it once, with no
    // intermediate empty or mismatched-shape frame. Safe to always show
    // the create-button skeleton unconditionally here (unlike Programs,
    // which gates it on `isMyProfile`) -- this route only ever redirects
    // to *your own* trainings, never someone else's.
    return (
        <div className={styles.programs}>
            <h2 className="pageTitle">{training.myPrograms}</h2>
            <ProgramCreateSkeleton/>
            <ProgramsListSkeleton/>
        </div>
    );
};

export default TrainingRedirect;
