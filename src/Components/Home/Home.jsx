// src/pages/Home.jsx
import React from 'react';
import './Home.css';
import CargoImage from '../../Assets/Home.png';
import Navbar from '../Auth/Shared/Navbar';

const Home = () => {
  return (
    <div>
    <div className="landing-page">
      <div className="card-overlay">
        {/* Navbar */}
        <Navbar />
        
        {/* Main Home Content */}
        <div className="main-content">
          <div className="content">
            <h1 className="name">
              Ready<span style={{ color: "purple", fontSize: '6rem' }}>2</span>Go
            </h1>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Aspernatur culpa nisi minus esse
              corporis aliquam voluptates fuga quisquam voluptatem doloribus.
            </p>
            <button className="cta-button">Find Cargo</button>
          </div>

          <div className="image-container">
            <img src={CargoImage} alt="Cargo Transport" className="cargo-image" />
          </div>
        </div>
      </div>
    </div>
        </div>
  );
};

export default Home;
