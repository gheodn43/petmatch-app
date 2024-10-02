'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import { Blog, Comment } from '@/app/model/blog';

const BlogDetailPage = () => {
  const { category, blogId } = useParams(); // Lấy category và blogId từ URL
  const [blog, setBlog] = useState<Blog | null>(null);
  const [comments, setComments] = useState<Comment[]>([]); // Danh sách comment
  const [loading, setLoading] = useState<boolean>(true);
  const [comment, setComment] = useState<string>(''); // Biến lưu trữ comment của người dùng
  const commentSectionRef = useRef<HTMLDivElement | null>(null); // Ref để scroll đến phần comment

  // Hàm lấy chi tiết blog khi component được mount
  useEffect(() => {
    if (blogId) {
      fetchBlogDetails();
      fetchComments();
    }
  }, [category, blogId]);

  // Hàm lấy thông tin chi tiết của blog
  const fetchBlogDetails = async () => {
    try {
      const response = await axios.get(`/api/blog/${category}/${blogId}`);
      setBlog(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching blog details:', error);
      setLoading(false);
    }
  };

  // Hàm lấy danh sách comment
  const fetchComments = async () => {
    try {
      const response = await axios.get(`/api/comments?blogId=${blogId}`);
      setComments(response.data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  // Hàm xử lý khi người dùng submit comment
  const handleCommentSubmit = async () => {
    if (!comment.trim()) {
      alert('Comment cannot be empty!');
      return;
    }

    try {
      const response = await axios.post('/api/comments', {
        blogId,
        authorId: 'cb7bbce9-b70c-4292-a2c2-ea7beadb421a', //TODO chỉnh userID
        content: comment
      });

      console.log('Comment created:', response.data);
      setComment(''); // Reset ô nhập comment sau khi thêm thành công
      await fetchComments(); // Lấy lại danh sách comment mới sau khi thêm
      if (commentSectionRef.current) {
        commentSectionRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    } catch (error) {
      console.error('Error creating comment:', error);
    }
  };

  if (loading) {
    return <p>Loading blog...</p>;
  }

  if (!blog) {
    return <p>Blog not found</p>;
  }
  console.log(comments);


  return (
    <div className="p-6 min-h-screen text-black">
      {/* Khu vực hiển thị chi tiết blog */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-4">{blog.title}</h1>
        <div className="text-xs text-gray-400 mb-4">Created At: {new Date(blog.createdAt).toLocaleString()}</div>
        <div dangerouslySetInnerHTML={{ __html: blog.content }} className="text-base leading-6" />
      </div>

      {/* Khu vực hiển thị các comment hiện có */}
      <div className="bg-white mt-6 p-4 rounded-lg shadow-lg" ref={commentSectionRef}>
        <h3 className="text-lg font-bold mb-4">Comments</h3>
        {comments.length === 0 ? (
          <p>No comments yet. Be the first to comment!</p>
        ) : (
          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment.commentId} className="border-b border-gray-300 pb-2">
                <p className="text-sm">
                  <strong>{comment.authorName}</strong>: {comment.content}
                </p>
                <p className="text-xs text-gray-400">{new Date(comment.createdAt).toLocaleString()}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Khu vực nhập comment */}
      <div className="bg-white mt-6 p-4 rounded-lg shadow-lg">
        <h3 className="text-lg font-bold mb-4">Add a Comment</h3>
        {/* Container cho textarea và button */}
        <div className="flex items-start space-x-4">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = 'auto';
              target.style.height = `${target.scrollHeight}px`;
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault(); // Ngăn chặn hành vi mặc định (tạo dòng mới)
                handleCommentSubmit(); // Gọi hàm submit khi nhấn Enter
              }
            }}
            placeholder="Write your comment here..."
            className="w-full h-10 p-2 border border-gray-300 rounded resize-none"
            style={{ overflow: 'hidden' }} // Ẩn thanh cuộn
          />
          <button
            onClick={handleCommentSubmit}
            className="h-10 p-2 bg-[#FCD146] text-black rounded hover:bg-[#FFC300] flex-shrink-0"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlogDetailPage;
