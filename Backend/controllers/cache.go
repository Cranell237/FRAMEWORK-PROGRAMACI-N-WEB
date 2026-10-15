package controllers

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"time"

	"github.com/redis/go-redis/v9"
)

const cacheHeader = "X-Cache"

func readCacheJSON(ctx context.Context, key string, destination any) (bool, error) {
	if cacheClient == nil {
		return false, fmt.Errorf("cliente Redis no configurado")
	}

	payload, err := cacheClient.Get(ctx, key).Bytes()
	if errors.Is(err, redis.Nil) {
		return false, nil
	}
	if err != nil {
		return false, err
	}
	if err := json.Unmarshal(payload, destination); err != nil {
		_ = cacheClient.Del(ctx, key).Err()
		return false, fmt.Errorf("deserializar clave %s: %w", key, err)
	}
	return true, nil
}

func writeCacheJSON(ctx context.Context, key string, value any, ttl time.Duration) error {
	if cacheClient == nil {
		return fmt.Errorf("cliente Redis no configurado")
	}

	payload, err := json.Marshal(value)
	if err != nil {
		return err
	}
	return cacheClient.Set(ctx, key, payload, ttl).Err()
}
