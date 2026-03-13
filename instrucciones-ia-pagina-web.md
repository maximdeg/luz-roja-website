## Instrucciones para IA – Sitio Web Luz Roja

### Objetivo general

Crear un sitio web **minimalista**, **moderno** y **responsivo** para la marca Luz Roja, usando la paleta de colores, tipografías y tono de marca definidos en `instructions.md`. El sitio debe transmitir creatividad, autenticidad y profesionalismo, con **animaciones creativas pero sutiles**, que no distraigan del contenido.

- **Framework obligatorio**: construir todo el sitio usando **Next.js 15** (App Router, componentes funcionales y buenas prácticas modernas de React).
- **Logos e imágenes de marca**: usar la carpeta `logos` del proyecto como fuente principal de logos e isotipos (importarlos desde ahí en los componentes que los requieran).

### Lineamientos de marca (obligatorios)

- **Paleta de colores** (usar como base del diseño):
  - Fondo principal: `#161616`
  - Color acento marca: `#AB0F08`
  - Grises de apoyo: `#6A6969`, `#AEAEAF`, `#D8D7D7`
  - Texto sobre fondos oscuros: `#FFFFFF`
  - Acento ocasional: `#FFC900` (usar con moderación, solo para detalles importantes).
- **Tipografías**:
  - Títulos y destacados: `Montserrat`, sans-serif.
  - Cuerpo de texto y párrafos: `Hind`, sans-serif.
- **Estilo visual**:
  - Diseño **minimalista**: mucho espacio en blanco/negro, pocas líneas, sin recargos.
  - Usar **contraste fuerte** entre fondos oscuros y textos claros.
  - Imágenes o ilustraciones (si se usan) deben ser limpias, con encuadres tipo fotografía/editorial.

### Comportamiento general del sitio

- **Sitio responsivo**:
  - Debe verse y funcionar bien en mobile, tablet y desktop.
  - Usar layout con **mobile-first** (diseñar primero para pantallas pequeñas).
- **Navegación principal (header)**:
  - Logo o texto “Luz Roja Contenidos” a la izquierda.
  - Menú con enlaces a:
    - Home
    - Cositas gratis
    - Contacto

  - En escritorio: menú horizontal.
  - En mobile: menú tipo hamburguesa con animación simple de apertura/cierre.
- **Footer**:
  - Incluir enlaces de texto a:
    - Términos y Condiciones
    - Políticas de Privacidad
  - Breve texto de copyright y nombre de la marca.

### Estilo de animaciones

- **Carácter general**:
  - Animaciones **suaves**, **cortas** (200–500 ms) y **con intención**.
  - Utilizar transiciones en opacidad, escala mínima y movimientos ligeros.
  - Evitar animaciones exageradas (rebotes fuertes, giros constantes, parpadeos).
- **Ejemplos de uso**:
  - Entrada suave (fade-in + leve slide) de secciones al hacer scroll.
  - Hover en botones: cambio de color + ligera elevación (shadow/translateY).
  - Títulos principales con un subrayado animado o barra roja que se despliega.

---

### Página: Home

La página Home debe incluir al menos estas secciones:

#### 1. Sección Presentación (hero principal)

- **Objetivo**: Presentar rápidamente quiénes son y qué hacen, con una sensación cinematográfica/minimalista.
- **Contenido mínimo**:
  - Título principal corto (ejemplo orientativo, la IA puede mejorarlo pero manteniendo el tono):
    - “Encendemos la luz roja para contar historias que importan.”
  - Subtítulo o descripción breve (1–3 líneas) que resuma la propuesta: creación de contenido, storytelling, construcción de marca/comunidad.
  - Botón principal (CTA) que lleve a la sección de **Servicios** o a **Contacto** (decidir uno y destacarlo).
- **Diseño y animación**:
  - Fondo oscuro (`#161616`) con algún detalle en `#AB0F08` (línea, borde, acento).
  - Título con tipografía `Montserrat`, gran tamaño, alineado al centro o izquierda.
  - Animación de entrada: texto aparece con fade-in + ligera traslación desde abajo.

#### 2. Sección Servicios

