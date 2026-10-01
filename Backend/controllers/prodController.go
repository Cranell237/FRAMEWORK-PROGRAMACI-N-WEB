// Seguimos dentro del paquete controllers, ya que maneja la lógica de otra sección del negocio.
package controllers

import (
	// Importamos strconv para convertir el parámetro de ruta (texto) a número entero de forma segura.
	"strconv"

	// Importamos Fiber para manejar la respuesta HTTP.
	"github.com/gofiber/fiber/v2"
	// Importamos nuestro paquete de modelos para usar la estructura Producto.
	"multicatalogo-backend/models"
)

// catalogo es el origen de datos (hardcodeado por ahora) del catálogo de productos.
// Lo declaramos a nivel de paquete para REUTILIZARLO tanto en GetProductos como en GetProductoPorID,
// evitando duplicar la lista. Cuando migremos a persistencia relacional, solo se cambia esta fuente.
var catalogo = []models.Producto{
	// Agregamos el primer producto con sus respectivos valores para ID, Nombre, Precio e Img.
	{ID: 1, Nombre: "Serum Revitalizante", Precio: 45.00, Img: "https://picsum.photos/seed/serum/150"},
	// Agregamos el segundo producto a la lista.
	{ID: 2, Nombre: "Crema Hidratante Pro", Precio: 32.50, Img: "https://picsum.photos/seed/crema/150"},
	// Agregamos el tercer producto a la lista.
	{ID: 3, Nombre: "Tónico Purificante", Precio: 28.00, Img: "https://picsum.photos/seed/tonico/150"},
	// Agregamos el cuarto producto a la lista.
	{ID: 4, Nombre: "Mascarilla Nocturna", Precio: 50.00, Img: "https://picsum.photos/seed/mascarilla/150"},
}

// GetProductos es la función controladora encargada de devolver el catálogo de artículos.
func GetProductos(c *fiber.Ctx) error {
	// Fiber convierte automáticamente el slice de estructuras a formato JSON y lo envía como respuesta al cliente.
	return c.JSON(catalogo)
}

// GetProductoPorID devuelve un único producto buscándolo por el ID recibido en la URL (ej. /api/productos/2).
func GetProductoPorID(c *fiber.Ctx) error {
	// c.Params("id") devuelve el parámetro de la ruta SIEMPRE como texto (string).
	// strconv.Atoi intenta convertir ese texto a un entero; si el usuario envía algo que no es número
	// (ej. "abc"), err será distinto de nil y debemos responder con un error controlado.
	id, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		// El ID no es un número válido: respondemos HTTP 400 (Bad Request) con la estructura estándar APIError.
		return c.Status(fiber.StatusBadRequest).JSON(models.APIError{
			Status:  fiber.StatusBadRequest,
			Message: "El ID del producto debe ser un número entero válido",
			Details: fiber.Map{"id_recibido": c.Params("id")},
		})
	}

	// Recorremos el catálogo buscando el producto cuyo ID coincida con el solicitado.
	for _, p := range catalogo {
		if p.ID == id {
			// Encontrado: devolvemos ese producto como JSON (HTTP 200 por defecto).
			return c.JSON(p)
		}
	}

	// Si terminamos el recorrido sin coincidencias, el producto no existe: respondemos HTTP 404 (Not Found).
	return c.Status(fiber.StatusNotFound).JSON(models.APIError{
		Status:  fiber.StatusNotFound,
		Message: "Producto no encontrado",
		Details: fiber.Map{"id": id},
	})
}