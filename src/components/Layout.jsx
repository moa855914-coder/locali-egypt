import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Footer from './Footer';
import FloatingAIChat from './FloatingAIChat';
import TopBar from './TopBar';

import useLanguage from '../hooks/useLanguage';
import useTranslate, { isRTL } from '../hooks/useTranslate';

export default function Layout() {
  const { lang, changeLang } = useLanguage();
  const [openChat, setOpenChat] = useState(false);
  const { tx } = useTranslate(lang);

  return (
    <div className="min-h-screen bg-background" dir={isRTL(lang) ? 'rtl' : 'ltr'}>
      <TopBar lang={lang} onLangChange={changeLang} />
      <main>
        <Outlet context={{ lang, changeLang, tx, openAIChat: () => setOpenChat(true) }} />
      </main>

      <FloatingAIChat externalOpen={openChat} onExternalOpenHandled={() => setOpenChat(false)} />
      <Footer lang={lang} />
    </div>
  );
}