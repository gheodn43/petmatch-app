'use client';
import React, { useState, useEffect, useCallback } from 'react';
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
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Fetch all blogs from the API
  const fetchBlogs = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/blog', {
        params: { limit: 100 }, // Adjust the limit as needed
      });

      setBlogs(response.data.blogs);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch blogs on mount
  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  // Format date utility
  const formatDate = (dateString: string) =>
    format(new Date(dateString), 'dd MMM yyyy');

  return (
    <div className="text-black p-4">
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => router.push('/blog/create')}
          className="p-2 bg-[#FCD146] text-black rounded hover:bg-[#FFC300]"
        >
          Create New Blog
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center">
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
              <p className="text-xs text-gray-400">Created At: {formatDate(blog.createdAt)}</p>
              <div
                className="text-sm mt-2"
                dangerouslySetInnerHTML={{
                  __html:
                    blog.content.length > 100
                      ? `${blog.content.slice(0, 100)}...`
                      : blog.content,
                }}
              ></div>
            </div>
          ))}
        </div>
      )}

      {blogs.length > 0 && <div className="text-center">All blogs loaded.</div>}
    </div>
  );
}
