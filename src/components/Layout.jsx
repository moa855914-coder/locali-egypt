import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import FloatingAIChat from './FloatingAIChat';
import TopBar from './TopBar';
import useLanguage from '../hooks/useLanguage';

export default function Layout() {
  const { lang, changeLang } = useLanguage();
  const [openChat, setOpenChat] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <TopBar lang={lang} onLangChange={changeLang} />
      <main>
        <Outlet context={{ lang, changeLang, openAIChat: () => setOpenChat(true) }} />
      </main>
      <FloatingAIChat externalOpen={openChat} onExternalOpenHandled={() => setOpenChat(false)} />
    </div>
  );
}