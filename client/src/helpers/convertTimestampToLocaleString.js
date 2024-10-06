export const convertTimestampToLocaleString = (timestamp) => {
    return timestamp && new Date(timestamp).toLocaleString([],{hour12:false})
}