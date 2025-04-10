import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Bullseye, Search, TrendingUp, Podcast, CheckCircle, ArrowRight } from 'lucide-react';
import GlowCard from './GlowCard';
import SectionTitle from './SectionTitle';
import useFadeIn from '../hooks/useFadeIn';

const Services = () => {
  const { theme } = useTheme();
  const [setRefIntro, styleIntro] = useFadeIn();
  const [setRefCards, styleCards] = useFadeIn({ threshold: 0.05 });

  const servicesList = [
    { icon: Bullseye, title: "Strategic Marketing", description: "Comprehensive digital marketing strategies tailored to your business goals and target audience.", points: ["Market Research & Analysis", "Competitive Positioning", "Campaign Development"] },
    { icon: Search, title: "SEO Optimization", description: "Boost your visibility in search engines with our proven SEO techniques.", points: ["Keyword Research & Strategy", "On-Page & Technical SEO", "Local SEO Optimization"] },
    { icon: TrendingUp, title: "Paid Advertising", description: "Strategic PPC campaigns that maximize ROI and drive qualified traffic.", points: ["Google & Bing Ads", "Social Media Advertising", "Retargeting Campaigns"] },
    { icon: Podcast, title: "Pod Merch Development", description: "Grow your podcast revenue with custom merchandise and strategic monetization.", points: ["Custom Merchandise Design", "E-commerce Integration", "Promotion Strategy"] },
  ];

  return (
    <section id="services" className="py-20">
      <div className="container mx-auto px-4">
        <SectionTitle type="blue">Our Services</SectionTitle>
        <p ref={setRefIntro} style={styleIntro} className="text-center max-w-2xl mx-auto mb-12 text-secondary">
          Explore our comprehensive suite of digital marketing services designed to transform your online presence and drive measurable results.
        </p>

        <div 
        ref={setRefCards} 
        style={styleCards} 
        className="service-cards flex overflow-x-auto scroll-snap-x-mandatory gap-5 py-5 scrollbar-hide"
        role="region" 
        aria-label="Our services"
        tabIndex="0"
      >
          {servicesList.map((service, index) => (
            <div 
              key={index} 
              className="service-card flex-shrink-0 w-[300px] scroll-snap-start"
              role="article"
              aria-label={service.title}
              <GlowCard className="h-full">
                <div className="text-3xl mb-4 text-[--icon-color]">
                  <service.icon size={28} />
                </div>
                <h3 className="text-xl mb-3 neon-text font-semibold">{service.title}</h3>
                <p className="mb-4 text-secondary flex-grow">{service.description}</p>
                <ul className="space-y-2 mb-6 text-sm text-secondary">
                  {service.points.map((point, pIndex) => (
                    <li key={pIndex} className="flex items-center">
                      <CheckCircle size={14} className="text-[--icon-color] mr-2 flex-shrink-0" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
                <a href="#contact" className="text-[--text-link] hover:text-[--text-link-hover] transition-colors duration-300 flex items-center text-sm font-semibold mt-auto">
                  <span>Learn More</span><ArrowRight size={16} className="ml-2" />
                </a>
              </GlowCard>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;