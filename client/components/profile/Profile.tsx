import React, {FC, useState} from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

type ProfileProps = {
  user: any;
  fetchUser: Function;
};

const Profile: FC<ProfileProps> = ({user, fetchUser}) => {
  const [name, setName] = useState(user.name);
  const [isEditing, setIsEditing] = useState(false);

  const changeName = async () => {
    axios.patch(`/profile/${user.id}`, {name})
      .then((nameChanged) => {
        if(!nameChanged) {
          console.error('failed to change user name');
        } else {
          setIsEditing(false);
          fetchUser();
          console.log('nameChanged!', nameChanged);
        }
      })
      .catch((err) => {
        console.error('Failed to send name change request');
      })
  };

  return (
    <div className="[background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)] dark:text-white text-slate-400 min-h-screen h-full flex items-center justify-center pb-5"
      aria-label="User Profile"
    >
      <div className="flex flex-col items-center space-y-3 text-center" aria-labelledby="profile-header">
        <h1 id="profile-header" className="mb-10">Profile</h1>

        {isEditing ? (
          <div className="flex items-center space-x-2">
            <label htmlFor="name-input" className="sr-only">
              Edit name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              aria-label="Enter your name"
            />
            <button
              onClick={changeName}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              aria-label="Save name changes"
            >
              Save
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              aria-label="Cancel name changes"
            >
              Cancel
            </button>
          </div>
        ) : (
          <div
            className="p-2 anime-pulse border rounded focus:outline-none text-white cursor-pointer hover:border-blue-500"
            onClick={() => setIsEditing(true)}
            aria-label={`Name: ${name}. Click to edit.`}
          >
            {name}
          </div>
        )}

        <div className="" aria-label="User image placeholder">Image</div>
        <div className="text-yellow-300 text-bold" aria-label={`User score: ${user.score || 0}`}>Score: {user.score || 0}</div>
        <div aria-label="User statistics"> Wins: 0 | Losses: 0</div>
        <Link
          type="button"
          className="w-96 py-6 text-2xl p-3 bg-purple-1 text-white rounded-lg shadow-md shadow-slate-600 hover:bg-indigo-500"
          to="/cards"
          replace={true}
          aria-label="Go to Cards"
        >
          Cards
        </Link>
        <Link
          type="button"
          className="w-96 py-6 text-2xl p-3 bg-emerald-500 text-white rounded-lg shadow-md shadow-slate-600 hover:bg-emerald-400"
          to="/friends"
          replace={true}
          aria-label="Go to Friends"
        >
          Friends
        </Link>
        <Link
          type="button"
          className="w-96 py-6 text-2xl p-3 bg-gray text-white rounded-lg shadow-md shadow-slate-600 hover:bg-slate-300"
          to=""
          aria-label="Go to Settings"
        >
          Settings
        </Link>
        <Link
          type="button"
          className="w-96 py-6 text-2xl p-3 bg-gold text-white rounded-lg shadow-md shadow-slate-600 hover:bg-none bg-yellow-200"
          to="/leaderboard"
          replace={true}
          aria-label="Go to Leaderboard"
        >
          Leaderboard
        </Link>
      </div>
    </div>
  );
}

export default Profile;