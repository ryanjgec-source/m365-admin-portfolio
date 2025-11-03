import { db } from '@/db';
import { user, account } from '@/db/schema';
import { hash } from 'bcrypt';

async function main() {
    const timestamp = Date.now();
    const userId = `user_${timestamp}`;
    const accountId = `account_${timestamp}`;
    
    const hashedPassword = await hash('infra365admin', 10);
    
    await db.insert(user).values({
        id: userId,
        name: 'Admin',
        email: 'admin@infra365.online',
        emailVerified: true,
        createdAt: new Date(timestamp),
        updatedAt: new Date(timestamp),
    });
    
    await db.insert(account).values({
        id: accountId,
        accountId: 'admin@infra365.online',
        providerId: 'credential',
        userId: userId,
        password: hashedPassword,
        createdAt: new Date(timestamp),
        updatedAt: new Date(timestamp),
    });
    
    console.log('✅ Admin user seeder completed successfully');
    console.log('📧 Email: admin@infra365.online');
    console.log('🔑 Password: infra365admin');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});