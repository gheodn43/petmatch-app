'use client';
import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import axios from 'axios';
import { format } from 'date-fns'; // Import thư viện date-fns để định dạng ngày
import { Blog } from '@/app/model/blog';

const CategoryBlogsPage = () => {
  const router = useRouter();
  const { category } = useParams();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch dữ liệu từ API theo category
  useEffect(() => {
    if (category) {
      axios
        .get(`/api/blog/${category}`)
        .then((response) => {
          setBlogs(response.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching blogs:', error);
          setLoading(false);
        });
    }
  }, [category]);

  // Hàm để định dạng ngày
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'dd MMM yyyy'); // Định dạng ngày thành dạng: 01 Jan 2024
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen text-black">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Blogs in Category: {category}</h1>
        {/* Nút để chuyển sang trang tạo blog */}
        <button
          onClick={() => router.push(`/blog/${category}/create`)}
          className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Create New Blog
        </button>
      </div>

      {loading ? (
        <p className="text-center">Loading...</p>
      ) : blogs.length === 0 ? (
        <p className="text-center">No blogs found in this category.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <div
              key={blog.blogId}
              className="bg-white shadow-md rounded-lg p-4 cursor-pointer"
              onClick={() => router.push(`/blog/${category}/${blog.blogId}`)}
            >
              <h2 className="text-xl font-semibold mb-2">{blog.title}</h2>
              {/* Định dạng ngày tháng cho `createdAt` */}
              <p className="text-xs text-gray-400">Created At: {formatDate(blog.createdAt)}</p>
              {blog.imageUrl.length > 0 && (
                <img src={blog.imageUrl[0]} alt={blog.title} className="w-full h-40 object-cover mt-2 rounded-lg" />
              )}
              <p className="text-sm mt-2">{blog.content.slice(0, 100)}...</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryBlogsPage;
