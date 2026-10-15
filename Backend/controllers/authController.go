// Declaramos el paquete controllers para agrupar las funciones que manejan la lógica de negocio de las rutas.
package controllers

import (
	"errors"

	// Importamos el framework Fiber para tener acceso al contexto (c *fiber.Ctx) de la petición HTTP.
	"github.com/gofiber/fiber/v2"
	"github.com/jackc/pgx/v5"
	// Importamos nuestro paquete de modelos para poder usar la estructura LoginRequest.
	"multicatalogo-backend/models"
)

// Login es la función controladora que se ejecutará cuando el cliente envíe sus credenciales.
func Login(c *fiber.Ctx) error {
	// Creamos una variable 'req' del tipo LoginRequest (ubicada en nuestro paquete models) para almacenar los datos.
	var req models.LoginRequest

	// Intentamos parsear (transformar) el cuerpo JSON entrante y guardarlo en la variable 'req'.
	if err := c.BodyParser(&req); err != nil {
		// Si ocurre un error al parsear (ej. JSON mal formado), retornamos un HTTP 400 con la estructura estándar APIError.
		return c.Status(fiber.StatusBadRequest).JSON(models.APIError{
			Status:  fiber.StatusBadRequest,
			Message: "Cuerpo de petición inválido",
		})
	}

	// VALIDACIÓN DE ENTRADA: antes de comparar credenciales, exigimos que email y password no vengan vacíos.
	// Esto evita procesar peticiones incompletas y devuelve un error claro y estandarizado al cliente.
	if req.Email == "" || req.Password == "" {
		// Armamos un mapa con el detalle de qué campo(s) faltan, para ayudar a quien consume la API.
		faltantes := fiber.Map{
			"email":    req.Email == "",
			"password": req.Password == "",
		}
		// Retornamos un HTTP 400 (Bad Request) usando APIError, incluyendo los detalles de los campos faltantes.
		return c.Status(fiber.StatusBadRequest).JSON(models.APIError{
			Status:  fiber.StatusBadRequest,
			Message: "Los campos email y password son obligatorios",
			Details: faltantes,
		})
	}

	usuario, err := dataRepository.BuscarUsuarioPorCredenciales(c.UserContext(), req.Email, req.Password)
	if errors.Is(err, pgx.ErrNoRows) {
		return c.Status(fiber.StatusUnauthorized).JSON(models.APIError{
			Status:  fiber.StatusUnauthorized,
			Message: "Credenciales incorrectas",
		})
	}
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(models.APIError{
			Status:  fiber.StatusInternalServerError,
			Message: "No se pudo consultar el usuario",
		})
	}

	// El token sigue siendo ficticio durante esta fase; el rol y la identidad vienen de PostgreSQL.
	token := "fake-jwt-token-456"
	if usuario.Rol == "admin" {
		token = "fake-jwt-token-123"
	}
	return c.JSON(fiber.Map{"token": token, "email": usuario.Email, "rol": usuario.Rol})
}
