import React from 'react';
import { useFadeIn } from '../hooks/useFadeIn';
import { BarChart, Search, TrendingUp, Share2, CheckCircle } from 'lucide-react';
import GlowCard from './GlowCard';
import NeonBorder from './NeonBorder';
import SectionTitle from './SectionTitle';

const About = () => {
  const [descRef, descStyle] = useFadeIn({ delay: 200 });
  const [valuesRef, valuesStyle] = useFadeIn({ delay: 400 });
  const [expertiseRef, expertiseStyle] = useFadeIn({ delay: 600 });

  // Data for Expertise section
  const expertise = [
    { icon: BarChart, title: "Digital Strategy", text: "Comprehensive digital roadmaps tailored to your business goals." },
    { icon: Search, title: "SEO Mastery", text: "Cleveland-focused SEO strategies that drive local and global traffic." },
    { icon: TrendingUp, title: "PPC Campaigns", text: "High-ROI paid advertising with advanced targeting and optimization." },
    { icon: Share2, title: "Social Media", text: "Engaging content strategies that build community and drive conversions." },
  ];

  // Data for Core Values section
  const coreValues = [
    { title: "Innovation First", text: "We embrace emerging technologies and strategies to keep our clients ahead of the curve." },
    { title: "Data-Driven Decisions", text: "Our strategies are built on concrete analytics and measurable outcomes." },
    { title: "Cleveland Proud", text: "We understand the unique challenges and opportunities of the Cleveland market." },
    { title: "Client Partnership", text: "We don't just work for you—we work with you as strategic partners in your success." },
  ];

  return (
    <section id="about" className="py-20 bg-[--section-even-bg]">
      <div className="container mx-auto px-4">
        <SectionTitle type="purple">About Us</SectionTitle>

        <div className="flex flex-col md:flex-row items-stretch gap-10 mt-12">
          <div ref={descRef} style={descStyle} className="md:w-1/2 flex">
            <NeonBorder className="h-full w-full p-6 md:p-8">
              <h3 className="text-2xl font-semibold mb-4 neon-blue">Digital Transformation Experts</h3>
              <p className="mb-4 text-secondary">At Vizion Wealth, we specialize in transforming traditional businesses into digital powerhouses.</p>
              <p className="text-secondary">Our cyberpunk approach to marketing embraces technological advancement while maintaining the human touch.</p>
            </NeonBorder>
          </div>

          <div ref={valuesRef} style={valuesStyle} className="md:w-1/2 flex">
            <GlowCard className="h-full w-full p-6 md:p-8">
              <h3 className="text-2xl font-semibold mb-6 neon-purple">Our Core Values</h3>
              <ul className="space-y-4">
                {coreValues.map((value, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle size={18} className="mr-3 mt-1 text-[--icon-color] flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold mb-1 text-heading">{value.title}</h4>
                      <p className="text-secondary text-sm">{value.text}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </GlowCard>
          </div>
        </div>

        <div ref={expertiseRef} style={expertiseStyle} className="mt-16 md:mt-20">
          <h3 className="text-3xl font-semibold neon-text text-center mb-10">Our Expertise</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {expertise.map((item, index) => (
              <GlowCard key={index} className="text-center p-6">
                <div className="mb-4 text-[--icon-color] inline-block">
                  <item.icon size={36} strokeWidth={1.5} />
                </div>
                <h4 className="text-xl mb-2 font-semibold text-heading">{item.title}</h4>
                <p className="text-secondary text-sm">{item.text}</p>
              </GlowCard>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;