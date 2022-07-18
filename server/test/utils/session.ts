import Keygrip from "keygrip"

export async function createSession(userId: string) {
  const cookieKey = process.env.COOKIE_KEY as string

  const keygrip = new Keygrip([cookieKey])
  const session = Buffer.from(JSON.stringify({
    passport: { user: userId }
  })).toString("base64")

  const sig = keygrip.sign(["session", session].join("="))

  return { session, sig }
}
