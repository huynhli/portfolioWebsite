package config

import (
	"fmt"
	"log"
	"os"

	"github.com/cloudinary/cloudinary-go/v2"
	"github.com/joho/godotenv"
)

var (
	DB_USERNAME string
	DB_PASSWORD string
)

var Cloudinary *cloudinary.Cloudinary

func LoadConfig() {
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, relying on environment variables")
	}

	DB_USERNAME = os.Getenv("DB_USERNAME")
	DB_PASSWORD = os.Getenv("DB_PASSWORD")
}

func InitCloudinary() {
	cloud, err := cloudinary.NewFromParams(
		os.Getenv("CLOUD_NAME"),
		os.Getenv("CLOUD_API_KEY"),
		os.Getenv("CLOUD_API_SECRET"),
	)

	if err != nil {
		log.Fatalf("Cloudinary init failed %f, ", err)
	}

	Cloudinary = cloud
	fmt.Println("Cloudinary initialized.")
}
