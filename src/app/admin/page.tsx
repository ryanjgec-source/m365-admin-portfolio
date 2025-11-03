"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { authClient, useSession } from "@/lib/auth-client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { FileText, Download, LogOut, BarChart3, Loader2, PenSquare } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

interface BlogPost {
  id: number
  title: string
  status: string
  createdAt: string
}

interface CVDownload {
  id: number
  downloadedAt: string
  ipAddress: string
}

export default function AdminDashboard() {
  const { data: session, isPending, refetch } = useSession()
  const router = useRouter()
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [downloads, setDownloads] = useState<CVDownload[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/admin/login")
    }
  }, [session, isPending, router])

  useEffect(() => {
    if (session?.user) {
      fetchData()
    }
  }, [session])

  const fetchData = async () => {
    try {
      const [postsRes, downloadsRes] = await Promise.all([
        fetch("/api/blog-posts?limit=5"),
        fetch("/api/cv-downloads?limit=5")
      ])

      if (postsRes.ok) {
        const posts = await postsRes.json()
        setBlogPosts(posts)
      }

      if (downloadsRes.ok) {
        const downloads = await downloadsRes.json()
        setDownloads(downloads)
      }
    } catch (error) {
      console.error("Error fetching data:", error)
      toast.error("Failed to load dashboard data")
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    const { error } = await authClient.signOut()
    if (error?.code) {
      toast.error("Failed to logout")
    } else {
      localStorage.removeItem("bearer_token")
      refetch()
      router.push("/")
      toast.success("Logged out successfully")
    }
  }

  if (isPending || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!session?.user) {
    return null
  }

  const publishedPosts = blogPosts.filter(p => p.status === "published").length
  const draftPosts = blogPosts.filter(p => p.status === "draft").length

  return (
    <div className="min-h-screen bg-background">
      {/* Header with Navigation */}
      <div className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Admin Dashboard</h1>
              <p className="text-sm text-muted-foreground">Welcome back, {session.user.name}</p>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/admin">
                <Button variant={router.pathname === "/admin" ? "default" : "ghost"} size="sm">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
              <Link href="/admin/blog">
                <Button variant="ghost" size="sm">
                  <FileText className="h-4 w-4 mr-2" />
                  Blog Posts
                </Button>
              </Link>
              <Link href="/admin/analytics">
                <Button variant="ghost" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  CV Analytics
                </Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Overview Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Blog Posts</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{blogPosts.length}</div>
              <p className="text-xs text-muted-foreground">
                {publishedPosts} published, {draftPosts} draft
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total CV Downloads</CardTitle>
              <Download className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{downloads.length}</div>
              <p className="text-xs text-muted-foreground">All time</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Published Posts</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{publishedPosts}</div>
              <p className="text-xs text-muted-foreground">Live on website</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Draft Posts</CardTitle>
              <PenSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{draftPosts}</div>
              <p className="text-xs text-muted-foreground">Not published yet</p>
            </CardContent>
          </Card>
        </div>

        {/* Latest Downloads */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Latest CV Downloads</CardTitle>
              <CardDescription>Most recent resume downloads</CardDescription>
            </div>
            <Link href="/admin/analytics">
              <Button variant="outline" size="sm">
                View All
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date/Time</TableHead>
                    <TableHead>IP Address</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {downloads.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={2} className="text-center text-muted-foreground">
                        No downloads yet
                      </TableCell>
                    </TableRow>
                  ) : (
                    downloads.slice(0, 5).map((download) => (
                      <TableRow key={download.id}>
                        <TableCell>
                          {new Date(download.downloadedAt).toLocaleString()}
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {download.ipAddress}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Latest Blog Posts */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Latest Blog Posts</CardTitle>
              <CardDescription>Recently created blog posts</CardDescription>
            </div>
            <Link href="/admin/blog">
              <Button variant="outline" size="sm">
                Manage Posts
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {blogPosts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center text-muted-foreground">
                        No blog posts yet
                      </TableCell>
                    </TableRow>
                  ) : (
                    blogPosts.slice(0, 5).map((post) => (
                      <TableRow key={post.id}>
                        <TableCell className="font-medium">{post.title}</TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              post.status === "published"
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {post.status}
                          </span>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {new Date(post.createdAt).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent className="flex gap-4">
            <Link href="/admin/blog/new">
              <Button>
                <PenSquare className="h-4 w-4 mr-2" />
                Create New Blog Post
              </Button>
            </Link>
            <Link href="/admin/analytics">
              <Button variant="outline">
                <BarChart3 className="h-4 w-4 mr-2" />
                View Analytics
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline">
                View Public Site
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
