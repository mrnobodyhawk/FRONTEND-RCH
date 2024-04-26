import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import logo from '../Media/Gifs/cube-logo.gif';
import { MDBCard, MDBCardBody } from 'mdb-react-ui-kit';
import './SignUp.css';
import NavBar from '../Homepage/NavBar';
import { useCookies } from 'react-cookie';
import axios from 'axios';

const SignUp = () => {
    // State variables for form fields
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

    // Cookie management hook
    const [, setCookie] = useCookies(['userId', 'userType']);

    // Navigation hook
    const navigate = useNavigate();

    // Function to handle sign up form submission
    const handleSignUp = async (e) => {
        e.preventDefault(); // Prevent default form submission behavior
        setIsLoading(true); // Set loading state to true

        // Check if any field is empty
        const emptyFields = [userId, firstName, lastName, username, password, mobileNumber, presentAddress]
            .filter(field => field.trim() === '');

        if (emptyFields.length > 0) {
            toast.warn('Please fill in all details.');
            setIsLoading(false); // Set loading state to false
            return;
        }

        try {

            // Check if a user with the same userId exists
            const userResponse = await axios.get(`http://localhost:8082/communityhub/user/getUser/${userId}`);
            const userData = userResponse.data;

            if (userData.length > 0) {
                toast.error(`User ID ${userId} is already registered.`);
                setIsLoading(false); // Set loading state to false
                return;
            }

            // Check if first name contains only letters
            if (!/^[a-zA-Z]+$/.test(firstName)) {
                toast.error('First name should contain only letters.');
                setIsLoading(false); // Set loading state to false
                return;
            }

            // Check if last name contains only letters
            if (!/^[a-zA-Z]+$/.test(lastName)) {
                toast.error('Last name should contain only letters.');
                setIsLoading(false); // Set loading state to false
                return;
            }

            // Check if username contains only letters
            if (!/^[a-zA-Z]+$/.test(username)) {
                toast.error('Username should contain only letters.');
                setIsLoading(false); // Set loading state to false
                return;
            }

            // Check if username already exists
            const usernameResponse = await axios.get(`http://localhost:8082/communityhub/user/username/${username}`);
            const usernameData = usernameResponse.data;

            if (usernameData === 'Username already exist') {
                toast.error(`Username ${username} is already registered.`);
                setIsLoading(false); // Set loading state to false
                return;
            }

            // Check if password meets complexity requirements
            if (password.length < 5 || !/[a-zA-Z]/.test(password) || !/\d/.test(password)) {
                toast.error('Password should be at least 5 characters long and contain at least one letter and one number.');
                setIsLoading(false); // Set loading state to false
                return;
            }

            // Check if mobile number is valid
            if (!/^[6-9]\d{9}$/.test(mobileNumber)) {
                toast.error('Mobile number should be 10 digits long and start with 6, 7, 8, or 9.');
                setIsLoading(false); // Set loading state to false
                return;
            }

            // If userType is ADMIN, check if admin code is provided and valid
            if (userType === 'ADMIN') {
                if (adminCode === '') {
                    toast.error('Please enter the ADMIN code.');
                    setIsLoading(false); // Set loading state to false
                    return;
                } else if (adminCode !== 'TVH') {
                    toast.error('Invalid ADMIN code.');
                    setIsLoading(false); // Set loading state to false
                    return;
                }
            }

            // Set cookies for user ID and type
            setCookie('userId', userId, { path: '/' });
            setCookie('userType', userType, { path: '/' });

            // Send user data to the server for saving
            const response = await axios.post('http://localhost:8082/communityhub/user/signUp', {
                userId,
                firstName,
                lastName,
                username,
                password,
                mobileNumber,
                presentAddress,
                userType,
            });

            // Handle successful sign up
            if (response.status === 200) {
                toast.success('Successfully signed up!');
                setIsLoading(false); // Set loading state to false
                // Redirect user to appropriate dashboard after a delay
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
            setIsLoading(false); // Set loading state to false
        }
    };

    return (
        <div className='sign-up-main-container'>
            {/* Navigation bar component */}
            <NavBar />
            <div className="signup-container">
                {/* Toast container for displaying messages */}
                <ToastContainer />
                <div className='signup-logo'>
                    <img src={logo} className="signup-App-logo" alt="logo" />
                </div>

                <div className="signup-card">
                    <MDBCard>
                        <MDBCardBody>
                            {/* Sign-up form */}
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
                                {/* Conditional rendering for admin code input based on user type */}
                                {userType === 'ADMIN' && (
                                    <div className="signup-form-group">
                                        <input type="text" className="signup-input-field" name="adminCode" placeholder="Enter Admin Code" value={adminCode} onChange={(e) => setAdminCode(e.target.value)} />
                                    </div>
                                )}
                                {/* Dropdown for selecting user type */}
                                <div className="signup-form-group">
                                    <select className="signup-input-field" name="userType" value={userType} onChange={(e) => setUserType(e.target.value)}>
                                        <option value="RESIDENT">Resident</option>
                                        <option value="ADMIN">Admin</option>
                                    </select>
                                </div>
                                {/* Submit button with loading indicator */}
                                <button type="submit" className={`signup-btn-primary ${isLoading ? 'signup-loading' : ''}`} disabled={isLoading}>{isLoading ? 'Signing Up...' : 'Sign Up'}</button>
                            </form>

                            {/* Link to sign in page */}
                            <div className="signup-create-account-link">
                                <p>Already have an account! <span onClick={() => navigate('/sign-in')} onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        navigate('/sign-in');
                                    }
                                }} >Sign In</span></p>
                            </div>

                        </MDBCardBody>
                    </MDBCard>
                </div>
            </div>
        </div>
    );
};

export default SignUp;
