import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useParams, useHistory } from 'react-router';
import Popover from '@material-ui/core/Popover';
import FooterIcon from '../Post/FooterIcon';
import Like from '../Post/Like';
import ReplyComment from '../ReplyComment/ReplyComment1';
import Modal from '../../elements/Modal/Modal';
import { Avatar } from '@material-ui/core';
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChatBubbleOutlineIcon from '@material-ui/icons/ChatBubbleOutline';
import RepeatIcon from '@material-ui/icons/Repeat';
import PublishIcon from '@material-ui/icons/Publish';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import BarChartIcon from '@material-ui/icons/BarChart';
import CodeIcon from '@material-ui/icons/Code';
import PlaceIcon from '@material-ui/icons/Place';
import SentimentVeryDissatisfiedIcon from '@material-ui/icons/SentimentVeryDissatisfied';
import BlockIcon from '@material-ui/icons/Block';
import PostAddIcon from '@material-ui/icons/PostAdd';
import PersonAddDisabledIcon from '@material-ui/icons/PersonAddDisabled';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import CloseIcon from '@material-ui/icons/Close';

import { useStateValue } from '../../contexts/StateContextProvider';
import util from '../../helpers/timeDifference';
import { convertTimestampToLocaleString } from '../../helpers/convertTimestampToLocaleString';
import axios from '../../axios';  // Replaced Firebase with axios

