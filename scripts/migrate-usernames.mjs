/**
 * 資料遷移腳本：為現有使用者生成 username
 *
 * 此腳本會：
 * 1. 查詢所有 username 為 null 的使用者
 * 2. 使用 user_id 前 8 碼生成 username（格式：user_XXXXXXXX）
 * 3. 確保 username 唯一性
 * 4. 更新資料庫
 *
 * 執行方式：
 * node scripts/migrate-usernames.mjs
 */

import postgres from 'postgres';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env.local
dotenv.config({ path: join(__dirname, '..', '.env.local') });

async function migrateUsernames() {
  console.log('🔍 開始檢查需要遷移的使用者...');

  let sql;
  try {
    // 建立資料庫連線
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      throw new Error('DATABASE_URL 環境變數未設定');
    }

    sql = postgres(databaseUrl, { max: 1 });

    // 1. 查詢所有 username 為 null 的使用者
    const usersWithoutUsername = await sql`
      SELECT user_id, display_name
      FROM profiles
      WHERE username IS NULL
    `;

    console.log(`📊 找到 ${usersWithoutUsername.length} 位需要設定 username 的使用者`);

    if (usersWithoutUsername.length === 0) {
      console.log('✅ 所有使用者都已經有 username，無需遷移');
      await sql.end();
      return;
    }

    // 2. 為每位使用者生成 username
    let successCount = 0;
    let failCount = 0;

    for (const user of usersWithoutUsername) {
      try {
        // 使用 user_id 前 8 碼生成 username
        const username = `user_${user.user_id.substring(0, 8)}`;

        // 檢查 username 是否已存在
        const existingUser = await sql`
          SELECT user_id
          FROM profiles
          WHERE username = ${username}
          LIMIT 1
        `;

        let finalUsername = username;

        // 如果已存在，添加隨機後綴
        if (existingUser.length > 0) {
          console.log(`⚠️  Username ${username} 已存在，生成新的...`);
          let attempt = 0;
          while (attempt < 10) {
            const randomSuffix = Math.floor(Math.random() * 10000);
            finalUsername = `user_${user.user_id.substring(0, 8)}_${randomSuffix}`;

            const check = await sql`
              SELECT user_id
              FROM profiles
              WHERE username = ${finalUsername}
              LIMIT 1
            `;

            if (check.length === 0) break;
            attempt++;
          }

          // 最後手段：使用完整 UUID
          if (attempt >= 10) {
            finalUsername = `user_${user.user_id.replace(/-/g, '')}`;
          }
        }

        // 更新使用者的 username
        await sql`
          UPDATE profiles
          SET username = ${finalUsername},
              updated_at = NOW()
          WHERE user_id = ${user.user_id}
        `;

        console.log(`✅ 已為使用者 ${user.user_id} 設定 username: ${finalUsername}`);
        successCount++;
      } catch (error) {
        console.error(`❌ 處理使用者 ${user.user_id} 時發生錯誤:`, error);
        failCount++;
      }
    }

    console.log('\n📈 遷移結果：');
    console.log(`  成功: ${successCount}`);
    console.log(`  失敗: ${failCount}`);
    console.log(`  總計: ${usersWithoutUsername.length}`);

    if (successCount === usersWithoutUsername.length) {
      console.log('\n🎉 所有使用者的 username 已成功設定！');
    } else if (successCount > 0) {
      console.log('\n⚠️  部分使用者設定成功，請檢查失敗的項目');
    } else {
      console.log('\n❌ 遷移失敗，請檢查錯誤訊息');
    }

    await sql.end();
  } catch (error) {
    console.error('❌ 遷移過程發生錯誤:', error);
    if (sql) await sql.end();
    process.exit(1);
  }
}

// 執行遷移
migrateUsernames()
  .then(() => {
    console.log('\n✨ 遷移腳本執行完畢');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ 執行失敗:', error);
    process.exit(1);
  });
