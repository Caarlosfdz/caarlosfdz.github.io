/**
 * Datos de contacto. Es el ÚNICO sitio donde se editan.
 * Mientras un campo esté vacío ("") su botón o icono no se muestra.
 *
 *  email      → tu correo, p. ej. "hola@tudominio.es"
 *  whatsapp   → número con prefijo y sin signos, p. ej. "34600111222"
 *  instagram  → solo el usuario, sin @ ni URL, p. ej. "tuusuario"
 */
export const contacto = {
  email: '',
  whatsapp: '34644028761',
  instagram: '',
};

/** Mensaje que llega escrito cuando alguien pulsa el botón de WhatsApp. */
export const mensajeWhatsapp = 'Hola Carlos, he visto tu portfolio y me gustaría hablar contigo.';

/** Enlace del botón principal. Sin WhatsApp, lleva a la sección de contacto. */
export const enlacePrincipal = contacto.whatsapp
  ? `https://wa.me/${contacto.whatsapp}?text=${encodeURIComponent(mensajeWhatsapp)}`
  : '#contacto';

export const enlaceEmail = contacto.email ? `mailto:${contacto.email}` : '';
export const enlaceInstagram = contacto.instagram ? `https://instagram.com/${contacto.instagram}` : '';
