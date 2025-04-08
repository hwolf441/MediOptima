
import ReduceMedicalWaste from '../../assets/LandingPage/ReduceMedicalWaste.jpg';
import CostEfficiency from '../../assets/LandingPage/CostEfficiency.jpg';
import ImprovedPatientCare from '../../assets/LandingPage/ImprovedPatientCare.jpg';
import AutomatedInsights from '../../assets/LandingPage/AutomatedInsights.jpg';

const WhyUsSection = ({ image, title, description, reverse }) => {
    return (
        <div className={`flex flex-col ${reverse ? 'md:flex-row-reverse' : 'md:flex-row'} items-center mb-16 md:mb-24 max-w-6xl mx-auto px-4`}>
            <div className={`md:w-1/2 ${reverse ? 'md:ml-12' : 'md:mr-12'} mb-8 md:mb-0`}>
                <img 
                    src={image} 
                    alt={title} 
                    className="w-full h-auto rounded-xl shadow-lg object-cover transition-transform duration-500 hover:scale-105" 
                />
            </div>
            <div className="md:w-1/2 text-center md:text-left">
                <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">{title}</h3>
                <p className="text-gray-600 text-lg leading-relaxed">{description}</p>
                <div className="mt-6">
                    <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300">
                        Learn more
                    </button>
                </div>
            </div>
        </div>
    );
};

const WhyUs = () => {
    const data = [
        {
            image: ReduceMedicalWaste,
            title: "Reduce Medical Waste",
            description: "Our advanced tracking system helps eliminate expired or unused medication, reducing environmental impact and saving costs.",
        },
        {
            image: CostEfficiency,
            title: "Cost Efficiency",
            description: "Prevent over-ordering and optimize budget allocation with our intelligent inventory management solutions.",
        },
        {
            image: ImprovedPatientCare,
            title: "Improved Patient Care",
            description: "Ensure life-saving medications are always available when needed, enhancing treatment outcomes and patient satisfaction.",
        },
        {
            image: AutomatedInsights,
            title: "Automated Insights",
            description: "AI-driven analytics provide actionable insights to help decision-makers plan smarter procurement strategies.",
        },
    ];

    return (
        <section className="py-16 md:py-24 bg-gray-50">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Why Choose Our Solution</h2>
                    <div className="w-20 h-1 bg-blue-600 mx-auto mb-6"></div>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Innovative features designed to transform your medical inventory management
                    </p>
                </div>
                
                <div className="space-y-24">
                    {data.map((item, index) => (
                        <WhyUsSection
                            key={index}
                            image={item.image}
                            title={item.title}
                            description={item.description}
                            reverse={index % 2 !== 0}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default WhyUs;