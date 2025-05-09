import { NextResponse } from 'next/server';

// En una aplicaciu00f3n real, este endpoint enviaru00eda un correo con un token
// para restablecer la contraseu00f1a. Para esta demo, simulamos el proceso.
export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    
    if (!email) {
      return NextResponse.json(
        { error: 'El correo electru00f3nico es obligatorio' },
        { status: 400 }
      );
    }
    
    // Simular verificaciu00f3n de que el email existe en el sistema
    // En una aplicaciu00f3n real, verificaru00edas contra tu base de datos
    const usuariosDemo = [
      'usuario@ejemplo.com',
      'admin@ejemplo.com'
    ];
    
    const usuarioExiste = usuariosDemo.includes(email);
    
    if (!usuarioExiste) {
      // Por seguridad, no informamos si el correo existe o no
      return NextResponse.json(
        { success: true, message: 'Si el correo estu00e1 registrado, recibiru00e1s un enlace para restablecer tu contraseu00f1a' },
        { status: 200 }
      );
    }
    
    // En una aplicaciu00f3n real, aquu00ed generaru00edas un token u00fanico,
    // lo almacenaru00edas en la base de datos asociado al usuario,
    // y enviaru00edas un correo con un enlace para restablecer la contraseu00f1a
    
    // Simulamos que el correo se enviu00f3 correctamente
    console.log(`[DEMO] Correo de recuperaciu00f3n enviado a: ${email}`);
    
    return NextResponse.json(
      { success: true, message: 'Si el correo estu00e1 registrado, recibiru00e1s un enlace para restablecer tu contraseu00f1a' },
      { status: 200 }
    );
    
  } catch (error) {
    console.error('Error en recuperaciu00f3n de contraseu00f1a:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
