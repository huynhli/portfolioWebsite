package handlers

import (
	"context"
	"portfolioWebsite/backend/config"
	"portfolioWebsite/backend/database"
	"portfolioWebsite/backend/models"

	"github.com/cloudinary/cloudinary-go/v2/api/uploader"
	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func AddArticle(c *fiber.Ctx) error {
	var article models.Article
	if err := c.BodyParser(&article); err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "Invalid request body")
	}

	_, err := database.Database.Collection("articles").InsertOne(context.TODO(), article)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, "Failed to add article")
	}
	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"message": "Article added successfully"})
}

func DeleteArticleById(c *fiber.Ctx) error {
	var articleID = c.Query("ID")
	result := database.Database.Collection("articles").FindOneAndDelete(context.TODO(), bson.D{{Key: "ID", Value: articleID}})
	var articleModel models.Article
	err := result.Decode(&articleModel)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return fiber.NewError(fiber.StatusNotFound, "No article found with that ID")
		}
		// Some other error occurred
		return fiber.NewError(fiber.StatusInternalServerError, "Failed to delete article")
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{"message": "Article deleted successfully", "article": articleModel})
}

func GetAllArticleBanners(c *fiber.Ctx) error {
	// query database
	collection := database.Database.Collection("articles")
	projection := bson.D{
		{Key: "title", Value: "1"},
		{Key: "date", Value: "1"},
	}
	cursor, err := collection.Find(context.TODO(), bson.D{}, options.Find().SetProjection(projection)) // cursor = iterable results of query
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, "Failed to fetch articles")
	}
	defer cursor.Close(context.TODO())

	// unloads cursor into []articleBanners
	var articleBanners []models.ArticleBanner
	if err := cursor.All(context.TODO(), &articleBanners); err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, "Failed to decode articles")
	}

	return c.JSON(articleBanners)
}

func GetArticleWithTitle(c *fiber.Ctx) error {
	//save query param
	id := c.Query("id")

	// query database and unload as struct
	var article models.Article
	err := database.Database.Collection("articles").FindOne(context.TODO(), bson.D{{Key: "id", Value: id}}).Decode(&article)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return fiber.NewError(fiber.StatusNotFound, "No article found with that id")
		}
		return fiber.NewError(fiber.StatusInternalServerError, "Failed to fetch article")
	}

	//return
	return c.JSON(article)
}

func UploadImage(c *fiber.Ctx) error {
	fileHeader, err := c.FormFile("image")
	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "Image not found in form data")
	}

	file, err := fileHeader.Open()
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, "Could not open image file")
	}
	defer file.Close()

	uploadResult, err := config.Cloudinary.Upload.Upload(context.Background(), file, uploader.UploadParams{})
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, "Could not upload image")
	}

	return c.JSON(fiber.Map{"url": uploadResult.SecureURL})
}
