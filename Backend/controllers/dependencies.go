package controllers

import (
	"github.com/redis/go-redis/v9"
	"multicatalogo-backend/repository"
)

var dataRepository *repository.Repository
var cacheClient *redis.Client

func SetRepository(repo *repository.Repository) {
	dataRepository = repo
}

func SetCache(client *redis.Client) {
	cacheClient = client
}
