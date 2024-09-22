'use client'
import { useState, useEffect, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@headlessui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock,faFile, faTrash } from "@fortawesome/free-solid-svg-icons";
import { PetOverviewDto } from "@/app/model/pet";
import { dbPet} from '@/localDB/pet.db';
import axios from 'axios';

const petTypeOptions = [
    { label: "Chó", species: ["Husky", "Golden", "Chihuahua"] },
    { label: "Mèo", species: ["Maine Coon", "Siamese", "Persian"] },
    { label: "Hamster", species: ["Syrian", "Dwarf", "Roborovski"] }
];

export default function AddPetForm() {
    const router = useRouter();

    const [petInfo, setPetInfo] = useState({
        petType: "",
        petSpecies: "",
        petName: "",
        petAge: "",
        birthCount: "",
        gender: "",
        pricing: "",
        images: [] as File[],
        certificates: [] as File[]
    });

    const [showIcon, setShowIcon] = useState(true);

    useEffect(() => {
        if (petInfo.gender !== "Male") {
            setShowIcon(true);
        }
    }, [petInfo.gender]);

    const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
        let selectedImages = Array.from(e.target.files || []);
        if (selectedImages.length > 5) {
            selectedImages = selectedImages.slice(0, 5);
        }
        setPetInfo(prev => ({
            ...prev,
            images: [...prev.images, ...selectedImages].slice(0, 5)
        }));
    };
    

    const handleCertificateChange = async (e: ChangeEvent<HTMLInputElement>) => {
        let selectedCertificates = Array.from(e.target.files || []);
        if (selectedCertificates.length > 3) {
            selectedCertificates = selectedCertificates.slice(0, 3);
        }
        setPetInfo(prev => ({
            ...prev,
            certificates: [...prev.certificates, ...selectedCertificates]
        }));
    };

    const handleRemoveImage = (indexToRemove: number) => {
        setPetInfo(prev => ({
            ...prev,
            images: prev.images.filter((_, index) => index !== indexToRemove)
        }));
    };
    const handleRemoveCertificate = (indexToRemove: number) => {
        setPetInfo(prev => ({
            ...prev,
            certificates: prev.certificates.filter((_, index) => index !== indexToRemove)
        }));
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setPetInfo(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleGenderChange = (gender: string) => {
        setPetInfo(prev => ({
            ...prev,
            gender
        }));
        if (gender === "Male") {
            setShowIcon(false);
        } else {
            setShowIcon(true);
        }
    };

    const handleSubmit = async () => {
        try {
            const formData = new FormData();
            formData.append("petType", petInfo.petType);
            formData.append("petSpecies", petInfo.petSpecies);
            formData.append("petName", petInfo.petName);
            formData.append("petAge", petInfo.petAge);
            formData.append("birthCount", petInfo.birthCount);
            formData.append("gender", petInfo.gender);
            formData.append("pricing", petInfo.pricing);
            petInfo.images.forEach((image) => {
                formData.append(`images`, image);
            });
            petInfo.certificates.forEach((certificate) => {
                formData.append(`certificates`, certificate);
            });
            const response = await axios.post('/api/pet/create', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            const petOverview: PetOverviewDto = response.data;
            await dbPet.pet.put(petOverview);
            router.push('/home')
        } catch (error) {
            console.error("Error creating pet profile", error);
        }
    };

    return (
        <div className="flex justify-center items-start h-screen mt-20">
            <div className="w-full max-w-2xl p-6">
                <h1 className="text-[#FFC629] font-black font-sans tracking-[5px] text-xl flex items-center justify-center">Thiết lập hồ sơ thú cưng</h1>
                <form className="space-y-6 mt-10">
                    {/* Hàng 1: 2 ô input dạng select-option */}
                    <div className="flex space-x-4 text-gray-900">
                        <select name="petType" className="flex-1 p-2 border border-gray-300 rounded" onChange={handleInputChange} value={petInfo.petType}>
                            <option value="" disabled hidden>Chọn loại thú cưng</option>
                            {petTypeOptions.map(({ label }) => (
                                <option key={label} value={label}>{label}</option>
                            ))}
                        </select>
                        <select name="petSpecies" className="flex-1 p-2 border border-gray-300 rounded" onChange={handleInputChange}>
                            <option value="" disabled hidden> Chọn giống thú cưng </option>
                            {petTypeOptions.find(({ label }) => label === petInfo.petType)?.species.map(species => (
                                <option key={species} value={species}> {species}</option>
                            ))}
                            <option>Khác</option>
                        </select>
                    </div>

                    <input name="petName" type="text" placeholder="Tên thú cưng" className="w-full p-2 border border-gray-300 rounded text-gray-900" onChange={handleInputChange} />

                    {/* Hàng 3: 2 ô input dạng number */}
                    <div className="flex space-x-4">
                        <input name="petAge" type="number" placeholder="Tuổi" className="flex-1 p-2 border border-gray-300 rounded text-gray-900" onChange={handleInputChange} />
                        <input name="birthCount" type="number" placeholder="Số lần" className="flex-1 p-2 border border-gray-300 rounded text-gray-900" onChange={handleInputChange} />
                    </div>

                    {/* Hàng 4: chọn giới tính và ô input text */}
                    <div className="flex items-center space-x-4 text-gray-900">
                        <div className="flex space-x-4">
                            <label className="flex items-center justify-center">
                                <input type="radio" name="gender" value="Male" checked={petInfo.gender === "Male"} onChange={() => handleGenderChange("Male")} />
                                <span className="ml-2">Đực</span>
                            </label>
                            <label className="flex items-center justify-center">
                                <input type="radio" name="gender" value="Female" checked={petInfo.gender === "Female"} onChange={() => handleGenderChange("Female")} />
                                <span className="ml-2">Cái</span>
                            </label>
                        </div>
                        {showIcon ? (
                            <FontAwesomeIcon
                                icon={faLock}
                                size="2x"
                                className=" text-gray-400"
                            />
                        ) : (
                            <input type="text" name="pricing" placeholder="VNĐ" className="p-2 border border-gray-300 rounded"
                                disabled={petInfo.gender !== 'Male'}
                                onChange={handleInputChange}
                            />
                        )}
                    </div>

                    <input name="images" type="file" accept=".png, .jpg, .jpeg" multiple className="w-full p-2 border border-gray-300 rounded text-gray-900" onChange={handleImageChange} />
                    <div className="mt-2">
                        {petInfo.images.map((image, index) => (
                            <div key={index} className="relative inline-block mr-4 text-gray-900">
                                <img
                                    src={URL.createObjectURL(image)}
                                    alt={`Pet Image ${index + 1}`}
                                    className="h-24 w-24 object-cover rounded"
                                />
                                <button
                                    type="button"
                                    onClick={() => handleRemoveImage(index)}
                                    className="absolute -top-4 -right-4 bg-red-600 px-1 text-white rounded-full"
                                >
                                    X
                                </button>
                            </div>
                        ))}
                    </div>
                    <input name="certificates" type="file" accept=".png, .jpg, .jpeg, .pdf" multiple className="w-full p-2 border border-gray-300 rounded text-gray-900" onChange={handleCertificateChange} />

                    <div className="mt-2">
                    {petInfo.certificates.map((certificate, index) => (
                        <div key={index} className="flex justify-between items-center bg-gray-100 p-3 mb-2 rounded-lg">
                        <div className="flex items-center">
                            <FontAwesomeIcon icon={faFile} size="2xl" className="text-gray-500 mr-5" />
                            <div>
                            <p className="text-gray-800">{certificate.name}</p>
                            <p className="text-gray-500 text-sm">{(certificate.size / 1024).toFixed(2)} KB</p> {/* Hiển thị kích thước file KB */}
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => handleRemoveCertificate(index)}
                            className="text-red-600 hover:text-red-800"
                        >
                            <FontAwesomeIcon icon={faTrash} />
                        </button>
                        </div>
                    ))}
                    </div>
                    <Button onClick={handleSubmit} className="w-full p-2 border border-gray-300 rounded bg-gradient-to-r from-[#FFC300] to-[#FEDF79] text-black font-semibold text-2cl"> Tạo</Button>
                </form>
            </div>
        </div>
    );
}
