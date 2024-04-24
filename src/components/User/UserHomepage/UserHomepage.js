import React, { useEffect } from 'react';
import UserNavbar from '../UserNavbar/UserNavbar';
import './UserHomepage.css'; // Import your CSS file for homepage styles

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
            <UserNavbar /> {/* Include UserNavbar component */}
            <div className='user-homepage-container'> {/* Apply user-homepage-container style */}
                <div className='user-homepage-headline'> {/* Apply user-homepage-headline style */}
                    <h1 className="right-aligned">Hello Resident,</h1> {/* Include greeting text with right alignment */}
                    <h1 id='typing-line' className="right-aligned">! </h1> {/* Include typing line with right alignment */}
                </div>
            </div>
        </div>
    );
}

export default UserHomepage;
