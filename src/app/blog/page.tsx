'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { format } from 'date-fns';

interface Blog {
  blogId: string;
  title: string;
  category: string;
  content: string;
  authorId: string;
  createdAt: string;
}

export default function CategoryBlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]); // Danh sách các blog
  const [loading, setLoading] = useState(false); // Trạng thái loading
  const [lastKey, setLastKey] = useState<string | null>(null); // Khóa cuối cùng của danh sách đã tải
  const [limit] = useState(10); // Số lượng blog muốn lấy mỗi lần
  const router = useRouter();
  const observerRef = useRef<HTMLDivElement | null>(null); // Tạo một ref cho observer

  // Hàm gọi API để lấy blog từ server với phân trang
  const fetchBlogs = async () => {
    if (loading) return; // Nếu đang trong trạng thái loading, không gọi API nữa
    setLoading(true);
    try {
      const response = await axios.get('/api/blog', {
        params: {
          limit: limit, // Số lượng blog mỗi lần lấy
          lastKey: lastKey, // Khóa cuối cùng của request trước đó
        },
      });

      const { blogs: newBlogs, lastKey: newLastKey } = response.data;

      setBlogs((prevBlogs) => [...prevBlogs, ...newBlogs]); // Thêm các blog mới vào danh sách hiện tại
      setLastKey(newLastKey); // Cập nhật khóa cuối cùng cho lần tải sau
    } catch (error) {
      console.error('Error fetching blogs:', error);
    }
    setLoading(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'dd MMM yyyy'); // Định dạng ngày thành dạng: 01 Jan 2024
  };

  // Gọi hàm `fetchBlogs` khi component được mount lần đầu
  useEffect(() => {
    fetchBlogs();
  }, []);

  // Sử dụng IntersectionObserver để tự động tải thêm dữ liệu khi cuộn tới cuối
  useEffect(() => {
    if (loading) return; // Không chạy observer khi đang loading
    const observer = new IntersectionObserver(
      (entries) => {
        // Kiểm tra nếu phần tử cuối cùng xuất hiện trong view
        if (entries[0].isIntersecting && lastKey) {
          fetchBlogs(); // Tự động gọi API để tải thêm blog
        }
      },
      { threshold: 1.0 } // Chỉ kích hoạt khi toàn bộ phần tử trong view
    );

    if (observerRef.current) {
      observer.observe(observerRef.current); // Gắn observer với phần tử cuối cùng trong danh sách
    }

    return () => {
      if (observerRef.current) observer.unobserve(observerRef.current); // Cleanup observer
    };
  }, [lastKey, loading]);

  return (
    <div className="text-black p-4">
      <div className="flex justify-between items-center mb-6">
        {/* Nút để chuyển sang trang tạo blog */}
        <button
          onClick={() => router.push(`/blog/create`)}
          className="p-2 bg-[#FCD146] text-black rounded hover:bg-[#FFC300]"
        >
          Create New Blog
        </button>
      </div>
      {loading && blogs.length === 0 ? (
        <div className="flex justify-center">
          {/* Spinner khi đang tải dữ liệu lần đầu */}
          <div className="spinner"></div>
        </div>
      ) : blogs.length === 0 ? (
        <p className="text-center">No blogs found in this category.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {blogs.map((blog) => (
            <div
              key={blog.blogId}
              className="bg-white shadow-md rounded-lg p-4 cursor-pointer"
              onClick={() => router.push(`/blog/${blog.category}/${blog.blogId}`)}
            >
              <h2 className="text-xl font-semibold mb-2">{blog.title}</h2>
              {/* Định dạng ngày tháng cho `createdAt` */}
              <p className="text-xs text-gray-400">Created At: {formatDate(blog.createdAt)}</p>
              <div
                className="text-sm mt-2"
                dangerouslySetInnerHTML={{
                  __html: blog.content.length > 100 ? `${blog.content.slice(0, 100)}...` : blog.content,
                }}
              ></div>
            </div>
          ))}
        </div>
      )}

      {/* Phần tử vô hình để gắn với observer */}
      <div ref={observerRef} className="h-1"></div>

      {/* Hiển thị trạng thái loading khi kéo xuống cuối trang */}
      {loading && blogs.length > 0 && (
        <div className="lds-ripple"><div></div><div></div></div>
      )}
    </div>
  );
}
