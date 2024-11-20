export interface PetitionSignatureEmailProps {
  petitionTitle: string
  petitionId: string
  userId: string
  userName: string
  signatureCount: number
  targetCount: number
  baseUrl: string
}

export function getPetitionSignatureEmail(props: PetitionSignatureEmailProps) {
  console.log("Generating email template with params:", {
    petitionTitle: props.petitionTitle,
    petitionId: props.petitionId,
    userId: props.userId,
    userName: props.userName,
    signatureCount: props.signatureCount,
    targetCount: props.targetCount,
    baseUrl: props.baseUrl,
  })

  const petitionUrl = `${props.baseUrl}/petitions/${props.petitionId}?ref=${props.userId}`
  const encodedUrl = encodeURIComponent(petitionUrl)
  const encodedTitle = encodeURIComponent(
    `I just signed: ${props.petitionTitle}`
  )
  const encodedText = encodeURIComponent(
    `Join me in supporting this important petition!`
  )

  console.log("Generated URLs:", {
    petitionUrl,
    encodedUrl,
  })

  const socialLinks = {
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    whatsapp: `https://wa.me/?text=${encodedText}%20${encodedUrl}`,
    email: `mailto:?subject=${encodedTitle}&body=${encodedText}%20${encodedUrl}`,
  }

  return `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #333;">Thank you for signing "${props.petitionTitle}"!</h1>
      
      <p>Dear ${props.userName},</p>
      
      <p>Thank you for adding your voice to this important cause. Your signature makes a difference!</p>
      
      <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <p style="margin: 0;">Current progress: <strong>${props.signatureCount}</strong> out of <strong>${props.targetCount}</strong> signatures</p>
      </div>

      <p style="font-weight: bold;">Help this petition reach more people by sharing:</p>
      
      <div style="margin: 20px 0;">
        <!-- Social Sharing Buttons -->
        <a href="${socialLinks.facebook}" target="_blank" style="display: inline-block; background: #1877f2; color: white; padding: 10px 20px; margin: 5px; text-decoration: none; border-radius: 5px;">
          Share on Facebook
        </a>
        
        <a href="${socialLinks.twitter}" target="_blank" style="display: inline-block; background: #1da1f2; color: white; padding: 10px 20px; margin: 5px; text-decoration: none; border-radius: 5px;">
          Share on Twitter
        </a>
        
        <a href="${socialLinks.linkedin}" target="_blank" style="display: inline-block; background: #0a66c2; color: white; padding: 10px 20px; margin: 5px; text-decoration: none; border-radius: 5px;">
          Share on LinkedIn
        </a>
        
        <a href="${socialLinks.whatsapp}" target="_blank" style="display: inline-block; background: #25d366; color: white; padding: 10px 20px; margin: 5px; text-decoration: none; border-radius: 5px;">
          Share on WhatsApp
        </a>
        
        <a href="${socialLinks.email}" style="display: inline-block; background: #333; color: white; padding: 10px 20px; margin: 5px; text-decoration: none; border-radius: 5px;">
          Share via Email
        </a>
      </div>

      <p>Or copy your unique sharing link:</p>
      <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; word-break: break-all;">
        <a href="${petitionUrl}">${petitionUrl}</a>
      </div>

      <p style="margin-top: 20px;">Together we can make change happen!</p>
      
      <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;">
      
      <p style="color: #666; font-size: 0.9em;">
        When others sign using your link, we'll track your impact on this campaign.
      </p>
    </div>
  `
}
