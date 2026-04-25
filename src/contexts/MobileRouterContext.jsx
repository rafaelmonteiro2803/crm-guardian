import React, { createContext, useContext, useState, useEffect } from 'react';

const MobileRouterContext = createContext(null);

export function MobileRouterProvider({ children }) {
  const [route, setRoute] = useState(() => {
    const path = window.location.pathname;
    return path.startsWith('/m/') ? path : '/m/';
  });

  const [params, setParams] = useState({});
  const [query, setQuery] = useState({});

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      setRoute(path.startsWith('/m/') ? path : '/m/');
      parseParams(path);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const parseParams = (path) => {
    const searchParams = new URLSearchParams(window.location.search);
    const queryParams = Object.fromEntries(searchParams);
    setQuery(queryParams);
  };

  const navigate = (path, options = {}) => {
    window.history.pushState(null, '', path);
    setRoute(path);
    parseParams(path);

    if (options.replace) {
      window.history.replaceState(null, '', path);
    }
  };

  const back = () => {
    window.history.back();
  };

  return (
    <MobileRouterContext.Provider value={{ route, params, query, navigate, back }}>
      {children}
    </MobileRouterContext.Provider>
  );
}

export function useMobileRouter() {
  const context = useContext(MobileRouterContext);
  if (!context) {
    throw new Error('useMobileRouter must be used within MobileRouterProvider');
  }
  return context;
}
