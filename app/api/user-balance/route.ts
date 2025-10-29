import { type NextRequest, NextResponse } from "next/server"
import fs from "fs"
import path from "path"

const USERS_FILE = path.join(process.cwd(), "public", "users.json")

export async function GET(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "127.0.0.1"

    if (!fs.existsSync(USERS_FILE)) {
      return NextResponse.json({ balance: "0.00" })
    }

    const data = fs.readFileSync(USERS_FILE, "utf-8")
    const users = JSON.parse(data)

    const user = users.find((u: any) => u.ip === ip)
    const balance = user?.balance || "0.00"

    return NextResponse.json({ balance })
  } catch (error) {
    console.error("Error fetching balance:", error)
    return NextResponse.json({ balance: "0.00" })
  }
}
