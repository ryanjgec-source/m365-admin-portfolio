import { db } from '@/db';
import { blogPosts } from '@/db/schema';

async function main() {
    const sampleBlogPosts = [
        {
            title: 'How I Prototyped RoomCheck in 2 Hours',
            slug: 'roomcheck-prototype',
            category: 'Learning',
            content: 'A quick dive into rapid prototyping with Power Automate and Teams integration. I built an intelligent automation bot that checks meeting room availability in real-time and prevents double bookings.',
            status: 'published',
            seoDescription: 'Learn how I built RoomCheck, an intelligent automation bot for meeting room availability using Power Automate and Teams integration.',
            featuredImage: null,
            createdAt: new Date().toISOString(),
            publishedAt: new Date().toISOString(),
        },
        {
            title: 'Lessons from Automating a Confluence Knowledge Base',
            slug: 'confluence-automation-lessons',
            category: 'Learning',
            content: 'What I learned building Python automation for team documentation. By syncing Jira with Confluence, I saved 10+ team hours weekly and improved first-call resolution by 25%.',
            status: 'published',
            seoDescription: 'Discover practical lessons from building Python automation to sync Jira with Confluence, saving hours and improving team efficiency.',
            featuredImage: null,
            createdAt: new Date().toISOString(),
            publishedAt: new Date().toISOString(),
        },
        {
            title: 'Beyond the Exam: What I Actually Learned from SC-900',
            slug: 'sc-900-real-learnings',
            category: 'Learning',
            content: 'Real-world security insights that go beyond certification prep. The SC-900 taught me fundamental security concepts that I now apply daily in my Microsoft 365 administration work.',
            status: 'published',
            seoDescription: 'Real-world security insights from SC-900 certification that go beyond exam prep and apply to daily Microsoft 365 administration.',
            featuredImage: null,
            createdAt: new Date().toISOString(),
            publishedAt: new Date().toISOString(),
        }
    ];

    await db.insert(blogPosts).values(sampleBlogPosts);
    
    console.log('✅ Blog posts seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});