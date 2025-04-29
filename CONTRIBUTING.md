# Guía de Contribución al Proyecto: Centro de Eventos (BugBusters)
 
Para mantener una estructura de trabajo limpia y organizada, por favor sigue estas pautas.

---

##  Reglas Generales

- **No** hacer `push` directo a la rama `main`.
- Todo cambio debe realizarse a través de un **Merge Request** (MR) hacia `devBranch`.
- Sigue el estilo de codificación y estructura definida en el proyecto.
- Toda nueva funcionalidad debe estar probada antes de solicitar un Merge Request.

---

##  Convenciones de Nombres y Estilo

1. **Funciones y Métodos:**
   - Usar **camelCase**.
   - Ejemplo: `calcularPrecioTotal()`

2. **Variables Locales:**
   - Usar **camelCase**.
   - Ejemplo: `numeroDeUsuarios`
   - **Constantes**: Usar **UPPER_SNAKE_CASE**.
   - Ejemplo: `MAX_WIDTH`

3. **Clases:**
   - Usar **PascalCase**.
   - Ejemplo: `ReservaDeSala`

4. **Archivos y Carpetas:**
   - Usar **kebab-case**.
   - Ejemplo: `reservar-sala.js`, `gestionar-reservas/`

---

##  Flujo de Trabajo de Git

1. **Actualizar `devBranch` antes de comenzar**:
   ```bash
   git checkout devBranch
   git pull origin devBranch
2. **Crear una nueva rama para tu tarea o bugfix**:
   ```bash
   git checkout -b feature/nombre-del-feature

o para bugs:
    ```bash
    git checkout -b fix/nombre-del-feature

3. **Realizar cambios, probar y hacer commit:**:
   ```bash
    git add .
    git commit -m "Descripción breve del cambio"
4. **Subir tu rama:**
    git push origin feature/nombre-del-feature
5. **Crear Merge Request desde `feature/` hacia `devBranch`.**

## Convención de nombres de ramas
Usamos el siguiente formato:
| Tipo                                            | Prefijo     | Ejemplo                       |
|-------------------------------------------------|-------------|-------------------------------|
| Nueva funcionalidad                             | `feature/`  | `feature/reserva-online`     |
| Corrección de errores                           | `fix/`      | `fix/validacion-telefono`    |
| Mejoras no funcionales (documentación, refactor, etc.) | `chore/`    | `chore/actualizar-readme`    |

## Estilo de commits
### Los mensajes de commit deben seguir la convención:

` <tipo>: <descripción breve>` 

### Tipos más comunes de Commits

| Tipo       | Descripción                                                                  |
|------------|-------------------------------------------------------------------------------|
| `feat`     | Nueva funcionalidad.                                                         |
| `fix`      | Corrección de bug.                                                           |
| `docs`     | Cambios en documentación.                                                    |
| `style`    | Cambios de formato (espacios, indentación), sin cambios de lógica/código.     |
| `refactor` | Cambios en el código que no corrigen bugs ni agregan nuevas funcionalidades.  |
| `test`     | Agregar o corregir pruebas.                                                  |
| `chore`    | Mantenimiento (actualización de paquetes, scripts, configuración, etc).      |


**Ejemplos:**
   ```bash
    feat: agregar formulario de cotización
    fix: corregir error en validación de correo
    docs: actualizar sección de instalación en README
    refactor: reorganizar componentes comunes
```
--- 

## Revisión de Código
Antes de enviar un Merge Request asegúrate de:

- El código compila y corre correctamente.

- No hay console.log innecesarios.

- Estás enviando solo cambios relacionados a tu tarea.

- Documentaste nuevas funciones/métodos si es necesario.

- Seguiste las convenciones del equipo.

---
¡Gracias por ser un super team! 