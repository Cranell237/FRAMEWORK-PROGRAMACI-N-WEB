// Seguimos dentro del paquete controllers, ya que maneja la lógica de otra sección del negocio.
package controllers

import (
	"errors"
	// Importamos strconv para convertir el parámetro de ruta (texto) a número entero de forma segura.
	"strconv"

	// Importamos Fiber para manejar la respuesta HTTP.
	"github.com/gofiber/fiber/v2"
	"github.com/jackc/pgx/v5"
	// Importamos nuestro paquete de modelos para usar la estructura Producto.
	"multicatalogo-backend/models"
)

// GetProductos es la función controladora encargada de devolver el catálogo de artículos.
func GetProductos(c *fiber.Ctx) error {
	productos, err := dataRepository.ObtenerProductos(c.UserContext())
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(models.APIError{
			Status:  fiber.StatusInternalServerError,
			Message: "No se pudieron consultar los productos",
		})
	}
	return c.JSON(productos)
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

	producto, err := dataRepository.ObtenerProductoPorID(c.UserContext(), id)
	if errors.Is(err, pgx.ErrNoRows) {
		return c.Status(fiber.StatusNotFound).JSON(models.APIError{
			Status:  fiber.StatusNotFound,
			Message: "Producto no encontrado",
			Details: fiber.Map{"id": id},
		})
	}
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(models.APIError{
			Status:  fiber.StatusInternalServerError,
			Message: "No se pudo consultar el producto",
		})
	}
	return c.JSON(producto)
}
