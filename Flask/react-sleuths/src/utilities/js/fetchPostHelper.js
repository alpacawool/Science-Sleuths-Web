  // creates Fetch Post Request with the JWT token
  export const createFetchRequest = (idToken) => {
    return {
      method: "POST",
      withCredentials: true,
      credentials: "include",
      headers: {
        Authorization: `Bearer ${idToken}`,
        "Content-Type": "application/json",
      },
    };
  };