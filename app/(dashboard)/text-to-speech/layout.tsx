import Header from '@/components/Header';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden">
      <Header title="Text to Speech" />
      {children}
    </div>
  );
}
