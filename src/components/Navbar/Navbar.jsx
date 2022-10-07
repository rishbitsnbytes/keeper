import "./navbar.css";
import keeperLogo from "assets/others/keeper-logo-gif.gif";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="navbar flex-row flex-align-center flex-justify-between">
      <div className="left-nav flex-row flex-justify-center flex-align-center gap-2 px-5 py-0-5">
        <Link to="/">
          <img
            className="nav-logo rounded-circle"
            src={keeperLogo}
            alt="Logo"
            width={60}
            height={60}
          />
        </Link>
        <Link to="/" className="btn h1 font-xbold color-primary">
          keeper!
        </Link>
      </div>
    </nav>
  );
};

export { Navbar };
