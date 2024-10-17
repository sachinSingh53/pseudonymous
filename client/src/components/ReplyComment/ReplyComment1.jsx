import React, { useState, useEffect } from 'react';
import { Avatar, Button } from '@material-ui/core';
import { useParams, useHistory } from 'react-router';
import { Timeline } from '@material-ui/lab';
import TimelineItem from '@material-ui/lab/TimelineItem';
import TimelineSeparator from '@material-ui/lab/TimelineSeparator';
import TimelineConnector from '@material-ui/lab/TimelineConnector';
import TimelineContent from '@material-ui/lab/TimelineContent';
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser';
import Popover from '@material-ui/core/Popover';
import Picker from 'emoji-picker-react';
import Spinner from '../../elements/Spinner/Spinner';
import StatusInput from '../StatusInput/StatusInput';
import Modal from '../../elements/Modal/Modal';
import TabbarMenu from '../../elements/TabbarMenu/TabbarMenu';
import CropPhoto from '../EditPhoto/CropPhotoB';
import AddALT from '../EditPhoto/AddALT';
import CancelIcon from '@material-ui/icons/Cancel';
import ImageOutlinedIcon from '@material-ui/icons/ImageOutlined';
import SentimentSatisfiedOutlinedIcon from '@material-ui/icons/SentimentSatisfiedOutlined';
import EqualizerOutlinedIcon from '@material-ui/icons/EqualizerOutlined';
import EventNoteSharpIcon from '@material-ui/icons/EventNoteSharp';
import GifOutlinedIcon from '@material-ui/icons/GifOutlined';
import ArrowBackOutlinedIcon from '@material-ui/icons/ArrowBackOutlined';
import CropIcon from '@material-ui/icons/Crop';
import postToCloudinary  from '../../helpers/postToCloudinary';
import { generateAltText } from '../../helpers/generateAltText';
import util from '../../helpers/timeDifference'
import { convertTimestampToLocaleString } from '../../helpers/convertTimestampToLocaleString';
import axios from '../../axios';  // External API handling

import '../Reply/Reply.css';

