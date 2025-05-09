"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { Building2, User, CheckCircle, AlertCircle } from 'lucide-react';

const formSchema = z.object({
  nombreAgencia: z.string().min(2, { message: 'El nombre de la agencia es demasiado corto' }),
  emailAgencia: z.string().email({ message: 'Email invu00e1lido' }),
  telefonoAgencia: z.string().min(7, { message: 'Telu00e9fono invu00e1lido' }),
  sitioWeb: z.string().url({ message: 'URL invu00e1lida' }).optional().or(z.literal('')),
  direccion: z.string().min(5, { message: 'Direcciu00f3n demasiado corta' }),
  password: z.string().min(8, { message: 'La contrasen\u00f1a debe tener al menos 8 caracteres' }),
  confirmPassword: z.string(),
  nombreContacto: z.string().min(2, { message: 'El nombre es demasiado corto' }),
  apellidoContacto: z.string().min(2, { message: 'El apellido es demasiado corto' }),
  cargoContacto: z.string().min(2, { message: 'El cargo es demasiado corto' }),
  emailContacto: z.string().email({ message: 'Email invu00e1lido' }),
  terminosCondiciones: z.boolean().refine(val => val === true, {
    message: 'Debes aceptar los tu00e9rminos y condiciones',
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Las contrasen\u00f1as no coinciden',
  path: ['confirmPassword'],
});

type FormValues = z.infer<typeof formSchema>;

export default function RegistroAgenciaPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('informacion');

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nombreAgencia: '',
      emailAgencia: '',
      telefonoAgencia: '',
      sitioWeb: '',
      direccion: '',
      password: '',
      confirmPassword: '',
      nombreContacto: '',
      apellidoContacto: '',
      cargoContacto: '',
      emailContacto: '',
      terminosCondiciones: false,
    },
  });

  const onSubmit = async (values: FormValues) => {
    setLoading(true);
    setError(null);

    try {
      // Llamada a la API para crear la cuenta de agencia
      const response = await fetch('/api/auth/registro-agencia', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al crear la cuenta');
      }

      setSuccess(true);

      // Iniciar sesiu00f3n automau00e1ticamente
      setTimeout(async () => {
        const result = await signIn('credentials', {
          email: values.emailAgencia,
          password: values.password,
          redirect: false,
        });

        if (result?.error) {
          console.error('Error al iniciar sesiu00f3n:', result.error);
          router.push('/login?message=Cuenta+creada+correctamente.+Inicia+sesiu00f3n+para+continuar');
        } else {
          // Redirigir a la pu00e1gina de selecciu00f3n de plan
          router.push('/dashboard/agencia/planes');
        }
      }, 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (value: string) => {
    // Validar campos de la pestau00f1a actual antes de cambiar
    if (activeTab === 'informacion') {
      const { nombreAgencia, emailAgencia, telefonoAgencia, direccion, password, confirmPassword } = form.getValues();
      if (!nombreAgencia || !emailAgencia || !telefonoAgencia || !direccion || !password || !confirmPassword) {
        form.trigger(['nombreAgencia', 'emailAgencia', 'telefonoAgencia', 'direccion', 'password', 'confirmPassword']);
        return;
      }
    }

    setActiveTab(value);
  };

  return (
    <div className="flex min-h-screen justify-center items-center p-4 bg-gray-50 dark:bg-gray-900">
      <Card className="w-full max-w-4xl">
        <CardHeader className="text-center border-b pb-6">
          <CardTitle className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">Registro de Agencia</CardTitle>
          <CardDescription>
            Crea una cuenta de agencia para gestionar mu00faltiples clientes y monitorizar su reputaciu00f3n online
          </CardDescription>
        </CardHeader>
        
        {success ? (
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center text-center p-6">
              <div className="rounded-full bg-green-100 p-3 mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold">u00a1Registro exitoso!</h2>
              <p className="text-gray-600 dark:text-gray-400 mt-2 mb-4">
                Tu cuenta de agencia ha sido creada correctamente. Estamos redirigiu00e9ndote a la pu00e1gina de selecciu00f3n de plan...
              </p>
            </div>
          </CardContent>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
                <CardContent>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="informacion">
                      <Building2 className="mr-2 h-4 w-4" /> 
                      Informaciu00f3n de la Agencia
                    </TabsTrigger>
                    <TabsTrigger value="contacto">
                      <User className="mr-2 h-4 w-4" />
                      Informaciu00f3n de Contacto
                    </TabsTrigger>
                  </TabsList>
                </CardContent>

                <CardContent>
                  {error && (
                    <Alert variant="destructive" className="mb-6">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Error</AlertTitle>
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <TabsContent value="informacion" className="mt-4 space-y-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="nombreAgencia"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nombre de la Agencia*</FormLabel>
                            <FormControl>
                              <Input placeholder="Agencia de Marketing Digital" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="emailAgencia"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email Corporativo*</FormLabel>
                            <FormControl>
                              <Input placeholder="info@tuagencia.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="telefonoAgencia"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Telu00e9fono*</FormLabel>
                            <FormControl>
                              <Input placeholder="+57 300 123 4567" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="sitioWeb"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Sitio Web</FormLabel>
                            <FormControl>
                              <Input placeholder="https://www.tuagencia.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="direccion"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Direcciu00f3n*</FormLabel>
                          <FormControl>
                            <Input placeholder="Calle Principal #123, Ciudad" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Contraseu00f1a*</FormLabel>
                            <FormControl>
                              <Input type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Confirmar Contraseu00f1a*</FormLabel>
                            <FormControl>
                              <Input type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="flex justify-end">
                      <Button 
                        type="button" 
                        onClick={() => handleTabChange('contacto')}
                        className="bg-cyan-600 hover:bg-cyan-700"
                      >
                        Siguiente
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="contacto" className="mt-4 space-y-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="nombreContacto"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nombre*</FormLabel>
                            <FormControl>
                              <Input placeholder="Juan" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="apellidoContacto"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Apellido*</FormLabel>
                            <FormControl>
                              <Input placeholder="Pu00e9rez" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="cargoContacto"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Cargo*</FormLabel>
                            <FormControl>
                              <Input placeholder="Director de Marketing" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="emailContacto"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email de Contacto*</FormLabel>
                            <FormControl>
                              <Input placeholder="juan.perez@tuagencia.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="terminosCondiciones"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>
                              Acepto los <Link href="/terminos" className="text-cyan-600 hover:underline">Tu00e9rminos y Condiciones</Link> y la <Link href="/privacidad" className="text-cyan-600 hover:underline">Polu00edtica de Privacidad</Link>
                            </FormLabel>
                            <FormDescription>
                              Al registrarte, aceptas recibir comunicaciones sobre tu cuenta y nuestros servicios.
                            </FormDescription>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex justify-between pt-4">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => handleTabChange('informacion')}
                      >
                        Atru00e1s
                      </Button>
                      <Button 
                        type="submit" 
                        disabled={loading}
                        className="bg-cyan-600 hover:bg-cyan-700"
                      >
                        {loading ? 'Registrando...' : 'Completar Registro'}
                      </Button>
                    </div>
                  </TabsContent>
                </CardContent>
              </Tabs>
            </form>
          </Form>
        )}
        
        <CardFooter className="flex justify-center border-t pt-6">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            u00bfYa tienes una cuenta? <Link href="/login" className="text-cyan-600 hover:underline">Inicia sesiu00f3n</Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
