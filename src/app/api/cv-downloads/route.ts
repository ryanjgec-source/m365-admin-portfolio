import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { cvDownloads } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    // Single record by ID
    if (id) {
      if (!id || isNaN(parseInt(id))) {
        return NextResponse.json(
          { 
            error: 'Valid ID is required',
            code: 'INVALID_ID' 
          },
          { status: 400 }
        );
      }

      const record = await db.select()
        .from(cvDownloads)
        .where(eq(cvDownloads.id, parseInt(id)))
        .limit(1);

      if (record.length === 0) {
        return NextResponse.json(
          { error: 'Record not found' },
          { status: 404 }
        );
      }

      return NextResponse.json(record[0], { status: 200 });
    }

    // List all with pagination and filters
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '10'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');
    const ipAddressFilter = searchParams.get('ip_address');

    let query = db.select().from(cvDownloads);

    // Apply ip_address filter if provided
    if (ipAddressFilter) {
      query = query.where(eq(cvDownloads.ipAddress, ipAddressFilter));
    }

    const results = await query.limit(limit).offset(offset);

    return NextResponse.json(results, { status: 200 });
  } catch (error: any) {
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
    const { userAgent, referrer } = body;

    // Get real IP address from request headers
    const forwarded = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    const ipAddress = forwarded?.split(',')[0] || realIp || 'unknown';

    // Validate required fields
    if (!userAgent) {
      return NextResponse.json(
        { 
          error: 'User agent is required',
          code: 'MISSING_USER_AGENT' 
        },
        { status: 400 }
      );
    }

    // Sanitize inputs
    const sanitizedUserAgent = userAgent.trim();
    const sanitizedReferrer = referrer ? referrer.trim() : null;

    // Create new record
    const newRecord = await db.insert(cvDownloads)
      .values({
        ipAddress: ipAddress,
        userAgent: sanitizedUserAgent,
        referrer: sanitizedReferrer,
        downloadedAt: new Date().toISOString()
      })
      .returning();

    return NextResponse.json(newRecord[0], { status: 201 });
  } catch (error: any) {
    console.error('POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error.message },
      { status: 500 }
    );
  }
}