import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import logo from '../Media/Gifs/cube-logo.gif';
import { MDBCard, MDBCardBody } from 'mdb-react-ui-kit';
import './SignUp.css';
import NavBar from '../Homepage/NavBar';
import { useCookies } from 'react-cookie';

const SignUp = ({ setUserRole }) => {
    const [userId, setUserId] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [mobileNumber, setMobileNumber] = useState('');
    const [presentAddress, setPresentAddress] = useState('');
    const [userType, setUserType] = useState('RESIDENT');
    const [adminCode, setAdminCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const [, setCookie] = useCookies(['userId', 'userType']);

    const navigate = useNavigate();

    const handleSignUp = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        // Check if any field is empty
        const emptyFields = [userId, firstName, lastName, username, password, mobileNumber, presentAddress]
            .filter(field => field.trim() === '');

        if (emptyFields.length > 0) {
            toast.warn('Please fill in all details.');
            setIsLoading(false);
            return;
        }

        try {
            // Check if a user with the same userId exists
            const userResponse = await fetch(`http://localhost:8082/communityhub/user/getUser/${userId}`);
            const userData = await userResponse.json();

            if (userData.length > 0) {
                toast.error(`User ID ${userId} is already registered.`);
                setIsLoading(false);
                return;
            }

            // Check if username already exists
            const usernameResponse = await fetch(`http://localhost:8082/communityhub/user/username/${username}`);
            const usernameData = await usernameResponse.text();

            if (usernameData === 'Username already exist') {
                toast.error(`Username ${username} is already registered.`);
                setIsLoading(false);
                return;
            }

            // If userType is ADMIN, check if admin code is provided and valid
            if (userType === 'ADMIN') {
                if (adminCode === '') {
                    toast.error('Please enter the ADMIN code.');
                    setIsLoading(false);
                    return;
                } else if (adminCode !== 'TVH') {
                    toast.error('Invalid ADMIN code.');
                    setIsLoading(false);
                    return;
                }
            }

            setCookie('userId', userId, { path: '/' });
            setCookie('userType', userType, { path: '/' });

            // Send user data to the server for saving
            const response = await fetch('http://localhost:8082/communityhub/user/signUp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId,
                    firstName,
                    lastName,
                    username,
                    password,
                    mobileNumber,
                    presentAddress,
                    userType,
                }),
            });

            if (response.ok) {
                toast.success('Successfully signed up!');
                setIsLoading(false);
                if (userType === 'RESIDENT') {
                    setTimeout(() => {
                        navigate('/user-dashboard');
                    }, 2500);
                } else if (userType === 'ADMIN') {
                    setTimeout(() => {
                        navigate('/admin-dashboard');
                    }, 2500);
                }
            } else {
                throw new Error('Failed to sign up');
            }
        } catch (error) {
            console.error('Error checking user existence:', error);
            toast.error(`Error checking user existence: ${error.message}`);
            setIsLoading(false);
        }
    };


    return (
        <div className='sign-up-main-container'>
            <NavBar />
            <div className="signup-container">
                <ToastContainer />
                <div className='signup-logo'>
                    <img src={logo} className="signup-App-logo" alt="logo" />
                </div>

                <div className="signup-card">
                    <MDBCard>
                        <MDBCardBody>
                            <form onSubmit={handleSignUp}>
                                <div className="signup-form-group">
                                    <input type="text" className="signup-input-field" name="userId" placeholder="Create User ID" value={userId} onChange={(e) => setUserId(e.target.value)} />
                                </div>
                                <div className="signup-form-group">
                                    <input type="text" className="signup-input-field" name="firstName" placeholder="Enter First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                                </div>
                                <div className="signup-form-group">
                                    <input type="text" className="signup-input-field" name="lastName" placeholder="Enter Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                                </div>
                                <div className="signup-form-group">
                                    <input type="text" className="signup-input-field" name="username" placeholder="Create a new Username" value={username} onChange={(e) => setUsername(e.target.value)} />
                                </div>
                                <div className="signup-form-group">
                                    <input type="password" className="signup-input-field" name="password" placeholder="Create Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                                </div>
                                <div className="signup-form-group">
                                    <input type="text" className="signup-input-field" name="mobileNumber" placeholder="Enter Mobile Number" value={mobileNumber} onChange={(e) => setMobileNumber(e.target.value)} />
                                </div>
                                <div className="signup-form-group">
                                    <input type="text" className="signup-input-field" name="presentAddress" placeholder="Enter Present Address" value={presentAddress} onChange={(e) => setPresentAddress(e.target.value)} />
                                </div>
                                {userType === 'ADMIN' && (
                                    <div className="signup-form-group">
                                        <input type="text" className="signup-input-field" name="adminCode" placeholder="Enter Admin Code" value={adminCode} onChange={(e) => setAdminCode(e.target.value)} />
                                    </div>
                                )}
                                <div className="signup-form-group">
                                    <select className="signup-input-field" name="userType" value={userType} onChange={(e) => setUserType(e.target.value)}>
                                        <option value="RESIDENT">Resident</option>
                                        <option value="ADMIN">Admin</option>
                                    </select>
                                </div>
                                <button type="submit" className={`signup-btn-primary ${isLoading ? 'signup-loading' : ''}`} disabled={isLoading}>{isLoading ? 'Signing Up...' : 'Sign Up'}</button>
                            </form>

                            <div className="signup-create-account-link">
                                <p>Already have an account! <span onClick={() => navigate('/sign-in')}>Sign In</span></p>
                            </div>

                        </MDBCardBody>
                    </MDBCard>
                </div>
            </div>
        </div>
    );
};

export default SignUp;
