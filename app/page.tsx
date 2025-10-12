"use client";

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { GoogleIcon } from "@/components/icons/GoogleIcon"

export function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-4 pb-8 pt-10">
          <div className="space-y-2">
            <CardTitle className="text-center text-3xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
              歡迎來到 OutShare
            </CardTitle>
            <CardDescription className="text-center text-base text-gray-600">
              開始你的戶外探險之旅
            </CardDescription>
          </div>
        </CardHeader>
        
        <CardContent className="pb-10">
          <Button 
            className="w-full h-12 text-base font-medium bg-white hover:bg-gray-50 text-gray-800 border-2 border-gray-200 hover:border-gray-300  transition-all duration-200"
            variant="outline"
          >
            <GoogleIcon />
            使用 Google 帳號登入
          </Button>
          
        </CardContent>
      </Card>
    </div>
  )
}

export default HomePage;
