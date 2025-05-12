package main

import (
	"fmt"
	"os"
	"portfolioWebsite/backend/config"
	"portfolioWebsite/backend/database"
	"portfolioWebsite/backend/routes"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
)

func init() {
	config.LoadConfig()
}

func main() {

	//Set port from env var
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080" // Default to 8080 if PORT is not set
	}

	database.ConnectMongoDB()
	defer database.DisconnectMongoDB()

	//create new Fiber app
	app := fiber.New()

	//enable CORS to allow requests to backend
	SetupCors(app)

	//routing
	routes.SetupRoutes(app)

	//port listen and serve
	err := app.Listen(":" + port)
	if err != nil {
		fmt.Println("Error starting server: ", err)
	}
}

func SetupCors(app *fiber.App) {
	app.Use(cors.New(cors.Config{
		AllowOrigins: "*",                            // TODO change after frontend hosted
		AllowMethods: "GET,POST,PUT,DELETE",          // Allowed methods
		AllowHeaders: "Origin, Content-Type, Accept", // Allowed headers
	}))
}
