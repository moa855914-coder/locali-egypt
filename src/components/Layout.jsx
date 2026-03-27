import { Outlet } from 'react-router-dom';
import BottomNav from './BottomNav';
import TopBar from './TopBar';
import useLanguage from '../hooks/useLanguage';

export default function Layout() {
  const { lang, changeLang } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      <TopBar lang={lang} onLangChange={changeLang} />
      <main className="pb-28">
        <Outlet context={{ lang, changeLang }} />
      </main>
      <BottomNav lang={lang} />
    </div>
  );
}