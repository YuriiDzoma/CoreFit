'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import CreateEditProgram from '@/app/training/create/components/CreateEditProgram';
import { ProgramFull } from '@/types/training';
import { fetchProgramDetail } from '@/lib/programData';
import Preloader from '@/ui/preloader/Preloader';
import { useAppSelector } from '@/app/hooks/redux';
import { getText } from '@/store/selectors';

export default function EditProgramPage() {
    const params = useParams();
    const id = params?.id as string;
    const { training } = useAppSelector(getText);

    const [program, setProgram] = useState<ProgramFull | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            const data = await fetchProgramDetail(id);
            setProgram(data);
            setLoading(false);
        };
        load();
    }, [id]);

    if (loading) return <Preloader />;
    if (!program) return <div>{training.programNotFound}</div>;

    return <CreateEditProgram initialProgram={program} />;
}
