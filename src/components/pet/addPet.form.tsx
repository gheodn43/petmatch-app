'use client'
import { useState, useEffect, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@headlessui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock, faFile, faTrash } from "@fortawesome/free-solid-svg-icons";
import { PetOverviewDto } from "@/app/model/pet";
import { dbPet } from '@/localDB/pet.db';
import axios from 'axios';

const petTypeOptions = [
    { label: "Chó", species: ["Husky", "Golden", "Chihuahua"] },
    { label: "Mèo", species: ["Maine Coon", "Siamese", "Persian"] },
    { label: "Hamster", species: ["Syrian", "Dwarf", "Roborovski"] }
];

export default function AddPetForm() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);


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
        let newValue = value;


        if (name === 'petAge') {
            const age = parseFloat(value);
            if (age < 0.5) {
                newValue = '0.5'; // Đặt giá trị bằng min
            } else if (age > 9) {
                newValue = '9'; // Đặt giá trị bằng max
            }
        } else if (name === 'birthCount') {
            const count = parseInt(value);
            if (count < 0) {
                newValue = '0'; // Đặt giá trị bằng min
            } else if (count > 10) {
                newValue = '10'; // Đặt giá trị bằng max
            }
        } else if (name === 'pricing') {
            // Loại bỏ tất cả các dấu phẩy trước khi xử lý
            const numericValue = value.replace(/,/g, '');

            // Định dạng lại số với dấu phẩy
            newValue = new Intl.NumberFormat().format(Number(numericValue));
        }

        setPetInfo(prev => ({
            ...prev,
            [name]: newValue
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
        const { petType, petSpecies, petName, petAge, birthCount, gender, pricing, images } = petInfo;

        // Kiểm tra các trường bắt buộc
        if (!petType || !petSpecies || !petName || !petAge || !birthCount || !gender || (gender === "Male" && !pricing) || images.length === 0) {
            alert("Vui lòng nhập tất cả các trường bắt buộc!");
            return;
        }

        try {
            setIsSubmitting(true); // Bắt đầu quá trình xử lý
            const formData = new FormData();
            formData.append("petType", petInfo.petType);
            formData.append("petSpecies", petInfo.petSpecies);
            formData.append("petName", petInfo.petName);
            formData.append("petAge", petInfo.petAge);
            formData.append("birthCount", petInfo.birthCount);
            formData.append("gender", petInfo.gender);
            formData.append("pricing", petInfo.pricing);
            petInfo.images.forEach((image) => {
                formData.append("images", image);
            });
            petInfo.certificates.forEach((certificate) => {
                formData.append("certificates", certificate);
            });

            const response = await axios.post('/api/pet/create', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            const petOverview: PetOverviewDto = response.data;
            await dbPet.pet.put(petOverview);
            router.push('/home');
        } catch (error) {
            console.error("Error creating pet profile", error);
        } finally {
            setIsSubmitting(false);
        }
    };


    return (
        <div className="flex justify-center items-start h-screen">
            <div className="w-full max-w-2xl p-4">
                <h1 className="text-[#FFC629] font-black font-sans tracking-[5px] text-xl flex items-center justify-center">
                    Thiết lập hồ sơ thú cưng
                </h1>
                <form className="space-y-6 mt-6">
                    {/* Hàng 1: 2 ô input dạng select-option */}
                    <div className="flex space-x-4 text-gray-900">
                        <div className="flex-1">
                            <label htmlFor="petType" className="block text-[#666666] font-semibold text-sm pb-2 ">
                                Thú cưng của bạn là? <span className="text-[#C71919]">*</span>
                            </label>
                            <select id="petType" name="petType" className="w-full p-2 border border-gray-300 rounded" onChange={handleInputChange} value={petInfo.petType}
                            >
                                <option value="" disabled hidden>
                                    Chọn loại thú cưng
                                </option>
                                {petTypeOptions.map(({ label }) => (
                                    <option key={label} value={label}>
                                        {label}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="flex-1">
                            <label htmlFor="petSpecies" className="block text-[#666666] font-semibold text-sm pb-2 ">
                                Giống thú cưng của bạn là? <span className="text-[#C71919]">*</span>
                            </label>
                            <select id="petSpecies" name="petSpecies" className="w-full p-2 border border-gray-300 rounded" onChange={handleInputChange} value={petInfo.petSpecies}
                            >
                                <option value="" disabled hidden>
                                    Chọn giống thú cưng
                                </option>
                                {petTypeOptions
                                    .find(({ label }) => label === petInfo.petType)
                                    ?.species.map((species) => (
                                        <option key={species} value={species}>
                                            {species}
                                        </option>
                                    ))}
                                <option>Khác</option>
                            </select>
                        </div>
                    </div>

                    {/* Tên thú cưng */}
                    <div>
                        <label htmlFor="petName" className="block text-[#666666] font-semibold text-sm pb-2 ">
                            Tên thú cưng <span className="text-[#C71919]">*</span>
                        </label>
                        <input
                            id="petName"
                            name="petName"
                            type="text"
                            placeholder="Tên"
                            className="w-full p-2 border border-gray-300 rounded text-gray-900"
                            onChange={handleInputChange}
                            value={petInfo.petName}
                        />
                    </div>

                    {/* Hàng 3: Tuổi và số lần sinh */}
                    <div className="flex space-x-4">
                        <div className="flex-1">
                            <label htmlFor="petAge" className="block text-[#666666] font-semibold text-sm pb-2 ">
                                Tuổi của bé là? <span className="text-[#C71919]">*</span>
                            </label>
                            <input
                                id="petAge"
                                name="petAge"
                                type="number"
                                placeholder="Tuổi"
                                className="w-full p-2 border border-gray-300 rounded text-gray-900"
                                onChange={handleInputChange}
                                value={petInfo.petAge}
                                min="0.5"
                                max="9"
                                step="0.1"  // Để cho phép nhập các giá trị thập phân
                            />
                        </div>
                        <div className="flex-1">
                            <label htmlFor="birthCount" className="block text-[#666666] font-semibold text-sm pb-2">
                                Bé đã sinh sản bao nhiêu lần? <span className="text-[#C71919]">*</span>
                            </label>
                            <input
                                id="birthCount"
                                name="birthCount"
                                type="number"
                                placeholder="Số lần"
                                className="w-full p-2 border border-gray-300 rounded text-gray-900"
                                onChange={handleInputChange}
                                value={petInfo.birthCount}
                                min="0"
                                max="10"
                            />
                        </div>
                    </div>


                    {/* Giới tính và giá */}

                    <div className="items-center ">
                        <label className="block text-[#666666] font-semibold text-sm pb-2">
                            Giới tính <span className="text-[#C71919]">*</span>
                        </label>
                        <div className="flex space-x-4 text-gray-900">
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

                            {/* Lock Icon with animation */}
                            {showIcon ? (
                                <FontAwesomeIcon icon={faLock} size="2x" className="text-gray-400 transform transition-transform duration-500 ease-in-out scale-100" style={{ transform: showIcon ? 'scale(1)' : 'scale(0)' }} />
                            ) : (
                                <input
                                    type="text"
                                    name="pricing"
                                    placeholder="VNĐ"
                                    className="p-2 border border-gray-300 rounded transform transition-transform duration-500 ease-in-out scale-100"
                                    style={{ transform: showIcon ? 'scale(0)' : 'scale(1)' }}
                                    disabled={petInfo.gender !== "Male"}
                                    onChange={handleInputChange}
                                    value={petInfo.pricing} // Hiển thị giá trị đã định dạng
                                />
                            )}
                        </div>
                    </div>

                    {/* Hình ảnh */}
                    <div>
                        <label className="block text-[#666666] font-semibold text-sm pb-2">
                            Hình ảnh ({petInfo.images.length}/5) <span className="text-[#C71919]">*</span>
                        </label>

                        <input name="images" type="file" accept=".png, .jpg, .jpeg" multiple className="w-full p-2 border border-gray-300 rounded text-gray-900"
                            onChange={(e) => {
                                if (e.target.files && e.target.files.length > 5) {
                                    alert("Bạn chỉ có thể chọn tối đa 5 hình ảnh.");
                                    e.target.value = ""; // Reset input nếu chọn quá số lượng file
                                } else {
                                    handleImageChange(e);
                                }
                            }}
                        />

                        <div className="mt-4 grid grid-cols-5 gap-4">
                            {petInfo.images.map((image, index) => (
                                <div key={index} className="relative text-gray-900">
                                    <img
                                        src={URL.createObjectURL(image)}
                                        alt={`Pet Image ${index + 1}`}
                                        className="h-40 w-full object-cover rounded-lg shadow-lg"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveImage(index)}
                                        className="absolute top-0 right-0 bg-red-600 text-white rounded-full h-6 w-6 flex items-center justify-center transform translate-x-2 -translate-y-2 hover:bg-red-700"
                                    >
                                        &times;
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Chứng chỉ */}
                    <div>
                        <label className="block text-[#666666] font-semibold text-sm pb-2">
                            Chứng chỉ ({petInfo.certificates.length}/3)
                        </label>
                        <input
                            name="certificates"
                            type="file"
                            accept=".png, .jpg, .jpeg, .pdf"
                            multiple
                            className="w-full p-2 border border-gray-300 rounded text-gray-900"
                            onChange={(e) => {
                                if (e.target.files && e.target.files.length > 3) {
                                    alert("Bạn chỉ có thể chọn tối đa 3 file.");
                                    e.target.value = ""; // Reset input nếu chọn quá số lượng file
                                } else {
                                    handleCertificateChange(e);
                                }
                            }}
                        />
                        <div className="mt-2">
                            {petInfo.certificates.map((certificate, index) => (
                                <div
                                    key={index}
                                    className="flex justify-between items-center bg-gray-100 p-3 mb-2 rounded-lg"
                                >
                                    <div className="flex items-center">
                                        <FontAwesomeIcon icon={faFile} size="2xl" className="text-gray-500 mr-5" />
                                        <div>
                                            <p className="text-gray-800">{certificate.name}</p>
                                            <p className="text-gray-500 text-sm">
                                                {(certificate.size / 1024).toFixed(2)} KB
                                            </p>
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
                    </div>

                    <Button
                        onClick={handleSubmit}
                        disabled={isSubmitting} // Vô hiệu hóa nút khi đang submit
                        className={`w-full p-2 border border-gray-300 rounded bg-gradient-to-r from-[#FFC300] to-[#FEDF79] text-black font-semibold text-2cl ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {isSubmitting ? "Đang tạo..." : "Tạo"}
                    </Button>
                </form>
            </div>
        </div>
    );
}