package routes

import (
	"os"
	"portfolioWebsite/backend/handlers"
	"strings"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
)

func SetupRoutes(app *fiber.App) {
	app.Get("/", homePage)

	// article routes
	app.Get("/api/articleBanners", handlers.GetAllArticleBanners)
	app.Get("/api/getArticleWithID", handlers.GetArticleWithID)
	app.Post("/api/addArticle", JWTMiddleware(), handlers.AddArticle)
	app.Post("/api/deleteArticle", JWTMiddleware(), handlers.DeleteArticleById)

	// project routes
	app.Get("/api/getProjects", handlers.GetProjects)

	// image routes
	app.Post("/api/uploadImage", JWTMiddleware(), handlers.UploadImage)
	app.Post("/api/deleteImage", JWTMiddleware(), handlers.DeleteImage)
	app.Get("/api/getImageMetaDatas", handlers.GetImageMetaDatasFromDBCloud)

	// auth for upload routes
	app.Get("/api/auth/github/login", handlers.GithubLogin)
	app.Get("/api/auth/github/callback", handlers.GithubCallback)
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
