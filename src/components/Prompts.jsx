import React from 'react';

import { Copy, Download, CheckCircle, ArrowRight } from 'lucide-react';
import GlowCard from './GlowCard';
import SectionTitle from './SectionTitle';
import useFadeIn from '../hooks/useFadeIn';

const Prompts = () => {
  
  const [setRefIntro, styleIntro] = useFadeIn();
  const [setRefItems, styleItems] = useFadeIn({ threshold: 0.05 });

  const promptCategories = [
    {
      title: "Marketing Prompts",
      description: "AI-generated marketing copy and content ideas to boost your campaigns.",
      items: [
        "Social media post ideas",
        "Email marketing templates",
        "Ad copy variations"
      ]
    },
    {
      title: "SEO Prompts",
      description: "Optimize your content with these SEO-focused writing prompts.",
      items: [
        "Keyword-rich blog post outlines",
        "Meta description templates",
        "Title tag variations"
      ]
    },
    {
      title: "Creative Prompts",
      description: "Spark creativity with these innovative content generation ideas.",
      items: [
        "Brand storytelling frameworks",
        "Visual content concepts",
        "Interactive content ideas"
      ]
    }
  ];

  return (
    <section id="prompts" className="py-20">
      <div className="container mx-auto px-4">
        <SectionTitle type="purple">AI Prompts Library</SectionTitle>
        <p ref={setRefIntro} style={styleIntro} className="text-center max-w-2xl mx-auto mb-12 text-secondary">
          Access our curated collection of AI prompts to enhance your digital marketing efforts.
        </p>

        <div ref={setRefItems} style={styleItems} className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {promptCategories.map((category, index) => (
            <div key={index} className="prompt-category">
              <GlowCard className="h-full">
                <div className="p-6">
                  <h3 className="text-xl mb-3 neon-purple">{category.title}</h3>
                  <p className="text-secondary mb-4">{category.description}</p>
                  <ul className="space-y-2 mb-6">
                    {category.items.map((item, i) => (
                      <li key={i} className="flex items-start">
                        <CheckCircle size={16} className="mr-2 mt-1 text-[--icon-color] flex-shrink-0" />
                        <span className="text-secondary">{item}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="flex gap-2">
                    <button className="text-sm flex items-center text-[--text-link] hover:text-[--text-link-hover] transition-colors duration-300">
                      <Copy size={14} className="mr-1" /> Copy All
                      {/* TODO: Implement copy functionality */}
                    </button>
                    <button className="text-sm flex items-center text-[--text-link] hover:text-[--text-link-hover] transition-colors duration-300">
                      <Download size={14} className="mr-1" /> Download
                      {/* TODO: Implement download functionality */}
                    </button>
                  </div>
                </div>
              </GlowCard>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Prompts;