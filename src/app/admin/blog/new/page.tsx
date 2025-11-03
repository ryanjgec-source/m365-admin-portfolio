"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "@/lib/auth-client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Loader2, Save } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { RichTextEditor } from "@/components/ui/rich-text-editor"

export default function NewBlogPostPage() {
  const { data: session, isPending } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    category: "Learning",
    content: "",
    seoDescription: "",
    featuredImage: "",
    status: "draft" as "draft" | "published"
  })

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/admin/login")
    }
  }, [session, isPending, router])

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
  }

  const handleTitleChange = (title: string) => {
    setFormData(prev => ({
      ...prev,
      title,
      slug: prev.slug || generateSlug(title)
    }))
  }

  const handleSave = async (publish: boolean = false) => {
    if (!formData.title.trim()) {
      toast.error("Title is required")
      return
    }

    if (!formData.slug.trim()) {
      toast.error("Slug is required")
      return
    }

    if (!formData.content.trim()) {
      toast.error("Content is required")
      return
    }

    setIsSaving(true)

    try {
      const response = await fetch("/api/blog-posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...formData,
          status: publish ? "published" : "draft"
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to create post")
      }

      const post = await response.json()
      toast.success(publish ? "Post published successfully!" : "Draft saved successfully!")
      router.push("/admin/blog")
    } catch (error: any) {
      console.error("Error saving post:", error)
      toast.error(error.message || "Failed to save post")
    } finally {
      setIsSaving(false)
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

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div>
          <Link href="/admin/blog">
            <Button variant="ghost" size="sm" className="mb-2">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Blog Posts
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Create New Blog Post</h1>
          <p className="text-muted-foreground">Write and publish a new blog post</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Post Details</CardTitle>
            <CardDescription>Enter the basic information for your blog post</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                placeholder="Enter post title"
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Slug *</Label>
              <Input
                id="slug"
                placeholder="post-url-slug"
                value={formData.slug}
                onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
              />
              <p className="text-xs text-muted-foreground">
                URL-friendly version of the title (auto-generated)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Microsoft 365">Microsoft 365</SelectItem>
                  <SelectItem value="Automation">Automation</SelectItem>
                  <SelectItem value="Security">Security</SelectItem>
                  <SelectItem value="Learning">Learning</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="featuredImage">Featured Image URL</Label>
              <Input
                id="featuredImage"
                placeholder="https://example.com/image.jpg"
                value={formData.featuredImage}
                onChange={(e) => setFormData(prev => ({ ...prev, featuredImage: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="seoDescription">SEO Description</Label>
              <Textarea
                id="seoDescription"
                placeholder="Brief description for search engines (150-160 characters)"
                rows={3}
                value={formData.seoDescription}
                onChange={(e) => setFormData(prev => ({ ...prev, seoDescription: e.target.value }))}
              />
              <p className="text-xs text-muted-foreground">
                {formData.seoDescription.length}/160 characters
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Content *</CardTitle>
            <CardDescription>Write your blog post content with rich formatting</CardDescription>
          </CardHeader>
          <CardContent>
            <RichTextEditor
              content={formData.content}
              onChange={(content) => setFormData(prev => ({ ...prev, content }))}
              placeholder="Start writing your post..."
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Publish Settings</CardTitle>
            <CardDescription>Control when and how your post is published</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Publish immediately</p>
                <p className="text-sm text-muted-foreground">
                  Make this post visible to the public right away
                </p>
              </div>
              <Switch
                checked={formData.status === "published"}
                onCheckedChange={(checked) => 
                  setFormData(prev => ({ ...prev, status: checked ? "published" : "draft" }))
                }
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button
            onClick={() => handleSave(false)}
            variant="outline"
            disabled={isSaving}
            className="flex-1"
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save as Draft
              </>
            )}
          </Button>
          <Button
            onClick={() => handleSave(true)}
            disabled={isSaving}
            className="flex-1"
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Publishing...
              </>
            ) : (
              "Publish Post"
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}