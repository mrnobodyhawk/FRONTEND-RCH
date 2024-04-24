import React from 'react';
import { useCookies } from 'react-cookie';
import UserNavbar from '../User/UserNavbar/UserNavbar';
import './SignOut.css';

const SignOut = () => {
    const [, , removeCookie] = useCookies(['userId', 'userType']);

    const handleSignOut = () => {
        // Remove userId and userType cookies upon sign-out
        removeCookie('userId', { path: '/' });
        removeCookie('userType', { path: '/' });
        // Redirect to sign-in page
        window.location.href = '/';
    };

    return (
        <div>
            <UserNavbar />
            <button className='sign-out-button' onClick={handleSignOut}>Sign Out</button>
        </div>
    );
};

export default SignOut;
