import Carousel from '../Carousel/Carousel';
import logo from '../Media/Gifs/cube-logo.gif';
import './Homepage.css'; // Import your CSS file for homepage styles
import NavBar from './NavBar';

function Homepage() {
    return (
        <div className="Homepage">
            <header className="Homepage-header">
                <NavBar />
                <Carousel />
                <img src={logo} className="Homepage-logo" alt="logo" />
            </header>
        </div>
    );
}

export default Homepage;