/**
 * Proveedor personalizado de TikTok para NextAuth.js
 * 
 * Este proveedor implementa la autenticación con TikTok usando OAuth 2.0
 */

interface TikTokProfile {
  open_id: string;
  avatar_url?: string;
  display_name?: string;
}

/**
 * Configuración simplificada para el proveedor de TikTok
 */
export default function TikTok(options: any) {
  return {
    id: "tiktok",
    name: "TikTok",
    type: "oauth",
    clientId: options.clientId,
    clientSecret: options.clientSecret,
    version: "2.0",
    wellKnown: "https://www.tiktok.com/v2/.well-known/openid-configuration",
    authorization: {
      url: "https://www.tiktok.com/v2/auth/authorize",
      params: { scope: "user.info.basic,video.list" }
    },
    token: "https://open.tiktokapis.com/v2/oauth/token",
    userinfo: "https://open.tiktokapis.com/v2/user/info",
    profile(profile: TikTokProfile) {
      return {
        id: profile.open_id,
        name: profile.display_name || "Usuario de TikTok",
        image: profile.avatar_url,
        email: null
      }
    },
    style: {
      logo: "/tiktok.svg",
      logoDark: "/tiktok.svg",
      bg: "#000000",
      text: "#ffffff",
      bgDark: "#000000",
      textDark: "#ffffff",
    }
  }
}
