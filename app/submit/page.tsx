"use client"

import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Heart, Loader2 } from 'lucide-react';
import { ErrorAlert } from '@/components/loading-error-components';

const SubmitPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    recipient: '',
    message: '',
    intensity: 50
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to submit message. Please try again.');
      }

      const data = await response.json();
      router.push(`/details/${data.id}`);
    } catch (error) {
      setError(error.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-pink-50">
      <div className="container mx-auto px-4 py-16">
        <Card className="max-w-2xl mx-auto bg-white shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-pink-600 text-center">
              Create Love Message
            </CardTitle>
          </CardHeader>
          <CardContent>
            {error && <ErrorAlert description={error} />}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Recipient Name
                </label>
                <Input
                  required
                  value={formData.recipient}
                  onChange={(e) => setFormData({ ...formData, recipient: e.target.value })}
                  className="border-pink-200 focus:ring-pink-500"
                  placeholder="Enter recipient's name"
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Your Message
                </label>
                <Textarea
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="border-pink-200 focus:ring-pink-500"
                  placeholder="Write your love message here..."
                  rows={4}
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Love Intensity
                </label>
                <div className="flex items-center gap-4">
                  <Heart className="w-4 h-4 text-pink-400" />
                  <Slider
                    value={[formData.intensity]}
                    onValueChange={(value) => setFormData({ ...formData, intensity: value[0] })}
                    max={100}
                    step={1}
                    className="flex-1"
                    disabled={isSubmitting}
                  />
                  <Heart className="w-6 h-6 text-pink-600" />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-pink-500 hover:bg-pink-600"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  'Send Love Message'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SubmitPage;
