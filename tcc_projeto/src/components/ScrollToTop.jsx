import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = ({ excludePaths = [] }) => {
  const { pathname } = useLocation();

  useEffect(() => {
    const isExcluded = excludePaths.some(path => pathname.startsWith(path));
    if (!isExcluded) {
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  return null;
};

export default ScrollToTop;