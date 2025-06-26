'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { ProgramsListSkeleton } from '@/ui/skeleton/skeleton'; // 👈 твій скелетон

const TrainingRedirect = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(true);

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

    return <ProgramsListSkeleton />;
};

export default TrainingRedirect;
