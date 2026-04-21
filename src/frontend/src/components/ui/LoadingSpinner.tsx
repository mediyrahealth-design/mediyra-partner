export function LoadingSpinner({
  size = "md",
  className = "",
}: { size?: "sm" | "md" | "lg"; className?: string }) {
  const sizes = { sm: "w-4 h-4", md: "w-7 h-7", lg: "w-10 h-10" };
  return (
    <div
      className={`flex items-center justify-center ${className}`}
      aria-label="Loading"
      aria-busy="true"
    >
      <div
        className={`${sizes[size]} rounded-full border-2 border-primary/20 border-t-primary animate-spin`}
      />
    </div>
  );
}

export function PageLoader() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
      <LoadingSpinner size="lg" />
      <p className="text-muted-foreground text-sm font-medium animate-pulse">
        Loading...
      </p>
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="card-elevated p-4 animate-pulse">
      <div className="h-4 bg-muted rounded-md w-2/3 mb-2" />
      <div className="h-3 bg-muted rounded-md w-1/2" />
    </div>
  );
}
