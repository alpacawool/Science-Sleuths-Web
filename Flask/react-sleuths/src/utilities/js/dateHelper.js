// Format timestamp date in readable format
export const formatDate = (dateString) => {
    let newDate = new Date(`${dateString}`);
    return newDate.toUTCString()
}
