import Dexie, { type EntityTable } from 'dexie';
import { PetOverviewDto } from '@/app/model/pet';


const dbPet = new Dexie('PetDatabase') as Dexie & {
    pet: EntityTable<PetOverviewDto, 'pet_id'>;
};
dbPet.version(1).stores({
    pet: 'pet_id, pet_name, pet_type, pet_species, pet_image, pet_gender, pet_pricing, pet_status'
});
const samplePets = [{
    pet_id: '12345',
    pet_name: 'Max',
    pet_type: 'Dog',
    pet_species: 'Labrador',
    pet_image: 'images/logo-color.png',
    pet_gender: 'Male',
    pet_pricing: '500 USD',
    pet_status: 'active'
}];
const addSamplePetsToDb = async () => {
    try {
        await dbPet.pet.clear();
        await dbPet.pet.bulkAdd(samplePets);
        console.log('Sample pets added to the database successfully.');
    } catch (error) {
        console.error('Error adding sample pets to the database:', error);
    }
};


export { dbPet, addSamplePetsToDb };

