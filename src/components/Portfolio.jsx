import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Calendar, User, CheckCircle, ArrowRight } from 'lucide-react';
import GlowCard from './GlowCard';
import SectionTitle from './SectionTitle';
import useFadeIn from '../hooks/useFadeIn';

const Portfolio = () => {
  const { theme } = useTheme();
  const [setRefIntro, styleIntro] = useFadeIn();
  const [setRefItems, styleItems] = useFadeIn({ threshold: 0.05 });

  const portfolioItems = [
    {
      title: "Digital Marketing Campaign",
      description: "Comprehensive campaign for a local Cleveland business that increased online engagement by 300%.",
      img: {
        src: "https://placehold.co/600x400/777777/ffffff/webp?text=Marketing+Campaign",
        srcSet: "https://placehold.co/300x200/777777/ffffff/webp?text=Marketing+Campaign 300w, https://placehold.co/600x400/777777/ffffff/webp?text=Marketing+Campaign 600w, https://placehold.co/1200x800/777777/ffffff/webp?text=Marketing+Campaign 1200w",
        sizes: "(max-width: 768px) 300px, (max-width: 1024px) 600px, 1200px"
      },
      colorClass: "neon-purple",
      caseStudyUrl: "#"
    },
    {
      title: "SEO Optimization",
      description: "Search engine optimization project that boosted organic traffic by 150% in 3 months.",
      img: {
        src: "https://placehold.co/600x400/777777/ffffff/webp?text=SEO+Project",
        srcSet: "https://placehold.co/300x200/777777/ffffff/webp?text=SEO+Project 300w, https://placehold.co/600x400/777777/ffffff/webp?text=SEO+Project 600w, https://placehold.co/1200x800/777777/ffffff/webp?text=SEO+Project 1200w",
        sizes: "(max-width: 768px) 300px, (max-width: 1024px) 600px, 1200px"
      },
      colorClass: "neon-blue",
      caseStudyUrl: "#"
    },
    {
      title: "Social Media Strategy",
      description: "Developed and executed a social media strategy that grew followers by 500%.",
      img: {
        src: "https://placehold.co/600x400/777777/ffffff/webp?text=Social+Media",
        srcSet: "https://placehold.co/300x200/777777/ffffff/webp?text=Social+Media 300w, https://placehold.co/600x400/777777/ffffff/webp?text=Social+Media 600w, https://placehold.co/1200x800/777777/ffffff/webp?text=Social+Media 1200w",
        sizes: "(max-width: 768px) 300px, (max-width: 1024px) 600px, 1200px"
      },
      colorClass: "neon-purple",
      caseStudyUrl: "#"
    }
  ];

  return (
    <section id="portfolio" className="py-20">
      <div className="container mx-auto px-4">
        <SectionTitle type="purple">Our Portfolio</SectionTitle>
        <p ref={setRefIntro} style={styleIntro} className="text-center max-w-2xl mx-auto mb-12 text-secondary">
          Explore our recent work and see how we've helped businesses in Cleveland achieve their digital marketing goals.
        </p>

        <div ref={setRefItems} style={styleItems} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {portfolioItems.map((item, index) => (
            <div key={index} className="portfolio-item">
              <GlowCard className="h-full">
                <div className="relative overflow-hidden rounded-lg h-48 bg-cover bg-center">
                  <img
                    src={item.img.src}
                    srcSet={item.img.srcSet}
                    sizes={item.img.sizes}
                    alt={item.title}
                    className="absolute inset-0 w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                    <a href={item.caseStudyUrl} className="text-white font-bold text-lg px-4 py-2 border-2 border-white rounded hover:bg-white hover:text-black transition-colors duration-300">
                      View Case Study
                    </a>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className={`text-xl mb-2 ${item.colorClass}`}>{item.title}</h3>
                  <p className="text-secondary mb-4">{item.description}</p>
                  <a href={item.caseStudyUrl} className="text-[--text-link] hover:text-[--text-link-hover] transition-colors duration-300 flex items-center text-sm font-semibold">
                    <span>Learn More</span><ArrowRight size={16} className="ml-2" />
                  </a>
                </div>
              </GlowCard>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Portfolio;