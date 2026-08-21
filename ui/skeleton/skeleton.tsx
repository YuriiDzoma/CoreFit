import styles from './skeleton.module.scss'
import React from "react";

export function UsersSkeleton() {
    return (
        <ul className={styles.users}>
            <li className={styles.user}>
                <div className={styles.user__info}>
                    <span className={styles.user__img}/>
                    <span className={styles.user__name}/>
                </div>
                <span className={styles.user__btn}/>
            </li>
            <li className={styles.user}>
                <div className={styles.user__info}>
                    <span className={styles.user__img}/>
                    <span className={styles.user__name}/>
                </div>
                <span className={styles.user__btn}/>
            </li>
            <li className={styles.user}>
                <div className={styles.user__info}>
                    <span className={styles.user__img}/>
                    <span className={styles.user__name}/>
                </div>
                <span className={styles.user__btn}/>
            </li>
        </ul>
    )
}

// Title and WikiNav's tabs render for real above this now (chrome, not
// data-dependent) -- only the leaderboard-card list itself is a
// placeholder, matching ProgramsListSkeleton/ExerciseListSkeleton's own
// title-less shape.
export function RecordsSkeleton() {
    return (
        <div className={styles.recordsPage__list}>
            <RecordsSkeletonCard/>
            <RecordsSkeletonCard/>
            <RecordsSkeletonCard/>
        </div>
    )
}

// A filled-wrapper card (`--skeleton-wrapper-bg`, no border) matching
// NewsSkeleton's own visual language on the Trainings/history feed, not
// the real `.card`'s own border-only treatment -- an explicit request to
// bring Records' skeleton into the same style, not a fidelity fix. Row
// anatomy (rank/avatar/name/weight) still mirrors `records.tsx`'s own
// `EntryRow` exactly, rather than collapsing to a single generic bar per
// row the way NewsSkeleton's exercise lines do -- a leaderboard reads as
// a leaderboard shape even as a placeholder.
function RecordsSkeletonCard() {
    return (
        <div className={styles.recordsPage__card}>
            <div className={styles.recordsPage__cardHeader}>
                <span className={styles.recordsPage__cardImage}/>
                <span className={styles.recordsPage__cardName}/>
            </div>
            <div className={styles.recordsPage__entryRow}>
                <span className={styles.recordsPage__entryRank}/>
                <span className={styles.recordsPage__entryAvatar}/>
                <span className={styles.recordsPage__entryName}/>
                <span className={styles.recordsPage__entryWeight}/>
            </div>
            <div className={styles.recordsPage__entryRow}>
                <span className={styles.recordsPage__entryRank}/>
                <span className={styles.recordsPage__entryAvatar}/>
                <span className={styles.recordsPage__entryName}/>
                <span className={styles.recordsPage__entryWeight}/>
            </div>
        </div>
    )
}

export function FriendsListSkeleton() {
    return (
        <div>
            <div className={styles.friendsListPage}>
                <div className={styles.friendsListPage__row}>
                    <span className={styles.friendsListPage__img}/>
                    <span className={styles.friendsListPage__name}/>
                </div>
                <div className={styles.friendsListPage__row}>
                    <span className={styles.friendsListPage__img}/>
                    <span className={styles.friendsListPage__name}/>
                </div>
                <div className={styles.friendsListPage__row}>
                    <span className={styles.friendsListPage__img}/>
                    <span className={styles.friendsListPage__name}/>
                </div>
            </div>
        </div>
    )
}

export function ProfileSkeleton() {
    return (
        <div className={styles.profile}>
            <span className={styles.profile__img}/>
            <div className={styles.profile__name}>
                <span className={styles.profile__txt}/>
                <span className={styles.profile__txtSecond}/>
                <span className={styles.profile__txtProfgrams}/>
            </div>
        </div>
    )
}

