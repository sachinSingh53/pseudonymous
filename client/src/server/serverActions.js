import firebase from 'firebase'
import db from '../firebase'
import axios from '../axios'

export const follow = (userId, followId) => {
    const userRef = db.collection('users').doc(userId)
    const followRef = db.collection('users').doc(followId)

    userRef.update({
        following: firebase.firestore.FieldValue.arrayUnion(followId)
    })

    followRef.update({
        followers: firebase.firestore.FieldValue.arrayUnion(userId)
    })
}

export const unfollow = (userId, followId) => {
    const userRef = db.collection('users').doc(userId)
    const followRef = db.collection('users').doc(followId)

    userRef.update({
        following: firebase.firestore.FieldValue.arrayRemove(followId)
    })

    followRef.update({
        followers: firebase.firestore.FieldValue.arrayRemove(userId)
    })  
}

export const deletePost = async (postId) => {
    try {
        await axios.delete(`/post/${postId}`);
    } catch (error) {
        console.error('Error deleting post:', error);
    }
};


export const like = async(postId, userId) => {
    // const postRef = db.collection('posts').doc(postId)
    // postRef.update({
    //     likes: firebase.firestore.FieldValue.arrayUnion(userId)
    // })
    try{
        await axios.put('post/like-post',{userId,postId});
    }catch (error) {
        console.error('Error liking post:', error);
    }
}

export const unlike = async(postId, userId) => {
    // const postRef = db.collection('posts').doc(postId)
    // postRef.update({
    //     likes: firebase.firestore.FieldValue.arrayRemove(userId)
    // })

    try{
        await axios.put('post/unlike-post',{userId,postId});
    }catch (error) {
        console.error('Error unliking post:', error);
    }
}

export const deleteComment = (postId, commentId) => {
    const commentRef = db.collection('posts').doc(postId).collection('comments').doc(commentId)
    commentRef.delete()
}

export const likeComment = (postId, commentId, userId) => {
    const commentRef = db.collection('posts').doc(postId).collection('comments').doc(commentId)
    commentRef.update({
        likes: firebase.firestore.FieldValue.arrayUnion(userId)
    })
}

export const unlikeComment = (postId, commentId, userId) => {
    const commentRef = db.collection('posts').doc(postId).collection('comments').doc(commentId)
    commentRef.update({
        likes: firebase.firestore.FieldValue.arrayRemove(userId)
    })
}

export const deleteThreadComment = (postId, commentId, threadCommentId) => {
    const threadCommentRef = db.collection('posts').doc(postId).collection('comments').doc(commentId).collection('threadComments').doc(threadCommentId)
    threadCommentRef.delete()    
}
