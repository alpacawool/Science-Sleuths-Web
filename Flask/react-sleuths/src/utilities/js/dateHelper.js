// Format timestamp date in readable format
export const formatDate = (dateString) => {
    let newDate = new Date(`${dateString}Z`);
    return newDate.toLocaleString()
}
