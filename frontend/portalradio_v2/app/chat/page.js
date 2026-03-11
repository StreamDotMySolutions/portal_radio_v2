import { Suspense } from 'react';
import ChatPageComponent from '@/components/ChatPage';

export const metadata = {
  title: 'Chat — PortalRadio RTM',
};

export default function ChatPage() {
  return (
    <main style={{ backgroundColor: 'var(--color-bg)', minHeight: '100vh', paddingTop: '80px' }}>
      <Suspense>
        <ChatPageComponent />
      </Suspense>
    </main>
  );
}
