'use client';
import React from "react";
import { usePathname } from "next/navigation";
import styles from './home.module.scss'
import HomeMenu from "../components/homeMenu/homeMenu";
import SubTabs from "../components/subTabs/subTabs";
import TrainingHistories from "../components/news/trainingHistories";
import Records from "./records/components/records";
import News from "./news/components/news";
import useWindowSize from "../hooks/useWindowSize";
import { useAppSelector } from "../hooks/redux";
import { getText } from "@/store/selectors";

// At 1200+ (full sidebar) Home is two columns: the Trainings feed on the
// left, always shown, and Records/News on the right behind their own
// switch -- the feed reads top to bottom as one list instead of a 2xN
// grid whose order was unclear. `/`, `/records` and `/news` all render
// this same pair; the path only picks the right column's tab, so the feed
// stays mounted (no refetch) when switching it. Below 1200 the three
// pages keep their own tabs.
export default function HomeLayout({ children }: { children: React.ReactNode }) {
    const { width } = useWindowSize();
    const pathname = usePathname();
    const { base } = useAppSelector(getText);

    // Width is 0 until the first effect has measured the window -- render
    // nothing for that one frame rather than mounting the narrow layout's
    // feed only to unmount and refetch it.
    if (width === 0) return <div className={styles.home} />;

    if (width < 1200) {
        return (
            <div className={styles.home}>
                <div className={styles.menu}>
                    <HomeMenu />
                </div>
                <div className={styles.content}>
                    {children}
                </div>
            </div>
        );
    }

    const showNews = pathname === '/news';

    return (
        <div className={styles.columns}>
            <section className={styles.feed}>
                <TrainingHistories oneColumn />
            </section>
            <aside className={styles.rail}>
                <div className={styles.railTabs}>
                    <SubTabs
                        items={[
                            { key: 'records', href: '/records', label: base.records, active: !showNews },
                            { key: 'news', href: '/news', label: base.news, active: showNews },
                        ]}
                    />
                </div>
                <div className={styles.railBody}>
                    {showNews ? <News inRail /> : <Records inRail />}
                </div>
            </aside>
        </div>
    );
}