const CommentPost = ({ status, comments }) => {
  const { postId, commentId } = useParams();
  const [{ user }] = useStateValue();
  const [originalPost, setOriginalPost] = useState(null);
  const [originalPostSender, setOriginalPostSender] = useState(null);
  const [profile, setProfile] = useState({ id: '', displayName: '', photoURL: '', verified: false, username: '', followers: [], following: [] });
  const { displayName, username, photoURL, verified } = profile;
  const [ownProfile, setOwnProfile] = useState(null);
  const { commentAltText, text, image, created_at, senderId, likes } = status;

//   const date = convertTimestampToLocaleString(timestamp);
  const history = useHistory();

  const [isOpenModal, setIsOpenModal] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const onClickExpand = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const open = Boolean(anchorEl);
  const id = open ? 'post-popover' : undefined;

  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    let mounted = true;
    
    // Fetch own profile from external backend
    axios.get(`/users/${user.id}`).then(response => {
      if (mounted) {
        setOwnProfile({ id: user.id, ...response.data.user });
      }
    });

    // Fetch profile of sender from external backend
    axios.get(`/users/${senderId}`).then(response => {
      if (mounted) {
        setProfile(response.data.user);
      }
    });

    // Fetch original post details
    axios.get(`/post/${postId}`).then(response => {
      if (mounted) {
        setOriginalPost(response.data.post);
      }
    });

    return () => (mounted = false);
  }, [postId, senderId, user.id]);

  useEffect(() => {
    let mounted = true;
    if (originalPost) {
      // Fetch original post sender details
      axios.get(`/users/${originalPost.senderId}`).then(response => {
        if (mounted) {
          setOriginalPostSender(response.data.user);
        }
      });
    }

    return () => (mounted = false);
  }, [originalPost]);

  useEffect(() => {
    if (profile) {
      setIsFollowing(profile.followers.includes(user.id));
    }
  }, [profile, user.id]);

  const callbackForModal = () => {};

  const deleteMyComment = (postId, commentId) => {
    axios.delete(`/post/${postId}/comments/${commentId}`).then(() => {
      history.push(`/status/${postId}`);
    });
  };

  const unfollowUser = () => axios.post(`/users/${user.id}/unfollow`, { targetUserId: senderId });

  const followUser = () => axios.post(`/users/${user.id}/follow`, { targetUserId: senderId });

  const setIsOpenParentModal = (state) => setIsOpenModal(state);

  return (
    <>
      <Modal
        open={isOpenModal}
        onClose={() => setIsOpenModal(false)}
        title=""
        callback={callbackForModal}
        Icon={CloseIcon}
        ButtonText=""
      >
        <ReplyComment
          props={{
            threadAltText: commentAltText,
            text,
            image,
            created_at,
            senderId,
            postId,
            likes,
            commentId,
          }}
          profile={profile}
          ownProfile={ownProfile}
          originalPostSender={originalPostSender}
          setIsOpenParentModal={setIsOpenParentModal}
        />
      </Modal>

      <div className="statusPost">
        <div className="post bottomWhited">
          <div className="post__avatar">
            <Avatar src={photoURL} />
          </div>
          <div className="post__body">
            <div className="post__header">
              <div className="post__headerText">
                <div className="post__statusPostHeader">
                  <h3>
                    {displayName} {verified && <VerifiedUserIcon className="post__badge" />}
                  </h3>
                  <span className="post__headerSpecial">{username && `@${username} `}</span>
                </div>

                <div className="post__headerExpandIcon" aria-describedby={id} variant="contained" onClick={onClickExpand}>
                  <ExpandMoreIcon />
                </div>

                <Popover
                  id={id}
                  open={open}
                  anchorEl={anchorEl}
                  onClose={handleClose}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                >
                  <ul className="post__expandList">
                    {senderId === user.id ? (
                      <>
                        <li onClick={() => deleteMyComment(postId, commentId)}>
                          <div className="delete">
                            <DeleteOutlineIcon />
                          </div>
                          <h3 className="delete">Delete</h3>
                        </li>
                        <li>
                          <div>
                            <PlaceIcon />
                          </div>
                          <h3>Pin to your profile</h3>
                        </li>
                        <li>
                          <div>
                            <CodeIcon />
                          </div>
                          <h3>Embed Tweet</h3>
                        </li>
                        <li>
                          <div>
                            <BarChartIcon />
                          </div>
                          <h3>View Tweet activity</h3>
                        </li>
                      </>
                    ) : (
                      <>
                        <li>
                          <div>
                            <SentimentVeryDissatisfiedIcon />
                          </div>
                          <h3>Not interested in this tweet</h3>
                        </li>
                        {isFollowing ? (
                          <li onClick={unfollowUser}>
                            <div>
                              <PersonAddDisabledIcon />
                            </div>
                            <h3>Unfollow {`@${username}`}</h3>
                          </li>
                        ) : (
                          <li onClick={followUser}>
                            <div>
                              <PersonAddIcon />
                            </div>
                            <h3>Follow {`@${username}`}</h3>
                          </li>
                        )}
                        <li>
                          <div>
                            <PostAddIcon />
                          </div>
                          <h3>Add/remove from Lists</h3>
                        </li>
                        <li>
                          <div>
                            <BlockIcon />
                          </div>
                          <h3>Block {`@${username}`}</h3>
                        </li>
                        <li>
                          <div>
                            <CodeIcon />
                          </div>
                          <h3>Embed Tweet</h3>
                        </li>
                      </>
                    )}
                  </ul>
                </Popover>
              </div>
            </div>
          </div>
        </div>

        {originalPostSender && originalPost && (
          <div className="post__originalThread">
            <div className="post__avatar">
              <Avatar src={originalPostSender.photoURL} />
            </div>
            <div className="post__body">
              <div className="post__header">
                <div className="post__headerText">
                  <h3>
                    {originalPostSender.displayName}{' '}
                    {originalPostSender.verified && <VerifiedUserIcon className="post__badge" />}
                  </h3>
                  <span className="post__headerSpecial">{originalPostSender.username && `@${originalPostSender.username} `}</span>
                </div>
                <div className="post__headerDescription">
                  <p>{originalPost.text}</p>
                </div>
              </div>
              {originalPost.image && <img src={originalPost.image} alt="" />}
            </div>
          </div>
        )}

        <div className="post__footer">
          <FooterIcon Icon={ChatBubbleOutlineIcon} number={0} setIsOpenModal={setIsOpenModal} />
          <FooterIcon Icon={RepeatIcon} number={0} />
          <Like postId={postId} senderId={senderId} commentId={commentId} status={status} number={likes&&likes.length?likes.length:0} />
          <FooterIcon Icon={PublishIcon} number={0} />
        </div>
      </div>
    </>
  );
};

export default CommentPost;