const ReplyComment = ({ props, profile, ownProfile, setIsOpenParentModal, originalPostSender }) => {
    const { displayName, username, photoURL, verified } = profile;
    const { created_at, text, image, altText, commentId } = props;
    // const date = convertTimestampToLocaleString(timestamp);
    const history = useHistory();
    const { postId } = useParams();

    const [anchorEl, setAnchorEl] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const open = Boolean(anchorEl);
    const id = open ? 'post-popover' : undefined;

    const onClickEmoticon = (event) => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);

    const [commentMessage, setCommentMessage] = useState('');
    const onChangeComment = (e) => setCommentMessage(e.target.value);

    const [src, setSrc] = useState(null);
    const [imageToSend, setImageToSend] = useState(null);
    const [initialImageSize, setInitialImageSize] = useState({ width: 0, height: 0 });
    const [initialAspectRatio, setInitialAspectRatio] = useState(null);
    const [croppedImageResult, setCroppedImageResult] = useState(null);
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [commentAltText, setCommentAltText] = useState(generateAltText(ownProfile.displayName));

    const onEmojiClick = (event, emojiObject) => {
        let newComment = commentMessage + emojiObject.emoji;
        setCommentMessage(newComment);
    };

    const onSelectFile = e => {
        const fileReader = new FileReader();
        fileReader.onloadend = () => {
            setSrc(fileReader.result);
            setImageToSend(fileReader.result);
        };
        fileReader.readAsDataURL(e.target.files[0]);
    };

    useEffect(() => {
        setInitialAspectRatio(initialImageSize.width / initialImageSize.height);
    }, [initialImageSize]);

    const changeSrc = () => {
        setSrc(URL.createObjectURL(croppedImageResult));
        setImageToSend(croppedImageResult);
    };

    const callbackforModal = () => {
        changeSrc();
        if (commentAltText.length === 0) {
            setCommentAltText(generateAltText(displayName));
        }
    };

    const items = [
        {
            id: 0,
            title: '',
            icon: <CropIcon />,
            item: <CropPhoto
                image={src}
                setCroppedImageResult={setCroppedImageResult}
                initialAspectRatio={initialAspectRatio}
            />
        },
        {
            id: 1,
            title: 'ALT',
            icon: '',
            item: <AddALT image={croppedImageResult} altText={commentAltText} setCommentAltText={setCommentAltText} />
        }
    ];

    const sendComment = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        let imageUrl = '';
        if (imageToSend) {
            try {
                const res = await postToCloudinary(imageToSend);
                imageUrl = res;
            } catch (error) {
                console.error(error);
                setIsLoading(false);
                return;
            }
        }

        try {
            await axios.post(`/post/${postId}/comments/${commentId}/reply`, {
                commentAltText,
                text: commentMessage,
                image: imageUrl,
                senderId: ownProfile.id,
                altText:'altText',
                likes:[],
                // created_at: new Date()
            });

            setCommentMessage('');
            setCommentAltText('');
            setSrc(null);
            setIsLoading(false);
            setIsOpenParentModal(false);
            history.push(`/status/${postId}/${commentId}`);
        } catch (error) {
            console.error('Failed to send comment', error);
            setIsLoading(false);
        }
    };

    return (
        <>
            <Modal  open={isOpenModal} 
                    onClose={()=>setIsOpenModal(false)}
                    title="Edit Photo"
                    callback = {callbackforModal}
                    Icon = {ArrowBackOutlinedIcon}
                    ButtonText='Save'
                    setIsOpenParentModal = {setIsOpenParentModal}
                    >
                    <TabbarMenu items={items}/>
            </Modal>

            <div className="reply">
                <Timeline>
                <TimelineItem>
                    <TimelineSeparator> 
                        <Avatar src={photoURL} />
                        <TimelineConnector />
                    </TimelineSeparator>
                    <TimelineContent>
                        <div className="post__body upped">
                            <div className="post__header">
                                <div className="post__headerText">
                                    <h3>{displayName} {' '}
                                        <span className='post__headerSpecial'> 
                                            {verified && <VerifiedUserIcon className='post__badge'/>} 
                                            {`@${username} . ${created_at && util.timeDiff(created_at)}`}
                                        </span>
                                    </h3>
                                </div>

                                <div className="post__headerDescription"> <p> {text} </p></div>
                            </div>
                            { image.length>0 && <img src={image} alt={altText}/> }
                            <span className='replyingTo'>Replying to  <p>{`@${username} @${originalPostSender && originalPostSender.username}`}</p></span>
                        </div>
                    </TimelineContent>
                </TimelineItem>

                <TimelineItem>
                    <TimelineSeparator>
                    <Avatar src={ownProfile.photoURL} />
                    </TimelineSeparator>
                    <TimelineContent>
                        <form onSubmit={sendComment}>
                            <div className='tweetBox__input upped'>
                                <textarea rows='1' 
                                        placeholder = 'Tweet your reply'
                                        type        = 'text' 
                                        value       = {commentMessage}
                                        onChange    = {onChangeComment}                            
                                >
                                </textarea>
                            </div> 

                            {
                                src &&
                                    <div className='tweetBox__input-image'>
                                        <CancelIcon className='cancelIcon' onClick={()=>setSrc(null)}/>
                                        <img src={src} alt="new test"/>               
                                        <Button className='editImage' onClick={()=>setIsOpenModal(true)}>Edit</Button>
                                    </div>                        
                            }

                            <div className='tweetBox__input-actions'>
                                <div className='tweetBox__input-icons'>
                                    <StatusInput Icon={ImageOutlinedIcon} 
                                        type="file"
                                        accept="image/*"
                                        name="comment-image-upload"
                                        id="comment-image-upload"
                                        onChange={onSelectFile}
                                    />
                                    <StatusInput Icon={GifOutlinedIcon}/>
                                    <StatusInput Icon={EqualizerOutlinedIcon} />
                                    <StatusInput Icon={SentimentSatisfiedOutlinedIcon} 
                                                 aria-describedby={id} type="button" onClick={onClickEmoticon} 
                                    />

                                    <Popover 
                                        id={id}
                                        open={open}
                                        anchorEl={anchorEl}
                                        onClose={handleClose}
                                        anchorOrigin={{
                                            vertical: 'top',
                                            horizontal: 'center',
                                        }}
                                        transformOrigin={{
                                            vertical: 'bottom',
                                            horizontal: 'center',
                                        }}
                                        style={{borderRadius: '2rem'}}
                                    >
                                        <Picker onEmojiClick={onEmojiClick} />
                                    </Popover>

                                    <StatusInput Icon={EventNoteSharpIcon} />
                                </div>
                        
                                    {
                                        isLoading ? <Button className='tweetBox__tweetButton'><Spinner /></Button>
                                        :
                                        <Button type='submit'className='tweetBox__tweetButton'>Reply</Button>
                                    }

                                </div>
                        </form>
                    </TimelineContent>
                </TimelineItem>
                </Timeline>
            </div>
        </>
    )
};

export default ReplyComment;
