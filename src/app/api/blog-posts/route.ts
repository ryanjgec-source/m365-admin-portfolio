import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { blogPosts } from '@/db/schema';
import { eq, like, and, or, desc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    // Single record by ID
    if (id) {
      if (!id || isNaN(parseInt(id))) {
        return NextResponse.json(
          { error: 'Valid ID is required', code: 'INVALID_ID' },
          { status: 400 }
        );
      }

      const record = await db
        .select()
        .from(blogPosts)
        .where(eq(blogPosts.id, parseInt(id)))
        .limit(1);

      if (record.length === 0) {
        return NextResponse.json(
          { error: 'Blog post not found', code: 'NOT_FOUND' },
          { status: 404 }
        );
      }

      return NextResponse.json(record[0], { status: 200 });
    }

    // List with filters
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '10'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');
    const search = searchParams.get('search');
    const status = searchParams.get('status');
    const category = searchParams.get('category');

    let query = db.select().from(blogPosts);

    const conditions = [];

    if (search) {
      conditions.push(
        or(
          like(blogPosts.title, `%${search}%`),
          like(blogPosts.content, `%${search}%`)
        )
      );
    }

    if (status) {
      conditions.push(eq(blogPosts.status, status));
    }

    if (category) {
      conditions.push(eq(blogPosts.category, category));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    const results = await query
      .orderBy(desc(blogPosts.createdAt))
      .limit(limit)
      .offset(offset);

    return NextResponse.json(results, { status: 200 });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, slug, category, featuredImage, content, seoDescription, status } = body;

    // Validate required fields
    if (!title) {
      return NextResponse.json(
        { error: 'Title is required', code: 'MISSING_TITLE' },
        { status: 400 }
      );
    }

    if (!slug) {
      return NextResponse.json(
        { error: 'Slug is required', code: 'MISSING_SLUG' },
        { status: 400 }
      );
    }

    if (!category) {
      return NextResponse.json(
        { error: 'Category is required', code: 'MISSING_CATEGORY' },
        { status: 400 }
      );
    }

    if (!content) {
      return NextResponse.json(
        { error: 'Content is required', code: 'MISSING_CONTENT' },
        { status: 400 }
      );
    }

    // Sanitize inputs
    const sanitizedTitle = title.trim();
    const sanitizedSlug = slug.trim();
    const sanitizedCategory = category.trim();
    const sanitizedContent = content.trim();

    // Prepare insert data
    const currentTimestamp = new Date().toISOString();
    const postStatus = status || 'draft';
    
    const insertData: any = {
      title: sanitizedTitle,
      slug: sanitizedSlug,
      category: sanitizedCategory,
      content: sanitizedContent,
      status: postStatus,
      createdAt: currentTimestamp
    };

    if (featuredImage) {
      insertData.featuredImage = featuredImage.trim();
    }

    if (seoDescription) {
      insertData.seoDescription = seoDescription.trim();
    }

    // Set publishedAt if status is published
    if (postStatus === 'published') {
      insertData.publishedAt = currentTimestamp;
    }

    const newRecord = await db.insert(blogPosts).values(insertData).returning();

    return NextResponse.json(newRecord[0], { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    
    // Handle unique constraint violation for slug
    if (error.message && error.message.includes('UNIQUE')) {
      return NextResponse.json(
        { error: 'A blog post with this slug already exists', code: 'DUPLICATE_SLUG' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error: ' + error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    // Check if record exists
    const existingRecord = await db
      .select()
      .from(blogPosts)
      .where(eq(blogPosts.id, parseInt(id)))
      .limit(1);

    if (existingRecord.length === 0) {
      return NextResponse.json(
        { error: 'Blog post not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const updates: any = {};

    // Add provided fields to updates
    if (body.title !== undefined) {
      updates.title = body.title.trim();
    }

    if (body.slug !== undefined) {
      updates.slug = body.slug.trim();
    }

    if (body.category !== undefined) {
      updates.category = body.category.trim();
    }

    if (body.featuredImage !== undefined) {
      updates.featuredImage = body.featuredImage ? body.featuredImage.trim() : null;
    }

    if (body.content !== undefined) {
      updates.content = body.content.trim();
    }

    if (body.seoDescription !== undefined) {
      updates.seoDescription = body.seoDescription ? body.seoDescription.trim() : null;
    }

    if (body.status !== undefined) {
      updates.status = body.status;
      
      // If status changes to published and publishedAt is null, set publishedAt
      if (body.status === 'published' && !existingRecord[0].publishedAt) {
        updates.publishedAt = new Date().toISOString();
      }
    }

    // Always update updatedAt
    updates.updatedAt = new Date().toISOString();

    const updated = await db
      .update(blogPosts)
      .set(updates)
      .where(eq(blogPosts.id, parseInt(id)))
      .returning();

    return NextResponse.json(updated[0], { status: 200 });
  } catch (error) {
    console.error('PUT error:', error);
    
    // Handle unique constraint violation for slug
    if (error.message && error.message.includes('UNIQUE')) {
      return NextResponse.json(
        { error: 'A blog post with this slug already exists', code: 'DUPLICATE_SLUG' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error: ' + error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    // Check if record exists
    const existingRecord = await db
      .select()
      .from(blogPosts)
      .where(eq(blogPosts.id, parseInt(id)))
      .limit(1);

    if (existingRecord.length === 0) {
      return NextResponse.json(
        { error: 'Blog post not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    const deleted = await db
      .delete(blogPosts)
      .where(eq(blogPosts.id, parseInt(id)))
      .returning();

    return NextResponse.json(
      {
        message: 'Blog post deleted successfully',
        deleted: deleted[0]
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error.message },
      { status: 500 }
    );
  }
}