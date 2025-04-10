import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { MapPin, Phone, Mail, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';
import GlowCard from './GlowCard';
import SectionTitle from './SectionTitle';
import useFadeIn from '../hooks/useFadeIn';

const Contact = () => {
  const { theme } = useTheme();
  const [setRefTitle, titleStyle] = useFadeIn();
  const [setRefForm, formStyle] = useFadeIn({ threshold: 0.05 });
  const [setRefInfo, infoStyle] = useFadeIn({ threshold: 0.05 });

  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    message: ''
  });
  const [errors, setErrors] = React.useState({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitStatus, setSubmitStatus] = React.useState(null);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
    
    // Clear error when user types
    if (errors[id]) {
      setErrors(prev => ({
        ...prev,
        [id]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.message.trim()) newErrors.message = 'Message is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    setSubmitStatus(null);
    
    try {
      const response = await fetch('https://api.vizionwealth.com/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      const result = await response.json();
      setSubmitStatus('success');
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20">
      <div className="container mx-auto px-4">
        <SectionTitle type="blue">Contact Us</SectionTitle>
        
        <div className="flex flex-col md:flex-row gap-10 mt-12">
          <div ref={setRefForm} style={formStyle} className="md:w-1/2">
            <GlowCard className="p-6">
              <h3 className="text-xl mb-6 neon-blue">Send Us a Message</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-secondary mb-1">Name</label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 bg-[--bg-input] border ${errors.name ? 'border-red-500' : 'border-[--input-border]'} rounded focus:outline-none focus:ring-2 focus:ring-[--neon-blue]`}
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-secondary mb-1">Email</label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 bg-[--bg-input] border ${errors.email ? 'border-red-500' : 'border-[--input-border]'} rounded focus:outline-none focus:ring-2 focus:ring-[--neon-blue]`}
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-secondary mb-1">Message</label>
                  <textarea
                    id="message"
                    rows="5"
                    value={formData.message}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 bg-[--bg-input] border ${errors.message ? 'border-red-500' : 'border-[--input-border]'} rounded focus:outline-none focus:ring-2 focus:ring-[--neon-blue]`}
                  />
                  {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-6 bg-[--neon-blue] text-white font-medium rounded hover:bg-[--neon-blue-hover] transition-colors duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
                {submitStatus === 'success' && (
                  <p className="text-green-500 text-sm mt-2">Message sent successfully!</p>
                )}
                {submitStatus === 'error' && (
                  <p className="text-red-500 text-sm mt-2">Failed to send message. Please try again.</p>
                )}
              </form>
            </GlowCard>
          </div>
          
          <div ref={setRefInfo} style={infoStyle} className="md:w-1/2">
            <GlowCard className="p-6 h-full">
              <h3 className="text-xl mb-6 neon-purple">Contact Information</h3>
              <div className="space-y-6">
                <div className="flex items-start">
                  <MapPin size={20} className="mr-4 mt-1 text-[--icon-color] flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-heading">Location</h4>
                    <p className="text-secondary">1234 Cyber Street, Cleveland, OH 44115</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Phone size={20} className="mr-4 mt-1 text-[--icon-color] flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-heading">Phone</h4>
                    <p className="text-secondary">(216) 555-1234</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Mail size={20} className="mr-4 mt-1 text-[--icon-color] flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-heading">Email</h4>
                    <p className="text-secondary">contact@vizionwealth.com</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <h4 className="font-medium text-heading mb-4">Follow Us</h4>
                <div className="flex space-x-4">
                  <a href="#" className="text-[--icon-color] hover:text-[--neon-purple] transition-colors duration-300">
                    <Facebook size={20} />
                  </a>
                  <a href="#" className="text-[--icon-color] hover:text-[--neon-purple] transition-colors duration-300">
                    <Twitter size={20} />
                  </a>
                  <a href="#" className="text-[--icon-color] hover:text-[--neon-purple] transition-colors duration-300">
                    <Linkedin size={20} />
                  </a>
                  <a href="#" className="text-[--icon-color] hover:text-[--neon-purple] transition-colors duration-300">
                    <Instagram size={20} />
                  </a>
                </div>
              </div>
            </GlowCard>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;