import { type NextRequest, NextResponse } from "next/server"
import fs from "fs"
import path from "path"

const USERS_FILE = path.join(process.cwd(), "public", "users.json")

export async function POST(request: NextRequest) {
  try {
    const { ip } = await request.json()

    let users: any[] = []
    if (fs.existsSync(USERS_FILE)) {
      const data = fs.readFileSync(USERS_FILE, "utf-8")
      users = JSON.parse(data)
    }

    const existingUserIndex = users.findIndex((u) => u.ip === ip)
    const now = new Date().toISOString()

    if (existingUserIndex >= 0) {
      users[existingUserIndex].lastVisit = now
    } else {
      users.push({
        ip,
        firstVisit: now,
        lastVisit: now,
        balance: "1250.50",
      })
    }

    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error tracking user:", error)
    return NextResponse.json({ error: "Failed to track user" }, { status: 500 })
  }
}
