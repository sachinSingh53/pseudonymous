import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router';
import axios from '../../axios';
import Comments from '../Comments/Comments';
import StatusPost from '../StatusPost/StatusPost1';
import Loader from '../../elements/Loader/Loader';

import '../Feed/Feed.css';
import './Status.css';
import ArrowBackOutlinedIcon from '@material-ui/icons/ArrowBackOutlined';

const Status = () => {
  const [comments, setComments] = useState([]);
  const [status, setStatus] = useState(null);
  const [statusUsername, setStatusUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const { postId } = useParams();

  // Fetch status post details
  useEffect(() => {
    let mounted = true;
    if (postId) {
      const fetchStatus = async () => {
        try {
          setLoading(true);
          // Replace with your external API URL
          const statusResponse = await axios.get(`/post/${postId}`);
          if (mounted) {
            console.log("sachin")
            setStatus(statusResponse.data.post);
          }

          // Fetch comments
          const commentsResponse = await axios.get(`/post/${postId}/comments`);
          if (mounted) {
            setComments(commentsResponse.data.comments);
          }
        } catch (error) {
          console.error('Error fetching data:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchStatus();
    }

    return () => (mounted = false);
  }, [postId]);

  // Fetch status username
  useEffect(() => {
    let mounted = true;
    if (status!=null) {
      const fetchUsername = async () => {
        try {
            console.log({status})
          // Replace with your external API URL for fetching user info
          const userResponse = await axios.get(`/users/${status.sender_id}`);
          if (mounted) {
            setStatusUsername(userResponse.data.user.username);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      };

      fetchUsername();
    }



    return () => (mounted = false);
  }, [status]);

  console.log({status});
  console.log({comments});
  console.log({statusUsername});
  return (
    <div className='feed'>
      <div className="status__header">
        <div className="status__backArrow" onClick={() => history.goBack()}>
          <ArrowBackOutlinedIcon />
        </div>
        <h2>Tweet</h2>
      </div>

      {loading && <div className="feed__loader"><Loader /></div>}
      
      {status && <StatusPost status={status} comments={comments} />}
      
      <Comments comments={comments} statusUsername={statusUsername} />
    </div>
  );
};

export default Status;
