package controllers

import (
	"fmt"
	"strings"
	"time"

	"github.com/gofiber/fiber/v2"
	"multicatalogo-backend/models"
)

const redCacheTTL = 10 * time.Minute

func GetRed(c *fiber.Ctx) error {
	ctx := c.UserContext()
	email := strings.ToLower(strings.TrimSpace(c.Get("X-User-Email")))
	if email == "" {
		email = "anonimo"
	}
	cacheKey := fmt.Sprintf("red:tree:%s", email)

	var red *models.Referido
	hit, cacheErr := readCacheJSON(ctx, cacheKey, &red)
	if cacheErr == nil && hit {
		c.Set(cacheHeader, "HIT")
		return c.JSON(red)
	}
	if cacheErr != nil {
		c.Set(cacheHeader, "BYPASS")
	} else {
		c.Set(cacheHeader, "MISS")
	}

	red, err := dataRepository.ObtenerRed(ctx)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(models.APIError{
			Status:  fiber.StatusInternalServerError,
			Message: "No se pudo consultar la red de referidos",
		})
	}
	if err := writeCacheJSON(ctx, cacheKey, red, redCacheTTL); err != nil {
		c.Set(cacheHeader, "BYPASS")
	}
	return c.JSON(red)
}
