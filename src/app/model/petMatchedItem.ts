export class MatchedItem {
    room_id: string;
    partner_id: string;
    partner_avatar: string;
    created_at: string;

    constructor(data: { room_id: string; partner_id: string; partner_avatar: string; created_at: string }) {
        this.room_id = data.room_id;
        this.partner_id = data.partner_id;
        this.partner_avatar = data.partner_avatar;
        this.created_at = data.created_at;
    }
}
