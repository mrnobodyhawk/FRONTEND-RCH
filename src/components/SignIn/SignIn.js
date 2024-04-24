import React, { useState } from 'react';
import logo from '../Media/Gifs/cube-logo.gif';
import '../SignIn/SignIn.css';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { MDBCard, MDBCardBody } from 'mdb-react-ui-kit';
import { useNavigate } from 'react-router-dom';
import NavBar from '../Homepage/NavBar';

const SignIn = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [, setCookie] = useCookies(['userId', 'userType']);
    const navigate = useNavigate(); // Initialize useNavigate

    const handleSignIn = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const formData = new FormData(e.target);
        const username = formData.get('username');
        const password = formData.get('password');

        try {
            const response = await axios.post('http://localhost:8082/communityhub/user/signIn', {
                username,
                password
            });

            if (response.status === 200 && response.data !== 0) {
                // Set userId in cookie upon successful sign-in
                setCookie('userId', response.data, { path: '/' });

                // Fetch user data using userId
                const userDataResponse = await axios.get(`http://localhost:8082/communityhub/user/getUser/${response.data}`);

                if (userDataResponse.status === 200) {
                    const userType = userDataResponse.data[0].userType;
                    // Set userType in cookie
                    setCookie('userType', userType, { path: '/' });
                    console.log(response.data);
                    console.log(userType);
                    toast.success('Successfully signed in');
                    if (userType === 'RESIDENT') {
                        setTimeout(() => {
                            navigate('/user-dashboard');
                        }, 2000);
                    }
                    else {
                        setTimeout(() => {
                            navigate('/admin-dashboard');
                        }, 2000);
                    }
                } else {
                    throw new Error('Failed to fetch user data');
                }
            } else {
                toast.error('Sign-in failed');
            }
        } catch (error) {
            console.error('Error occurred during sign-in:', error);
            toast.error('Error occurred during sign-in');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className='sign-in-main-container'>
            <NavBar />
            <div className="signin-container">
                <div className='signin-logo'>
                    <img src={logo} className="App-logo" alt="logo" />
                </div>

                <div className="signin-card">
                    <MDBCard>
                        <MDBCardBody>
                            <div className="form-container">
                                <form onSubmit={handleSignIn}>
                                    <div className="signin-form-group">
                                        <input type="text" className="input-field" name="username" placeholder="Enter username" required />
                                    </div>
                                    <div className="signin-form-group">
                                        <input type="password" className="input-field" name="password" placeholder="Enter password" required />
                                    </div>
                                    <button type="submit" className={`signin-btn-primary ${isLoading ? 'loading' : ''}`} disabled={isLoading}>
                                        {isLoading ? 'Signing In' : 'Sign In'}
                                    </button>
                                </form>
                            </div>
                            <div className="signin-create-account-link">
                                <p>Don't have an account! <span onClick={() => navigate('/sign-up')}>Create an account</span></p>
                            </div>
                        </MDBCardBody>
                    </MDBCard>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
}

export default SignIn;
