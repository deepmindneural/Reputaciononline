# Configuraciu00f3n de Autenticaciu00f3n con Redes Sociales

Este documento explica cu00f3mo configurar la autenticaciu00f3n con redes sociales para la plataforma de Reputaciu00f3n Online.

## Requisitos Previos

- Cuenta de desarrollador en cada plataforma (Facebook, Twitter, LinkedIn, Instagram)
- Node.js 18.16.0 o superior
- Next.js 13.0.7

## Configuraciu00f3n del Archivo .env.local

El archivo `.env.local` debe contener las siguientes variables de entorno:

```
# Facebook
FACEBOOK_CLIENT_ID=tu_facebook_client_id
FACEBOOK_CLIENT_SECRET=tu_facebook_client_secret

# Twitter
TWITTER_CLIENT_ID=tu_twitter_client_id
TWITTER_CLIENT_SECRET=tu_twitter_client_secret

# Instagram (usando Facebook Developer)
INSTAGRAM_CLIENT_ID=tu_instagram_client_id
INSTAGRAM_CLIENT_SECRET=tu_instagram_client_secret

# LinkedIn
LINKEDIN_CLIENT_ID=tu_linkedin_client_id
LINKEDIN_CLIENT_SECRET=tu_linkedin_client_secret

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=tu_nextauth_secret_aleatorio # Puedes generar uno con: openssl rand -base64 32
```

## Obtenciu00f3n de Credenciales

### Facebook

1. Ve a [Facebook Developers](https://developers.facebook.com/)
2. Crea una nueva aplicaciu00f3n (tipo: Consumidor)
3. En el panel, ve a "Configuraciu00f3n > Bu00e1sica"
4. Copia el "ID de la aplicaciu00f3n" y el "Secreto de la aplicaciu00f3n"
5. En "Productos", agrega "Inicio de sesiu00f3n con Facebook"
6. Configura la URL de redirecciu00f3n: `http://localhost:3000/api/auth/callback/facebook`

### Twitter

1. Ve a [Twitter Developer Portal](https://developer.twitter.com/)
2. Crea un nuevo proyecto y una aplicaciu00f3n
3. Configura la aplicaciu00f3n para usar OAuth 2.0
4. Establece los permisos necesarios (lectura de tweets, perfil, etc.)
5. Configura la URL de redirecciu00f3n: `http://localhost:3000/api/auth/callback/twitter`
6. Copia el "Client ID" y "Client Secret"

### Instagram

1. Ve a [Facebook Developers](https://developers.facebook.com/)
2. Crea una nueva aplicaciu00f3n (o usa la misma que para Facebook)
3. En "Productos", agrega "Instagram Basic Display"
4. Sigue las instrucciones para configurar la aplicaciu00f3n
5. Configura la URL de redirecciu00f3n: `http://localhost:3000/api/auth/callback/instagram`
6. Copia el ID y el secreto de la aplicaciu00f3n

### LinkedIn

1. Ve a [LinkedIn Developer Portal](https://www.linkedin.com/developers/)
2. Crea una nueva aplicaciu00f3n
3. Configura los permisos necesarios (r_liteprofile, r_emailaddress, etc.)
4. Configura la URL de redirecciu00f3n: `http://localhost:3000/api/auth/callback/linkedin`
5. Copia el "Client ID" y "Client Secret"

## Generaciu00f3n del NEXTAUTH_SECRET

Para generar un valor seguro para `NEXTAUTH_SECRET`, puedes usar el siguiente comando en la terminal:

```bash
openssl rand -base64 32
```

Copia el resultado y colu00f3calo en el archivo `.env.local`.

## Ejecuciu00f3n del Proyecto

Una vez configuradas todas las credenciales, puedes ejecutar el proyecto con:

```bash
npm run dev
```

## Verificaciu00f3n

1. Navega a `http://localhost:3000/login`
2. Inicia sesiu00f3n con credenciales (usuario@ejemplo.com / password123)
3. Ve a la pu00e1gina de redes sociales en el dashboard
4. Intenta conectar una red social
5. Deberu00edas ser redirigido a la pu00e1gina de autenticaciu00f3n de la plataforma
6. Despuu00e9s de autenticarte, seru00e1s redirigido de vuelta a la aplicaciu00f3n

## Resoluciu00f3n de Problemas

- **Error de redirecciu00f3n**: Verifica que las URLs de redirecciu00f3n estu00e9n correctamente configuradas en cada plataforma.
- **Error de autenticaciu00f3n**: Asegu00farate de que los IDs y secretos sean correctos en el archivo `.env.local`.
- **Error de permisos**: Verifica que hayas solicitado los permisos necesarios en cada plataforma.

## Notas Importantes

- Para un entorno de producciu00f3n, deberu00e1s actualizar `NEXTAUTH_URL` a la URL de tu sitio web.
- Algunas plataformas requieren aprobaciu00f3n para ciertos permisos o para salir del modo de desarrollo.
- Recuerda que este sistema utiliza una "base de datos" simulada con un array de usuarios. En un entorno de producciu00f3n, deberu00edas implementar una base de datos real.
