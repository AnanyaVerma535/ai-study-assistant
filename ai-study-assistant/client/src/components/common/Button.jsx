const VARIANT_CLASSES = {
  primary:
    "bg-accent text-white hover:bg-accent-hover disabled:bg-accent/40 disabled:cursor-not-allowed",
  secondary:
    "bg-transparent border border-text-muted/30 text-text-muted hover:border-accent hover:text-accent disabled:opacity-40 disabled:cursor-not-allowed",
  danger: "bg-danger text-white hover:bg-danger/90 disabled:bg-danger/40 disabled:cursor-not-allowed",
};

export default function Button({
  children,
  variant = "primary",
  type = "button",
  disabled = false,
  onClick,
  className = "",
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition-all active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-base dark:focus-visible:ring-offset-base-dark ${VARIANT_CLASSES[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
