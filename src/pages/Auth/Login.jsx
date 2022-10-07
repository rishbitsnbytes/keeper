import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

import "./auth.css";
import { loginService } from "services/";
import { useAuth } from "contexts/";
import { useDocumentTitle } from "custom-hook";

const Login = () => {
  const initialFormData = {
    email: "",
    password: "",
    rememberMe: false,
  };

  const [formData, setFormData] = useState(initialFormData);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const { authError, authLoading, isAuth, authDispatch } = useAuth();
  const setDocumentTitle = useDocumentTitle();

  useEffect(() => {
    setDocumentTitle("Keeper | Login");
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
    const { name, value, checked } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: name === "rememberMe" ? checked : value,
    }));
  };

  const showPasswordIcon = showPassword ? (
    <VisibilityOffIcon />
  ) : (
    <VisibilityIcon />
  );

  const handleFormSubmit = async (event) => {
    event.preventDefault();

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
      const { data } = await loginService(formData);
      const {
        encodedToken,
        foundUser: { notes, archives, ...otherUserDetails },
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

      if (rememberMe) {
        localStorage.setItem("keeper-token", encodedToken);
        localStorage.setItem("keeper-user", JSON.stringify(otherUserDetails));
      }

      setFormData(initialFormData);

      navigate(location?.state?.from ?? -1, { replace: true });
    } catch (error) {
      if (error.message.includes(404)) {
        authDispatch({
          action: {
            type: "SET_AUTH_LOADER_ERROR",
            payload: {
              authLoading: false,
              authError: "Login failed. Email not found!",
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
            authError: "Login failed. Please try again after sometime.",
          },
        },
      });
    }
  };

  const { email, password, rememberMe } = formData;
  const handleChangePasswordVisibility = () =>
    setShowPassword((prevShowPassword) => !prevShowPassword);

  const handleLoginWithTestCredentials = (event) => {
    setFormData({
      email: "testSingh@test.com",
      password: "testPassword",
      rememberMe: true,
    });
  };

  const btnDisabled = authLoading && "btn-disabled";

  return (
    <section
      className="main auth-main flex-col flex-align-center flex-justify-center mx-auto py-2 px-3 w-full"
      style={{ minHeight: "90vh" }}
    >
      <div className="auth-wrapper">
        <section className="auth-container login-container mx-auto mb-1 px-1-5 py-2 rounded-md">
          <h3 className="text-center h2 py-1">Login</h3>
          <form
            className="auth-form flex-col flex-justify-center flex-align-start py-1 px-5 w-full gap-2"
            onSubmit={handleFormSubmit}
          >
            <div className="w-full mx-auto">
              <label
                className="flex-col mx-auto gap-0-5"
                htmlFor="input-login-email"
              >
                Email
                <input
                  type="email"
                  name="email"
                  id="input-login-email"
                  placeholder="kindness@humanity.org"
                  value={email}
                  disabled={authLoading}
                  onChange={handleFormDataChange}
                  required
                />
              </label>
              <span className="text-sm mt-0-5"></span>
            </div>
            <div className="w-full mx-auto">
              <label
                className="flex-col mx-auto gap-0-5"
                htmlFor="input-login-psd"
              >
                Password
                <span className="relative w-full h5 font-bold">
                  <input
                    type={`${showPassword ? "text" : "password"}`}
                    id="input-login-psd"
                    disabled={authLoading}
                    placeholder="********"
                    name="password"
                    value={password}
                    onChange={handleFormDataChange}
                    autoComplete="off"
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
              <span className="text-sm mt-0-5"></span>
            </div>
            <div className="flex-row flex-align-center flex-justify-between flex wrap gap-1">
              <input
                type="checkbox"
                id="checkbox-remember"
                checked={rememberMe}
                disabled={authLoading}
                name="rememberMe"
                onChange={handleFormDataChange}
              />
              <label
                htmlFor="checkbox-remember"
                className="flex-row input-checkbox-remember flex-align-center text-md"
              >
                Remember me
              </label>
            </div>
            <div className="flex-col flex-justify-center flex-align-center w-full gap-2 py-1">
              <button
                type="submit"
                className={`btn btn-primary rounded-md py-1 px-2 w-full font-bold ${btnDisabled}`}
                disabled={authLoading}
              >
                {" "}
                Login{" "}
              </button>
              <button
                type="submit"
                className={`btn btn-secondary rounded-md py-1 px-2 w-full font-bold ${btnDisabled}`}
                disabled={authLoading}
                onClick={handleLoginWithTestCredentials}
              >
                Login with Test Credentials
              </button>
              <Link
                to="/signup"
                className={`btn btn-link-animated-3 h5 font-sbold font-bold ${btnDisabled}`}
              >
                Create a new account
                <span className="ml-0-5">
                  <ChevronRightIcon />
                </span>
              </Link>
            </div>
          </form>
        </section>
      </div>
      {authError && <p className="error-color text-lg">{authError}</p>}
      {authLoading && (
        <p className="success-color text-lg">Logging in. Please wait...</p>
      )}
    </section>
  );
};

export { Login };
