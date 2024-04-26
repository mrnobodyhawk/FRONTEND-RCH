import React, { useEffect } from 'react';
import UserNavbar from '../UserNavbar/UserNavbar';
import './UserHomepage.css'; // Import CSS file for homepage styles

function UserHomepage() {
    useEffect(() => {
        const typingLine = document.getElementById('typing-line'); // Get the typing line element
        const text = "Welcome to our Website..."; // Define the text to be typed
        let index = 0; // Initialize index for typing animation

        const typeEffect = () => { // Define typing effect function
            if (index < text.length) { // Check if not reached end of text
                typingLine.textContent = text.substring(0, index + 1); // Update text content with substring
                index++; // Increment index
                setTimeout(typeEffect, 100); // Call typeEffect function after 100 milliseconds
            }
        };

        typeEffect(); // Start typing effect
    }, []); // Run effect only once after component mount

    return (
        <div>
            <UserNavbar /> 
            <div className='user-homepage-container'> 
                <div className='user-homepage-headline'> 
                    <h1 className="right-aligned">Hello Resident,</h1> 
                    <h1 id='typing-line' className="right-aligned">!</h1> 
                </div>
            </div>
        </div>
    );
}

export default UserHomepage;
