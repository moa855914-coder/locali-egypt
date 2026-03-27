import { useState, useCallback } from 'react';

export default function useLanguage() {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('locali_lang') || 'en';
  });

  const changeLang = useCallback((newLang) => {
    setLang(newLang);
    localStorage.setItem('locali_lang', newLang);
  }, []);

  return { lang, changeLang };
}