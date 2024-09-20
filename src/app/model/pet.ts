import { Reviewing } from "./review";
export const PET_STATUS = {
    ACTIVE: 'active',
    HIBERNATING: 'hibernating',   
    BLOCKED: 'blocked',            
};
export interface Pet {
    user_id: string;    //owner
    pet_id: string;
    pet_type: string;
    pet_species: string;
    pet_name: string;
    pet_age: string;
    pet_birth_count: string;
    pet_gender: string;
    pet_pricing: string;
    pet_images: string[];           
    pet_certificates: string[];     
    pet_status: string;
    pet_liked: string[];
    pet_unliked: string[];
    pet_matched: string[];
    pet_star: number; 
    pet_review: Reviewing[];     
}
export class CreatePetDto {
    user_id: string;
    pet_type: string;
    pet_species: string;
    pet_name: string;
    pet_age: string;
    pet_birth_count: string;
    pet_gender: string;
    pet_pricing: string;
    pet_images: string[];
    pet_certificates: string[];
    pet_status: string;
    pet_liked: string[];
    pet_unliked: string[];
    pet_matched: string[];
    pet_star: number; 
    pet_review: Reviewing[];

    constructor(data: any) {
        this.user_id = data.user_id;
        this.pet_type = data.pet_type;
        this.pet_species = data.pet_species;
        this.pet_name = data.pet_name;
        this.pet_age = data.pet_age;
        this.pet_birth_count = data.pet_birth_count;
        this.pet_gender = data.pet_gender;
        this.pet_pricing = data.pet_pricing;
        this.pet_images = data.pet_images || [];
        this.pet_certificates = data.pet_certificates || [];
        this.pet_status = data.pet_status || PET_STATUS.ACTIVE;
        this.pet_liked = data.pet_liked || [];
        this.pet_unliked = data.pet_unliked || [];
        this.pet_matched = data.pet_matched || [];
        this.pet_star = data.pet_star || 0;
        this.pet_review = data.pet_review || [];
    }
}


export class PetOverviewDto {
    pet_id: string;
    pet_name: string;
    pet_type: string;
    pet_species: string;
    pet_image: string;
    pet_gender: string;
    pet_pricing: string;
    pet_status: string;

    constructor(data: any) {
        this.pet_id = data.pet_id;
        this.pet_name = data.pet_name;
        this.pet_type = data.pet_type;
        this.pet_species = data.pet_species;
        this.pet_image = data.pet_image;
        this.pet_gender = data.pet_gender;
        this.pet_pricing = data.pet_pricing;
        this.pet_status = data.pet_status;
    }
}

export class PetDetailDto {
    pet_id: string;
    pet_name: string;
    pet_type: string;
    pet_species: string;
    pet_age: string;
    pet_birth_count: string;
    pet_gender: string;
    pet_pricing: string;
    pet_images: string[];
    pet_certificates: string[];
    pet_status: string;
    user_id: string;

    constructor(data: any) {
        this.pet_id = data.pet_id;
        this.pet_name = data.pet_name;
        this.pet_type = data.pet_type;
        this.pet_species = data.pet_species;
        this.pet_age = data.pet_age;
        this.pet_birth_count = data.pet_birth_count;
        this.pet_gender = data.pet_gender;
        this.pet_pricing = data.pet_pricing;
        this.pet_images = data.pet_images;
        this.pet_certificates = data.pet_certificates;
        this.pet_status = data.pet_status;
        this.user_id = data.user_id;
    }
}
