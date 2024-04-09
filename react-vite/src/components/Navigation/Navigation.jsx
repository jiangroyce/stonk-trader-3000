import { NavLink, useNavigate } from "react-router-dom";
import SearchBar from "../SearchBar";
import ProfileButton from "./ProfileButton";
import "./Navigation.css";
import { useSelector } from "react-redux";
import OpenModalMenuItem from "./OpenModalMenuItem";
import LoginFormModal from "../LoginFormModal";
import SignupFormModal from "../SignupFormModal";

function Navigation() {
  const loggedIn = useSelector((state) => state.session.user);

  return (
    <>
      {loggedIn ?
        <div className="nav-bar">
          <div className="nav-bar-left">
            <NavLink className="landing-logo" to="/"><img src="./public/stonks-logo.png" alt="stonks-logo" width="50px"/></NavLink>
            <SearchBar />
          </div>
          <div className="nav-bar-right">
            <NavLink>Dashboard</NavLink>
            <NavLink>Screeners</NavLink>
            <NavLink>Watchlists</NavLink>
            <NavLink>Strategies</NavLink>
            <ProfileButton />
          </div>
        </div> :
        <div className="nav-bar">
            <OpenModalMenuItem
              className="log-in"
              itemText="Log In"
              modalComponent={<LoginFormModal />}
            />
            <OpenModalMenuItem
              className="log-out"
              itemText="Sign Up"
              modalComponent={<SignupFormModal />}
            />
        </div>
      }
    </>
  );
}

export default Navigation;
