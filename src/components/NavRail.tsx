interface Props {
  onLogout: () => void;
  connectionStatus: string;
}

export default function NavRail({ onLogout, connectionStatus }: Props) {
  const authorized = connectionStatus === 'authorized';

  return (
    <nav className="w-[60px] flex-shrink-0 flex flex-col items-center py-3 gap-1 bg-[#1a1b2e] border-r border-white/5">
      {/* Logo / profile */}
      <div className="relative mb-2">
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#7b61ff] to-[#a78bfa] flex items-center justify-center text-white font-bold text-sm select-none">
          G
        </div>
        <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-[#1a1b2e] ${authorized ? 'bg-[#25d366]' : 'bg-[#aebac1]'}`} />
      </div>

      <NavBtn title="Все" active>
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
          <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
        </svg>
        <span className="text-[9px] mt-0.5 leading-none">Все</span>
      </NavBtn>

      <NavBtn title="Контакты">
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
          <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
        </svg>
        <span className="text-[9px] mt-0.5 leading-none">Контакты</span>
      </NavBtn>

      <NavBtn title="Звонки">
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
          <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z" />
        </svg>
        <span className="text-[9px] mt-0.5 leading-none">Звонки</span>
      </NavBtn>

      <div className="flex-1" />

      <button
        onClick={onLogout}
        title="Выйти"
        className="w-10 h-10 rounded-xl flex flex-col items-center justify-center gap-0.5 text-[#5c6070] hover:text-white hover:bg-white/10 transition-colors"
      >
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
          <path d="M10.09 15.59L11.5 17l5-5-5-5-1.41 1.41L12.67 11H3v2h9.67l-2.58 2.59zM19 3H5c-1.11 0-2 .9-2 2v4h2V5h14v14H5v-4H3v4c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z" />
        </svg>
        <span className="text-[9px] leading-none">Выйти</span>
      </button>

      <NavBtn title="Настройки">
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
          <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
        </svg>
        <span className="text-[9px] mt-0.5 leading-none">Настройки</span>
      </NavBtn>
    </nav>
  );
}

function NavBtn({ title, children, active }: { title: string; children: React.ReactNode; active?: boolean }) {
  return (
    <button
      title={title}
      className={`w-10 h-10 rounded-xl flex flex-col items-center justify-center gap-0.5 transition-colors ${
        active ? 'text-white bg-white/10' : 'text-[#5c6070] hover:text-white hover:bg-white/10'
      }`}
    >
      {children}
    </button>
  );
}
