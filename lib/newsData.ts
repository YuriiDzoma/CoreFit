import { createClient } from '@/utils/supabase/client';

export type NewsItem = {
    id: string;
    title: string;
    description: string;
    image_url: string | null;
    published_at: string;
};

// `news` is the project's own update/announcement feed -- public read-only,
// no in-app authoring UI. Rows are added directly via the Supabase
// dashboard/SQL, matching this table's RLS (SELECT-only policy, no
// INSERT/UPDATE/DELETE policy at all -- see mobile repo's
// supabase/migrations/20260906120000_add_news.sql, the source of truth for
// this schema since this repo has no migrations folder of its own).
export const fetchAllNews = async (): Promise<NewsItem[]> => {
    const supabase = createClient();

    const { data, error } = await supabase
        .from('news')
        .select('id, title, description, image_url, published_at')
        .order('published_at', { ascending: false });

    if (error) {
        console.error('Error fetching news:', error.message);
        return [];
    }

    return data ?? [];
};
