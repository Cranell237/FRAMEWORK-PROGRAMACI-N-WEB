// Seguimos dentro del paquete controllers; este archivo maneja el "chequeo de salud" del servidor.
package controllers

import (
	// Importamos Fiber para construir la respuesta HTTP.
	"github.com/gofiber/fiber/v2"
)

// HealthCheck es un endpoint simple que confirma que el servidor está vivo y respondiendo.
// Es una práctica común (health check) para que monitoreo, balanceadores o el propio frontend
// puedan verificar rápidamente si el backend está operativo.
func HealthCheck(c *fiber.Ctx) error {
	// Devolvemos HTTP 200 (OK) con un JSON simple e informativo sobre el estado del servicio.
	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"status":  "ok",
		"message": "Servidor Go/Fiber operativo",
	})
}
