import Mockman from "mockman-js";
import { Routes, Route } from "react-router-dom";
import { NotFoundPage, Login, Signup } from "pages";

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<Mockman />} path="/mockman" />
      <Route element={<Login />} path="/login" />
      <Route element={<Signup />} path="/signup" />
      <Route element={<NotFoundPage />} path="*" />
    </Routes>
  );
};

export { AppRoutes };
