export class MatchedItem {
    room_id: string;
    pet_id: string;
    owner_partner_id: string;
    partner_id: string;
    partner_avatar: string;
    partner_name: string;
    created_at: string;

    constructor(data: { room_id: string;pet_id: string;owner_partner_id: string; partner_id: string; partner_avatar: string; partner_name: string; created_at: string }) {
        this.room_id = data.room_id;
        this.pet_id = data.pet_id;
        this.owner_partner_id = data.owner_partner_id,
        this.partner_id = data.partner_id;
        this.partner_avatar = data.partner_avatar;
        this.partner_name= data.partner_name;
        this.created_at = data.created_at;
    }
}
