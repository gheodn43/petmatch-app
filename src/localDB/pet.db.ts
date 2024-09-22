import Dexie, { type EntityTable } from 'dexie';
import { PetOverviewDto } from '@/app/model/pet';
import { MatchedItem } from '@/app/model/petMatchedItem';

const dbPet = new Dexie('PetDatabase') as Dexie & {
    pet: EntityTable<PetOverviewDto, 'pet_id'>;
    matched: EntityTable<MatchedItem, 'room_id'>; // Bảng matched
    selected: EntityTable<PetOverviewDto, 'pet_id'>; // Thêm bảng selected
};

dbPet.version(1).stores({
    pet: 'pet_id, pet_name, pet_type, pet_species, pet_image, pet_gender, pet_pricing, pet_status',
    matched: 'room_id, pet_id, partner_id, partner_avatar, partner_name, created_at',
    selected: 'pet_id, pet_name, pet_type, pet_species, pet_image, pet_gender, pet_pricing, pet_status' // Bảng selected
});

export { dbPet };
