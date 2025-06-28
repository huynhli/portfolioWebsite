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

func main() {
	fmt.Println("running main")

	// connect to cloud
	config.LoadConfig()
	config.InitCloudinary()

	// connect to db
	database.ConnectMongoDB()
	defer database.DisconnectMongoDB()

	// Set port from env var
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080" // Default to 8080 if PORT is not set
	}

	// create new Fiber app
	app := fiber.New()

	// enable CORS to allow requests to backend
	SetupCors(app)

	// setup routing
	routes.SetupRoutes(app)

	// port listen and serve
	err := app.Listen(":" + port)
	if err != nil {
		fmt.Println("Error starting server: ", err)
	}
}

func SetupCors(app *fiber.App) {
	app.Use(cors.New(cors.Config{
		AllowOrigins: "https://liamhuynh.pages.dev/, http://localhost:5173",
		AllowMethods: "GET,POST,PUT,DELETE",                         // Allowed methods
		AllowHeaders: "Origin, Content-Type, Accept, Authorization", // Allowed headers
	}))
}
