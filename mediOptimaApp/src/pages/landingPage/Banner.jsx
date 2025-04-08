import BannerImg from '../../assets/LandingPage/BannerImg.jpg';
import { useNavigate } from 'react-router-dom';

export default function Banner() {
    const navigate = useNavigate();

    const handleGetStarted = () => {
        navigate('/adminlogin');
    };

    return (
        <section className="relative h-screen max-h-[900px] overflow-hidden bg-gray-50">
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-indigo-900/90"></div>
            
            {/* Content Container */}
            <div className="container mx-auto px-6 h-full flex flex-col lg:flex-row items-center justify-center relative z-10 pt-20 lg:pt-0">
                {/* Text Content */}
                <div className="lg:w-1/2 mb-12 lg:mb-0 lg:pr-12 text-center lg:text-left">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                        <span className="text-white">Smart, Data-Driven</span><br />
                        <span className="text-white">
                            Medical Inventory <span className="text-blue-300">Management</span>
                        </span>
                    </h1>
                    <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                        Transform your healthcare inventory with our AI-powered platform that reduces medical waste and ensures critical supplies are always available when needed.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                        <button 
                            onClick={handleGetStarted}
                            className="bg-white text-blue-900 font-semibold py-3 px-8 rounded-lg hover:bg-blue-50 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1"
                        >
                            Get Started
                        </button>
                        <button className="bg-transparent border-2 border-white text-white font-semibold py-3 px-8 rounded-lg hover:bg-white hover:bg-opacity-10 transition-all duration-300">
                            Learn More
                        </button>
                    </div>
                
                </div>

                {/* Image Content */}
                <div className="lg:w-1/2 flex justify-center">
                    <div className="relative w-full max-w-xl">
                        <img 
                            src={BannerImg} 
                            alt="Medical professionals using inventory management system" 
                            className="rounded-lg shadow-2xl w-full h-auto object-cover border-4 border-white/20 transform transition-all duration-500 hover:scale-[1.02]" 
                        />
                        <div className="absolute -bottom-4 -right-4 w-24 h-24 border-t-4 border-r-4 border-blue-300 rounded-tr-lg opacity-80"></div>
                    </div>
                </div>
            </div>

            {/* Decorative Wave */}
            <div className="absolute bottom-0 left-0 right-0">
                <svg viewBox="0 0 1440 120" className="w-full">
                    <path 
                        fill="#FFFFFF" 
                        fillOpacity="0.1" 
                        d="M0,64L48,80C96,96,192,128,288,128C384,128,480,96,576,85.3C672,75,768,85,864,101.3C960,117,1056,139,1152,133.3C1248,128,1344,96,1392,80L1440,64L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
                    ></path>
                </svg>
            </div>
        </section>
    );
}