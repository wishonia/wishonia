/**
 * @jest-environment node
 */
import { sendEmail } from "@/lib/mailer"

describe("sendEmail", () => {
  it("should send an email with correct parameters", async () => {
    const mockEmail = "test@example.com"
    const mockSubject = "Test Subject"
    const mockText = "Test Text"
    const mockHtml = "<b>Test Html</b>"
    const info = await sendEmail(mockEmail, mockSubject, mockText, mockHtml)
    expect(info.rejected).toStrictEqual([])
  })
})
