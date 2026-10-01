// Declaramos el paquete models para agrupar las estructuras de datos de la aplicación.
package models

// LoginRequest define la estructura esperada para el cuerpo de la petición (JSON) al iniciar sesión.
type LoginRequest struct {
	// Email representa el correo del usuario; la etiqueta `json:"email"` indica cómo se mapea el JSON a esta variable.
	Email    string `json:"email"`
	// Password representa la contraseña del usuario; se extrae del campo "password" del JSON entrante.
	Password string `json:"password"`
}

// APIError estandariza la forma de TODAS las respuestas de error HTTP de la API.
// Tener una estructura única hace que el frontend (o Postman) reciba siempre el mismo
// formato predecible cuando algo sale mal, en lugar de mensajes sueltos y distintos.
type APIError struct {
	// Status es el código HTTP del error (ej. 400, 401, 404). Se mapea al campo "status" del JSON.
	Status int `json:"status"`
	// Message es la descripción legible del error. Se mapea al campo "message" del JSON.
	Message string `json:"message"`
	// Details es información adicional y OPCIONAL sobre el error (ej. qué campo falló).
	// `omitempty` hace que, si está vacío/nil, el campo "details" ni siquiera aparezca en el JSON.
	Details interface{} `json:"details,omitempty"`
}

// Producto define la estructura de los datos de un artículo en nuestro catálogo.
type Producto struct {
	// ID es el identificador único numérico del producto.
	ID     int     `json:"id"`
	// Nombre es la descripción en texto del producto.
	Nombre string  `json:"nombre"`
	// Precio es el costo del producto, almacenado como un número con decimales (float64).
	Precio float64 `json:"precio"`
	// Img es la URL o ruta que apunta a la fotografía o imagen del producto.
	Img    string  `json:"img"`
}