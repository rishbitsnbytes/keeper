import "styles/styles.css";
import { Navbar, NewNoteModal } from "components";
import { AppRoutes } from "routes";

const App = () => {
  return (
    <div className="flex-col">
      <Navbar />
      <NewNoteModal />
      <AppRoutes />
    </div>
  );
};

export default App;
