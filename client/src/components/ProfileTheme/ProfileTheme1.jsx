import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';

import CloseIcon from '@material-ui/icons/Close';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import InsertLinkIcon from '@material-ui/icons/InsertLink';
import PlaceIcon from '@material-ui/icons/Place';
import DateRangeIcon from '@material-ui/icons/DateRange';
import MailOutlineIcon from '@material-ui/icons/MailOutline';

import Modal from '../../elements/Modal/Modal';
import ModalImage from '../../elements/Modal/ModalImage';
import Spinner from '../../elements/Spinner/Spinner';
import EditProfile from '../EditProfile/EditProfile';
import FollowingEquality from '../FollowingEquality/FollowingEquality1.jsx';

import axios from '../../axios'; // New: Axios for HTTP requests
import postToCloudinary from '../../helpers/postToCloudinary';
import { useStateValue } from '../../contexts/StateContextProvider';

import { follow, unfollow } from '../../server/serverActions'; // Modify if needed for external API
import './ProfileTheme.css';

const ProfileTheme = () => {
  const [profile, setProfile] = useState({
    bio: '',
    displayName: '',
    followers: [],
    following: [],
    location: '',
    photoURL: '',
    website: '',
    wallpaper: '',
  });

  const [{ user }] = useStateValue();
  const { username } = useParams();


  const [updatedProfileState, setUpdatedProfileState] = useState({});
  const [finalPhoto, setFinalPhoto] = useState(null);
  const [finalWallpaper, setFinalWallpaper] = useState(null);
  const [isPhotoReady, setIsPhotoReady] = useState(false);
  const [isWallpaperReady, setIsWallpaperReady] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const [isOpenModal, setIsOpenModal] = useState(false);
  const isMe = profile.id === user.id;

  const [isFollowing, setIsFollowing] = useState(false);

  const [openImage, setOpenImage] = useState(false);
  const [imgsrc, setImgsrc] = useState('');

  const onClickImage = (img) => {
    setImgsrc(img);
    setOpenImage(true);
  };

  const handleCloseImage = () => setOpenImage(false);

  // Fetch profile data from external backend
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`/users/u/${username}`);
        setProfile(response.data.user);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };
    fetchProfile();
  }, [username]);

  const callbackforModal = async () => {
    const { photoToSend, wallpaperToSend } = updatedProfileState.pictureToSend;
    setIsUpdating(true);

    // Upload photo if changed
    if (photoToSend !== profile.photoURL) {
      try {
        const res = await postToCloudinary(photoToSend);
        setFinalPhoto(res);
        setIsPhotoReady(true);
      } catch (error) {
        console.error('Error uploading photo:', error);
      }
    } else {
      setFinalPhoto(profile.photoURL);
      setIsPhotoReady(true);
    }

    // Upload wallpaper if changed
    if (wallpaperToSend !== profile.wallpaper) {
      try {
        const res = wallpaperToSend
          ? await postToCloudinary(wallpaperToSend)
          : '';
        setFinalWallpaper(res);
        setIsWallpaperReady(true);
      } catch (error) {
        console.error('Error uploading wallpaper:', error);
      }
    } else {
      setFinalWallpaper(profile.wallpaper);
      setIsWallpaperReady(true);
    }
  };

  useEffect(() => {
    if (isPhotoReady && isWallpaperReady) {
      const { displayName, bio, location, website } =
        updatedProfileState.profileState;
      const updateProfile = async () => {
        try {
          await axios.put(`/users/${user.id}`, {
            displayName,
            bio,
            location,
            website,
            photoURL: finalPhoto,
            wallpaper: finalWallpaper,
          });
          setIsUpdating(false);
        } catch (error) {
          console.error('Error updating profile:', error);
        }
      };
      updateProfile();
    }
  }, [isPhotoReady, isWallpaperReady]);

  useEffect(() => {
    if (profile && !isMe) {
      setIsFollowing(profile.followers.includes(user.id));
    }
  }, [profile]);


  console.log({profile})


  return (
    <>
      <Modal
        open={isOpenModal}
        onClose={() => setIsOpenModal(false)}
        title="Edit Profile"
        callback={callbackforModal}
        Icon={CloseIcon}
        ButtonText="Save"
      >
        <EditProfile
          profile={profile}
          setUpdatedProfileState={setUpdatedProfileState}
        />
      </Modal>

      <ModalImage open={openImage} onClose={handleCloseImage} imgsrc={imgsrc} />

      <div className="userProfile">
        <div
          className="userProfile__theme"
          style={{ backgroundImage: `url(${profile.wallpaper})` }}
        >
          <div className="photoWrapper">
            {profile.photoURL && (
              <img
                src={profile.photoURL}
                alt={profile.displayName}
                onClick={() => onClickImage(profile.photoURL)}
              />
            )}
          </div>
        </div>

        <div className="infoWrapper">
          <div className="userProfile__actions">
            <div className="moreWrapper">
              <MoreHorizIcon />
            </div>
            {!isMe && <div className="mailWrapper"><MailOutlineIcon /></div>}
            {isMe ? (
              <div
                className="followWrapper"
                onClick={() => setIsOpenModal(true)}
              >
                Edit Profile
              </div>
            ) : isFollowing ? (
              <div
                className="followWrapper"
                onClick={() => unfollow(user.id, profile.id)}
              >
                Followed
              </div>
            ) : (
              <div
                className="followWrapper"
                onClick={() => follow(user.id, profile.id)}
              >
                Follow
              </div>
            )}
          </div>

          <h2>{profile.displayName}</h2>
          <span>{`@${username}`}</span>
          <p>{profile.bio}</p>

          <div className="bioInfo">
            {profile.location && (
              <div>
                <PlaceIcon /> <span>{profile.location}</span>
              </div>
            )}
            {profile.website && (
              <div className="blued">
                <InsertLinkIcon /> <span>{profile.website}</span>
              </div>
            )}
            <div>
              <DateRangeIcon /> <span>Sep 2020</span>
            </div>
          </div>

          <div className="countInfo">
            <Link to={`/profile/${username}/followinfo`}>
              <span>
                {profile.following.length} <p>Following</p>
              </span>
            </Link>
            <Link to={`/profile/${username}/followinfo`}>
              <span>
                {profile.followers.length} <p>Followers</p>
              </span>
            </Link>
            {isMe && isUpdating && <Spinner />}
          </div>

          <div className="themeBottom">
            {!isMe && <FollowingEquality profile={profile} />}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileTheme;
