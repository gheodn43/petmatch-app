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
    <div className="p-6 bg-gray-100 min-h-screen text-black">
      {/* Khu vực hiển thị chi tiết blog */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-4">{blog.title}</h1>
        <div className="text-xs text-gray-400 mb-4">Created At: {new Date(blog.createdAt).toLocaleString()}</div>
        {blog.imageUrl.length > 0 && (
          <img src={blog.imageUrl[0]} alt={blog.title} className="w-full h-80 object-cover mb-4 rounded-lg" />
        )}
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
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write your comment here..."
          className="w-full h-24 p-2 border border-gray-300 rounded mb-4"
        />
        <button
          onClick={handleCommentSubmit}
          className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Submit Comment
        </button>
      </div>
    </div>
  );
};

export default BlogDetailPage;
