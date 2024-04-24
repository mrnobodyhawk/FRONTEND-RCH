import './AboutUs.css'
import NavBar from './NavBar';
function AboutUs() {
    return (
        <div>
            <NavBar/>
            <div className="about-us-container">
                <h1 className='about-us-headline'>About Us</h1>
            </div>
        </div>
    );
}

export default AboutUs;