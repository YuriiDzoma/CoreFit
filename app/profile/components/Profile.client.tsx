'use client';

import styles from './profiles.module.scss';
import Image from "next/image";
import useWindowSize from "../../hooks/useWindowSize";
import {getIsDarkTheme, getText, getUserId} from "@/store/selectors";
import {useAppSelector} from "../../hooks/redux";
import {ProfileType} from "@/types/user";
import Link from "next/link";
import React, {useEffect, useState} from "react";
import {
    getAllFriendLinksOfUser,
    getFriendshipState,
    sendFriendRequest,
    cancelFriendRequest,
    removeFriendship,
} from "@/lib/friendData";
import {
    getAllTrainerLinksOfUser,
    getTrainerClientCount,
    getTrainerClientState,
    sendTrainerRequest,
    cancelTrainerRequest,
    removeTrainerRelationship,
} from "@/lib/trainerClientData";
import type { FriendRecord } from "@/types/friends";
import type { TrainerClientRecord } from "@/types/trainerClient";
import {fetchUserSettings} from "@/lib/userData";
import GlobalPopup from "@/app/components/globalPopup/globalPopup";
import TrainerBadge from "./TrainerBadge";

const Profile = ({profile}: {profile: ProfileType}) => {
    const { width } = useWindowSize();
    const { base } = useAppSelector(getText);
    const currentId = useAppSelector(getUserId);
    const isDark = useAppSelector(getIsDarkTheme);

    const isOwnProfile = currentId === profile.id;

    // The viewer's own relationships/flag -- a different fetch from
    // `profile` itself, which is the *viewed* user's data. Only run when
    // looking at someone else's profile; matches profile.is_trainer
    // (already selected server-side by lib/data/user.ts's getProfileById)
    // for the target side of the trainer gate.
    const [friendLinks, setFriendLinks] = useState<FriendRecord[]>([]);
    const [trainerLinks, setTrainerLinks] = useState<TrainerClientRecord[]>([]);
    const [viewerIsTrainer, setViewerIsTrainer] = useState(false);
    const [clientCount, setClientCount] = useState(0);
    const [isPreloader, setIsPreloader] = useState(false);
    const [pendingRemoval, setPendingRemoval] = useState<
        | { kind: 'friend' }
        | { kind: 'trainer'; asClient: boolean }
        | null
    >(null);

    const refreshRelationships = () => {
        if (!currentId) return;
        Promise.all([
            getAllFriendLinksOfUser(currentId),
            getAllTrainerLinksOfUser(currentId),
        ]).then(([friends, trainers]) => {
            setFriendLinks(friends);
            setTrainerLinks(trainers);
        });
    };

    useEffect(() => {
        if (!currentId || isOwnProfile) return;
        refreshRelationships();
        fetchUserSettings(currentId).then((settings) => {
            setViewerIsTrainer(settings.is_trainer ?? false);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentId, isOwnProfile]);

    // Own profile and someone else's both need this -- not folded into
    // the viewer-relationship effect above, which deliberately skips
    // `isOwnProfile`.
    useEffect(() => {
        if (!profile.is_trainer) return;
        getTrainerClientCount(profile.id).then(setClientCount);
    }, [profile.id, profile.is_trainer]);

    const friendState = currentId
        ? getFriendshipState(friendLinks, currentId, profile.id)
        : { status: 'none' as const };
    const trainerState = currentId
        ? getTrainerClientState(trainerLinks, currentId, profile.id)
        : { status: 'none' as const };

    // 'accepted' doesn't itself say which role the viewer has -- resolved
    // from the matching link record, only where it matters for display
    // (the button label / confirm copy).
    const acceptedTrainerLink =
        trainerState.status === 'accepted'
            ? trainerLinks.find((link) => link.id === trainerState.requestId)
            : null;
    const viewerIsClientOfLink = acceptedTrainerLink?.client_id === currentId;

    const targetIsTrainer = profile.is_trainer === true;

    const handleAddFriend = async () => {
        setIsPreloader(true);
        await sendFriendRequest(profile.id);
        refreshRelationships();
        setIsPreloader(false);
    };

    const handleCancelFriendRequest = async () => {
        setIsPreloader(true);
        await cancelFriendRequest(profile.id);
        refreshRelationships();
        setIsPreloader(false);
    };

    const handleConfirmRemoveFriend = async () => {
        setPendingRemoval(null);
        setIsPreloader(true);
        await removeFriendship(profile.id);
        refreshRelationships();
        setIsPreloader(false);
    };

    const handleAddTrainer = async () => {
        setIsPreloader(true);
        await sendTrainerRequest(profile.id);
        refreshRelationships();
        setIsPreloader(false);
    };

    const handleCancelTrainerRequest = async () => {
        setIsPreloader(true);
        await cancelTrainerRequest(profile.id);
        refreshRelationships();
        setIsPreloader(false);
    };

    const handleConfirmRemoveTrainerLink = async () => {
        setPendingRemoval(null);
        setIsPreloader(true);
        await removeTrainerRelationship(profile.id);
        refreshRelationships();
        setIsPreloader(false);
    };

    return (
        <div className={styles.profile}>
            <div className={styles.profile__header}>

                <Image
                    src={profile.avatar_url}
                    width={width < 768 ? 96 : 150}
                    height={width < 768 ? 96 : 150}
                    alt="avatar"
                    unoptimized
                />

                <div>
                    <p>{profile.username}</p>
                    <span>{new Date(profile.created_at).toLocaleString()}</span>
                    {profile.city && (
                        <span className={styles.profile__city}>
                            {profile.city}{profile.country ? `, ${profile.country}` : ''}
                        </span>
                    )}
                    {profile.is_trainer && <TrainerBadge clientCount={clientCount} />}
                    <Link className={styles.programsLink} href={`/training/${profile.id}`}>
                        <span>{base.programs}</span>
                    </Link>
                </div>

                {isOwnProfile && (
                    <Link className={styles.settings} href="/settings" >
                        <Image
                            src={isDark ? "/icons/settings.svg" : "/icons/settingsDark.svg"}
                            width={24}
                            height={24}
                            alt="settings"
                            unoptimized
                        />
                    </Link>
                )}

            </div>

            {!isOwnProfile && currentId && (
                <div className={styles.profile__actions}>
                    {friendState.status === 'none' && (
                        <button className="button" onClick={handleAddFriend} disabled={isPreloader}>
                            <span>{base.addFriends}</span>
                        </button>
                    )}
                    {friendState.status === 'outgoing' && (
                        <button className="button" onClick={handleCancelFriendRequest} disabled={isPreloader}>
                            <span>{base.cancelRequest}</span>
                        </button>
                    )}
                    {friendState.status === 'incoming' && (
                        <span className={styles.profile__pending}>{base.pending}</span>
                    )}
                    {friendState.status === 'accepted' && (
                        <button
                            className="button"
                            onClick={() => setPendingRemoval({ kind: 'friend' })}
                            disabled={isPreloader}
                        >
                            <span>{base.removeFriend}</span>
                        </button>
                    )}

                    {/* Trainer requests only make sense between friends --
                        enforced both here (visibility) and at the RLS
                        layer (the trainer_clients insert policy itself
                        requires an accepted friendship and both parties'
                        is_trainer roles -- see mobile repo's
                        docs/decisions.md). */}
                    {friendState.status === 'accepted' && (
                        <>
                            {trainerState.status === 'none' && targetIsTrainer && !viewerIsTrainer && (
                                <button className="button" onClick={handleAddTrainer} disabled={isPreloader}>
                                    <span>{base.addAsTrainer}</span>
                                </button>
                            )}
                            {trainerState.status === 'outgoing' && (
                                <button className="button" onClick={handleCancelTrainerRequest} disabled={isPreloader}>
                                    <span>{base.cancelRequest}</span>
                                </button>
                            )}
                            {trainerState.status === 'accepted' && (
                                <button
                                    className="button"
                                    onClick={() =>
                                        setPendingRemoval({ kind: 'trainer', asClient: viewerIsClientOfLink })
                                    }
                                    disabled={isPreloader}
                                >
                                    <span>{viewerIsClientOfLink ? base.yourTrainer : base.yourClient}</span>
                                </button>
                            )}
                        </>
                    )}
                </div>
            )}

            {pendingRemoval?.kind === 'friend' && (
                <GlobalPopup
                    title={base.removeFriendTitle}
                    message={base.removeFriendText}
                    onConfirm={handleConfirmRemoveFriend}
                    onCancel={() => setPendingRemoval(null)}
                />
            )}

            {pendingRemoval?.kind === 'trainer' && (
                <GlobalPopup
                    title={pendingRemoval.asClient ? base.removeTrainerTitle : base.removeClientTitle}
                    message={pendingRemoval.asClient ? base.removeTrainerText : base.removeClientText}
                    onConfirm={handleConfirmRemoveTrainerLink}
                    onCancel={() => setPendingRemoval(null)}
                />
            )}
        </div>
    )
}

export default Profile;
