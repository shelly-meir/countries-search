/**
 * Loading Component
 * Displays a centered loading spinner
 */
export const Loading: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-foreground"></div>
      <p className="mt-4 text-sm text-muted-foreground">Loading countries...</p>
    </div>
  );
};
