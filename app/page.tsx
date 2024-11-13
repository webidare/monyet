"use client"

import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from 'next/link';
import { Heart } from 'lucide-react';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-pink-50">
      <div className="container mx-auto px-4 py-16">
        <Card className="max-w-2xl mx-auto bg-white shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-pink-600 flex items-center justify-center gap-2">
              <Heart className="w-8 h-8 text-pink-500 animate-pulse" />
              Love Messages
              <Heart className="w-8 h-8 text-pink-500 animate-pulse" />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center text-gray-600">
              Share your feelings with someone special through a unique love message
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/submit">
                <Button className="w-full sm:w-auto bg-pink-500 hover:bg-pink-600">
                  Send Love Message
                </Button>
              </Link>
              <Link href="/browse">
                <Button className="w-full sm:w-auto bg-pink-400 hover:bg-pink-500">
                  Browse Messages
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HomePage;
