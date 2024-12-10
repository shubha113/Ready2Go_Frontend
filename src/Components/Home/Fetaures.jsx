import React, { useEffect, useState } from 'react';
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
import { useTranslation } from 'react-i18next';
import i18n from '../../../i18n';

const Features = () => {
    const [activeCard, setActiveCard] = useState(null);
    const { t } = useTranslation();
    const [language, setLanguage] = useState(i18n.language);

    useEffect(() => {
        const handleLanguageChange = () => {
            setLanguage(i18n.language);
        };

        i18n.on('languageChanged', handleLanguageChange);

        return () => {
            i18n.off('languageChanged', handleLanguageChange);
        };
    }, [i18n]);


    const features = [
        {
            icon: <IndianRupee className="feature-icon" />,
            title: t('features.0.title'),
            description: t('features.0.description')
        },
        {
            icon: <Truck className="feature-icon" />,
            title: t('features.1.title'),
            description: t('features.1.description')
        }, 
        {
            icon: <MessageSquare className="feature-icon" />,
            title: t('features.2.title'),
            description: t('features.2.description')
        },
        {
            icon: <Users className="feature-icon" />,
            title: t('features.3.title'),
            description: t('features.3.description')
        },
        {
            icon: <MapPin className="feature-icon" />,
            title: t('features.4.title'),
            description: t('features.4.description')
        },
        {
            icon: <ShieldCheck className="feature-icon" />,
            title: t('features.5.title'),
            description: t('features.5.description')
        },
        {
            icon: <Star className="feature-icon" />,
            title: t('features.6.title'),
            description: t('features.6.description')
        },
        {
            icon: <Clock className="feature-icon" />,
            title: t('features.7.title'),
            description: t('features.7.description')
        },
    ];

    return (
        <div className="features-full-screen" key={language}>
            <div className="features-content-wrapper">
                <div className="features-header">
                    <h2 className="features-subtitle">Delivery Features</h2>
                </div>

                <div className="features-main-content">
                    <div className="features-cards-container">
                        <div className="features-grid-container">
                            {features.slice(0, 4).map((feature, index) => (
                                <div
                                    key={`${language}-${index}`}
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
                                    key={`${language}-${index + 4}`}
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