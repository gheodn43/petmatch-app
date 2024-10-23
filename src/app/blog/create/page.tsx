"use client";
import React, { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "@/lib/firebase";
import axios from "axios";

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

// Upload image to Firebase
const uploadImage = async (file: File) => {
  try {
    const storageRef = ref(storage, `uploads/${Date.now()}_${file.name}`);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (error) {
    console.error("Image upload failed:", error);
    throw new Error("Failed to upload image. Please try again.");
  }
};

export default function MyComponent() {
  const [title, setTitle] = useState(""); // Blog title state
  const [category, setCategory] = useState(""); // Blog category state
  const [content, setContent] = useState(""); // Blog content state
  const [loading, setLoading] = useState(false); // Loading state

  const handleChange = (content: string) => setContent(content);

  const imageHandler = useCallback(() => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      const file = input.files?.[0];
      if (file) {
        try {
          const imageUrl = await uploadImage(file);
          setContent((prevContent) => `${prevContent}<img src="${imageUrl}" alt="Uploaded image"/>`);
        } catch (error) {
          alert(error.message);
        }
      }
    };
  }, []);

  const handleSubmit = async () => {
    if (!title || !content || !category) {
      alert("Please complete all fields.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("/api/blog/create", {
        title,
        content,
        category,
      });

      alert("Blog created successfully!");
      console.log("Blog created:", response.data);
      setTitle("");
      setCategory("");
      setContent("");
    } catch (error) {
      console.error("Failed to create blog:", error);
      alert("Failed to create blog. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-gray-900 bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl mx-auto mt-10">
      <h1 className="text-2xl font-extrabold mb-6 text-center bg-gradient-to-r from-[#FFC629] via-[#FFD971] to-[#FFC629] h-16 flex items-center justify-center">
        Create a New Blog
      </h1>

      <div className="mb-6">
        <label htmlFor="title" className="block text-lg font-medium mb-2 text-gray-700">
          Blog Title:
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter your blog title"
          className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[#FFC629]"
        />
      </div>

      <div className="mb-6">
        <label htmlFor="category" className="block text-lg font-medium mb-2 text-gray-700">
          Select Category:
        </label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[#FFC629]"
        >
          <option hidden value="">
            Select a Category
          </option>
          <option value="Chó">Chó</option>
          <option value="Mèo">Mèo</option>
          <option value="Hamster">Hamster</option>
        </select>
      </div>

      <label className="block text-lg font-medium mb-2 text-gray-700">Blog Content:</label>
      <div className="mb-20 overflow-auto" style={{ maxHeight: "300px" }}>  
        <ReactQuill
          theme="snow"
          placeholder="What are you thinking..."
          modules={{
            toolbar: {
              container: [
                [{ header: "1" }, { header: "2" }, { font: [] }],
                [{ size: [] }],
                ["bold", "italic", "underline", "strike", "blockquote"],
                [{ list: "ordered" }, { list: "bullet" }],
                ["link", "image", "video"],
                ["clean"],
              ],
              handlers: { image: imageHandler },
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
            "link",
            "image",
            "video",
          ]}
          value={content}
          onChange={handleChange}
          className="border border-gray-300 rounded-lg shadow-sm"
        />
      </div>

      <div className="fixed bottom-5 left-0 right-0 flex justify-center mb-14">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`px-6 py-3 bg-gradient-to-r from-[#FFC629] via-[#FFD971] to-[#FFC629] text-black font-bold rounded-lg shadow-lg transition-transform transform ${
            loading ? "opacity-50 cursor-not-allowed" : "hover:scale-105"
          }`}
        >
          {loading ? "Submitting..." : "Submit Blog"}
        </button>
      </div>
    </div>
  );
}
