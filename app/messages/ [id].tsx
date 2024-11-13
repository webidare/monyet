import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Link as LinkIcon, Copy, Check } from 'lucide-react';
import { LoadingSpinner, ErrorAlert } from '@/components/loading-error-components';

const MessageDetailsPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/messages/${id}` : '';

  useEffect(() => {
    if (id) {
      fetchMessage();
    }
  }, [id]);

  const fetchMessage = async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/messages/${id}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Message not found. The link might be invalid or expired.');
        }
        throw new Error('Failed to load message. Please try again.');
      }

      const data = await response.json();
      setMessage(data);
    } catch (error) {
      setError(error.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      setError('Failed to copy link. Please try again.');
    }
  };

  if (isLoading) return (
    <div className="min-h-screen bg-pink-50 flex items-center justify-center">
      <LoadingSpinner />
    </div>
  );

  return (
    <div className="min-h-screen bg-pink-50">
      <div className="container mx-auto px-4 py-16">
        <Card className="max-w-2xl mx-auto bg-white shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-pink-600 text-center flex items-center justify-center gap-2">
              <Heart className="w-6 h-6" />
              Love Message
              <Heart className="w-6 h-6" />
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            {error ? (
              <ErrorAlert description={error} />
            ) : message && (
              <>
                <div className="text-center p-6 border border-pink-100 rounded-lg bg-pink-50">
                  <h3 className="text-xl font-semibold text-pink-600 mb-4">
                    To: {message.recipient}
                  </h3>
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {message.message}
                  </p>
                  <div className="mt-4 flex items-center justify-center gap-2">
                    <Heart className="w-5 h-5 text-pink-500" />
                    <span className="text-pink-600 font-medium">
                      Love Intensity: {message.intensity}%
                    </span>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="flex-1 w-full">
                      <div className="px-3 py-2 bg-gray-100 rounded-lg text-sm text-gray-600 truncate">
                        {shareUrl}
                      </div>
                    </div>
                    <Button
                      onClick={handleCopyLink}
                      className="bg-pink-500 hover:bg-pink-600 w-full sm:w-auto"
                    >
                      {copied ? (
                        <>
                          <Check className="w-4 h-4 mr-2" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 mr-2" />
                          Copy Link
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </>
            )}
          </CardContent>

          <CardFooter className="flex justify-center pt-2">
            <Button
              variant="ghost"
              className="text-pink-600 hover:text-pink-700"
              onClick={() => router.push('/')}
            >
              Create Your Own Message
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default MessageDetailsPage;