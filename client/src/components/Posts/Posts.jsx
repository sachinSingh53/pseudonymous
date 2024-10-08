import React from 'react'
import FlipMove from 'react-flip-move'
import Post from '../Post/Post1'

const Posts = ({ posts,removePost }) => {
    // for(let post of posts){
    //     console.log(post.image)
    // }


    return (
        <>
            <FlipMove>
                {
                    posts.map(post => (
                        <Post key={post.id}
                            postId={post.id}
                            altText={post.altText}
                            senderId={post.sender_id}
                            username={post.username}
                            text={post.text}
                            avatar={post.avatar}
                            image={post.image}
                            created_at={post.created_at}
                            likes={post.likes}
                            removePost={removePost}
                        />
                    ))
                }
            </FlipMove>
        </>
    )
}

export default Posts
