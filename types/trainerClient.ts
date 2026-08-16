// Mirrors types/friends.ts's FriendRecord shape, but with named,
// direction-specific columns (trainer_id/client_id) rather than friends'
// symmetric user_id/friend_id -- direction is meaningful here in a way it
// isn't for friends. Matches the live public.trainer_clients table
// (mobile repo's supabase/migrations/), shared by both apps' Supabase
// project.
export type TrainerClientRecord = {
    id: string;
    trainer_id: string;
    client_id: string;
    status: string;
    created_at: string;
};
