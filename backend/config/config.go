package config

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

var (
	DB_USERNAME string
	DB_PASSWORD string
)

func LoadConfig() {
	if err := godotenv.Load(); err != nil {
		log.Fatal("Error loading .env file")
	}

	DB_USERNAME = os.Getenv("DB_USERNAME")
	DB_PASSWORD = os.Getenv("DB_PASSWORD")
}
