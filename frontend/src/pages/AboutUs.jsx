import React, { useEffect } from 'react';
import HeroSection from '../components/AboutUs/HeroSection';
import StorySection from '../components/AboutUs/StorySection';
import ValuesSection from '../components/AboutUs/ValuesSection';
import LookbookGallery from '../components/AboutUs/LookbookGallery';
import BehindScenes from '../components/AboutUs/BehindScenes';
import CTASection from '../components/AboutUs/CTASection';

const AboutUs = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-black selection:text-white">
            <HeroSection />
            <StorySection />
            <ValuesSection />
            <LookbookGallery />
            <BehindScenes />
            <CTASection />
        </div>
    );
};

export default AboutUs;
