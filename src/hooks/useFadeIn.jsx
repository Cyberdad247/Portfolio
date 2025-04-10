import { useState, useEffect, useRef } from 'react';

const useFadeIn = (options = { threshold: 0.1, rootMargin: '0px' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const currentRef = ref.current;
    if (!currentRef) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.unobserve(currentRef);
      }
    }, options);

    observer.observe(currentRef);

    return () => {
      if (currentRef && observer) {
          observer.unobserve(currentRef);
      }
    };
  }, [options]);

  const style = {
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
    transition: `opacity 0.8s ease ${options.delay || '0s'}, transform 0.8s ease ${options.delay || '0s'}`,
  };

  return [ref, style];
};

export default useFadeIn;