export class ConversationItem {
    room_id: string;
    pet_id: string;
    partner_id: string;
    partner_avatar: string;
    partner_name: string;
    last_message: { sender_id: string, content: string };
    sent_at: string;

    constructor(data: {
        room_id: string;
        pet_id: string;
        partner_id: string;
        partner_avatar: string;
        partner_name: string;
        created_at: string;
        last_message?: { sender_id: string, content: string };
        sent_at?: string;
    }) {
        this.room_id = data.room_id;
        this.pet_id = data.pet_id;
        this.partner_id = data.partner_id;
        this.partner_avatar = data.partner_avatar;
        this.partner_name = data.partner_name;
        this.last_message = data.last_message || { sender_id: '', content: '' };
        this.sent_at = data.sent_at || data.created_at;
    }
}
