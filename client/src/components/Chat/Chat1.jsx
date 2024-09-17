import React, { useEffect, useState } from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';
import './Chat.css';
import { Avatar, Button } from '@material-ui/core';

import InfoIcon from '@material-ui/icons/Info';
import SentimentSatisfiedOutlinedIcon from '@material-ui/icons/SentimentSatisfiedOutlined';
import InsertPhotoOutlinedIcon from '@material-ui/icons/InsertPhotoOutlined';
import GifOutlinedIcon from '@material-ui/icons/GifOutlined';
import SendIcon from '@material-ui/icons/Send';
import CancelIcon from '@material-ui/icons/Cancel';
import CropIcon from '@material-ui/icons/Crop';
import ArrowBackOutlinedIcon from '@material-ui/icons/ArrowBackOutlined';

import Popover from '@material-ui/core/Popover';
import Picker from 'emoji-picker-react';
import StatusInput from '../StatusInput/StatusInput';
import CropPhoto from '../EditPhoto/CropPhotoB';
import AddALT from '../EditPhoto/AddALT';
import Modal from '../../elements/Modal/Modal';
import TabbarMenu from '../../elements/TabbarMenu/TabbarMenu';
import Spinner from '../../elements/Spinner/Spinner';
import MessageItem from '../../components/MessageItem/MessageItem';

import postToCloudinary from '../../helpers/postToCloudinary';
import { useStateValue } from '../../contexts/StateContextProvider';
import { generateAltText } from '../../helpers/generateAltText';
import { getInfo } from '../../helpers/getImageDimension';
import { useRoomState } from '../../contexts/IsRoomOpenedContextProvider';
import { actionTypes } from '../../contexts/IsRoomOpenedReducers';

