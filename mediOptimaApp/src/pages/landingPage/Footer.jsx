import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaArrowRight } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';


export default function Footer() {

    const navigate = useNavigate();

    const handleGetStarted = () => {
        navigate('/adminlogin');
    };

    return (
        <footer className="bg-gradient-to-r from-gray-900 to-gray-800 text-white pt-16 pb-8">
            <div className="container mx-auto px-6">
                {/* Call to Action */}
                <div className="text-center mb-16 p-8 bg-gray-800 rounded-xl shadow-lg">
                    <h2 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                        Ready to Transform Your Medical Inventory?
                    </h2>
                    <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                        Join hundreds of healthcare providers optimizing their inventory management with our AI-powered solution.
                    </p>
                    <button className="relative inline-flex items-center justify-center px-8 py-3 overflow-hidden font-medium text-white bg-gradient-to-r from-blue-500 to-purple-600 rounded-full group" onClick={handleGetStarted}>
                        <span className="relative z-10 flex items-center">
                            Get Started Now <FaArrowRight className="ml-2 transition-transform group-hover:translate-x-1" />
                        </span>
                        <span className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-700 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                    </button>
                </div>

                {/* Footer Navigation */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-10 mb-12">
                    {/* Logo */}
                    <div className="space-y-4">
                        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                            Sanusvelle
                        </h1>
                        <p className="text-gray-400 text-sm">
                            AI-powered medical inventory optimization for healthcare providers.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-300">
                                <FaFacebook size={20} />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-300">
                                <FaTwitter size={20} />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors duration-300">
                                <FaInstagram size={20} />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-blue-500 transition-colors duration-300">
                                <FaLinkedin size={20} />
                            </a>
                        </div>
                    </div>

                    {/* Solutions */}
                    <div>
                        <h3 className="font-bold text-lg mb-4 text-white">Solutions</h3>
                        <ul className="space-y-3">
                            <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">Inventory Optimization</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">Demand Forecasting</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">Waste Reduction</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">Reporting Analytics</a></li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h3 className="font-bold text-lg mb-4 text-white">Support</h3>
                        <ul className="space-y-3">
                            <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">Documentation</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">API Reference</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">24/7 Support</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">Training</a></li>
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h3 className="font-bold text-lg mb-4 text-white">Company</h3>
                        <ul className="space-y-3">
                            <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">About Us</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">Careers</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">Blog</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">Partners</a></li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h3 className="font-bold text-lg mb-4 text-white">Legal</h3>
                        <ul className="space-y-3">
                            <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">Privacy Policy</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">Terms of Service</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">HIPAA Compliance</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">Security</a></li>
                        </ul>
                    </div>
                </div>

                {/* Footer Bottom */}
                <div className="pt-8 border-t border-gray-700 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-gray-500 text-sm mb-4 md:mb-0">
                        &copy; {getCurrentYear()} MediOptima. All rights reserved.
                    </p>
                    <div className="flex space-x-6">
                        <a href="#" className="text-gray-500 hover:text-white transition-colors duration-300 text-sm">Cookie Policy</a>
                        <a href="#" className="text-gray-500 hover:text-white transition-colors duration-300 text-sm">Accessibility</a>
                        <a href="#" className="text-gray-500 hover:text-white transition-colors duration-300 text-sm">Sitemap</a>
                    </div>
                </div>
            </div>
        </footer>
    );

    function getCurrentYear() {
        return new Date().getFullYear();
    }
}
