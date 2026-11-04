# Aprendizajes y limitaciones — BugLab

## Contexto

BugLab fue construido como un **MVP para la BRODT Hackathon 2026** (track *Future of Education*). Su propósito era demostrar una experiencia de aprendizaje de debugging con tres casos contextualizados, no ofrecer una plataforma de ejecución de código a escala de producción.

El equipo recibió observaciones técnicas de los jurados. Esta página registra lo que se identificó y las decisiones tomadas para el cierre del prototipo. **Documentar un riesgo no significa que haya sido corregido.**

## Hallazgos y limitaciones conocidas

| Área | Observación | Estado al documentar |
| --- | --- | --- |
| Protección de la API | El servidor utiliza `cors()` sin restringir orígenes y no se verificó un límite de solicitudes al endpoint de validación | Pendiente; no exponer públicamente |
| Recursos | No se ha verificado un límite global de ejecuciones Docker concurrentes | Pendiente; no exponer públicamente |
| Pruebas | Los jurados recomendaron sustituir pruebas insuficientes por pruebas reales del runner y del ciclo de validación | Pendiente de auditoría |
| Transporte | La documentación original enlazaba a una demo con HTTP | La demo se retirará; no se anuncia un servicio público |
| Documentación | La arquitectura contenía una ruta de API obsoleta y el README enlazaba a un PDF no disponible | Corregido en la rama de documentación |

El runner ya contiene controles parciales, como listas permitidas de archivos, comprobación de rutas y límites de tiempo. **Estos controles no constituyen una garantía integral de aislamiento.**

## Decisión de cierre

Se conservará el código y la documentación como proyecto educativo y de portafolio, sin mantener el endpoint de ejecución disponible públicamente. No se planifica ampliar el MVP con cuentas, base de datos, más lenguajes o funcionalidades comerciales.

Si en el futuro se decide reactivar el servicio, será necesario revisar como mínimo:

1. Limitación de solicitudes y concurrencia de validaciones.
2. Seguridad de los contenedores, permisos, aislamiento, recursos y limpieza.
3. Pruebas automatizadas confiables del runner, incluyendo fallos, tiempos de espera y límites.
4. HTTPS, configuración de CORS, manejo de errores y secretos.
5. Verificación de extremo a extremo antes de publicar.

## Qué aprendimos

- Validar el **comportamiento esperado** ayuda a admitir más de una solución correcta a un desafío.
- La ejecución de código ajeno introduce riesgos operativos que no desaparecen por usar Docker.
- La seguridad y las pruebas de la propia plataforma importan tanto como una demo funcional.
- Reducir el alcance a tres casos permitió desarrollar y presentar una experiencia coherente dentro de la hackathon.

## Nota sobre versiones

Los cambios de documentación posteriores a la hackathon no deben confundirse con la entrega evaluada por el jurado. El historial de Git conserva la evolución del repositorio.
