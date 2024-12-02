import React, { useState } from 'react';
import './Features.css';
import FeaturesImage from '../../Assets/Features1.jpg';
import {
    ShieldCheck,
    Users,
    MapPin,
    Clock,
    Truck,
    Star,
    MessageSquare,
    IndianRupee
} from 'lucide-react';

const Features = () => {
    const [activeCard, setActiveCard] = useState(null);

    const features = [
        {
            icon: <IndianRupee className="feature-icon" />,
            title: "Zero Commission",
            description: "Direct pricing without any hidden fees. Pay exactly what the driver quotes."
        },
        {
            icon: <Users className="feature-icon" />,
            title: "Driver Freedom",
            description: "Complete independence for drivers. No subscriptions or company constraints."
        },
        {
            icon: <MapPin className="feature-icon" />,
            title: "Local Matching",
            description: "Instant connections with drivers within your locality. Multiple competitive bids."
        },
        {
            icon: <ShieldCheck className="feature-icon" />,
            title: "Secure Transactions",
            description: "Payments held in secure escrow, released only upon successful delivery."
        },
        {
            icon: <MessageSquare className="feature-icon" />,
            title: "Direct Communication",
            description: "Instant messaging with your delivery partner for seamless coordination."
        },
        {
            icon: <Truck className="feature-icon" />,
            title: "Real-Time Tracking",
            description: "Monitor your delivery in real-time with precise GPS tracking and updates."
        },
        {
            icon: <Star className="feature-icon" />,
            title: "Quality Ratings",
            description: "Comprehensive driver and service ratings to help you make informed choices."
        },
        {
            icon: <Clock className="feature-icon" />,
            title: "Flexibility",
            description: "Choose your ideal delivery partner based on price, convenience and ratings."
        },
    ];

    return (
        <div className="features-full-screen">
            <div className="features-content-wrapper">
                <div className="features-header">
                    <h1>
                        <h2 className="features-subtitle">Delivery Features</h2>
                    </h1>
                </div>

                <div className="features-main-content">
                    <div className="features-cards-container">
                        <div className="features-grid-container">
                            {features.slice(0, 4).map((feature, index) => (
                                <div
                                    key={index}
                                    className={`feature-card-modern ${activeCard === index ? 'active' : ''}`}
                                    onMouseEnter={() => setActiveCard(index)}
                                    onMouseLeave={() => setActiveCard(null)}
                                >
                                    <div className="feature-card-inner">
                                        <div className="feature-card-icon-circle">
                                            {feature.icon}
                                        </div>
                                        <div className="feature-card-text">
                                            <h3>{feature.title}</h3>
                                            <p>{feature.description}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="features-image-section">
                        <div className="image-wrapper">
                            <img
                                src={FeaturesImage}
                                alt="Ready2Go Delivery Features"
                                className="features-full-image"
                            />
                        </div>
                    </div>

                    <div className="features-cards-container">
                        <div className="features-grid-container">
                            {features.slice(4).map((feature, index) => (
                                <div
                                    key={index + 4}
                                    className={`feature-card-modern ${activeCard === index + 4 ? 'active' : ''}`}
                                    onMouseEnter={() => setActiveCard(index + 4)}
                                    onMouseLeave={() => setActiveCard(null)}
                                >
                                    <div className="feature-card-inner">
                                        <div className="feature-card-icon-circle">
                                            {feature.icon}
                                        </div>
                                        <div className="feature-card-text">
                                            <h3>{feature.title}</h3>
                                            <p>{feature.description}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Features;