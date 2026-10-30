export type Conversation = {
    id: string;
    user_a: string;
    user_b: string;
    last_message_at: string | null;
    last_message_body: string | null;
    last_message_sender_id: string | null;
    created_at: string;
};

export type Message = {
    id: string;
    conversation_id: string;
    sender_id: string;
    body: string;
    created_at: string;
    // Set by the DB when the sender edits the text (Sprint 131).
    edited_at?: string | null;
};
