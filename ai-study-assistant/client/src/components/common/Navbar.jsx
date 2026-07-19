import DarkModeToggle from "../common/DarkModeToggle";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-10 border-b border-text-muted/10 bg-base/80 backdrop-blur dark:bg-base-dark/80">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2">
          <span className="font-display text-lg font-semibold text-accent">Recall</span>
          <span className="hidden font-body text-sm text-text-muted sm:inline">
            AI Study Assistant
          </span>
        </div>
        <DarkModeToggle />
      </div>
    </header>
  );
}
