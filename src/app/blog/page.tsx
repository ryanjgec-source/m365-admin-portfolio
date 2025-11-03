"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Calendar, Loader2 } from "lucide-react"
import Navigation from "@/components/Navigation"

interface BlogPost {
  id: number
  title: string
  slug: string
  category: string
  featuredImage: string | null
  content: string
  seoDescription: string | null
  status: string
  createdAt: string
  publishedAt: string | null
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const response = await fetch("/api/blog-posts?status=published&limit=100")
      if (!response.ok) throw new Error("Failed to fetch posts")
      const data = await response.json()
      setPosts(data)
    } catch (error) {
      console.error("Error fetching posts:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getExcerpt = (content: string, maxLength: number = 150): string => {
    const text = content.replace(/<[^>]*>/g, "")
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <Link href="/">
          <Button variant="ghost" size="sm" className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </Link>

        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Notes & Learnings
          </h1>
          <p className="text-lg text-muted-foreground">
            Insights and lessons from my Microsoft 365 administration journey
          </p>
        </div>

        {posts.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No blog posts published yet.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`}>
                <Card className="h-full hover:shadow-lg transition-all hover:scale-105 cursor-pointer">
                  {post.featuredImage && (
                    <div className="relative w-full h-48 overflow-hidden rounded-t-lg">
                      <Image
                        src={post.featuredImage}
                        alt={post.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary">{post.category}</Badge>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3 mr-1" />
                        {new Date(post.publishedAt || post.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <CardTitle className="text-xl">{post.title}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {post.seoDescription || getExcerpt(post.content)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="link" className="p-0">
                      Read More →
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>

      <footer className="py-8 px-4 sm:px-6 lg:px-8 border-t border-border mt-20">
        <div className="max-w-5xl mx-auto text-center text-muted-foreground text-sm">
          <p>© 2024 Sayan K Ghosh. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
