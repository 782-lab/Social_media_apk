// frontend/src/components/HomePage.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './HomePage.css';
import ProfileModal from './ProfileModal'; // Import new modal component
import { FaHeart, FaRegHeart, FaComment, FaUserPlus, FaUserMinus, FaEdit, FaSignOutAlt, FaMoon, FaSun } from 'react-icons/fa';

// Updated prop name to 'onUserUpdate'
function HomePage({ userInfo, onLogout, onUserUpdate }) {

  // --- States ---
  const [newPostText, setNewPostText] = useState('');
  const [newPostImage, setNewPostImage] = useState('');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [commentText, setCommentText] = useState({});

  // --- New state for modal ---
  const [isModalOpen, setIsModalOpen] = useState(false); // For modal visibility
  // ---------------------------

  // --- Stories state ---
  const [stories, setStories] = useState([]); // Array of story objects
  // ----------------------

  // --- Dark theme state ---
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  // -------------------------

  // --- Theme toggle handler ---
  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme);
    document.body.classList.toggle('dark-theme', !isDarkTheme);
  };
  // ----------------------------

  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${userInfo.token}`,
    },
  };

  // --- All functions (Fetch, Post, Like, Comment, Follow) ---
  // (These remain unchanged)
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get('/api/posts', config);
        setPosts(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching posts:', error);
        setLoading(false);
      }
    };
    fetchPosts();

    // Mock stories data - in real app, fetch from backend
    const mockStories = [
      { _id: '1', user: { _id: '1', name: 'Your Story', profilePic: userInfo.profilePic }, content: 'Add a story!' },
      { _id: '2', user: { _id: '2', name: 'Alice', profilePic: 'https://via.placeholder.com/50' }, content: 'Story content' },
      { _id: '3', user: { _id: '3', name: 'Bob', profilePic: 'https://via.placeholder.com/50' }, content: 'Story content' },
      { _id: '4', user: { _id: '4', name: 'Charlie', profilePic: 'https://via.placeholder.com/50' }, content: 'Story content' },
    ];
    setStories(mockStories);
  }, [userInfo.token, userInfo.profilePic]);

  const postSubmitHandler = async (e) => {
    e.preventDefault();
    if (!newPostText.trim()) return;
    try {
      const { data: newPost } = await axios.post('/api/posts', { text: newPostText, image: newPostImage }, config);
      setPosts([newPost, ...posts]);
      setNewPostText(''); setNewPostImage('');
    } catch (error) { console.error('Error creating post:', error); }
  };

  const likeHandler = async (postId) => {
    try {
      setPosts(posts.map((post) => {
        if (post._id === postId) {
          const userLiked = post.likes.includes(userInfo._id);
          return { ...post, likes: userLiked ? post.likes.filter((id) => id !== userInfo._id) : [...post.likes, userInfo._id] };
        } return post;
      }));
      await axios.put(`/api/posts/${postId}/like`, {}, config);
    } catch (error) { console.error('Error liking post:', error); }
  };

  const commentHandler = async (e, postId) => {
    e.preventDefault();
    const text = commentText[postId];
    if (!text || !text.trim()) return;
    try {
      const { data: newComments } = await axios.post(`/api/posts/${postId}/comment`, { text }, config);
      setPosts(posts.map((post) => post._id === postId ? { ...post, comments: newComments } : post));
      setCommentText({ ...commentText, [postId]: '' });
    } catch (error) { console.error('Error adding comment:', error); }
  };

  const handleCommentChange = (postId, text) => {
    setCommentText({ ...commentText, [postId]: text });
  };

  const followHandler = async (userIdToFollow) => {
    if (userIdToFollow === userInfo._id) return; 
    try {
      const { data: updatedUser } = await axios.put(`/api/users/${userIdToFollow}/follow`, {}, config);
      onUserUpdate(updatedUser); // Update App.jsx
    } catch (error) { console.error('Error following user:', error); alert('Could not follow user'); }
  };
  
  // --- New functions ---
  // Open and close modal
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // Handle profile update
  const profileUpdateHandler = async (name, profilePic) => {
    try {
      // (PUT /api/users/profile)
      const { data: updatedUserWithToken } = await axios.put(
        '/api/users/profile',
        { name, profilePic },
        config
      );

      // Update App.jsx
      onUserUpdate(updatedUserWithToken);
      alert('Profile Updated Successfully!');
      closeModal(); // Close modal
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Could not update profile');
    }
  };
  // ---------------------------------

  return (
    <>
      <div className="homepage-container">
      {/* --- 1. Header (Updated) --- */}
      <header className="homepage-header">
        <div className="header-left">
          <h1 className="header-title">SocialSphere</h1>
          <span className="trademark">by Md Ashab Akhtar</span>
        </div>
        <div className="header-user">
          <img
            src={userInfo.profilePic}
            alt="Profile"
            className="header-profile-pic"
          />
          <span>Welcome, {userInfo.name}</span>

          <button onClick={toggleTheme} className="theme-toggle-btn" aria-label="Toggle Theme">
            {isDarkTheme ? <FaSun /> : <FaMoon />}
          </button>

          <button onClick={openModal} className="edit-profile-btn" aria-label="Edit Profile">
            <FaEdit /> Edit Profile
          </button>

          <button onClick={onLogout} className="logout-btn" aria-label="Logout">
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </header> 

      {/* --- Stories Section --- */}
      <div className="stories-container">
        {stories.map((story) => (
          <div key={story._id} className="story-item">
            <img src={story.user.profilePic} alt={story.user.name} className="story-pic" />
            <span className="story-name">{story.user.name}</span>
          </div>
        ))}
      </div>

      {/* --- 2. Create Post Form --- */}
      <div className="create-post-container">
        <form onSubmit={postSubmitHandler}>
          <textarea placeholder="What's on your mind?" value={newPostText} onChange={(e) => setNewPostText(e.target.value)}></textarea>
          <input type="text" placeholder="Image URL (optional)" value={newPostImage} onChange={(e) => setNewPostImage(e.target.value)} />
          <button type="submit" className="post-submit-btn">Post</button>
        </form>
      </div>

      <div className="feed-container">
        {loading ? (
          <p>Loading feed...</p>
        ) : (
          posts.map((post) => (
            <div key={post._id} className="post-card">
              <div className="post-header">
                <div className="post-header-user">
                  <img src={post.user.profilePic} alt={post.user.name} className="post-profile-pic"/>
                  <span className="post-user-name">{post.user.name}</span>
                </div>
                {post.user._id !== userInfo._id && (
                  <button className={`follow-btn ${userInfo.following.includes(post.user._id) ? 'following' : ''}`}
                    onClick={() => followHandler(post.user._id)}
                    aria-label={userInfo.following.includes(post.user._id) ? 'Unfollow user' : 'Follow user'}>
                    {userInfo.following.includes(post.user._id) ? (
                      <>
                        <FaUserMinus /> Unfollow
                      </>
                    ) : (
                      <>
                        <FaUserPlus /> Follow
                      </>
                    )}
                  </button>
                )}
              </div>
              <p className="post-text">{post.text}</p>
              {post.image && (<img src={post.image} alt="Post" className="post-image" />)}
              <div className="post-actions">
                <span className={`action-btn ${post.likes.includes(userInfo._id) ? 'liked' : ''}`} onClick={() => likeHandler(post._id)} aria-label="Like post">
                  {post.likes.includes(userInfo._id) ? <FaHeart /> : <FaRegHeart />} Like
                </span>
                <span className="action-btn" aria-label="View comments">
                  <FaComment /> Comment ({post.comments.length})
                </span>
                <span className="like-count" aria-label={`${post.likes.length} likes`}>
                  {post.likes.length} {post.likes.length === 1 ? 'like' : 'likes'}
                </span>

              </div>
              <div className="comment-section">
                <form className="comment-form" onSubmit={(e) => commentHandler(e, post._id)}>
                  <input type="text" placeholder="Write a comment..." className="comment-input" value={commentText[post._id] || ''} onChange={(e) => handleCommentChange(post._id, e.target.value)}/>
                  <button type="submit" className="comment-submit-btn">Send</button>
                </form>
                <div className="comment-list">
                  {post.comments && post.comments.length > 0 ? (
                    post.comments.map((comment) => (
                      <div key={comment._id} className="comment-bubble">
                        <img src={comment.user.profilePic} alt={comment.user.name} className="comment-profile-pic"/>
                        <div className="comment-content">
                          <span className="comment-user-name">{comment.user.name}</span>
                          <p className="comment-text">{comment.text}</p>
                        </div>
                      </div>
                    ))
                  ) : (<p className="no-comments">No comments yet.</p>)}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      
      <ProfileModal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        user={userInfo}
        onProfileUpdate={profileUpdateHandler}
      />
    </div>
    </>
  );
}

export default HomePage; 