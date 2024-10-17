import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router';
import axios from '../../axios'; // Axios for API calls
import Posts from '../Posts/Posts';
import TabbarMenu from '../../elements/TabbarMenu/TabbarMenu';
import ProfileTheme from '../ProfileTheme/ProfileTheme1';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ArrowBackOutlinedIcon from '@material-ui/icons/ArrowBackOutlined';
import Loader from '../../elements/Loader/Loader';
import '../Feed/Feed.css';

const Feed = () => {
  const { username } = useParams();
  const history = useHistory();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    bio: '',
    displayName: '',
    followers: [],
    following: [],
    id: '',
    location: '',
    photoURL: '',
    username: '',
    wallpaper: '',
    website: '',
  });

  // Fetch user profile from the backend
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

  // Fetch posts based on profile ID from the backend
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        if (profile.id) {
          const response = await axios.get(`/post/sender/${profile.id}`);
          setPosts(response.data.posts);
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [profile]);

  const items = [
    {
      id: 0,
      title: 'Tweets',
      item: (
        <>
          {loading && <div className="feed__loader"><Loader /></div>}
          <Posts posts={posts} />
        </>
      ),
    },
    {
      id: 1,
      title: 'Tweets & replies',
      item: (
        <>
          {loading && <div className="feed__loader"><Loader /></div>}
        </>
      ),
    },
    {
      id: 2,
      title: 'Media',
      item: (
        <>
          {loading && <div className="feed__loader"><Loader /></div>}
          <Posts posts={posts.filter(post => post.image.length > 0)} />
        </>
      ),
    },
    {
      id: 3,
      title: 'Likes',
      item: (
        <>
          {loading && <div className="feed__loader"><Loader /></div>}
        </>
      ),
    },
  ];

  return (
    <div className="feed">
      <div className="profile__header">
        <div className="profile__backArrow" onClick={() => history.goBack()}>
          <ArrowBackOutlinedIcon />
        </div>
        <div className="profile__title">
          <div className="profile__title_title">
            <h2>{profile.displayName}</h2>
            <CheckCircleIcon />
          </div>
          <span>{posts.length} tweets</span>
        </div>
      </div>

      <ProfileTheme profile={profile} />
      <TabbarMenu items={items} />
    </div>
  );
};

export default Feed;
