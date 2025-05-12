package routes

import (
	"portfolioWebsite/backend/handlers"

	"github.com/gofiber/fiber/v2"
)

func SetupRoutes(app *fiber.App) {
	app.Get("/", homePage)
	app.Get("/api/articles", handlers.GetAllArticles)
}

func homePage(c *fiber.Ctx) error {
	return c.SendString("This is the homepage of the backend of my portfolio website. The Github repo can be found at: https://github.com/huynhli")
}
