import Dexie, { type EntityTable } from 'dexie';
import { PetOverviewDto, RcmPetDto } from '@/app/model/pet';
import { MatchedItem } from '@/app/model/petMatchedItem';
import { ConversationItem } from '@/app/model/petConversationItem';

const dbPet = new Dexie('PetDatabase') as Dexie & {
    pet: EntityTable<PetOverviewDto, 'pet_id'>;
    matched: EntityTable<MatchedItem, 'room_id'>; 
    conversation: EntityTable<ConversationItem, 'room_id'>; 
    selected: EntityTable<PetOverviewDto, 'pet_id'>;
    rcm: EntityTable<{ pet_id: string; recommended_pets: RcmPetDto[] }, 'pet_id'>;
};

dbPet.version(1).stores({
    pet: 'pet_id, pet_name, pet_type, pet_species, pet_image, pet_gender, pet_pricing, pet_status',
    matched: 'room_id, pet_id,owner_partner_id, partner_id, partner_avatar, partner_name, created_at',
    conversation: 'room_id, pet_id, owner_partner_id, partner_id, partner_avatar, partner_name, last_message.sender_id, last_message.content, sent_at',
    selected: 'pet_id, pet_name, pet_type, pet_species, pet_image, pet_gender, pet_pricing, pet_status',
    rcm: 'pet_id' 
});

export { dbPet };
