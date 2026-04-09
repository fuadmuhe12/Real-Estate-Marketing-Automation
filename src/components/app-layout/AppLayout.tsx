import Sidebar from "./Sidebar";
import MobileNav from "./MobileNav";
import MobileHeader from "./MobileHeader";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <MobileHeader />
        <main className="flex-1 overflow-y-auto bg-background pb-16 md:pb-0">
          {children}
        </main>
      </div>
      <MobileNav />
    </div>
  );
}
