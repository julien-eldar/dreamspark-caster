import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function Navbar() {
  const { token, logout } = useContext(AuthContext);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark" style={{ backgroundColor: '#1E3A8A' }}>
      <Link className="navbar-brand" to="/">DreamSpark</Link>
      <div className="collapse navbar-collapse justify-content-end">
        <ul className="navbar-nav">
          {token ? (
            <li className="nav-item">
              <button className="btn btn-link nav-link text-white" onClick={logout}>Logout</button>
            </li>
          ) : (
            <>
              <li className="nav-item">
                <Link className="nav-link text-white" to="/signup">Sign Up</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-white" to="/login">Login</Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;