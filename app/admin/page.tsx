"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Users, 
  BookOpen, 
  BarChart3, 
  Search,
  CheckCircle2,
  PhoneCall,
  Mail,
  ArrowUpRight,
  Loader2
} from "lucide-react"

// Types for data
interface UserData {
  id: string
  name: string
  email: string
  phoneNumber?: string
  createdAt: string
  lastLogin?: string
  completedSections?: number
}

interface KhatmData {
  id: string
  khatmNumber: number
  startDate: string
  endDate: string
  totalParticipants: number
  sectionsCompleted: number
  totalSections: number
  isActive: boolean
}

export default function AdminDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  
  const [users, setUsers] = useState<UserData[]>([])
  const [khatms, setKhatms] = useState<KhatmData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null)
  const [userDialogOpen, setUserDialogOpen] = useState(false)
  
  // Stats
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeKhatms: 0,
    completedKhatms: 0,
    totalCompletedSections: 0,
    newUsersThisWeek: 0,
    activeUsersThisWeek: 0,
  })

  // Check admin status
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/sign-in?callbackUrl=/admin")
      return
    }
    
    // For this example, allow access based on email
    // In production, use a proper admin role system
    if (status === "authenticated" && session?.user?.email !== "admin@example.com") {
      router.push("/dashboard")
      return
    }
    
    // Fetch data when authenticated
    if (status === "authenticated") {
      fetchData()
    }
  }, [status, session, router])
  
  // Fetch all data for admin
  const fetchData = async () => {
    setIsLoading(true)
    try {
      // In a real application, these would be API calls
      // For demo purposes, we'll create mock data
      const mockUsers = [
        {
          id: "1",
          name: "Aisha Khan",
          email: "aisha@example.com",
          phoneNumber: "+1 (234) 567-8901",
          createdAt: "2023-03-15T14:30:00Z",
          lastLogin: "2023-04-10T09:15:30Z",
          completedSections: 12
        },
        {
          id: "2",
          name: "Mohammed Ali",
          email: "mohammed@example.com",
          phoneNumber: "+1 (345) 678-9012",
          createdAt: "2023-02-20T10:45:00Z",
          lastLogin: "2023-04-11T16:20:15Z",
          completedSections: 7
        },
        {
          id: "3",
          name: "Fatima Hassan",
          email: "fatima@example.com",
          phoneNumber: "+1 (456) 789-0123",
          createdAt: "2023-03-05T09:15:00Z",
          lastLogin: "2023-04-09T11:05:45Z",
          completedSections: 15
        },
        {
          id: "4",
          name: "Omar Farooq",
          email: "omar@example.com",
          phoneNumber: "+1 (567) 890-1234",
          createdAt: "2023-01-10T13:20:00Z",
          lastLogin: "2023-04-12T08:30:20Z",
          completedSections: 9
        },
        {
          id: "5",
          name: "Zainab Malik",
          email: "zainab@example.com",
          phoneNumber: "+1 (678) 901-2345",
          createdAt: "2023-03-25T15:10:00Z",
          lastLogin: "2023-04-10T14:45:10Z",
          completedSections: 5
        }
      ]
      
      const mockKhatms = [
        {
          id: "1",
          khatmNumber: 1,
          startDate: "2023-01-01T00:00:00Z",
          endDate: "2023-01-31T23:59:59Z",
          totalParticipants: 25,
          sectionsCompleted: 30,
          totalSections: 30,
          isActive: false
        },
        {
          id: "2",
          khatmNumber: 2,
          startDate: "2023-02-01T00:00:00Z",
          endDate: "2023-02-28T23:59:59Z",
          totalParticipants: 18,
          sectionsCompleted: 30,
          totalSections: 30,
          isActive: false
        },
        {
          id: "3",
          khatmNumber: 3,
          startDate: "2023-03-01T00:00:00Z",
          endDate: "2023-03-31T23:59:59Z",
          totalParticipants: 30,
          sectionsCompleted: 28,
          totalSections: 30,
          isActive: true
        }
      ]
      
      setUsers(mockUsers)
      setKhatms(mockKhatms)
      
      // Calculate stats
      setStats({
        totalUsers: mockUsers.length,
        activeKhatms: mockKhatms.filter(k => k.isActive).length,
        completedKhatms: mockKhatms.filter(k => !k.isActive && k.sectionsCompleted === k.totalSections).length,
        totalCompletedSections: mockUsers.reduce((sum, user) => sum + (user.completedSections || 0), 0),
        newUsersThisWeek: 2, // Mock data
        activeUsersThisWeek: 4, // Mock data
      })
      
    } catch (error) {
      console.error("Error fetching admin data:", error)
    } finally {
      setIsLoading(false)
    }
  }
  
  // Filter users based on search term
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.phoneNumber && user.phoneNumber.includes(searchTerm))
  )
  
  // Open user details dialog
  const openUserDetails = (user: UserData) => {
    setSelectedUser(user)
    setUserDialogOpen(true)
  }
  
  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }
  
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-islamic-primary" />
        <span className="ml-2">Loading admin dashboard...</span>
      </div>
    )
  }
  
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Users className="mr-2 h-4 w-4 text-muted-foreground" />
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {stats.newUsersThisWeek} new users this week
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Khatm Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <BookOpen className="mr-2 h-4 w-4 text-muted-foreground" />
              <div className="text-2xl font-bold">{stats.activeKhatms} Active / {stats.completedKhatms} Completed</div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {stats.totalCompletedSections} total sections completed
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <BarChart3 className="mr-2 h-4 w-4 text-muted-foreground" />
              <div className="text-2xl font-bold">{stats.activeUsersThisWeek}</div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Users active in the past 7 days
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Main Content */}
      <Tabs defaultValue="users" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="khatms">Khatms</TabsTrigger>
        </TabsList>
        
        {/* Users Tab */}
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>View and manage user information</CardDescription>
              
              {/* Search Bar */}
              <div className="relative mt-4">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users by name, email, or phone..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Registration Date</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead>Completed Sections</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.phoneNumber || "-"}</TableCell>
                        <TableCell>{formatDate(user.createdAt)}</TableCell>
                        <TableCell>{user.lastLogin ? formatDate(user.lastLogin) : "-"}</TableCell>
                        <TableCell>{user.completedSections || 0}</TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => openUserDetails(user)}
                          >
                            <ArrowUpRight className="h-4 w-4" />
                            <span className="sr-only">View</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-4">
                        No users found matching your search criteria
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Khatms Tab */}
        <TabsContent value="khatms">
          <Card>
            <CardHeader>
              <CardTitle>Khatm Progress</CardTitle>
              <CardDescription>Track Quran reading completion progress</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Khatm #</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>End Date</TableHead>
                    <TableHead>Participants</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {khatms.map((khatm) => (
                    <TableRow key={khatm.id}>
                      <TableCell className="font-medium">{khatm.khatmNumber}</TableCell>
                      <TableCell>{formatDate(khatm.startDate)}</TableCell>
                      <TableCell>{formatDate(khatm.endDate)}</TableCell>
                      <TableCell>{khatm.totalParticipants}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <div className="w-full bg-secondary rounded-full h-2.5">
                            <div 
                              className="bg-islamic-primary h-2.5 rounded-full" 
                              style={{ width: `${(khatm.sectionsCompleted / khatm.totalSections) * 100}%` }}
                            ></div>
                          </div>
                          <span className="ml-2 text-xs">
                            {khatm.sectionsCompleted}/{khatm.totalSections}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          khatm.isActive 
                            ? "bg-green-100 text-green-800" 
                            : "bg-gray-100 text-gray-800"
                        }`}>
                          {khatm.isActive ? "Active" : "Completed"}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* User Details Dialog */}
      <Dialog open={userDialogOpen} onOpenChange={setUserDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription>
              Detailed information about this user.
            </DialogDescription>
          </DialogHeader>
          
          {selectedUser && (
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="rounded-full bg-muted w-16 h-16 flex items-center justify-center text-2xl font-bold">
                  {selectedUser.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-medium">{selectedUser.name}</h3>
                  <p className="text-sm text-muted-foreground">Member since {formatDate(selectedUser.createdAt)}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{selectedUser.email}</span>
                </div>
                
                {selectedUser.phoneNumber && (
                  <div className="flex items-center">
                    <PhoneCall className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{selectedUser.phoneNumber}</span>
                  </div>
                )}
                
                <div className="flex items-center">
                  <CheckCircle2 className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{selectedUser.completedSections || 0} sections completed</span>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <h4 className="text-sm font-medium mb-2">Activity</h4>
                <p className="text-sm">
                  Last login: {selectedUser.lastLogin ? formatDate(selectedUser.lastLogin) : "Never"}
                </p>
                <p className="text-sm mt-1">
                  Reading activity: {selectedUser.completedSections ? "Active" : "No activity"}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
} 