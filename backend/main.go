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
	config.LoadConfig()
	config.InitCloudinary()
	database.ConnectMongoDB()
	defer database.DisconnectMongoDB()

	//Set port from env var
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080" // Default to 8080 if PORT is not set
	}

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
		AllowOrigins: "https://liamhuynh.pages.dev/",
		AllowMethods: "GET,POST,PUT,DELETE",          // Allowed methods
		AllowHeaders: "Origin, Content-Type, Accept", // Allowed headers
	}))
}