export function ProfileSettingsSkeleton() {
    return (
        <div className={styles.profileSettings}>
            <span className={styles.profileSettings__title} />
            <ul>
                <li>
                    <span className={styles.profileSettings__label}/>
                    <span className={styles.profileSettings__field}/>
                </li>
                <li>
                    <span className={styles.profileSettings__label}/>
                    <span className={styles.profileSettings__field}/>
                </li>
            </ul>
            <span className={styles.profileSettings__btn}/>
        </div>
    )
}

export function ProfileFriendsSkeleton() {
    return (
        <div className={styles.profileFriends}>
            <div className={styles.profileFriends__header}>
                <span className={styles.profileFriends__title}/>
                <span className={styles.profileFriends__link}/>
            </div>
            <ul>
                <li>
                    <span className={styles.profileFriends__img}/>
                    <span className={styles.profileFriends__name}/>
                </li>
                <li>
                    <span className={styles.profileFriends__img}/>
                    <span className={styles.profileFriends__name}/>
                </li>
                <li>
                    <span className={styles.profileFriends__img}/>
                    <span className={styles.profileFriends__name}/>
                </li>
                <li>
                    <span className={styles.profileFriends__img}/>
                    <span className={styles.profileFriends__name}/>
                </li>
            </ul>
        </div>
    )
}

// The real title renders unconditionally in Wiki.tsx now (not skipped
// during loading), so this only covers what's actually still hidden
// while loading: the search row, muscle-group tabs, and exercise list.
export function ExerciseListSkeleton() {
    return (
        <div>
            <span className={styles.wikiSearch}/>
            <div className={styles.wiki}>
                <div className={styles.exercisesList}>
                    <div className={styles.exercisesList__row}>
                        <span className={styles.exercisesList__img}/>
                        <span className={styles.exercisesList__name}/>
                    </div>
                    <div className={styles.exercisesList__row}>
                        <span className={styles.exercisesList__img}/>
                        <span className={styles.exercisesList__name}/>
                    </div>
                    <div className={styles.exercisesList__row}>
                        <span className={styles.exercisesList__img}/>
                        <span className={styles.exercisesList__name}/>
                    </div>
                    <div className={styles.exercisesList__row}>
                        <span className={styles.exercisesList__img}/>
                        <span className={styles.exercisesList__name}/>
                    </div>
                    <div className={styles.exercisesList__row}>
                        <span className={styles.exercisesList__img}/>
                        <span className={styles.exercisesList__name}/>
                    </div>
                    <div className={styles.exercisesList__row}>
                        <span className={styles.exercisesList__img}/>
                        <span className={styles.exercisesList__name}/>
                    </div>
                    <div className={styles.exercisesList__row}>
                        <span className={styles.exercisesList__img}/>
                        <span className={styles.exercisesList__name}/>
                    </div>
                    <div className={styles.exercisesList__row}>
                        <span className={styles.exercisesList__img}/>
                        <span className={styles.exercisesList__name}/>
                    </div>
                    <div className={styles.exercisesList__row}>
                        <span className={styles.exercisesList__img}/>
                        <span className={styles.exercisesList__name}/>
                    </div>
                </div>
                <ul className={styles.wiki__groups}>
                    <li className={styles.wiki__group}/>
                    <li className={styles.wiki__group}/>
                    <li className={styles.wiki__group}/>
                    <li className={styles.wiki__group}/>
                    <li className={styles.wiki__group}/>
                    <li className={styles.wiki__group}/>
                    <li className={styles.wiki__group}/>
                    <li className={styles.wiki__group}/>
                </ul>
            </div>
        </div>
    )
}

export function ExerciseSkeleton() {
    return (
        <div className={styles.exercise}>
            <span className={styles.title}/>
            <span className={styles.exercise__row}/>
            <span className={styles.exercise__row}/>
            <span className={styles.exercise__image}/>
            <span className={styles.exercise__text}/>
            <span className={styles.exercise__video}/>
        </div>
    )
}

