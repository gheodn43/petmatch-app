"use client";
import React, { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"; // Import Firebase Storage SDK
import { storage } from "@/lib/firebase";
import axios from "axios";

// Import `ReactQuill` dynamically để ngắt SSR (Server-Side Rendering)
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

// Hàm upload ảnh lên Firebase Storage
const uploadImage = async (file: File) => {
  try {
    const storageRef = ref(storage, `uploads/${Date.now()}_${file.name}`); // Tạo tham chiếu tới Firebase Storage
    await uploadBytes(storageRef, file); // Tải file lên Firebase Storage
    const downloadURL = await getDownloadURL(storageRef); // Lấy URL sau khi tải lên thành công
    return downloadURL; // Trả về URL của ảnh đã tải lên
  } catch (error) {
    console.error("Failed to upload image:", error);
    throw new Error("Failed to upload image");
  }
};

export default function MyComponent() {
  const [title, setTitle] = useState(""); // Tiêu đề của blog
  const [category, setCategory] = useState(""); // Danh mục của blog
  const [content, setContent] = useState(""); // Nội dung của trình soạn thảo

  // Hàm xử lý khi nội dung trong editor thay đổi
  const handleChange = (content: string) => {
    setContent(content); // Cập nhật state value với nội dung mới
  };

  // Hàm xử lý khi người dùng nhấn nút hình ảnh trên toolbar
  const imageHandler = useCallback(() => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      const file = input.files ? input.files[0] : null;
      if (file) {
        try {
          // Upload trực tiếp lên Firebase và nhận URL thực tế
          const imageUrl = await uploadImage(file);

          // Chèn URL của ảnh từ Firebase vào nội dung hiện tại
          setContent((prevContent) => `${prevContent}<img src="${imageUrl}" alt="uploaded image"/>`);
        } catch (error) {
          console.error("Failed to upload image:", error);
        }
      }
    };
  }, []);

  // Hàm gửi dữ liệu lên API
  const handleSubmit = async () => {
    if (!title || !content) {
      alert("Please enter both title and content");
      return;
    }

    try {
      // Gửi dữ liệu tiêu đề, nội dung và danh mục (category) lên server
      const response = await axios.post("/api/blog/create", {
        title: title,
        content: content,
        category: category, // Danh mục mà người dùng đã chọn
      });

      console.log("Blog created successfully:", response.data);
      alert("Blog created successfully!");
      setTitle(""); // Reset lại tiêu đề
      setContent(""); // Reset lại nội dung
    } catch (error) {
      console.error("Failed to create blog:", error);
      alert("Failed to create blog!");
    }
  };

  return (
    <div className="text-gray-900 bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl mx-auto mt-10">
      <h1 className="text-2xl font-extrabold mb-6 text-center text-gradient bg-gradient-to-r from-[#FFC629] via-[#FFD971] to-[#FFC629] h-16 flex items-center justify-center">
        Create a New Blog
      </h1>

      {/* Trường nhập tiêu đề */}
      <div className="mb-6">
        <label className="block text-lg font-medium mb-2 text-gray-700" htmlFor="title">
          Blog Title:
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter your blog title"
          className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FFC629] focus:border-transparent"
        />
      </div>

      {/* Dropdown chọn Category */}
      <div className="mb-6">
        <label className="block text-lg font-medium mb-2 text-gray-700" htmlFor="category">
          Select Category:
        </label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FFC629] focus:border-transparent"
        >
          <option hidden value="">
            Select a Category
          </option>
          <option value="Chó">Chó</option>
          <option value="Mèo">Mèo</option>
          <option value="Hamster">Hamster</option>
        </select>
      </div>

      {/* Trình soạn thảo văn bản ReactQuill */}
      <div className="mb-6">
        <label className="block text-lg font-medium mb-2 text-gray-700">Blog Content:</label>
        <ReactQuill
          theme="snow"
          placeholder="Start writing..."
          modules={{
            toolbar: {
              container: [
                [{ header: "1" }, { header: "2" }, { font: [] }],
                [{ size: [] }],
                ["bold", "italic", "underline", "strike", "blockquote"],
                [
                  { list: "ordered" },
                  { list: "bullet" },
                  { indent: "-1" },
                  { indent: "+1" },
                ],
                ["link", "image", "video"],
                ["code-block"],
                ["clean"],
              ],
              handlers: {
                image: imageHandler,
              },
            },
            clipboard: {
              matchVisual: false,
            },
          }}
          formats={[
            "header",
            "font",
            "size",
            "bold",
            "italic",
            "underline",
            "strike",
            "blockquote",
            "list",
            "bullet",
            "indent",
            "link",
            "image",
            "video",
            "code-block",
          ]}
          value={content}
          onChange={handleChange}
          className="border border-gray-300 rounded-lg shadow-sm"
        />
      </div>

      {/* Nút Submit để gửi dữ liệu */}
      <div className="flex justify-center">
        <button
          onClick={handleSubmit}
          className="px-6 py-3 bg-gradient-to-r from-[#FFC629] via-[#FFD971] to-[#FFC629] text-black font-bold rounded-lg shadow-lg transform hover:scale-105 transition duration-200 hover:bg-[#FFD971]"
        >
          Submit Blog
        </button>
      </div>
    </div>
  );
}
