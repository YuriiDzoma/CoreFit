'use client';
import styles from './TrainerBadge.module.scss';
import { useAppSelector } from '../../hooks/redux';
import { getText } from '../../../store/selectors';
import { getTrainerTier, type TrainerTier } from '@/lib/trainerClientData';

const TIER_TEXT_KEY: Record<TrainerTier, 'trainerBadgeTierIron' | 'trainerBadgeTierBronze' | 'trainerBadgeTierSilver' | 'trainerBadgeTierGold'> = {
    iron: 'trainerBadgeTierIron',
    bronze: 'trainerBadgeTierBronze',
    silver: 'trainerBadgeTierSilver',
    gold: 'trainerBadgeTierGold',
};

// A small medal glyph -- two ribbon ends above a ringed disc with a
// center dot -- not a stock icon, so it recolors per tier via
// `currentColor` the same way the rest of this badge does.
const MedalIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24">
        <path d="M8 2 L11 10 L5 10 Z" fill="currentColor" />
        <path d="M16 2 L19 10 L13 10 Z" fill="currentColor" opacity="0.6" />
        <circle cx="12" cy="15" r="6.5" fill="none" stroke="currentColor" strokeWidth="2" />
        <circle cx="12" cy="15" r="2.6" fill="currentColor" />
    </svg>
);

// Profile-page trainer-level badge -- a dedicated row (not an inline
// chip next to the name, nor an avatar-corner emblem; both were tried
// and rejected via live-reviewed mockups, see mobile repo's
// docs/decisions.md) showing an icon and "Trainer · {tier} · {count}"
// as one compact line -- a two-line version (bold title, dimmer count
// below) read as too large/heavy next to the rest of the profile header
// per live feedback. Renders nothing when `getTrainerTier` returns
// `null` (0 clients) -- the same "don't show an empty state, just hide
// the block" convention already used elsewhere on this page.
const TrainerBadge = ({ clientCount }: { clientCount: number }) => {
    const { base } = useAppSelector(getText);
    const tier = getTrainerTier(clientCount);
    if (!tier) return null;

    return (
        <div className={`${styles.badge} ${styles[tier]}`}>
            <MedalIcon />
            <span className={styles.text}>
                {base.trainerLabel} · {base[TIER_TEXT_KEY[tier]]} ·{' '}
                {base.trainerBadgeClientsCount.replace('{value}', String(clientCount))}
            </span>
        </div>
    );
};

export default TrainerBadge;
