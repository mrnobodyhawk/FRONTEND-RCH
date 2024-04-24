import React, { useState, useEffect } from 'react';
import image01 from '../Media/Images/image-01.jpg';
import image02 from '../Media/Images/image-02.jpg';
import image03 from '../Media/Images/image-03.jpg';
import '../Carousel/Carousel.css'; // Import your CSS file for carousel styles

const Carousel = () => {
  const [currentImage, setCurrentImage] = useState(image01);

  useEffect(() => {
    // Array of images
    const images = [image01, image02, image03];

    // Function to change the image every 3 seconds
    const interval = setInterval(() => {
      const currentIndex = images.indexOf(currentImage);
      const nextIndex = (currentIndex + 1) % images.length;
      setCurrentImage(images[nextIndex]);
    }, 1500);

    // Clean up function to clear the interval
    return () => clearInterval(interval);
  }, [currentImage]);

  return (
    <div id="carouselExampleIndicators" className="carousel slide" data-ride="carousel">
      <div className="carousel-inner">
        <div className="carousel-item active">
          <img className="d-block w-100" src={currentImage} alt="Slide" />
        </div>
      </div>
    </div>
  );
}

export default Carousel;
