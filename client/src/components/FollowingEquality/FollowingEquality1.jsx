import React, { useState, useEffect } from 'react'
import { Avatar } from '@material-ui/core'
import { useStateValue } from '../../contexts/StateContextProvider'
import axios from '../../axios' // or use fetch if preferred

const FollowingEquality = ({ profile }) => {
    const [{ user }] = useStateValue()
    const [myFollowing, setMyFollowing] = useState([])
    const [equality, setEquality] = useState([])

    const [user1, setUser1] = useState(null)
    const [user2, setUser2] = useState(null)

    // Fetch the user's following list from the backend
    const fetchFollowing = async () => {
        try {
            const response = await axios.get(`/users/${user.id}/following`)
            setMyFollowing(response.data.following)
        } catch (error) {
            console.error('Error fetching following list:', error)
        }
    }

    // Fetch user details based on user IDs
    const fetchUserDetails = async (userId, setter) => {
        try {
            const response = await axios.get(`/users/${userId}`)
            setter(response.data)
        } catch (error) {
            console.error(`Error fetching user ${userId} details:`, error)
        }
    }

    useEffect(() => {
        fetchFollowing()
    }, [])

    useEffect(() => {
        if (profile && profile.followers.length > 0) {
            const mutualFollowers = profile.followers.filter(item =>
                myFollowing.includes(item)
            )
            setEquality(mutualFollowers)
        }
    }, [myFollowing, profile])

    useEffect(() => {
        if (equality.length > 0) {
            fetchUserDetails(equality[0], setUser1)

            if (equality.length > 1) {
                fetchUserDetails(equality[1], setUser2)
            }
        }
    }, [equality])

    console.log(equality)

    return (
        <div className="followedInfo">
            {equality.length > 0 ? (
                <>
                    {user1 && <Avatar src={user1.photoURL} />}
                    {equality.length > 1 && user2 && <Avatar src={user2.photoURL} />}
                    <span>
                        Followed by {user1 ? user1.displayName : ''}{' '}
                        {equality.length === 2 && user2
                            ? `and ${user2.displayName}`
                            : ''}
                        {equality.length > 2 && user2
                            ? `, ${user2.displayName}, and ${
                                  equality.length - 2
                              } others`
                            : ''}
                    </span>
                </>
            ) : (
                <span>Not followed by anyone you follow</span>
            )}
        </div>
    )
}

export default FollowingEquality
