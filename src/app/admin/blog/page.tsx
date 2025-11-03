"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "@/lib/auth-client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { 
  ArrowLeft, 
  Loader2, 
  PenSquare, 
  Trash2, 
  Eye, 
  Plus,
  ExternalLink 
} from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface BlogPost {
  id: number
  title: string
  slug: string
  category: string
  status: string
  createdAt: string
  publishedAt: string | null
}

export default function AdminBlogPage() {
  const { data: session, isPending } = useSession()
  const router = useRouter()
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<number | null>(null)

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/admin/login")
    }
  }, [session, isPending, router])

  useEffect(() => {
    if (session?.user) {
      fetchPosts()
    }
  }, [session])

  const fetchPosts = async () => {
    try {
      const response = await fetch("/api/blog-posts?limit=100")
      if (!response.ok) throw new Error("Failed to fetch posts")
      const data = await response.json()
      setPosts(data)
    } catch (error) {
      console.error("Error fetching posts:", error)
      toast.error("Failed to load blog posts")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/blog-posts?id=${id}`, {
        method: "DELETE"
      })

      if (!response.ok) throw new Error("Failed to delete post")

      toast.success("Blog post deleted successfully")
      setPosts(posts.filter(p => p.id !== id))
      setDeleteId(null)
    } catch (error) {
      console.error("Error deleting post:", error)
      toast.error("Failed to delete blog post")
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

  const publishedCount = posts.filter(p => p.status === "published").length
  const draftCount = posts.filter(p => p.status === "draft").length

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Link href="/admin">
              <Button variant="ghost" size="sm" className="mb-2">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <h1 className="text-3xl font-bold">Blog Posts</h1>
            <p className="text-muted-foreground">
              Manage your blog posts and content
            </p>
          </div>
          <Link href="/admin/blog/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create New Post
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{posts.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Published</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{publishedCount}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Drafts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{draftCount}</div>
            </CardContent>
          </Card>
        </div>

        {/* Posts Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Blog Posts</CardTitle>
            <CardDescription>Manage, edit, and preview your blog posts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {posts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                        No blog posts yet. Create your first post to get started!
                      </TableCell>
                    </TableRow>
                  ) : (
                    posts.map((post) => (
                      <TableRow key={post.id}>
                        <TableCell className="font-medium max-w-md truncate">
                          {post.title}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{post.category}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={post.status === "published" ? "default" : "secondary"}
                          >
                            {post.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {new Date(post.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link href={`/blog/${post.slug}`} target="_blank">
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Link href={`/admin/blog/edit/${post.id}`}>
                              <Button variant="ghost" size="sm">
                                <PenSquare className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setDeleteId(post.id)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the blog post.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && handleDelete(deleteId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
