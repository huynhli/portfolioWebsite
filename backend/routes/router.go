package routes

import (
	"backend/handlers"
	"os"
	"strings"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
)

func SetupRoutes(app *fiber.App) {
	app.Get("/", homePage)

	// API version prefix
	api := app.Group("/api/v1")

	// Article routes - RESTful resource-based
	articles := api.Group("/articles")
	articles.Get("/", handlers.GetAllArticleBanners)                     // GET /api/v1/articles
	articles.Get("/:id", handlers.GetArticleWithID)                      // GET /api/v1/articles/:id
	articles.Post("/", JWTMiddleware(), handlers.AddArticle)             // POST /api/v1/articles
	articles.Delete("/:id", JWTMiddleware(), handlers.DeleteArticleById) // DELETE /api/v1/articles/:id

	// Project routes
	projects := api.Group("/projects")
	projects.Get("/", handlers.GetProjects) // GET /api/v1/projects

	// Image routes - RESTful resource-based
	images := api.Group("/images")
	images.Get("/", handlers.GetImageMetaDatasFromDBCloud)    // GET /api/v1/images
	images.Post("/", JWTMiddleware(), handlers.UploadImage)   // POST /api/v1/images
	images.Delete("/", JWTMiddleware(), handlers.DeleteImage) // DELETE /api/v1/images (with public_id in body)

	// Authentication routes - nested resource
	auth := api.Group("/auth")
	github := auth.Group("/github")
	github.Get("/login", handlers.GithubLogin)       // GET /api/v1/auth/github/login
	github.Get("/callback", handlers.GithubCallback) // GET /api/v1/auth/github/callback
}

func homePage(c *fiber.Ctx) error {
	return c.SendString("This is the homepage of the backend of my portfolio website. The Github repo can be found at: https://github.com/huynhli")
}

// auth middleware to ensure authorized user
func JWTMiddleware() fiber.Handler {
	return func(c *fiber.Ctx) error {
		// get authorization from http request
		auth := c.Get("Authorization")
		if auth == "" {
			return c.Status(fiber.StatusUnauthorized).SendString("Missing token")
		}

		// trim "Bearer", parse into jwt token
		tokenStr := strings.TrimPrefix(auth, "Bearer ")
		token, err := jwt.Parse(tokenStr, func(token *jwt.Token) (interface{}, error) {
			return []byte(os.Getenv("JWT_SECRET")), nil
		})
		if err != nil || !token.Valid {
			return c.Status(fiber.StatusUnauthorized).SendString("Invalid token")
		}

		// from the token, take claims and username, check with admin
		claims := token.Claims.(jwt.MapClaims)
		username := claims["username"].(string)
		if username != "huynhli" {
			return c.Status(fiber.StatusForbidden).JSON(fiber.Map{
				"error": "Unauthorized user",
			})
		}

		c.Locals("username", username)
		return c.Next() // do next func in route
	}
}
