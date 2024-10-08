import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import axios from '../../axios';
import Popover from '@material-ui/core/Popover';
import FooterIcon from '../Post/FooterIcon';
import Like from '../Post/Like';
import Reply from '../Reply/Reply1';
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
import { like, unlike, follow, unfollow, deletePost } from '../../server/serverActions';
import { useStateValue } from '../../contexts/StateContextProvider';
import util from '../../helpers/timeDifference';

const StatusPost = ({ status, comments }) => {
  const { postId } = useParams();
  const [{ user }] = useStateValue();
  const [profile, setProfile] = useState({
    id: '',
    displayName: '',
    photoURL: '',
    verified: false,
    username: '',
    followers: [],
    following: []
  });
  const { displayName, username, photoURL, verified } = profile;
  const { altText, text, image, created_at, sender_id, likes } = status;
  // const date = convertTimestampToLocaleString(timestamp);
  console.log({status})
  
  const history = useHistory();

  const [isOpenModal, setIsOpenModal] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const onClickExpand = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const open = Boolean(anchorEl);
  const id = open ? 'post-popover' : undefined;
  const [isFollowing, setIsFollowing] = useState(false);

  // Fetch user profile from the external backend
  useEffect(() => {
    let mounted = true;
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`/users/${sender_id}`);
        if (mounted) {

          setProfile(response.data.user);

        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };
    fetchProfile();
    return () => (mounted = false);
  }, [sender_id]);



  useEffect(() => {
    if (profile) {
      setIsFollowing(profile.followers.includes(user.id));
    }
  }, [profile]);

  const callbackForModal = () => {};

  const deleteMyPost = async () => {
    try {
      await axios.delete(`/post/${postId}`);
      history.push('/');
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const followUser = async () => {
    try {
      await axios.post(`/users/${sender_id}/follow`, { userId: user.id });
      setIsFollowing(true);
    } catch (error) {
      console.error('Error following user:', error);
    }
  };

  const unfollowUser = async () => {
    try {
      await axios.post(`/users/${sender_id}/unfollow`, { userId: user.id });
      setIsFollowing(false);
    } catch (error) {
      console.error('Error unfollowing user:', error);
    }
  };


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
        <Reply
          props={{
            altText,
            text,
            image,
            created_at,
            sender_id,
            postId,
            likes
          }}
          profile={profile}
          ownProfile={user}
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
                  <span className="post__headerSpecial">
                    {username && `@${username} `}
                  </span>
                </div>

                <div
                  className="post__headerExpandIcon"
                  aria-describedby={id}
                  variant="contained"
                  onClick={onClickExpand}
                >
                  <ExpandMoreIcon />
                </div>

                <Popover
                  id={id}
                  open={open}
                  anchorEl={anchorEl}
                  onClose={handleClose}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right'
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right'
                  }}
                >
                  <ul className="post__expandList">
                    {sender_id === user.id ? (
                      <>
                        <li onClick={deleteMyPost}>
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

        <div className="statusPost__body">
          <div className="statusPost__body--message">{text}</div>
          {image && <img src={image} alt={altText} />}
          <div className="statusPost__body--date">{created_at && util.timeDiff(created_at)}</div>
        </div>

        <div className="statusPost__footer">
          <div className="post__footer">
            <FooterIcon Icon={ChatBubbleOutlineIcon} value={comments.length} onClick={() => setIsOpenModal(true)} />
            <FooterIcon Icon={RepeatIcon} value={0} />
            <Like
              likes={likes}
              likeAction={() => like(postId, user.id)}
              unlikeAction={() => unlike(postId, user.id)}
            />
            <FooterIcon Icon={PublishIcon} />
          </div>
        </div>
      </div>
    </>
  );
};

export default StatusPost;
