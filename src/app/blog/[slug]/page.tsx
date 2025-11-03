"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
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

export default function BlogPostPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string
  const [post, setPost] = useState<BlogPost | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (slug) {
      fetchPost()
    }
  }, [slug])

  const fetchPost = async () => {
    try {
      const response = await fetch(`/api/blog-posts/slug/${slug}`)
      if (!response.ok) {
        if (response.status === 404) {
          router.push("/blog")
          return
        }
        throw new Error("Failed to fetch post")
      }
      const data = await response.json()
      
      // Only show published posts to public
      if (data.status !== "published") {
        router.push("/blog")
        return
      }
      
      setPost(data)
    } catch (error) {
      console.error("Error fetching post:", error)
      router.push("/blog")
    } finally {
      setIsLoading(false)
    }
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

  if (!post) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <Link href="/blog">
          <Button variant="ghost" size="sm" className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Blog
          </Button>
        </Link>

        {post.featuredImage && (
          <div className="relative w-full h-[400px] rounded-lg overflow-hidden mb-8">
            <Image
              src={post.featuredImage}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Badge variant="secondary">{post.category}</Badge>
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="h-4 w-4 mr-2" />
              {new Date(post.publishedAt || post.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric"
              })}
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            {post.title}
          </h1>
          
          {post.seoDescription && (
            <p className="text-xl text-muted-foreground">
              {post.seoDescription}
            </p>
          )}
        </div>

        <div 
          className="prose prose-lg max-w-none dark:prose-invert
            prose-headings:font-bold prose-headings:text-foreground
            prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-4
            prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-3
            prose-p:text-muted-foreground prose-p:leading-relaxed prose-p:mb-4
            prose-a:text-primary prose-a:no-underline hover:prose-a:underline
            prose-strong:text-foreground prose-strong:font-semibold
            prose-ul:list-disc prose-ul:pl-6 prose-ul:mb-4
            prose-ol:list-decimal prose-ol:pl-6 prose-ol:mb-4
            prose-li:text-muted-foreground prose-li:mb-2
            prose-code:bg-muted prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm
            prose-pre:bg-muted prose-pre:p-4 prose-pre:rounded-lg prose-pre:overflow-x-auto
            prose-img:rounded-lg prose-img:shadow-md prose-img:my-8
            prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-4 prose-blockquote:italic"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        <div className="mt-12 pt-8 border-t border-border">
          <Link href="/blog">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to All Posts
            </Button>
          </Link>
        </div>
      </article>

      <footer className="py-8 px-4 sm:px-6 lg:px-8 border-t border-border mt-20">
        <div className="max-w-5xl mx-auto text-center text-muted-foreground text-sm">
          <p>© 2024 Sayan K Ghosh. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
