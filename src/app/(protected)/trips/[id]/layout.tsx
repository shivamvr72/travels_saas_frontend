import { ReactNode } from 'react';

export default function TripWorkspaceLayout({ children }: { children: ReactNode }) {
  return (
    <div className="w-full relative px-4 sm:px-6 md:px-8 py-2 -mx-4 sm:-mx-6 md:-mx-8">
      {/* 
        This wrapper uses negative margins to break out of the parent layout's max-w-7xl constraint.
        It spans the full width of the available space inside the sidebar.
      */}
      <div className="w-[calc(100vw-2rem)] md:w-[calc(100vw-var(--sidebar-width,16rem)-4rem)] max-w-none">
        {children}
      </div>
    </div>
  );
}
