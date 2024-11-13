"use client"

import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart } from 'lucide-react';
import { LoadingSpinner, ErrorAlert } from '@/components/loading-error-components';

const BrowsePage = () => {
  const [messages, setMessages] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      fetchMessages();
    }, 300);

    return () => clearTimeout(debounceTimeout);
  }, [searchQuery]);

  const fetchMessages = async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/messages?recipient=${encodeURIComponent(searchQuery)}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch messages. Please try again.');
      }

      const data = await response.json();
      setMessages(data);
    } catch (error) {
      setError(error.message || 'Failed to load messages. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-pink-50">
      <div className="container mx-auto px-4 py-16">
        <Card className="max-w-4xl mx-auto bg-white shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-pink-600 text-center">
              Browse Love Messages
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by recipient name..."
              className="border-pink-200 focus:ring-pink-500"
              disabled={isLoading}
            />

            {error && <ErrorAlert description={error} />}

            {isLoading ? (
              <LoadingSpinner />
            ) : messages.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                {searchQuery 
                  ? "No messages found for this recipient" 
                  : "Start typing to search for messages"}
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message) => (
                  <Card key={message.id} className="border-pink-100">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold text-pink-600">
                          To: {message.recipient}
                        </h3>
                        <div className="flex items-center gap-1">
                          <Heart className="w-4 h-4 text-pink-500" />
                          <span className="text-sm text-gray-600">
                            {message.intensity}%
                          </span>
                        </div>
                      </div>
                      <p className="text-gray-700">{message.message}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BrowsePage;
