import './topbar.css';
import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HiOutlineBell, HiOutlineCog6Tooth, HiOutlineBars3, HiOutlineArrowsPointingOut } from 'react-icons/hi2';
import { FaUser, FaLock, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { token } from '../utils/token';

const Topbar = ({ onToggleSidebar }) => {

  const navigate = useNavigate();

  const handleLogout = () => {
     localStorage.removeItem('token');
    navigate('/');
  };

     useEffect(() => {
    token(handleLogout);
  }, []);


  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };
  const [showBellDropdown, setShowBellDropdown] = useState(false);
  const [showSettingsDropdown, setShowSettingsDropdown] = useState(false);

  const toggleBellDropdown = () => {
    setShowBellDropdown((prev) => !prev);
    setShowSettingsDropdown(false);
  };

  const toggleSettingsDropdown = () => {
    setShowSettingsDropdown((prev) => !prev);
    setShowBellDropdown(false);
  };

  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


  return (
    <div className="topbar">
      <div className="topbar-left">
        <span className="logo">HRM</span>
        <HiOutlineBars3 className="icon-bar" onClick={onToggleSidebar} />
        <HiOutlineArrowsPointingOut className="icon1" onClick={toggleFullscreen} />
      </div>


      <div className="topbar-right">

        <div className="position-relative">
          <HiOutlineBell
            className="icon1"
            onClick={toggleBellDropdown}
            style={{ cursor: 'pointer', fontSize: '24px' }}
          />

          {showBellDropdown && (
            <ul className="dropdown-menu show" style={{ position: 'absolute', top: '30px', right: '0' }}>
              <li>
                <Link
                  to="/leave-detail"
                  className="dropdown-item"
                  onClick={() => setShowBellDropdown(false)}
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  View all leave
                </Link>
              </li>
              <li>
                <Link
                  to="/training-list"
                  className="dropdown-item"
                  onClick={() => setShowBellDropdown(false)}
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  View all trainings
                </Link>
              </li>
              <li>
                <Link
                  to="/ticketDetail"
                  className="dropdown-item"
                  onClick={() => setShowBellDropdown(false)}
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  View all tickets
                </Link>
              </li>
              <li>
                <Link
                  to="/update-attendance"
                  className="dropdown-item"
                  onClick={() => setShowBellDropdown(false)}
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  View all attendance
                </Link>
              </li>
            </ul>
          )}
        </div>

        <div className="position-relative">
          <HiOutlineCog6Tooth
            className="icon1"
            onClick={toggleSettingsDropdown}
            style={{ cursor: 'pointer', fontSize: '24px' }}
          />

          {showSettingsDropdown && (
            <ul className="dropdown-menu show" style={{ position: 'absolute', top: '30px', right: '0' }}>
              <li>
                <Link
                  to="/constants"
                  className="dropdown-item"
                  onClick={() => setShowSettingsDropdown(false)}
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  Constants
                </Link>
              </li>
              <li>
                <Link
                  to="/emailtemplates"
                  className="dropdown-item"
                  onClick={() => setShowSettingsDropdown(false)}
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  Email Template
                </Link>
              </li>
              <li>
                <Link
                  to="/databasebackup"
                  className="dropdown-item"
                  onClick={() => setShowSettingsDropdown(false)}
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  Backup Database Log
                </Link>
              </li>
            </ul>
          )}
        </div>

        {/* admin(sign out) */}
        <div className="position-relative" ref={dropdownRef}>
          <div
            onClick={() => setShowDropdown((prev) => !prev)}
            style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}
          >
            <img src="avatar.webp" alt="Avatar" className="avatar-img" />
            <span className="admin-text">Admin</span>
          </div>

          {showDropdown && (

            <ul className="dropdown-menu show" style={{ listStyle: 'none', padding: '8px', minWidth: '180px' }}>
              <li>
                <a href="#" className="dropdown-item" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FaUser /> My Profile
                </a>
              </li>
              <hr style={{ margin: '8px 0' }} />
              <li>
                <a href="#" className="dropdown-item" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FaLock /> Change Password
                </a>
              </li>
              <li>
                <a href="#" className="dropdown-item" onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FaSignOutAlt /> Sign Out
                </a>
              </li>
            </ul>

          )}
        </div>

      </div>
    </div>
  );
};

export default Topbar;
