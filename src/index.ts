import { Hono } from "hono";
import { Kysely, PostgresDialect } from "kysely";
import { Client, Pool } from "pg";
import { Database } from "./types";

type Bindings = {
    DB_URL: string;
}

const app = new Hono<{Bindings: Bindings}>();

app.get("/", (c) => {
    return c.text("テスト");
});

// pgのみで接続
// app.get('/users', async (c) => {
//     const client = new Client({
//         connectionString: c.env.DB_URL,
//         ssl: true
//     });
//     await client.connect();

//     console.log('connected');

//     const result = await client.query('SELECT * FROM users');

//     console.log(result.rows);

//     const users = result.rows.map((row) => ({
//         id: row.id,
//         name: row.name, 
//     }));

//     c.executionCtx.waitUntil(client.end());
    
//     return c.json(users);
// });

app.get('/users', async (c) => {
    const dialect = new PostgresDialect({
        pool: new Pool({
            connectionString: c.env.DB_URL,
            ssl: true
        })
    });

    const db = new Kysely<Database>({
        dialect
    })

    const result = await db.selectFrom('users')
        .selectAll()
        .execute();

    const users = result.map((row) => ({
        id: row.id,
        name: row.name, 
    }));
    
    return c.json(users);
});

export default app;