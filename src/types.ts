import { Generated } from "kysely"

export interface Database {
    users: UserTable
}

export interface UserTable {
    id: Generated<number>

    name: string
}