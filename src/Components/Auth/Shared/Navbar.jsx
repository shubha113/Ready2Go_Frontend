import React, { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Languages } from "lucide-react";
import "./Navbar.css";
import { logout } from "../../../Redux/actions/userAction";
import { toast } from "react-toastify";
import Logo from "../../../Assets/logo.png";
import { useTranslation } from "react-i18next";

const Navbar = () => {
  const [isMenuActive, setMenuActive] = useState(false);
  const [isLanguageDropdownOpen, setLanguageDropdownOpen] = useState(false);
  const languageDropdownRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const { isAuthenticated, user } = useSelector((state) => state.user);

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
    { code: 'pa', name: 'ਪੰਜਾਬੀ', flag: '🇮🇳' }
  ];

  const changeLanguage = (languageCode) => {
    i18n.changeLanguage(languageCode);
    setLanguageDropdownOpen(false);
    localStorage.setItem('selectedLanguage', languageCode);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (languageDropdownRef.current && 
          !languageDropdownRef.current.contains(event.target)) {
        setLanguageDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const toggleMenu = () => {
    setMenuActive(!isMenuActive);
  };

  const closeMenu = () => {
    setMenuActive(false);
  };

  return (
    <header className="header">
      <nav>
        <div className="logo">
          <NavLink to="/">
            <img src={Logo} alt="Ready2Go" />
          </NavLink>
        </div>
        <ul className={`nav-links ${isMenuActive ? "active" : ""}`}>
          <li>
            <div className="button-logout">
              <NavLink 
                to="/" 
                className={({ isActive }) => 
                  `button-link ${isActive ? 'active-route' : ''}`
                }
                onClick={closeMenu}
              >
                  {t('navbar.home')}
              </NavLink>
            </div>
          </li>
          {user?.role === "user" && (
            <li>
              <div className="button-logout">
                <NavLink 
                  to="/create-order" 
                  className={({ isActive }) => 
                    `button-link ${isActive ? 'active-route' : ''}`
                  }
                  onClick={closeMenu}
                >
                  {t('navbar.createDelivery')}
                </NavLink>
              </div>
            </li>
          )}
          {(user?.role === "driver" || user?.role === "company") && (
            <li>
              <div className="button-logout">
                <NavLink 
                  to="/jobs" 
                  className={({ isActive }) => 
                    `button-link ${isActive ? 'active-route' : ''}`
                  }
                  onClick={closeMenu}
                >
                  {t('navbar.takeDelivery')}
                </NavLink>
              </div>
            </li>
          )}
          {isAuthenticated ? (
            <>
              <li>
                <div className="button-logout">
                  <NavLink 
                    to="/profile" 
                    className={({ isActive }) => 
                      `button-link ${isActive ? 'active-route' : ''}`
                    }
                    onClick={closeMenu}
                  >
                  {t('navbar.profile')}
                  </NavLink>
                </div>
              </li>
              <li>
                <div className="button-logout">
                  <NavLink 
                    to="/history" 
                    className={({ isActive }) => 
                      `button-link ${isActive ? 'active-route' : ''}`
                    }
                    onClick={closeMenu}
                  >
                  {t('navbar.history')}
                  </NavLink>
                </div>
              </li>
              <li onClick={handleLogout}>
                <div className="button-logout">
                  <NavLink 
                    to="/login" 
                    className={({ isActive }) => 
                      `button-link ${isActive ? 'active-route' : ''}`
                    }
                    onClick={() => {
                      handleLogout();
                      closeMenu();
                    }}
                  >
                  {t('navbar.logout')}
                  </NavLink>
                </div>
              </li>
            </>
          ) : (
            <>
              <li>
                <div className="button-logout">
                  <NavLink 
                    to="/register" 
                    className={({ isActive }) => 
                      `button-link ${isActive ? 'active-route' : ''}`
                    }
                    onClick={closeMenu}
                  >
                  {t('navbar.register')}
                  </NavLink>
                </div>
              </li>
              <li>
                <div className="button-login">
                  <NavLink 
                    to="/login" 
                    className={({ isActive }) => 
                      `button-link ${isActive ? 'active-route' : ''}`
                    }
                    onClick={closeMenu}
                  >
                  {t('navbar.login')}
                  </NavLink>
                </div>
              </li>
            </>
          )}
          {user?.role === "admin" && (
            <li>
              <div className="button-nav">
                <NavLink 
                  to="/get-users" 
                  className={({ isActive }) => 
                    `button-link ${isActive ? 'active-route' : ''}`
                  }
                  onClick={closeMenu}
                >
                  {t('navbar.manageUsers')}
                </NavLink>
              </div>
            </li>
          )}
          
          {/* Language Dropdown */}
          <li ref={languageDropdownRef} className="language-dropdown-container">
            <div 
              className="language-dropdown-trigger"
              onClick={() => setLanguageDropdownOpen(!isLanguageDropdownOpen)}
            >
              <Languages size={20} />
              <span>
                {languages.find(lang => lang.code === i18n.language)?.name || 'Language'}
              </span>
            </div>
            {isLanguageDropdownOpen && (
              <div className="language-dropdown-menu">
                {languages.map((language) => (
                  <div 
                    key={language.code}
                    className="language-dropdown-item"
                    onClick={() => changeLanguage(language.code)}
                  >
                    <span className="language-flag">{language.flag}</span>
                    <span className="language-name">{language.name}</span>
                  </div>
                ))}
              </div>
            )}
          </li>
        </ul>
        <div
          className={`hamburger ${isMenuActive ? "hamburger-active" : ""}`}
          onClick={toggleMenu}
        >
          <span className="line"></span>
          <span className="line"></span>
          <span className="line"></span>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;