export const prerender = false;

import { Resend } from 'resend';
import type { APIRoute } from 'astro';

const resend = new Resend(import.meta.env.RESEND_API_KEY);

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json(); // aquí es donde el error ocurría
    const { nombre, email, mensaje } = data;

    if (!nombre || !email || !mensaje) {
      return new Response(JSON.stringify({ success: false, error: 'Campos incompletos' }), { status: 400 });
    }

    await resend.emails.send({
      from: 'Core-X <onboarding@resend.dev>',
      to: 'contacto@core-x.lat',
      subject: `Nuevo mensaje de contacto de ${nombre}`,
      html: `
        <h2>Nuevo mensaje desde el sitio web</h2>
        <p><strong>Nombre:</strong> ${nombre}</p>
        <p><strong>Correo:</strong> ${email}</p>
        <p><strong>Mensaje:</strong></p>
        <p>${mensaje}</p>
      `,
    });

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error('Error enviando correo:', error);
    return new Response(JSON.stringify({ success: false, error: String(error) }), { status: 500 });
  }
};