// The real title and "+ Create new program" link render unconditionally
// in programs.tsx now (not skipped during loading, matching Complexes'
// own already-unconditional title/create-link) -- only the list itself
// still needs a placeholder here.
export function ProgramsListSkeleton() {
    return (
        <ul className={styles.programList__list}>
            <li  className={styles.programList__item}/>
            <li  className={styles.programList__item}/>
            <li  className={styles.programList__item}/>
            <li  className={styles.programList__item}/>
        </ul>
    )
}

// Complexes' own title and (trainer-only) "create global program" link
// already render unconditionally outside its loading check
// (complexes.tsx), so this only needs the list itself -- reuses
// `.programList__list`/`__item` verbatim (same flat, unbordered
// rectangle as Programs' own skeleton), not a re-measured version of
// Complexes' own `Accordion`-based card. "Analogous", per request, not a
// pixel match of the MUI accordion's border/chevron.
export function ComplexesListSkeleton() {
    return (
        <ul className={styles.programList__list}>
            <li className={styles.programList__item}/>
            <li className={styles.programList__item}/>
            <li className={styles.programList__item}/>
            <li className={styles.programList__item}/>
        </ul>
    )
}

export function NewsSkeleton() {
    return (
        <div className={styles.news}>
           <div className={styles.news__item}>
               <p className={styles.news__header}>
                   <span className={styles.news__avatar}/>
                   <span className={styles.news__name}/>
               </p>
               <span className={styles.news__finished}/>
               <ul className={styles.news__list}>
                   <li className={styles.news__item}/>
                   <li className={styles.news__item}/>
                   <li className={styles.news__item}/>
                   <li className={styles.news__item}/>
                   <li className={styles.news__item}/>
                   <li className={styles.news__item}/>
               </ul>
           </div>
            <div className={styles.news__item}>
                <p className={styles.news__header}>
                    <span className={styles.news__avatar}/>
                    <span className={styles.news__name}/>
                </p>
                <span className={styles.news__finished}/>
                <ul className={styles.news__list}>
                    <li className={styles.news__item}/>
                    <li className={styles.news__item}/>
                    <li className={styles.news__item}/>
                    <li className={styles.news__item}/>
                    <li className={styles.news__item}/>
                    <li className={styles.news__item}/>
                </ul>
            </div>
            <div className={styles.news__item}>
                <p className={styles.news__header}>
                    <span className={styles.news__avatar}/>
                    <span className={styles.news__name}/>
                </p>
                <span className={styles.news__finished}/>
                <ul className={styles.news__list}>
                    <li className={styles.news__item}/>
                    <li className={styles.news__item}/>
                    <li className={styles.news__item}/>
                    <li className={styles.news__item}/>
                    <li className={styles.news__item}/>
                    <li className={styles.news__item}/>
                </ul>
            </div>
        </div>
    )
}

