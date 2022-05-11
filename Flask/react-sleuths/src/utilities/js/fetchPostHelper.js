/*
Reducer idea and implementation adapted from https://www.robinwieruch.de/react-hooks-fetch-data/
*/

import { useReducer, useEffect, useRef } from "react";

// creates Fetch Post Request with JWT header
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

// reducer for Retch requests
const dataFetchReducer = (state, action) => {
  switch (action.type) {
    case "FETCH_INIT":
      return {
        ...state,
        isLoading: true,
        isError: false,
      };
    case "FETCH_SUCCESS":
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: action.payload,
      };
    case "FETCH_FAILURE":
      return {
        ...state,
        isLoading: false,
        isError: true,
      };
    default:
      throw new Error("Failed to get projects.");
  }
};

// custom hook for data fetching
export const useFetchHook = (resource, init, isLoadingName = "isLoading", isErrorName = "isError", dataName = "data") => {
  const isInitialRender = useRef(true);

  const [state, dispatch] = useReducer(dataFetchReducer, {
    isLoading: false,
    isError: false,
    data: null,
  });

  useEffect(() => {
    let didCancel = false;

    const fetchData = async () => {
      dispatch({ type: "FETCH_INIT" });

      try {
        const result = await fetch(resource, init);
        // on success and component still mounted
        if (!didCancel) {
          const data = await result.json();
          dispatch({ type: "FETCH_SUCCESS", payload: data });
        }
      } catch (error) {
        // on error and component still mounted
        if (!didCancel) {
          dispatch({ type: "FETCH_FAILURE" });
        }
      }
    };

    // only call on initial render
    if (isInitialRender.current) {
      fetchData();
      isInitialRender.current = false;
      return;
    }

    // cleanup function
    return () => {
      didCancel = true;
    };
  }, []);

  return [{[isLoadingName]: state.isLoading, [isErrorName]: state.isError, [dataName]: state.data}];
};