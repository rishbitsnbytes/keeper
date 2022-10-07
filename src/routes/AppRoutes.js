import Mockman from "mockman-js";
import { Routes, Route } from "react-router-dom";
import { NotFoundPage, Login, Signup, Home } from "pages";

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<Mockman />} path="/mockman" />
      <Route element={<Login />} path="/login" />
      <Route element={<Signup />} path="/signup" />
      <Route element={<NotFoundPage />} path="*" />
      <Route element={<Home />} path="/home" />
      <Route element={<Home />} path="/" />
    </Routes>
  );
};

export { AppRoutes };
