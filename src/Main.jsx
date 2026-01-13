import React, { useEffect, useState } from 'react'
import { Route, Routes } from 'react-router-dom';
import Footer from './HeaderandFooter/Footer';
import Footeradmin from './Dashboard/footeradmin';
import First from './Firstpage/First';
import Homepages from './HomePage/Homepages';
import Menucard from './Services/Menucard';
import MyProfile from './Profile/MyProfile';
import Register from './Loginpages/Register';
import Loginform from './Loginpages/Loginform';
import Bookingform from './Services/Bookingform';
import EditProfile from './Profile/EditProfile';
import Bookedhistory from './Profile/Bookedhistory';
import Helpandsupport from './Profile/Helpandsupport';
import Dashboardpage from './Dashboard/Dashboardpage';
import Adminservicemenu from './Dashboard/Adminservicemenu';
import Adminlogin from './Loginpages/Adminlogin';
import BookingDetails from './Dashboard/BookingDetails';
import Adminprofile from './Dashboard/Adminprofile';
import AdminEditprofile from './Dashboard/AdminEditprofile';

// Create a custom event for role changes
const ROLE_CHANGE_EVENT = 'roleChanged';

// Helper function to get user role that will be used throughout the app
export const getUserRole = () => localStorage.getItem('userRole');

// Helper function to set user role
export const setUserRoleInStorage = (role) => {
  localStorage.setItem('userRole', role);
  // Dispatch custom event
  window.dispatchEvent(new CustomEvent(ROLE_CHANGE_EVENT, { detail: { role } }));
};

export default function Main() {
  const [showSplash, setShowSplash] = useState(false);
  const [isSplashTime, setIsSplashTime] = useState(false);
  const [userRole, setUserRole] = useState(getUserRole());

  useEffect(() => {
    const hasShown = sessionStorage.getItem('splashShown');
    
    // Always check for latest role
    setUserRole(getUserRole());

    if (!hasShown) {
      setShowSplash(true);
      setIsSplashTime(true);
      setTimeout(() => {
        setIsSplashTime(false);
        sessionStorage.setItem('splashShown', 'true');
      }, 3000);
    }
  }, []);

  // Add event listeners to detect role changes
  useEffect(() => {
    // Function to update role from localStorage
    const handleRoleChange = (event) => {
      const newRole = getUserRole();
      setUserRole(newRole);
      
    };

    // Listen for our custom event
    window.addEventListener(ROLE_CHANGE_EVENT, handleRoleChange);
    
    // Also listen for standard storage events (for logout from other tabs)
    window.addEventListener('storage', (event) => {
      if (event.key === 'userRole' || event.key === null) {
        handleRoleChange();
      }
    });

    // Interval to periodically check localStorage (fallback)
    const intervalId = setInterval(() => {
      const currentRole = getUserRole();
      if (currentRole !== userRole) {
        setUserRole(currentRole);
      }
    }, 1000);

    return () => {
      window.removeEventListener(ROLE_CHANGE_EVENT, handleRoleChange);
      window.removeEventListener('storage', handleRoleChange);
      clearInterval(intervalId);
    };
  }, [userRole]);
  
  // Force a role check on each render
  useEffect(() => {
    const currentRole = getUserRole();
    if (currentRole !== userRole) {
      setUserRole(currentRole);
    }
  });
  
  if (showSplash && isSplashTime) {
    return <First />;
  }

  // Redirect users with role 2 to dashboard if they try to access regular user routes
  const isAdminRole = userRole === '2';
  
  return (
    <>
      <div className='Main'>
        <Routes>
          {/* Regular user routes */}
          <Route path="/" element={isAdminRole ? <Dashboardpage /> : <Homepages />} />
          <Route path="/services" element={isAdminRole ? <Adminservicemenu /> : <Menucard />} />
          <Route path='/MyProfile' element={isAdminRole ? <Dashboardpage /> : <MyProfile />} />
          <Route path='/Register' element={<Register />} />
          <Route path='/Login' element={<Loginform />} />
          <Route path='/Booking' element={isAdminRole ? <BookingDetails /> : <Bookingform />} />
          <Route path='/Edit-profile' element={isAdminRole ? <Dashboardpage /> : <EditProfile />} />
          <Route path='/Booked-history' element={isAdminRole ? <BookingDetails /> : <Bookedhistory />} />
          <Route path='/Help-support' element={isAdminRole ? <Dashboardpage /> : <Helpandsupport />} />
          
          {/* Admin routes */}
          <Route path='/Admin-login' element={<Adminlogin />} />
          <Route path='/dashboard' element={<Dashboardpage />} />
          <Route path='/Adminservicemenu' element={<Adminservicemenu />} />
          <Route path='/Booking-details' element={<BookingDetails/>}/>
          <Route path='/Admin-profile' element={<Adminprofile/>}/>
          <Route path='/Admin-Edit-profile' element={<AdminEditprofile/>}/>
        </Routes>

        {/* Render the appropriate footer based on user role */}
        {userRole === '2' ? <Footeradmin /> : <Footer />}
      </div>
    </>
  );
}