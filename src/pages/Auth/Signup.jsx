import { useState, useEffect, useReducer } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

import "./auth.css";
import { signupService } from "services/";
import { useAuth } from "contexts/";
import { useDocumentTitle, useToastify } from "custom-hook";
import { isFormDataValid } from "utils";

const Signup = () => {
  const initialFormData = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState(null);

  const initialErrorState = {
    firstNameError: null,
    lastNameError: null,
    passwordError: null,
    confirmPasswordError: null,
  };

  const errorReducer = (state, { type, payload: { error, errorValue } }) => {
    switch (type) {
      case "RESET_ERROR_STATES":
        return { ...initialErrorState };
      case "SET_ERROR":
        return { ...state, [error]: errorValue };
    }
  };

  const [formDataError, setFormDataError] = useReducer(
    errorReducer,
    initialErrorState
  );

  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToastify();

  const { isAuth, authLoading, authError, authDispatch } = useAuth();

  const setDocumentTitle = useDocumentTitle();

  useEffect(() => {
    setDocumentTitle("Keeper | Signup");
    const { state } = location;
    !authLoading && isAuth && navigate(state?.from ?? -1, { replace: true });

    return () => {
      if (authError) {
        authDispatch({
          action: {
            type: "SET_AUTH_LOADER_ERROR",
            payload: {
              authLoading: false,
              authError: "",
            },
          },
        });
      }
    };
  }, []);

  const handleFormDataChange = (event) => {
    const { name, value } = event.target;
    if (formDataError[name + "Error"]) {
      setFormDataError({
        type: "SET_ERROR",
        payload: { error: name + "Error", errorValue: null },
      });
    }
    if (error) {
      setError(null);
    }

    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  const showPasswordIcon = showPassword ? (
    <VisibilityOffIcon />
  ) : (
    <VisibilityIcon />
  );
  const showConfirmPasswordIcon = showConfirmPassword ? (
    <VisibilityOffIcon />
  ) : (
    <VisibilityIcon />
  );

  const { firstName, lastName, email, password, confirmPassword } = formData;

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    if (
      !isFormDataValid(
        firstName,
        lastName,
        password,
        confirmPassword,
        setFormDataError,
        setError
      )
    ) {
      return;
    }

    if (password !== confirmPassword) {
      showToast("Password and Confirm Password do not match", "error");
      return;
    }

    authDispatch({
      action: {
        type: "SET_AUTH_LOADER_ERROR",
        payload: {
          authLoading: true,
          authError: null,
        },
      },
    });

    try {
      const { data } = await signupService(formData);
      const {
        encodedToken,
        createdUser: { notes, archives, ...otherUserDetails },
      } = data;

      authDispatch({
        action: {
          type: "INIT_AUTH",
          payload: {
            isAuth: true,
            authToken: encodedToken,
            authUser: { ...otherUserDetails },
            authLoading: true,
            authError: null,
          },
        },
      });

      setFormData(initialFormData);

      navigate(location?.state?.from ?? "/", { replace: true });
    } catch (error) {
      if (error.message.includes(422)) {
        authDispatch({
          action: {
            type: "SET_AUTH_LOADER_ERROR",
            payload: {
              authLoading: false,
              authError: "Signup failed. Email already in use!",
            },
          },
        });
        return;
      }
      authDispatch({
        action: {
          type: "SET_AUTH_LOADER_ERROR",
          payload: {
            authLoading: false,
            authError: "Signup failed. Please try again after sometime.",
          },
        },
      });
    }
  };

  const { firstNameError, lastNameError, passwordError, confirmPasswordError } =
    formDataError;

  const handleChangePasswordVisibility = () =>
    setShowPassword((prevShowPassword) => !prevShowPassword);
  const handleChangeConfirmPasswordVisibility = () =>
    setShowConfirmPassword(
      (prevShowConfirmPassword) => !prevShowConfirmPassword
    );

  return (
    <section className="main auth-main section-wrapper flex-col flex-align-center flex-justify-start mx-auto py-2 px-3 w-full">
      <div className="auth-wrapper py-5">
        <article className="auth-container signup-container mx-auto mb-1 px-1-5 py-2 rounded-md">
          <h3 className="text-center h2 py-1">Sign Up</h3>
          <form
            className="auth-form flex-col flex-justify-center flex-align-start py-1 px-5 w-full gap-2"
            onSubmit={handleFormSubmit}
          >
            <div className="w-full mx-auto">
              <label
                className="flex-col mx-auto gap-0-5"
                htmlFor="input-signup-fname"
              >
                First Name
                <input
                  type="text"
                  id="input-signup-fname"
                  placeholder="Enter your First Name"
                  name="firstName"
                  disabled={authLoading}
                  onChange={handleFormDataChange}
                  value={firstName}
                  required
                />
              </label>
              {firstNameError && (
                <span className="error-text my-0-25 text-sm">
                  {firstNameError}
                </span>
              )}
            </div>
            <div className="w-full mx-auto">
              <label
                className="flex-col mx-auto gap-0-5"
                htmlFor="input-signup-lname"
              >
                Last Name
                <input
                  type="text"
                  id="input-signup-lname"
                  placeholder="Enter your Last Name"
                  name="lastName"
                  disabled={authLoading}
                  onChange={handleFormDataChange}
                  value={lastName}
                  required
                />
              </label>
              {lastNameError && (
                <span className="error-text my-0-25 text-sm">
                  {lastNameError}
                </span>
              )}
            </div>
            <div className="w-full mx-auto">
              <label
                className="flex-col mx-auto gap-0-5"
                htmlFor="input-login-email"
              >
                Email
                <input
                  type="email"
                  id="input-login-email"
                  placeholder="kindness@humanity.org"
                  name="email"
                  disabled={authLoading}
                  onChange={handleFormDataChange}
                  value={email}
                  required
                />
              </label>
            </div>
            <div className="w-full mx-auto">
              <label className="flex-col mx-auto gap-0-5" htmlFor="input-psd">
                Password
                <span className="relative w-full h5 font-bold">
                  <input
                    type={`${showPassword ? "text" : "password"}`}
                    id="input-psd"
                    placeholder="********"
                    autoComplete="off"
                    name="password"
                    onChange={handleFormDataChange}
                    value={password}
                    disabled={authLoading}
                    required
                  />
                  <button
                    type="button"
                    className={`btn btn-icon password-eye absolute`}
                    onClick={handleChangePasswordVisibility}
                    disabled={authLoading}
                  >
                    <span>{showPasswordIcon}</span>
                  </button>
                </span>
              </label>
              {passwordError && (
                <span className="error-text my-0-25 text-sm">
                  {passwordError}
                </span>
              )}
            </div>
            <div className="w-full mx-auto">
              <label className="flex-col mx-auto gap-0-5" htmlFor="input-psd">
                Confirm Password
                <span className="relative w-full h5 font-bold">
                  <input
                    type={`${showConfirmPassword ? "text" : "password"}`}
                    id="input-confirm-psd"
                    placeholder="********"
                    autoComplete="off"
                    name="confirmPassword"
                    onChange={handleFormDataChange}
                    value={confirmPassword}
                    required
                    disabled={authLoading}
                  />
                  <button
                    type="button"
                    className={`btn btn-icon password-eye absolute`}
                    onClick={handleChangeConfirmPasswordVisibility}
                    disabled={authLoading}
                  >
                    <span>{showConfirmPasswordIcon}</span>
                  </button>
                </span>
              </label>
              {confirmPassword && (
                <span className="error-text my-0-25 text-sm">
                  {confirmPasswordError}
                </span>
              )}
            </div>
            {error ? <div className="my-1 error-color">{error}</div> : null}
            <div className="flex-row flex-align-center flex-justify-between flex wrap gap-1">
              <input
                type="checkbox"
                id="checkbox-remember"
                name="checkbox-remember"
                required
                disabled={authLoading}
              />
              <label
                htmlFor="checkbox-remember"
                className="flex-row input-checkbox-remember flex-align-center text-md"
              >
                I accept terms and conditions
              </label>
            </div>
            <div className="flex-col flex-justify-center flex-align-center w-full gap-2 py-1">
              <button
                type="submit"
                disabled={authLoading}
                className="btn btn-primary rounded-md py-1 px-2 w-full font-bold"
              >
                Sign Up
              </button>
              <Link
                to="/login"
                className={`btn btn-link-animated-3 h5 font-sbold font-bold ${
                  authLoading ? "btn-disabled" : ""
                }`}
              >
                Already have an account? Login
                <span className="ml-0-5">
                  <ChevronRightIcon />
                </span>
              </Link>
            </div>
          </form>
        </article>
      </div>

      {authLoading && (
        <p className="success-color text-lg">Signing up. Please wait...</p>
      )}
    </section>
  );
};