const Chat = () => {
    const { roomId } = useParams();
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState('');
    const [members, setMembers] = useState('');
    const [display, setDisplay] = useState({});
    const [{ user }] = useStateValue();
    const [{ isRoomOpened }, dispatch] = useRoomState();
    const history = useHistory();

    const [altText, setAltText] = useState(generateAltText(user.displayName));
    const [anchorEl, setAnchorEl] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const [src, setSrc] = useState(null);
    const [imageToSend, setImageToSend] = useState(null);
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [initialImageSize, setInitialImageSize] = useState({ width: 0, height: 0 });
    const [initialAspectRatio, setInitialAspectRatio] = useState(null);
    const [croppedImageResult, setCroppedImageResult] = useState(null);

    // Fetch members and messages using external API with fetch
    useEffect(() => {
        if (roomId) {
            fetch(`/api/rooms/${roomId}`)
                .then(response => response.json())
                .then(data => {
                    const otherMembers = data.members.filter(userId => userId !== user.id);
                    setMembers(otherMembers[0]);
                })
                .catch(error => console.error("Error fetching room data:", error));

            fetch(`/api/rooms/${roomId}/messages`)
                .then(response => response.json())
                .then(data => setMessages(data))
                .catch(error => console.error("Error fetching messages:", error));
        }

        dispatch({
            type: actionTypes.OPENING_ROOM,
            isRoomOpened: true
        });
    }, [roomId]);

    useEffect(() => {
        if (members) {
            fetch(`/api/users/${members}`)
                .then(response => response.json())
                .then(data => setDisplay(data))
                .catch(error => console.error("Error fetching user data:", error));
        }
    }, [members]);

    const sendMessage = (e) => {
        e.preventDefault();
        setIsLoading(true);

        if (imageToSend) {
            postToCloudinary(imageToSend)
                .then(res => {
                    fetch(`/api/rooms/${roomId}/messages`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            senderId: user.id,
                            message: text,
                            image: res,
                            timestamp: Date.now(),
                        }),
                    })
                    .then(() => {
                        setText('');
                        setSrc(null);
                        setImageToSend(null);
                        setIsLoading(false);
                    })
                    .catch(err => {
                        console.error("Error sending message:", err);
                        setIsLoading(false);
                    });
                })
                .catch(err => {
                    console.error("Error uploading image:", err);
                    setIsLoading(false);
                });
        } else {
            fetch(`/api/rooms/${roomId}/messages`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    senderId: user.id,
                    message: text,
                    timestamp: Date.now(),
                }),
            })
            .then(() => {
                setText('');
                setSrc(null);
                setIsLoading(false);
            })
            .catch(err => {
                console.error("Error sending message:", err);
                setIsLoading(false);
            });
        }
    };

    const onSelectFile = e => {
        const fileReader = new FileReader();
        fileReader.onloadend = () => {
            setSrc(fileReader.result);
            setImageToSend(fileReader.result);
        };
        fileReader.readAsDataURL(e.target.files[0]);

        getInfo(e).then(res => {
            setInitialImageSize({ width: res.width, height: res.height });
        });
    };

    useEffect(() => {
        if (initialImageSize.width && initialImageSize.height) {
            setInitialAspectRatio(initialImageSize.width / initialImageSize.height);
        }
    }, [initialImageSize]);

    const changeSrc = () => {
        setSrc(URL.createObjectURL(croppedImageResult));
        setImageToSend(croppedImageResult);
    };

    const callbackforModal = () => {
        changeSrc();
        if (altText.length === 0) {
            setAltText(generateAltText(user.displayName));
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
        let newMessage = text + emojiObject.emoji;
        setText(newMessage);
    };

    const closeRoom = () => {
        dispatch({
            type: actionTypes.CLOSING_ROOM,
        });

        history.push('/messages');
    };

    return (
        <>
            <Modal open={isOpenModal} 
                onClose={() => setIsOpenModal(false)}
                title="Edit Photo"
                callback={callbackforModal}
                Icon={ArrowBackOutlinedIcon}
                ButtonText='Save'
            >
                <TabbarMenu items={items} />
            </Modal>

            <div className="chat">
                <div className="chat__header">
                    <div className="chat__backArrow">
                        <ArrowBackOutlinedIcon onClick={closeRoom} />
                    </div>
                    <div className="chat__header-ava">
                        <Avatar src={display && display.photoURL} />
                    </div>
                    <h2>{display && display.displayName}</h2>
                    <Link to={`/messages/${roomId}/info`}><InfoIcon member={display} /></Link>      
                </div>

                <div className="chat__body">
                    {messages.map(msg => (
                        <MessageItem key={msg.id} msg={msg} />
                    ))}
                </div>

                <div className="chat__footer">
                    {src && 
                        <div className='chat__footer-ImageBox'>
                            <CancelIcon className='cancelIcon' onClick={() => setSrc(null)} />
                            <img src={src} alt="new test" />               
                            <Button className='editImage' onClick={() => setIsOpenModal(true)}>Edit</Button>
                        </div>
                    }

                    <StatusInput Icon={InsertPhotoOutlinedIcon}
                        type="file"
                        accept="image/*"
                        name="image-upload"
                        id="input-image"
                        onChange={onSelectFile}
                    />
                    <GifOutlinedIcon />
                    <form onSubmit={sendMessage}>
                        <input type="text"
                            placeholder='Start a new message'
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                        />
                        <div className="chat__footer-emowrapper">
                            <SentimentSatisfiedOutlinedIcon 
                                aria-describedby={id} 
                                type="button" 
                                onClick={onClickEmoticon} 
                            />
                            <Popover 
                                id={id} 
                                open={open} 
                                anchorEl={anchorEl} 
                                onClose={handleClose}
                            >
                                <Picker onEmojiClick={onEmojiClick} />
                            </Popover>
                        </div>
                        <Button type="submit" disabled={isLoading}>
                            <SendIcon />
                        </Button>
                    </form>
                </div>
            </div>
        </>
    );
}

export default Chat;
