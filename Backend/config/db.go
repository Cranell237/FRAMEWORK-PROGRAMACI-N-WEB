package config

import (
	"context"
	"fmt"
	"net"
	"net/url"
	"os"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/joho/godotenv"
)

// Connect abre un pool y comprueba que PostgreSQL acepte conexiones.
func Connect() (*pgxpool.Pool, error) {
	// Las variables del entorno tienen prioridad sobre el archivo local.
	_ = godotenv.Load()

	for _, key := range []string{"POSTGRES_USER", "POSTGRES_PASSWORD", "POSTGRES_DB", "POSTGRES_PORT", "DB_HOST"} {
		if os.Getenv(key) == "" {
			return nil, fmt.Errorf("falta la variable de entorno %s", key)
		}
	}

	connectionURL := &url.URL{
		Scheme: "postgres",
		User:   url.UserPassword(os.Getenv("POSTGRES_USER"), os.Getenv("POSTGRES_PASSWORD")),
		Host:   net.JoinHostPort(os.Getenv("DB_HOST"), os.Getenv("POSTGRES_PORT")),
		Path:   os.Getenv("POSTGRES_DB"),
	}
	params := connectionURL.Query()
	sslmode := os.Getenv("DB_SSLMODE")
	if sslmode == "" {
		sslmode = "disable"
	}
	params.Set("sslmode", sslmode)
	connectionURL.RawQuery = params.Encode()

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	pool, err := pgxpool.New(ctx, connectionURL.String())
	if err != nil {
		return nil, fmt.Errorf("configurar PostgreSQL: %w", err)
	}
	if err := pool.Ping(ctx); err != nil {
		pool.Close()
		return nil, fmt.Errorf("conectar con PostgreSQL: %w", err)
	}
	return pool, nil
}
