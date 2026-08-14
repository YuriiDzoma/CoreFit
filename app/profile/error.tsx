'use client';
import { useAppSelector } from '@/app/hooks/redux';
import { getText } from '@/store/selectors';

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
    const { base } = useAppSelector(getText);
    return <div>{base.oops}{error.message} <button onClick={reset}>{base.tryAgain}</button></div>;
}
