import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { firestore, storage } from '../firebase/config';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Music, Upload } from 'lucide-react';

interface UserProfile {
  name: string;
  bio: string;
  profilePicture: string;
  favoriteSongs: string[];
}

const ProfilePage: React.FC = () => {
  const { currentUser } = useAuth();
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    bio: '',
    profilePicture: '',
    favoriteSongs: [],
  });
  const [newSong, setNewSong] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      if (currentUser) {
        const userRef = doc(firestore, 'users', currentUser.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setProfile(userSnap.data() as UserProfile);
        }
      }
    };

    fetchProfile();
  }, [currentUser]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfilePictureChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && currentUser) {
      const file = e.target.files[0];
      const storageRef = ref(storage, `profilePictures/${currentUser.uid}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      setProfile((prev) => ({ ...prev, profilePicture: downloadURL }));
    }
  };

  const addFavoriteSong = () => {
    if (newSong.trim()) {
      setProfile((prev) => ({
        ...prev,
        favoriteSongs: [...prev.favoriteSongs, newSong.trim()],
      }));
      setNewSong('');
    }
  };

  const removeFavoriteSong = (index: number) => {
    setProfile((prev) => ({
      ...prev,
      favoriteSongs: prev.favoriteSongs.filter((_, i) => i !== index),
    }));
  };

  const saveProfile = async () => {
    if (currentUser) {
      const userRef = doc(firestore, 'users', currentUser.uid);
      await updateDoc(userRef, profile);
      alert('Profile updated successfully!');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Your Profile</h1>
        
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={profile.name}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="bio">
            Bio
          </label>
          <textarea
            id="bio"
            name="bio"
            value={profile.bio}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            rows={4}
          ></textarea>
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Profile Picture
          </label>
          <div className="flex items-center">
            <img
              src={profile.profilePicture || 'https://via.placeholder.com/150'}
              alt="Profile"
              className="w-20 h-20 rounded-full mr-4"
            />
            <label className="cursor-pointer bg-purple-500 text-white py-2 px-4 rounded-md hover:bg-purple-600 transition duration-300">
              <Upload className="inline-block mr-2" />
              Upload New Picture
              <input
                type="file"
                accept="image/*"
                onChange={handleProfilePictureChange}
                className="hidden"
              />
            </label>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Favorite Songs
          </label>
          <div className="flex mb-2">
            <input
              type="text"
              value={newSong}
              onChange={(e) => setNewSong(e.target.value)}
              className="flex-grow mr-2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Add a favorite song"
            />
            <button
              onClick={addFavoriteSong}
              className="bg-purple-500 text-white py-2 px-4 rounded-md hover:bg-purple-600 transition duration-300"
            >
              Add
            </button>
          </div>
          <ul>
            {profile.favoriteSongs.map((song, index) => (
              <li key={index} className="flex items-center mb-2">
                <Music className="h-5 w-5 text-purple-500 mr-2" />
                <span>{song}</span>
                <button
                  onClick={() => removeFavoriteSong(index)}
                  className="ml-auto text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>

        <button
          onClick={saveProfile}
          className="w-full bg-purple-500 text-white py-2 px-4 rounded-md hover:bg-purple-600 transition duration-300"
        >
          Save Profile
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;