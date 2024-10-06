// import React, {useEffect, useState} from 'react'
// import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder'
// import FavoriteIcon from '@material-ui/icons/Favorite'

// import {useStateValue} from '../../contexts/StateContextProvider'
// import './FooterIcon.css'

// const Like = ({likes, likeAction, unlikeAction}) => {
//     const [{user}] = useStateValue()
//     const [isLiked, setisLiked] = useState(false)

//     useEffect(() => {
//         if(user.id && likes){
//             if(likes.includes(user.id)){
//                 setisLiked(true)
//             } else {
//                 setisLiked(false)
//             }
//         }
//     }, [likes])

//     return (
//         <div className="footerIcon_wrapper">
//             { isLiked?
//                 <span className='liked' onClick={unlikeAction}><FavoriteIcon/></span>
//             :
//                 <FavoriteBorderIcon onClick={likeAction} />
//             }
//             <div className="footerIcon__counter">{(likes && likes.length>0 )&& likes.length}</div>
//         </div>
//     )
// }

// export default Like

import React, { useEffect, useState } from 'react';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import FavoriteIcon from '@material-ui/icons/Favorite';
import { useStateValue } from '../../contexts/StateContextProvider';
import './FooterIcon.css';



const Like = ({ likes, postId, likeAction, unlikeAction }) => {
    const [{ user }] = useStateValue();
    const [isLiked, setIsLiked] = useState(false);

    const [likeCount, setLikeCount] = useState(Array.isArray(likes)?likes.length:0); // Track like count locally


    useEffect(() => {
        if (user.id && likes) {
            if (likes.includes(user.id)) {
                setIsLiked(true);
            } else {
                setIsLiked(false);
            }
        }
    }, [likes, user.id]);

    const handleLike = async () => {
        setIsLiked(true); // Optimistically update the UI
        setLikeCount(likeCount + 1); // Increase the like count instantly

        try {
            await likeAction(postId, user.id);
        } catch (error) {
            console.error('Error liking post:', error);
            setIsLiked(false); // Revert if there is an error
            setLikeCount(likeCount - 1); // Revert the like count
        }
    };

    const handleUnlike = async () => {
        setIsLiked(false); // Optimistically update the UI
        setLikeCount(likeCount - 1); // Decrease the like count instantly

        try {
            await unlikeAction(postId, user.id);
        } catch (error) {
            console.error('Error unliking post:', error);
            setIsLiked(true); // Revert if there is an error
            setLikeCount(likeCount + 1); // Revert the like count
        }
    };

    return (
        <div className="footerIcon_wrapper">

            {isLiked ? (
                <span className="liked" onClick={handleUnlike}>
                    <FavoriteIcon />
                </span>
            ) : (
                <FavoriteBorderIcon onClick={handleLike} />
            )}
            <div className="footerIcon__counter">{likeCount > 0 && likeCount}</div>
        </div>
    );
};

export default Like;



