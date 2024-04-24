import './ContactUs.css';
import NavBar from './NavBar';
function ContactUs() {
    return (
        <div>
            <NavBar/>
            <div className='contact-us-container'>
                <h1 className='contact-us-headline'>Contact</h1>
                <h1 className='contact-us-headline' id='text-us'>Us</h1>
            </div>
        </div>
    );
}

export default ContactUs;