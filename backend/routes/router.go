package routes

import (
	"portfolioWebsite/backend/handlers"

	"github.com/gofiber/fiber/v2"
)

func SetupRoutes(app *fiber.App) {
	app.Get("/", homePage)
	app.Get("/api/articleBanners", handlers.GetAllArticleBanners)
	app.Get("/api/article", handlers.GetArticleWithTitle)
	app.Post("/api/addArticle", handlers.AddArticle)
	app.Post("/api/deleteArticle", handlers.DeleteArticleById)
	app.Post("/api/uploadImage", handlers.UploadImage)
	app.Post("/api/deleteImage", handlers.DeleteImage)
}

func homePage(c *fiber.Ctx) error {
	return c.SendString("This is the homepage of the backend of my portfolio website. The Github repo can be found at: https://github.com/huynhli")
}