export function ProgramDetailSkeleton() {
    return (
        <div className={styles.program}>
            <span className={styles.program__titleWrapper}>
                <span className={styles.program__title}/>
            </span>
            <div className={styles.program__details}>
                <span/>
                <span/>
                <span/>
            </div>
            <span className={styles.program__changer}/>
            <div className={styles.program__grid}>
                <span className={styles.program__day}/>
                <span className={styles.program__day}/>
                <span className={styles.program__date}/>
            </div>
            <div className={styles.program__grid}>
                <span className={styles.program__exercise}/>
                <span className={styles.program__weight}/>
                <span className={styles.program__field}/>
            </div>
            <div className={styles.program__grid}>
                <span className={styles.program__exercise}/>
                <span className={styles.program__weight}/>
                <span className={styles.program__field}/>
            </div>
            <div className={styles.program__grid}>
                <span className={styles.program__exercise}/>
                <span className={styles.program__weight}/>
                <span className={styles.program__field}/>
            </div>
            <div className={styles.program__grid}>
                <span className={styles.program__exercise}/>
                <span className={styles.program__weight}/>
                <span className={styles.program__field}/>
            </div>
            <div className={styles.program__grid}>
                <span className={styles.program__exercise}/>
                <span className={styles.program__weight}/>
                <span className={styles.program__field}/>
            </div>
            <div className={styles.program__grid}>
                <span className={styles.program__exercise}/>
                <span className={styles.program__weight}/>
                <span className={styles.program__field}/>
            </div>
            <div className={styles.program__grid}>
                <span className={styles.program__exercise}/>
                <span className={styles.program__weight}/>
                <span className={styles.program__field}/>
            </div>

            <span className={styles.program__space} />

            <div className={styles.program__grid}>
                <span className={styles.program__day}/>
                <span className={styles.program__day}/>
                <span className={styles.program__date}/>
            </div>
            <div className={styles.program__grid}>
                <span className={styles.program__exercise}/>
                <span className={styles.program__weight}/>
                <span className={styles.program__field}/>
            </div>
            <div className={styles.program__grid}>
                <span className={styles.program__exercise}/>
                <span className={styles.program__weight}/>
                <span className={styles.program__field}/>
            </div>
            <div className={styles.program__grid}>
                <span className={styles.program__exercise}/>
                <span className={styles.program__weight}/>
                <span className={styles.program__field}/>
            </div>
            <div className={styles.program__grid}>
                <span className={styles.program__exercise}/>
                <span className={styles.program__weight}/>
                <span className={styles.program__field}/>
            </div>
            <div className={styles.program__grid}>
                <span className={styles.program__exercise}/>
                <span className={styles.program__weight}/>
                <span className={styles.program__field}/>
            </div>
            <div className={styles.program__grid}>
                <span className={styles.program__exercise}/>
                <span className={styles.program__weight}/>
                <span className={styles.program__field}/>
            </div>
            <div className={styles.program__grid}>
                <span className={styles.program__exercise}/>
                <span className={styles.program__weight}/>
                <span className={styles.program__field}/>
            </div>
        </div>
    )
}

export function ProgramDetailExercisesSkeleton() {
    return (
        <div className={styles.detailExercises}>
            <div className={styles.detailExercises__grid}>
                <span className={styles.program__day}/>
            </div>
            <div className={styles.detailExercises__grid}>
                <span className={styles.program__exercise}/>
            </div>
            <div className={styles.detailExercises__grid}>
                <span className={styles.program__exercise}/>
            </div>
            <div className={styles.detailExercises__grid}>
                <span className={styles.program__exercise}/>
            </div>
            <div className={styles.detailExercises__grid}>
                <span className={styles.program__exercise}/>
            </div>
            <div className={styles.detailExercises__grid}>
                <span className={styles.program__exercise}/>
            </div>
            <div className={styles.detailExercises__grid}>
                <span className={styles.program__exercise}/>
            </div>
            <div className={styles.detailExercises__grid}>
                <span className={styles.program__exercise}/>
            </div>

            <span className={styles.program__space} />

            <div className={styles.detailExercises__grid}>
                <span className={styles.program__day}/>
            </div>
            <div className={styles.detailExercises__grid}>
                <span className={styles.program__exercise}/>
            </div>
            <div className={styles.detailExercises__grid}>
                <span className={styles.program__exercise}/>
            </div>
            <div className={styles.detailExercises__grid}>
                <span className={styles.program__exercise}/>
            </div>
            <div className={styles.detailExercises__grid}>
                <span className={styles.program__exercise}/>
            </div>
            <div className={styles.detailExercises__grid}>
                <span className={styles.program__exercise}/>
            </div>
            <div className={styles.detailExercises__grid}>
                <span className={styles.program__exercise}/>
            </div>
            <div className={styles.detailExercises__grid}>
                <span className={styles.program__exercise}/>
            </div>
        </div>
    )
}