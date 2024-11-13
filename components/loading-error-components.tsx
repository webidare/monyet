import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

export const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-8">
    <Loader2 className="h-8 w-8 animate-spin text-pink-500" />
  </div>
);

export const ErrorAlert = ({ title = "Error", description = "Something went wrong. Please try again." }) => (
  <Alert variant="destructive" className="mb-4">
    <AlertTitle>{title}</AlertTitle>
    <AlertDescription>{description}</AlertDescription>
  </Alert>
);
