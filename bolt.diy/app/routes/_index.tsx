import { json, type MetaFunction } from '@remix-run/cloudflare';
import { ClientOnly } from 'remix-utils/client-only';
import { BaseChat } from '~/components/chat/BaseChat';
import { Chat } from '~/components/chat/Chat.client';
import { Header } from '~/components/header/Header';
import BackgroundRays from '~/components/ui/BackgroundRays';

export const meta: MetaFunction = () => {
  return [{ title: 'Workspace - AI Development Environment' }, { name: 'description', content: 'AI-powered development workspace for building applications faster' }];
};

export const loader = () => json({});

/**
 * Landing page component for Bolt
 * Authentication removed - open access
 */
export default function Index() {
  return (
    <div className="flex flex-col h-full w-full bg-black">
      <BackgroundRays />
      <Header />
      <ClientOnly fallback={<BaseChat />}>{() => <Chat />}</ClientOnly>
    </div>
  );
}
