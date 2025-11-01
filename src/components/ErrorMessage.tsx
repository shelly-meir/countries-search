interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;  // Optional retry callback
}/**
 * ErrorMessage Component
 * Displays a user-friendly error message with optional retry button
 */
export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-6">
      <div className="rounded-full bg-red-50 p-3 mb-4">
        <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <h3 className="font-semibold text-lg mb-2">Something went wrong</h3>
      <p className="text-sm text-muted-foreground mb-6 max-w-md">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-primary text-primary-foreground text-sm rounded-md hover:bg-primary/90"
        >
          Try again
        </button>
      )}
    </div>
  );
};
