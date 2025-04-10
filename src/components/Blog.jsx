import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Calendar, User, CheckCircle, ArrowRight } from 'lucide-react';
import GlowCard from './GlowCard';
import SectionTitle from './SectionTitle';
import useFadeIn from '../hooks/useFadeIn';

const Blog = () => {
  const { theme } = useTheme();
  const [setRefIntro, styleIntro] = useFadeIn();
  const [setRefPosts, stylePosts] = useFadeIn({ threshold: 0.05 });

  const blogPosts = [
    {
      title: "Digital Marketing Trends 2023",
      description: "Explore the latest trends shaping digital marketing this year and how to leverage them for your business.",
      img: {
        src: "https://placehold.co/600x400/777777/ffffff/webp?text=Marketing+Trends",
        srcSet: "https://placehold.co/300x200/777777/ffffff/webp?text=Marketing+Trends 300w, https://placehold.co/600x400/777777/ffffff/webp?text=Marketing+Trends 600w, https://placehold.co/1200x800/777777/ffffff/webp?text=Marketing+Trends 1200w",
        sizes: "(max-width: 768px) 300px, (max-width: 1024px) 600px, 1200px"
      },
      colorClass: "neon-purple",
      date: "May 15, 2023",
      author: "John Doe"
    },
    {
      title: "SEO Best Practices",
      description: "Learn the most effective SEO strategies to improve your website's visibility and ranking.",
      img: {
        src: "https://placehold.co/600x400/777777/ffffff/webp?text=SEO+Best+Practices",
        srcSet: "https://placehold.co/300x200/777777/ffffff/webp?text=SEO+Best+Practices 300w, https://placehold.co/600x400/777777/ffffff/webp?text=SEO+Best+Practices 600w, https://placehold.co/1200x800/777777/ffffff/webp?text=SEO+Best+Practices 1200w",
        sizes: "(max-width: 768px) 300px, (max-width: 1024px) 600px, 1200px"
      },
      colorClass: "neon-blue",
      date: "April 28, 2023",
      author: "Jane Smith"
    },
    {
      title: "Social Media Engagement",
      description: "Discover proven techniques to increase engagement and grow your audience on social media platforms.",
      img: {
        src: "https://placehold.co/600x400/777777/ffffff/webp?text=Social+Media",
        srcSet: "https://placehold.co/300x200/777777/ffffff/webp?text=Social+Media 300w, https://placehold.co/600x400/777777/ffffff/webp?text=Social+Media 600w, https://placehold.co/1200x800/777777/ffffff/webp?text=Social+Media 1200w",
        sizes: "(max-width: 768px) 300px, (max-width: 1024px) 600px, 1200px"
      },
      colorClass: "neon-purple",
      date: "March 10, 2023",
      author: "Mike Johnson"
    }
  ];

  return (
    <section id="blog" className="py-20">
      <div className="container mx-auto px-4">
        <SectionTitle type="purple">Our Blog</SectionTitle>
        <p ref={setRefIntro} style={styleIntro} className="text-center max-w-2xl mx-auto mb-12 text-secondary">
          Insights and strategies from our digital marketing experts to help you grow your business online.
        </p>

        <div ref={setRefPosts} style={stylePosts} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post, index) => (
            <div key={index} className="blog-post">
              <GlowCard className="h-full">
                <div className="relative overflow-hidden rounded-lg h-48 bg-cover bg-center">
                  <img
                    src={post.img.src}
                    srcSet={post.img.srcSet}
                    sizes={post.img.sizes}
                    alt={post.title}
                    className="absolute inset-0 w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                    <a href="#" className="text-white font-bold text-lg px-4 py-2 border-2 border-white rounded hover:bg-white hover:text-black transition-colors duration-300">
                      Read Article
                    </a>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className={`text-xl mb-2 ${post.colorClass}`}>{post.title}</h3>
                  <p className="text-secondary mb-4">{post.description}</p>
                  <div className="flex items-center text-sm text-secondary">
                    <Calendar size={14} className="mr-1" />
                    <span className="mr-4">{post.date}</span>
                    <User size={14} className="mr-1" />
                    <span>{post.author}</span>
                  </div>
                  <a href="#" className="text-[--text-link] hover:text-[--text-link-hover] transition-colors duration-300 flex items-center text-sm font-semibold mt-3">
                    <span>Read More</span><ArrowRight size={16} className="ml-2" />
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

export default Blog;