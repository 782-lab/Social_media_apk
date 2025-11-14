// frontend/src/components/ProfileModal.jsx

import React, { useState, useEffect } from 'react';
import Modal from 'react-modal'; // Import the modal library
import './ProfileModal.css'; // CSS file for styling

// Set the app element for accessibility
Modal.setAppElement('#root');

// Props received from HomePage
function ProfileModal({ isOpen, onRequestClose, user, onProfileUpdate }) {
  // State to allow user to type in the form
  const [name, setName] = useState(user?.name || '');
  const [profilePic, setProfilePic] = useState(user?.profilePic || '');

  // Update form when user prop changes (e.g., new data loads)
  useEffect(() => {
    if (user) {
      setName(user.name);
      setProfilePic(user.profilePic);
    }
  }, [user]);

  // Handle form submission
  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      // Send new data to HomePage component
      await onProfileUpdate(name, profilePic);
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    }
  };

  return (
    <Modal
      isOpen={isOpen} // Whether to show the modal or not
      onRequestClose={onRequestClose} // Close on outside click
      className="profile-modal"
      overlayClassName="profile-modal-overlay"
    >
      <h2>Edit Profile</h2>
      <form onSubmit={submitHandler} className="profile-form">
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="profilePic">Profile Picture URL</label>
          <input
            type="url"
            id="profilePic"
            value={profilePic}
            onChange={(e) => setProfilePic(e.target.value)}
            placeholder="https://example.com/image.jpg"
          />
        </div>
        <div className="form-actions">
          <button type="button" onClick={onRequestClose} className="btn-cancel">
            Cancel
          </button>
          <button type="submit" className="btn-save">
            Save Changes
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default ProfileModal;