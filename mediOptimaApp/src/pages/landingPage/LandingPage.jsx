import Banner from "./Banner"
import DevTeam from "./DevTeam"
import Footer from "./Footer"
import HowItWorks from "./HowItWorks"
import Nav from "./Nav"
import WhyUs from "./WhyUs"

export default function LandingPage() {
    return (
        <>
            <Nav />
            
            {/* Banner/Home Section */}
            <section id="home">
                <Banner />
            </section>
            
            {/* How It Works Section */}
            <section id="how-it-works">
                <HowItWorks />
            </section>
            
            {/* Why Us Section */}
            <section id="why-us">
                <WhyUs />
            </section>
            
            {/* Development Team Section */}
            <section id="team">
                <DevTeam />
            </section>
            
            <Footer />
        </>
    );
}
