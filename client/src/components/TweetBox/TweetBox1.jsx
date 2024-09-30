import React, { useState, useEffect } from 'react';
import { Avatar, Button } from '@material-ui/core';
import { useStateValue } from '../../contexts/StateContextProvider';
import axios from '../../axios'; // Import Axios instance
import './TweetBox.css';
import Popover from '@material-ui/core/Popover';
import Picker from 'emoji-picker-react';
import StatusInput from '../StatusInput/StatusInput';
import TabbarMenu from '../../elements/TabbarMenu/TabbarMenu'
import postToCloudinary from '../../helpers/postToCloudinary';
import { getInfo } from '../../helpers/getImageDimension';
import { generateAltText } from '../../helpers/generateAltText';
import Modal from '../../elements/Modal/Modal';
import Spinner from '../../elements/Spinner/Spinner';
import CropPhoto from '../EditPhoto/CropPhotoB';
import AddALT from '../EditPhoto/AddALT';
import CancelIcon from '@material-ui/icons/Cancel';
import SentimentSatisfiedOutlinedIcon from '@material-ui/icons/SentimentSatisfiedOutlined';
import ImageOutlinedIcon from '@material-ui/icons/ImageOutlined';
import EqualizerOutlinedIcon from '@material-ui/icons/EqualizerOutlined';
import EventNoteSharpIcon from '@material-ui/icons/EventNoteSharp';
import GifOutlinedIcon from '@material-ui/icons/GifOutlined';
import CropIcon from '@material-ui/icons/Crop';
import ArrowBackOutlinedIcon from '@material-ui/icons/ArrowBackOutlined';

const TweetBox = () => {
    const [{ user }] = useStateValue();
    const { displayName } = user;
    const [profile, setProfile] = useState(null);
    const [tweetMessage, setTweetMessage] = useState('');
    const [altText, setAltText] = useState(generateAltText(user.displayName));
    const [src, setSrc] = useState(null);
    const [imageToSend, setImageToSend] = useState(null);
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [initialImageSize, setinitialImageSize] = useState({ width: 0, height: 0 });
    const [initialAspectRatio, setinitialAspectRatio] = useState(null);
    const [croppedImageResult, setCroppedImageResult] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    // Fetch user profile from external backend
    useEffect(() => {
        axios.get(`/users/${user.id}`)
            .then(response => {
                setProfile(response.data);
            })
            .catch(error => {
                console.error('Error fetching profile:', error);
            });
    }, [user.id]);

    const sendTweet = (e) => {
        e.preventDefault();
        setIsLoading(true);

        if (imageToSend) {
            postToCloudinary(imageToSend)
                .then(res => {
                    // Send tweet with image
                    axios.post('/posts', {
                        altText: altText,
                        text: tweetMessage,
                        image: res.url,  // Assuming Cloudinary response includes URL
                        likes: [],
                        senderId: user.id,
                        created_at: new Date().toISOString(),
                    }).then(() => {
                        resetTweetForm();
                    }).catch(err => {
                        setIsLoading(false);
                        console.error('Error posting tweet:', err);
                    });
                })
                .catch(err => {
                    setIsLoading(false);
                    console.error('Error uploading image:', err);
                });
        } else {
            // Send tweet without image
            axios.post('/posts', {
                altText: altText,
                text: tweetMessage,
                image: '',
                likes: [],
                senderId: user.id,
                created_at: new Date().toISOString(),
            }).then(() => {
                resetTweetForm();
            }).catch(err => {
                setIsLoading(false);
                console.error('Error posting tweet:', err);
            });
        }
    };

    const resetTweetForm = () => {
        setTweetMessage('');
        setAltText('');
        setSrc(null);
        setIsLoading(false);
    };

    const onSelectFile = e => {
        const fileReader = new FileReader();
        fileReader.onloadend = () => {
            setSrc(fileReader.result);
            setImageToSend(fileReader.result);
        };
        fileReader.readAsDataURL(e.target.files[0]);

        getInfo(e).then(res => {
            setinitialImageSize({ width: res.width, height: res.height });
        });
    };

    useEffect(() => {
        setinitialAspectRatio(initialImageSize.width / initialImageSize.height);
    }, [initialImageSize]);

    const changeSrc = () => {
        setSrc(URL.createObjectURL(croppedImageResult));
        setImageToSend(croppedImageResult);
    };

    const callbackforModal = () => {
        changeSrc();
        if (altText.length === 0) {
            setAltText(generateAltText(displayName));
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
            item: <AddALT image={croppedImageResult} altText={altText} setAltText={setAltText} />
        }
    ];

    const open = Boolean(anchorEl);
    const id = open ? 'post-popover' : undefined;
    const onClickEmoticon = (event) => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);

    const onEmojiClick = (event, emojiObject) => {
        setTweetMessage(tweetMessage + emojiObject.emoji);
    };

    useEffect(() => {
        const textarea = document.querySelector('textarea');
        textarea.addEventListener('keydown', autosize);
                    
        function autosize() {
            const el = this;
            setTimeout(() => {
                el.style.cssText = 'height:auto padding:0';
                el.style.cssText = 'height:' + el.scrollHeight + 'px';
            }, 0);
        }
    }, []);



    return (
        <>
            <Modal
                open={isOpenModal}
                onClose={() => setIsOpenModal(false)}
                title="Edit Photo"
                callback={callbackforModal}
                Icon={ArrowBackOutlinedIcon}
                ButtonText='Save'
            >
                <TabbarMenu items={items} />
            </Modal>

            <div className='tweetBox'>
                <form onSubmit={sendTweet}>
                    <div className='tweetBox__wrapperInput'>
                        
                        <div className="tweetBox__ava">
                           
                            <Avatar src={profile && profile.user.dp} />   
                        </div>

                        <div className='tweetBox__input'>
                            <textarea
                                rows='1' 
                                placeholder="What's happening"
                                value={tweetMessage}
                                onChange={e => setTweetMessage(e.target.value)}
                            />

                            {src && (
                                <div className='tweetBox__input-image'>
                                    <CancelIcon className='cancelIcon' onClick={() => setSrc(null)} />
                                    <img src={src} alt="new" />
                                    <Button className='editImage' onClick={() => setIsOpenModal(true)}>Edit</Button>
                                </div>
                            )}

                            <div className='tweetBox__input-actions'>
                                <div className='tweetBox__input-icons'>
                                    <StatusInput
                                        Icon={ImageOutlinedIcon}
                                        type="file"
                                        accept="image/*"
                                        onChange={onSelectFile}
                                    />
                                    <StatusInput Icon={GifOutlinedIcon} />
                                    <StatusInput Icon={EqualizerOutlinedIcon} />
                                    <StatusInput
                                        Icon={SentimentSatisfiedOutlinedIcon}
                                        onClick={onClickEmoticon}
                                    />

                                    <Popover 
                                        id={id}
                                        open={open}
                                        anchorEl={anchorEl}
                                        onClose={handleClose}
                                        anchorOrigin={{
                                            vertical: 'bottom',
                                            horizontal: 'center',
                                        }}
                                        transformOrigin={{
                                            vertical: 'top',
                                            horizontal: 'center',
                                        }}
                                    >
                                        <Picker onEmojiClick={onEmojiClick} />
                                    </Popover>

                                    <StatusInput Icon={EventNoteSharpIcon} />
                                </div>

                                {isLoading
                                    ? <Button className='tweetBox__tweetButton'><Spinner /></Button>
                                    : <Button type='submit' className='tweetBox__tweetButton'>Tweet</Button>
                                }
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
};

export default TweetBox;
