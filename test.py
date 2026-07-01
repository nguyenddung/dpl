import asyncio
import asyncpg

async def main():
    try:
        conn = await asyncpg.connect(
            user="postgres",
            password="040605",
            database="coc_study",
            host="localhost",
            port=5432
        )

        print("✅ Kết nối thành công")

        print(await conn.fetchval("SELECT current_database();"))
        print(await conn.fetchval("SELECT current_user;"))

        await conn.close()

    except Exception as e:
        print("❌", e)

asyncio.run(main())