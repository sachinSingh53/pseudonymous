import React from 'react'
import FlipMove from 'react-flip-move'
import Comment from '../Comment/Comment1'

const Comments = ({comments, statusUsername}) => {
    return (
        <>
        <FlipMove>
        {
            comments.map(comment => (
                <Comment key={comment.id}
                        commentId = {comment.id}
                        commentAltText = {comment.commentAltText}
                        senderId = {comment.sender_id}
                        username = {comment.username}
                        text = {comment.text}
                        // avatar = {comment.avatar}
                        image = {comment.image}
                        created_at = {comment.created_at}
                        likes = {comment.likes}
                        statusUsername = {statusUsername}
                />
            ))
        }           
        </FlipMove>
        </>
    )
}

export default Comments
