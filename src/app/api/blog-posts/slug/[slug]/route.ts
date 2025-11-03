import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { blogPosts } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const slug = params.slug;

    // Validate slug parameter
    if (!slug || typeof slug !== 'string' || slug.trim() === '') {
      return NextResponse.json(
        { 
          error: 'Valid slug is required',
          code: 'INVALID_SLUG' 
        },
        { status: 400 }
      );
    }

    // Query blog post by slug
    const post = await db.select()
      .from(blogPosts)
      .where(eq(blogPosts.slug, slug.trim()))
      .limit(1);

    // Check if post exists
    if (post.length === 0) {
      return NextResponse.json(
        { 
          error: 'Blog post not found',
          code: 'POST_NOT_FOUND' 
        },
        { status: 404 }
      );
    }

    // Return the blog post
    return NextResponse.json(post[0], { status: 200 });

  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error')
      },
      { status: 500 }
    );
  }
}