import React, { useState, useEffect } from 'react';
import TweetBox from '../TweetBox/TweetBox1';
import Posts from '../Posts/Posts';
import { Avatar } from '@material-ui/core';
import Loader from '../../elements/Loader/Loader';
import './Feed.css';
import { useStateValue } from '../../contexts/StateContextProvider';
import axios from '../../axios';

const Feed = () => {
    const [{ user }] = useStateValue();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [profile, setProfile] = useState(null);
    const [following, setFollowing] = useState([]);

    useEffect(() => {
        let mounted = true;

        // Fetch user profile data using axios
        axios.get(`/users/${user.id}`)
            .then(response => {
                if (mounted) {
                    setProfile(response.data.user);
                    setFollowing(response.data.user.following || []);
                }
            })
            .catch(error => console.error('Error fetching profile:', error));

        return () => mounted = false;
    }, [user.id]);

    useEffect(() => {
        let mounted = true;
        setLoading(true);

        const fetchPosts = async () => {
            // let url;
           

            try {
                let response;
                if (following && following.length > 0) {
                    const followingIds = [user.id, ...following];
                    response = await axios.post('/post/feed',followingIds);

                } else {
                    // url = `/posts?senderIds=${JSON.stringify([user.id])}`;
                    response = await axios.post('/post/feed', [user.id]);
                }
                // const response = await axios.get(url);
                if (mounted) {
                    if (response.data.length === 0) {
                        setLoading(false);
                        return;
                    }
                    setPosts(response.data.posts);
                    setLoading(false);
                }
                // return response.data
            } catch (error) {
                console.error('Error fetching posts:', error);
            }
        };

        fetchPosts();
        

        return () => mounted = false;
    }, [following, user.id]);

    const addNewPost = (newPost) => {
        setPosts([newPost, ...posts]);  // Add the new post to the beginning of the posts array
    };
    const removePost = (postId) => {
        setPosts(posts.filter(post => post.id !== postId));  // Assuming post._id is the post's unique identifier
    };

    console.log("sachin",posts);

    return (
        <div className='feed'>
            <div className="feed__header">
                <div className="feed__header-ava">
                    <Avatar src={profile && profile.photoURL} />
                </div>
                <h2>Home</h2>
            </div>

            <TweetBox addNewPost={addNewPost}/>

            {loading && <div className="feed__loader"><Loader /></div>}
            

            <Posts posts={posts} removePost = {removePost} />



            
        </div>
    );
};

export default Feed;
