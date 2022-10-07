import "styles/styles.css";
import { Navbar } from "components";
import { AppRoutes } from "routes";

const App = () => {
  return (
    <div className="flex-col">
      <Navbar />
      <AppRoutes />
    </div>
  );
};

export default App;
