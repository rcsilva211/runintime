import { Link } from "react-router-dom";
import PropTypes from "prop-types";

const Navigation = ({ handleLogout }) => (
  <header>
    <nav>
      <ul>
        <li>
          <Link to='/'>Home</Link>
        </li>
        <li>
          <Link to='/profile'>Profile</Link>
        </li>
        <li>
          <button onClick={handleLogout}>Logout</button>
        </li>
      </ul>
    </nav>
  </header>
);

Navigation.propTypes = {
  handleLogout: PropTypes.func.isRequired,
};

export default Navigation;
