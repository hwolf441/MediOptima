import Predictions from '../../assets/LandingPage/AIPoweredPredictions.jpg';
import DataDriven from '../../assets/LandingPage/DataDrivenRestocking.jpg';
import SmartProcurement from '../../assets/LandingPage/SmartProcurementStrategies.jpg';
import SeamlessIntegration from '../../assets/LandingPage/SeamlessIntegration.jpg';

const FeatureCard = ({ icon, title, description }) => {
    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 h-full flex flex-col">
            <div className="overflow-hidden">
                {icon}
            </div>
            <div className="p-6 flex-grow flex flex-col">
                <h3 className="text-xl font-bold text-gray-800 mb-3">{title}</h3>
                <p className="text-gray-600 mb-4 flex-grow">{description}</p>
                <a href="#" className="text-blue-600 font-medium inline-flex items-center mt-auto hover:text-blue-800 transition-colors">
                    Learn more
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </a>
            </div>
        </div>
    );
};

const HowItWorks = () => {
    const features = [
        {
            icon: <img src={Predictions} alt="AI Powered Predictions" className="w-full h-48 object-cover hover:scale-105 transition-transform duration-500" />,
            title: 'AI Powered Predictions',
            description: 'Our system analyzes prescription patterns and real-time hospital data to recommend the most essential medications, minimizing waste and reducing procurement costs.',
        },
        {
            icon: <img src={DataDriven} alt="Data Driven Restocking" className="w-full h-48 object-cover hover:scale-105 transition-transform duration-500" />,
            title: 'Data Driven Restocking',
            description: 'No more guesswork. Get precision-based stock recommendations tailored to actual patient needs, ensuring continuous availability of critical medicines.',
        },
        {
            icon: <img src={SmartProcurement} alt="Smart Procurement Strategies" className="w-full h-48 object-cover hover:scale-105 transition-transform duration-500" />,
            title: 'Smart Procurement Strategies',
            description: 'Choose from AI-optimized procurement models that prevent stockouts while reducing unnecessary purchases.',
        },
        {
            icon: <img src={SeamlessIntegration} alt="Seamless Integration" className="w-full h-48 object-cover hover:scale-105 transition-transform duration-500" />,
            title: 'Seamless Integration',
            description: "Works effortlessly with your hospital's existing workflow, making inventory tracking and management simpler, faster, and smarter.",
        },
    ];

    return (
        <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">How It Works</h2>
                    <div className="w-20 h-1 bg-blue-600 mx-auto mb-6"></div>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Our intelligent system transforms medical inventory management through cutting-edge technology
                    </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => (
                        <FeatureCard
                            key={index}
                            icon={feature.icon}
                            title={feature.title}
                            description={feature.description}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;