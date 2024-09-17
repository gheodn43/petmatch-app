'use client'
import { useState, useEffect, ChangeEvent, MouseEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@headlessui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock } from "@fortawesome/free-solid-svg-icons";
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
        images: [] as string[],
    });

    const [showIcon, setShowIcon] = useState(true);

    useEffect(() => {
        if (petInfo.gender !== "Male") {
            setShowIcon(true);
        }
    }, [petInfo.gender]);

    const convertFileToBase64 = (file: File) => {
        return new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = reject;
        });
    };

    const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        const base64Images = await Promise.all(files.map(file => convertFileToBase64(file)));
        setPetInfo(prev => ({
            ...prev,
            images: [...prev.images, ...base64Images]
        }));
    };

    const handleRemoveImage = (indexToRemove: number) => {
        setPetInfo(prev => ({
            ...prev,
            images: prev.images.filter((_, index) => index !== indexToRemove)
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
            // Append simple fields
            Object.entries(petInfo).forEach(([key, value]) => {
                if (key !== "images") {
                    formData.append(key, value as string);
                }
            });

            // Append base64 images separately
            petInfo.images.forEach((base64Image, index) => {
                formData.append('images', base64Image);
            });

            await axios.post('/api/pet/create', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log('successfully')
            //router.push('/success'); 
        } catch (error) {
            console.error("Error creating pet profile", error);
        }
    };

    return (
        <div className="flex justify-center items-center">
            <div className="w-full max-w-2xl p-6">
                <h1 className="text-2xl font-bold mb-6">Thiết lập hồ sơ thú cưng</h1>
                <form className="space-y-6">
                    {/* Hàng 1: 2 ô input dạng select-option */}
                    <div className="flex space-x-4">
                        <select name="petType" className="flex-1 p-2 border border-gray-300 rounded" onChange={handleInputChange} value={petInfo.petType}>
                            <option value="" disabled hidden>Chọn loại thú cưng</option>
                            {petTypeOptions.map(({ label }) => (
                                <option key={label} value={label}>{label}</option>
                            ))}
                        </select>
                        <select name="petSpecies" className="flex-1 p-2 border border-gray-300 rounded" onChange={handleInputChange}>
                            <option value="" disabled hidden> Chọn giống thú cưng </option>
                            {petTypeOptions.find(({ label }) => label === petInfo.petType)?.species.map(species => (
                                <option key={species} value={species}>
                                    {species}
                                </option>
                            ))}
                            <option>Khác</option>
                        </select>
                    </div>

                    {/* Hàng 2: ô input dạng text */}
                    <input name="petName" type="text" placeholder="Tên thú cưng" className="w-full p-2 border border-gray-300 rounded" onChange={handleInputChange} />

                    {/* Hàng 3: 2 ô input dạng number */}
                    <div className="flex space-x-4">
                        <input name="petAge" type="number" placeholder="Tuổi" className="flex-1 p-2 border border-gray-300 rounded" onChange={handleInputChange} />
                        <input name="birthCount" type="number" placeholder="Số lần" className="flex-1 p-2 border border-gray-300 rounded" onChange={handleInputChange} />
                    </div>

                    {/* Hàng 4: chọn giới tính và ô input text */}
                    <div className="flex space-x-4">
                        <div className="flex space-x-4">
                            <label>
                                <input type="radio" name="gender" value="Male" checked={petInfo.gender === "Male"} onChange={() => handleGenderChange("Male")} />
                                <span className="ml-2">Đực</span>
                            </label>
                            <label>
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
                            <input
                                type="text"
                                placeholder="VNĐ"
                                className={` p-2 border border-gray-300 rounded`}
                                disabled={petInfo.gender !== 'Male'}
                                onChange={handleInputChange}
                            />
                        )}
                    </div>


                    {/* Hàng 5 & 6: input dạng file */}
                    <input name="images" type="file" multiple className="w-full p-2 border border-gray-300 rounded" onChange={handleImageChange} />
                    <input name="cerifications" type="file" multiple className="w-full p-2 border border-gray-300 rounded" onChange={handleImageChange} />
                    <div className="mt-2">
                        {petInfo.images.map((image, index) => (
                            <div key={index} className="relative inline-block mr-4">
                                <img
                                    src={image}
                                    alt={`Pet Image ${index + 1}`}
                                    className="h-24 w-24 object-cover rounded"
                                />
                                <button
                                    type="button"
                                    onClick={() => handleRemoveImage(index)}
                                    className="absolute top-0 right-0 p-1 bg-red-600 text-white rounded-full"
                                >
                                    X
                                </button>
                            </div>
                        ))}
                    </div>
                    {/* Hàng 7: nút submit */}
                    <Button onClick={handleSubmit} className="w-full p-2 border border-gray-300 rounded"> Tạo</Button>
                </form>
            </div>
        </div>
    );
}
