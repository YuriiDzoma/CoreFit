import styles from './skeleton.module.scss'
import React from "react";

export function UsersSkeleton() {
    return (
        <>
            <span className={styles.searchSkeleton}/>
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
        </>
    )
}

// The Messages conversation list (conversationList.tsx): elevated rows
// with 8px padding, a 48px round avatar, a two-line text column (name +
// preview) and a trailing time -- not UsersSkeleton, whose search bar the
// list doesn't have.
export function MessagesListSkeleton() {
    return (
        <ul className={styles.messagesList}>
            {Array.from({ length: 4 }).map((_, index) => (
                <li key={index} className={styles.messagesList__row}>
                    <span className={styles.messagesList__avatar}/>
                    <div className={styles.messagesList__text}>
                        <span className={styles.messagesList__name}/>
                        <span className={styles.messagesList__preview}/>
                    </div>
                    <span className={styles.messagesList__time}/>
                </li>
            ))}
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
            <div className={styles.recordsPage__entries}>
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
        </div>
    )
}

export function FriendsListSkeleton() {
    return (
        <>
            <span className={styles.searchSkeleton}/>
            <div className={styles.friendsListPage}>
                <div className={styles.friendsListPage__row}>
                    <span className={styles.friendsListPage__img}/>
                    <span className={styles.friendsListPage__name}/>
                    <span className={styles.friendsListPage__btn}/>
                </div>
                <div className={styles.friendsListPage__row}>
                    <span className={styles.friendsListPage__img}/>
                    <span className={styles.friendsListPage__name}/>
                    <span className={styles.friendsListPage__btn}/>
                </div>
                <div className={styles.friendsListPage__row}>
                    <span className={styles.friendsListPage__img}/>
                    <span className={styles.friendsListPage__name}/>
                    <span className={styles.friendsListPage__btn}/>
                </div>
            </div>
        </>
    )
}

// `withActions`: someone else's profile, where a signed-in viewer also gets
// the `.profile__actions` row ("Write message" + a friend action) under
// the header -- without it the block grows by that row (36.5px) on load.
export function ProfileSkeleton({ withActions = false }: { withActions?: boolean }) {
    const header = (
        <div className={styles.profile}>
            <span className={styles.profile__img}/>
            <div className={styles.profile__name}>
                <span className={styles.profile__txt}/>
                <span className={styles.profile__txtSecond}/>
                <span className={styles.profile__txtProfgrams}/>
            </div>
        </div>
    );
    if (!withActions) return header;
    return (
        <div className={styles.profileWithActions}>
            {header}
            <div className={styles.profileWithActions__actions}>
                <span className={styles.profileWithActions__btnWide}/>
                <span className={styles.profileWithActions__btnNarrow}/>
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

// Matches TrainerSettings' own `.trainer` block: title, a single
// name+checkbox toggle row, and the explanatory hint line beneath it.
export function TrainerSettingsSkeleton() {
    return (
        <div className={styles.settingsSection}>
            <span className={styles.settingsSection__title}/>
            <div className={styles.settingsSection__row}>
                <span className={styles.settingsSection__name}/>
                <span className={styles.settingsSection__checkbox}/>
            </div>
            <span className={styles.settingsSection__hint}/>
        </div>
    )
}

// Matches CitySettings' own `.location` block: title, the city text
// input, and the "detect automatically" link beneath it.
export function CitySettingsSkeleton() {
    return (
        <div className={styles.settingsSection}>
            <span className={styles.settingsSection__title}/>
            <span className={styles.settingsSection__input}/>
            <span className={styles.settingsSection__link}/>
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

// Same `.profileFriends` shape/classes as ProfileFriendsSkeleton -- the
// real TrainerClients.tsx reuses Friends.tsx's own `.friends`/
// `.friends__link` classes too (same header+avatar-grid anatomy), just a
// different label and no "see all" link, so this skips only the
// `&__link` span. Was previously `fallback={null}` on TrainerClientsServer's
// Suspense boundary in page.tsx -- the trainer/client block popped in
// with no placeholder at all, unlike every other section on this page.
export function ProfileTrainerSkeleton() {
    return (
        <div className={styles.profileFriends}>
            <div className={styles.profileFriends__header}>
                <span className={styles.profileFriends__title}/>
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

// UserWall.tsx's own loading state already renders this same
// title-bar + NewsSkeleton pair once it mounts client-side; this export
// exists only so the route-level `loading.tsx` -- which renders before
// UserWall ever mounts -- can preview the same shape instead of leaving a
// gap where the Wall section will eventually appear.
export function ProfileWallSkeleton() {
    return (
        <div className={styles.profileFriends}>
            <span className={styles.profileFriends__title}/>
            <NewsSkeleton/>
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

// The real title renders unconditionally in programs.tsx (not skipped
// during loading, matching Complexes' own already-unconditional title)
// -- only the list itself needs a placeholder here.
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

// The "+ Create new program" button, shown in place of the real link
// while `loading` is true. `.programList__create` already existed
// (pre-dating the title/create-link unconditional-render refactor) but
// had gone unused since -- reinstated per explicit request.
export function ProgramCreateSkeleton() {
    return <span className={styles.programList__create}/>;
}

// Complexes' own title and (trainer-only) "create global program" link
// already render unconditionally outside its loading check
// (complexes.tsx), so this only needs the list itself -- the same flat,
// unbordered rectangles as Programs' own skeleton, but at the collapsed
// accordion card's measured height (`__complexItem`, 68px).
export function ComplexesListSkeleton() {
    return (
        <ul className={styles.programList__list}>
            <li className={styles.programList__complexItem}/>
            <li className={styles.programList__complexItem}/>
            <li className={styles.programList__complexItem}/>
            <li className={styles.programList__complexItem}/>
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