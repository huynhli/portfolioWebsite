package handlers

import (
	"context"
	"portfolioWebsite/backend/database"
	"portfolioWebsite/backend/models"

	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

func AddArticle(article models.Article) (*mongo.InsertOneResult, error) {
	collection := database.Database.Collection("articles")
	return collection.InsertOne(context.TODO(), article)
}

func GetAllArticles(c *fiber.Ctx) error {
	collection := database.Database.Collection("articles")

	cursor, err := collection.Find(context.TODO(), bson.D{})
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, "Failed to fetch articles")
	}
	defer cursor.Close(context.TODO())

	var articles []models.Article
	if err := cursor.All(context.TODO(), &articles); err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, "Failed to decode articles")
	}

	return c.JSON(articles)
}