- **Objetivo**: Mostrar de forma clara y simple qué ofrece Luz Roja.
- **Contenido mínimo**:
  - Título de sección (ej: “Servicios”).
  - 3–6 bloques de servicio, cada uno con:
    - Título corto.
    - Descripción de 1–2 frases.
  - Se puede incluir un botón “Ver más” o “Hablemos de tu proyecto” que lleve a **Contacto**.
- **Diseño y animación**:
  - Layout en cards o columnas, que en mobile se apilen una debajo de otra.
  - Cada card con borde o fondo ligeramente contrastado (usar grises y el rojo como acento).
  - Animación al hacer hover: elevación suave + borde o sombra con `#AB0F08`.

---

### Página: Cositas gratis

- **Objetivo**: Espacio de recursos gratuitos (plantillas, guías, descargables, etc.) que refuerzan el valor de la marca.
- **Contenido mínimo**:
  - Título de página (ej: “Cositas gratis”).
  - Texto breve explicando que son recursos gratuitos para ayudar a marcas/creadores.
  - Listado de recursos:
    - Cada recurso en un bloque con:
      - Título.
      - Breve descripción.
      - Acción: botón o enlace (descargar, ver online, etc.). Si no hay links reales, usar botones deshabilitados o texto de ejemplo.
- **Diseño y animación**:
  - Mantener estilo minimalista, con cards ordenadas en grid responsivo.
  - Animación al hacer scroll: los recursos aparecen con un ligero delay uno tras otro.

---

### Página: Contacto

- **Objetivo**: Facilitar el contacto directo, con un formulario simple y claro.
- **Contenido mínimo**:
  - Título de página (ej: “Contacto” o “Hablemos”).
  - Texto corto invitando a escribir.
  - Formulario con campos:
    - Nombre
    - Email
    - Mensaje
  - Botón de envío destacado (color `#AB0F08` con hover animado).
- **Comportamiento**:
  - La IA puede dejar la integración real del formulario como comentario (por ejemplo, usando un endpoint ficticio o solo validación en front).
  - Validación básica en front-end: campos requeridos y email con formato válido.

---

### Página: Términos y Condiciones

- **Objetivo**: Mostrar texto legal de forma legible y ordenada.
- **Contenido mínimo**:
  - Título: “Términos y Condiciones”.
  - Texto estructurado en secciones (puede usar títulos tipo: “Uso del sitio”, “Propiedad intelectual”, etc.).
  - Párrafos cortos para facilitar la lectura.
- **Diseño**:
  - Fondo claro oscuro suave (por ejemplo gris muy oscuro) y texto claro.
  - Anclas internas opcionales (índice al inicio para saltar a cada sección).

---

### Página: Políticas de Privacidad

- **Objetivo**: Explicar cómo se manejan los datos de los usuarios.
- **Contenido mínimo**:
  - Título: “Políticas de Privacidad”.
  - Secciones sugeridas:
    - Datos que se recopilan.
    - Uso de la información.
    - Cookies (si aplica).
    - Derechos del usuario.
    - Contacto para dudas sobre privacidad.
- **Diseño**:
  - Similar a Términos y Condiciones, priorizando legibilidad.

---

### Recomendaciones técnicas para la IA (opcional pero deseado)

- **Stack tecnológico (obligatorio)**:
  - Usar **Next.js 15** como base del proyecto.
  - Aprovechar el enrutado de páginas de Next para crear:
    - `/` → Home
    - `/cositas-gratis`
    - `/contacto`
    - `/terminos-y-condiciones`
    - `/politicas-de-privacidad`
  - Utilizar componentes reutilizables para `Header`, `Footer` y cada sección principal.
- **Buenas prácticas**:
  - Mantener componentes separados para header, footer y cada sección principal.
  - Usar variables CSS para colores y tipografías.
  - Optimizar animaciones usando `transform` y `opacity` para mejor rendimiento.

---

### Tono de texto

- Lenguaje en **español**, cercano pero profesional.
- Inspirado en la historia y misión de la marca:
  - Hablar de “encender la luz roja”, “contar historias”, “construir comunidades”, “contenido auténtico y creativo”.
- Evitar jerga técnica excesiva; priorizar claridad y calidez.