export { Signup };

// <div className="auth-wrapper">
// <article className="auth-container signup-container mx-auto mb-1 px-1-5 py-2">
//   <h3 className="text-center text-uppercase auth-head mb-2">Sign Up</h3>
//   <form className="auth-form px-1" onSubmit={handleFormSubmit}>
//     <div className="input-group input-default mt-1-5 mx-auto">
//       <label
//         className="text-label text-reg flex-col mx-auto"
//         htmlFor="input-signup-fname"
//       >
//         First Name
//         <input
//           type="text"
//           id="input-signup-fname"
//           className="input-text text-sm px-0-75 py-0-5 mt-0-25"
//           placeholder="Jane"
//           name="firstName"
//           onChange={handleFormDataChange}
//           value={firstName}
//           disabled={authLoading}
//           required
//         />
//       </label>
//       <span className="text-message error-color mt-0-5">
//         {firstNameError}
//       </span>
//     </div>
//     <div className="input-group input-default mt-1-5 mx-auto">
//       <label
//         className="text-label text-reg flex-col mx-auto"
//         htmlFor="input-signup-lname"
//       >
//         Last Name
//         <input
//           type="text"
//           id="input-signup-lname"
//           className="input-text text-sm px-0-75 py-0-5 mt-0-25"
//           placeholder="Dow"
//           name="lastName"
//           onChange={handleFormDataChange}
//           value={lastName}
//           disabled={authLoading}
//           required
//         />
//       </label>
//       <span className="text-message error-color mt-0-5">
//         {lastNameError}
//       </span>
//     </div>
//     <div className="input-group input-default mt-1-5 mx-auto">
//       <label
//         className="text-label text-reg flex-col mx-auto"
//         htmlFor="input-login-email"
//       >
//         Email
//         <input
//           type="email"
//           id="input-login-email"
//           className="input-text text-sm px-0-75 py-0-5 mt-0-25"
//           placeholder="janedoe@example.com"
//           name="email"
//           onChange={handleFormDataChange}
//           value={email}
//           disabled={authLoading}
//           required
//         />
//       </label>
//       <span className="text-message error-color mt-0-5"></span>
//     </div>
//     <div className="input-group input-default mt-1-5 mb-1 mx-auto">
//       <label
//         className="text-label text-reg flex-col mx-auto text-sm"
//         htmlFor="input-psd"
//       >
//         Password
//         <span className="password-input-toggler">
//           <input
//             type={`${showPassword ? "text" : "password"}`}
//             id="input-psd"
//             className="input-text px-0-75 py-0-5 mt-0-25 text-sm"
//             placeholder="********"
//             autoComplete="off"
//             name="password"
//             onChange={handleFormDataChange}
//             value={password}
//             required
//             disabled={authLoading}
//           />
//           <button
//             type="button"
//             className="btn btn-icon icon-show-psd"
//             onClick={handleChangePasswordVisibility}
//             disabled={authLoading}
//           >
//             <span className="icon mui-icon">{showPasswordIcon}</span>
//           </button>
//         </span>
//       </label>
//       <span className="text-message error-color mt-0-5">
//         {passwordError}
//       </span>
//     </div>
//     <div className="input-group input-default mt-1-5 mb-1 mx-auto">
//       <label
//         className="text-label text-reg flex-col mx-auto text-sm"
//         htmlFor="input-confirm-psd"
//       >
//         Confirm Password
//         <span className="password-input-toggler">
//           <input
//             type={`${showConfirmPassword ? "text" : "password"}`}
//             id="input-confirm-psd"
//             className="input-text px-0-75 py-0-5 mt-0-25 text-sm"
//             placeholder="********"
//             autoComplete="off"
//             name="confirmPassword"
//             onChange={handleFormDataChange}
//             value={confirmPassword}
//             required
//             disabled={authLoading}
//           />
//           <button
//             type="button"
//             className={`btn btn-icon icon-show-psd ${
//               authLoading && "btn-disabled"
//             }`}
//             onClick={handleChangeConfirmPasswordVisibility}
//             disabled={authLoading}
//           >
//             <span className="icon mui-icon">
//               {showConfirmPasswordIcon}
//             </span>
//           </button>
//         </span>
//       </label>
//       <span className="text-message error-color mt-0-5">
//         {confirmPasswordError}
//       </span>
//     </div>
//     {error ? <p className="error-color">{error}</p> : null}
//     {authError && <p className="error-color text-lg">{authError}</p>}
//     <div className="psd-mgmt-container mt-2 flex-row flex-align-center flex-justify-between flex-wrap">
//       <label
//         htmlFor="checkbox-remember"
//         className="flex-row input-checkbox-remember flex-align-center text-sm"
//       >
//         <input
//           type="checkbox"
//           className="input-checkbox text-reg"
//           id="checkbox-remember"
//           required
//           disabled={authLoading}
//         />
//         I accept terms and conditions
//       </label>
//     </div>

//     <div className="auth-button-container mt-1 flex-col flex-align-center">
//       <input
//         type="submit"
//         value="Sign Up"
//         className={`btn btn-primary px-0-75 py-0-25 btn-full-width text-reg ${btnDisabled}`}
//         disabled={authLoading}
//       />
//       <Link
//         to="/login"
//         className={`btn btn-link btn-primary mt-0-75 ${linkDisabled}`}
//       >
//         Already have an account? Login{" "}
//         <span className="icon mui-icon icon-chevron-right">
//           <ChevronRightIcon />
//         </span>
//       </Link>
//     </div>
//   </form>
// </article>
// </div>
