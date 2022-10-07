const authActions = {
  INIT_AUTH: "INIT_AUTH",
  RESET_AUTH: "RESET_AUTH",
  SET_AUTH_LOADER_ERROR: "SET_AUTH_LOADER_ERROR",
};

const initialAuthState = {
  isAuth: false,
  authToken: "",
  authLoading: false,
  authError: null,
  authUser: {},
};

const authReducerFunction = (
  prevAuthState,
  {
    action: {
      type,
      payload: { isAuth, authLoading, authError, authUser, authToken },
    },
  }
) => {
  switch (type) {
    case authActions.INIT_AUTH:
      return {
        ...prevAuthState,
        isAuth,
        authLoading,
        authError,
        authUser,
        authToken,
      };

    case authActions.RESET_AUTH:
      return initialAuthState;

    case authActions.SET_AUTH_LOADER_ERROR:
      return { ...prevAuthState, authLoading, authError };

    default:
      throw new Error("Invalid Dispatch action type!");
  }
};

export { authReducerFunction, initialAuthState };
