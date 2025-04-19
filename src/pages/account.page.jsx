import React, { useState, useEffect } from "react"
import { useUser, useAuth } from "@clerk/clerk-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  User2Icon,
  MailIcon,
  PhoneIcon,
  LogOutIcon,
  SettingsIcon,
  PackageIcon,
} from "lucide-react"

export default function AccountPage() {
  const { isLoaded, isSignedIn, user } = useUser()
  const { signOut } = useAuth()
  const [isDarkMode, setIsDarkMode] = useState(false)

  // Apply dark mode class to the body
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add("dark")
    } else {
      document.body.classList.remove("dark")
    }
  }, [isDarkMode])

  // Loading state
  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-pulse">
            <div className="h-12 bg-gray-300 rounded w-48 mx-auto mb-4"></div>
            <div className="h-6 bg-gray-200 rounded w-32 mx-auto"></div>
          </div>
        </div>
      </div>
    )
  }

  // Not signed in
  if (!isSignedIn) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <h2 className="text-2xl font-bold mb-4">Please Sign In</h2>
            <Button onClick={() => (window.location.href = "/sign-in")}>
              Go to Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="profile">
            <User2Icon className="mr-2 h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="settings">
            <SettingsIcon className="mr-2 h-4 w-4" />
            Settings
          </TabsTrigger>
          <TabsTrigger value="orders">
            <PackageIcon className="mr-2 h-4 w-4" />
            My Orders
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card className="w-full">
            <CardHeader className="bg-muted/50 p-6">
              <div className="flex items-center space-x-6">
                <Avatar className="h-20 w-20 border-4 border-primary/20">
                  <AvatarImage
                    src={user.imageUrl}
                    alt={`${user.fullName}'s profile`}
                  />
                  <AvatarFallback>
                    {user.fullName
                      ? user.fullName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()
                      : "UN"}
                  </AvatarFallback>
                </Avatar>

                <div>
                  <h1 className="text-2xl font-bold">{user.fullName}</h1>
                  <p className="text-muted-foreground">
                    {user.emailAddresses[0]?.emailAddress}
                  </p>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-6 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Personal Information */}
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold flex items-center gap-2">
                    <User2Icon className="h-5 w-5 text-primary" />
                    Personal Details
                  </h2>
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground">
                      Full Name
                    </label>
                    <p className="mt-1">{user.fullName || "Not provided"}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground">
                      Username
                    </label>
                    <p className="mt-1">{user.username || "Not set"}</p>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold flex items-center gap-2">
                    <MailIcon className="h-5 w-5 text-primary" />
                    Contact Information
                  </h2>
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground">
                      Email Address
                    </label>
                    <p className="mt-1 flex items-center gap-2">
                      {user.emailAddresses[0]?.emailAddress || "No email"}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground">
                      Phone Number
                    </label>
                    <p className="mt-1 flex items-center gap-2">
                      <PhoneIcon className="h-4 w-4 text-muted-foreground" />
                      {user.phoneNumbers[0]?.phoneNumber || "Not provided"}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="flex justify-between items-center">
                <span>Dark Mode</span>
                <input
                  type="checkbox"
                  className="toggle"
                  checked={isDarkMode}
                  onChange={(e) => setIsDarkMode(e.target.checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        {/* Logout Button */}
        <div className="mt-6">
          <Button
            className="w-full bg-black text-white"
            onClick={() => signOut()}
          >
            Logout
          </Button>
        </div>
      </Tabs>
    </div>
  )
}