import { useStore } from '@nanostores/react';
import { ClientOnly } from 'remix-utils/client-only';
import { chatStore } from '~/lib/stores/chat';
import { classNames } from '~/utils/classNames';
import { HeaderActionButtons } from './HeaderActionButtons.client';
import { ChatDescription } from '~/lib/persistence/ChatDescription.client';
import { AboutModal } from './AboutModal';
import { useState } from 'react';
import { useAuth } from '../auth/AuthProvider';
import { useNavigate } from '@remix-run/react';

export function Header() {
  const chat = useStore(chatStore);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    // Logout is disabled - no redirect needed
    logout();
  };

  return (
    <header
      className={classNames('flex items-center px-8 py-4 h-[var(--header-height)] bg-black border-b-2', {
        'border-transparent': !chat.started,
        'border-white': chat.started,
      })}
    >
      <button
        onClick={() => window.location.href = '/'}
        className="flex items-center gap-4 bg-transparent hover:opacity-80 transition-opacity cursor-pointer border-none"
        title="Go to home page"
      >
        <div className="w-12 h-12 bg-white flex items-center justify-center border-2 border-white">
          <div className="i-ph:code-bold text-3xl text-black" />
        </div>
        <div className="flex flex-col">
          <span className="text-2xl font-black tracking-tighter text-white">WORKSPACE</span>
          <span className="text-[10px] text-white/60 tracking-[0.3em] uppercase font-bold">Development Environment</span>
        </div>
      </button>
      {chat.started && (
        <>
          <span className="flex-1 px-6 truncate text-center text-white font-mono text-sm">
            <ClientOnly>{() => <ChatDescription />}</ClientOnly>
          </span>
          <ClientOnly>
            {() => (
              <div className="flex items-center gap-3">
                <HeaderActionButtons chatStarted={chat.started} />
              </div>
            )}
          </ClientOnly>
        </>
      )}
      {!chat.started && <div className="flex-1" />}

      {/* User Menu */}
      {user && (
        <div className="relative mr-3">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 px-4 py-2 text-xs font-black uppercase tracking-wider bg-white text-black hover:bg-black hover:text-white border-2 border-white transition-all"
            title={user.email}
          >
            <span className="i-ph:user text-base" />
            <span className="max-w-[150px] truncate">{user.email}</span>
          </button>

          {showUserMenu && (
            <>
              {/* Backdrop to close menu */}
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowUserMenu(false)}
              />
              {/* Dropdown menu */}
              <div className="absolute right-0 top-full mt-2 w-64 bg-black border-2 border-white z-50">
                <div className="p-4 border-b-2 border-white/20">
                  <p className="text-white font-bold text-sm truncate">{user.name || 'User'}</p>
                  <p className="text-white/60 text-xs font-mono truncate">{user.email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-3 text-left text-white hover:bg-white hover:text-black transition-colors font-bold uppercase tracking-wider text-xs flex items-center gap-2"
                >
                  <span className="i-ph:sign-out text-base" />
                  <span>Logout</span>
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* Visit BackBench button */}
      <button
        onClick={() => window.open('http://localhost:9999', '_blank')}
        className="flex items-center gap-2 px-4 py-2 text-xs font-black uppercase tracking-wider bg-black text-white hover:bg-white hover:text-black border-2 border-white transition-all mr-3"
        title="Open BackBench Dashboard"
      >
        <span className="i-ph:cube text-base" />
        <span>Visit BackBench</span>
      </button>

      {/* About button - always visible */}
      <button
        onClick={() => setIsAboutOpen(true)}
        className="flex items-center gap-2 px-4 py-2 text-xs font-black uppercase tracking-wider bg-white text-black hover:bg-black hover:text-white border-2 border-white transition-all"
        title="Learn about WORKSPACE"
      >
        <span className="i-ph:info text-base" />
        <span>About</span>
      </button>

      <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />
    </header>
  );
}
