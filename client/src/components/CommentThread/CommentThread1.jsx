import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router';
import ThreadComments from '../ThreadComments/ThreadComments';
import CommentPost from '../CommentPost/CommentPost1';
import axios from '../../axios'; // Replacing Firebase with Axios
import Loader from '../../elements/Loader/Loader';

import '../Feed/Feed.css';
import '../Status/Status.css';
import ArrowBackOutlinedIcon from '@material-ui/icons/ArrowBackOutlined';

const Status = () => {
  const [threadComments, setThreadComments] = useState([]);
  const [status, setStatus] = useState(null);
  const [statusUsername, setStatusUsername] = useState('');
  const [originalPost, setOriginalPost] = useState(null);
  const [originalPostUsername, setOriginalPostUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const { postId, commentId } = useParams();

  useEffect(() => {
    let mounted = true;
    if (postId) {
      setLoading(true);
      // Fetch the original post
      axios.get(`/post/${postId}`)
        .then((response) => {
          if (mounted) {
            setOriginalPost(response.data.post);
          }
        })
        .catch((error) => {
          console.error('Error fetching post:', error);
        });

      // Fetch the specific comment (status)
      axios.get(`/post/${postId}/comments/${commentId}`)
        .then((response) => {
          if (mounted) {
            setStatus(response.data.comment);
          }
        })
        .catch((error) => {
          console.error('Error fetching comment:', error);
        });

      // Fetch the thread comments
      axios.get(`/post/${postId}/comments/${commentId}/thread`)
        .then((response) => {
          if (mounted) {
            setThreadComments(response.data.thread_comments);
            setLoading(false);
          }
        })
        .catch((error) => {
          console.error('Error fetching thread comments:', error);
          setLoading(false);
        });
    }

    return () => (mounted = false);
  }, [postId, commentId]);

  useEffect(() => {
    let mounted = true;
    if (originalPost) {
      // Fetch the username of the original post sender
      axios.get(`/users/${originalPost.senderId}`)
        .then((response) => {
          if (mounted) {
            setOriginalPostUsername(response.data.user.username);
          }
        })
        .catch((error) => {
          console.error('Error fetching original post sender:', error);
        });
    }

    return () => (mounted = false);
  }, [originalPost]);

  useEffect(() => {
    let mounted = true;
    if (status) {
      // Fetch the username of the comment sender (status sender)
      axios.get(`/users/${status.senderId}`)
        .then((response) => {
          if (mounted) {
            setStatusUsername(response.data.user.username);
          }
        })
        .catch((error) => {
          console.error('Error fetching status sender:', error);
        });
    }

    return () => (mounted = false);
  }, [status]);

  return (
    <div className='feed'>
      <div className="status__header">
        <div className="status__backArrow" onClick={() => history.goBack()}>
          <ArrowBackOutlinedIcon />
        </div>
        <h2>Thread</h2>
      </div>

      {/* Render the CommentPost component if status is loaded */}
      {status && <CommentPost status={status} comments={threadComments} />}

      {/* Show loader while loading */}
      {loading && <div className="feed__loader"><Loader /></div>}

      {/* Render the ThreadComments */}
      <ThreadComments
        comments={threadComments}
        statusUsername={statusUsername}
        originalPostUsername={originalPostUsername}
      />
    </div>
  );
};

export default Status;
