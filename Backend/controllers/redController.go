package controllers

import (
	"github.com/gofiber/fiber/v2"
	"multicatalogo-backend/models"
)

func GetRed(c *fiber.Ctx) error {
	red, err := dataRepository.ObtenerRed(c.UserContext())
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(models.APIError{
			Status:  fiber.StatusInternalServerError,
			Message: "No se pudo consultar la red de referidos",
		})
	}
	return c.JSON(red)
}
