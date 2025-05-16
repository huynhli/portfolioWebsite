package handlers

import (
	"context"
	"fmt"
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
	projection := bson.D{ // filter query
		{Key: "title", Value: "1"},
		{Key: "date", Value: "1"},
	}
	cursor, err := collection.Find(context.TODO(), bson.D{}, options.Find().SetProjection(projection)) // cursor := iterable results of query
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
	fmt.Println("image handler called")
	fileHeader, err := c.FormFile("image")
	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "Image not found in form data")
	}

	fmt.Println("image found")

	file, err := fileHeader.Open()
	if err != nil {
		fmt.Println("cant open")
		return fiber.NewError(fiber.StatusInternalServerError, "Could not open image file")
	}
	defer file.Close()

	fmt.Println("uploading")
	uploadResult, err := config.Cloudinary.Upload.Upload(context.Background(), file, uploader.UploadParams{})
	if err != nil {
		fmt.Printf("Cloudinary upload error: %v\n", err)
		return fiber.NewError(fiber.StatusInternalServerError, "Could not upload image")
	}

	imageMetadata := models.Image{
		PublicID: uploadResult.PublicID,
		URL:      uploadResult.SecureURL,
		Format:   uploadResult.Format,
		Width:    uploadResult.Width,
		Height:   uploadResult.Height,
	}

	fmt.Println("saving")
	_, err = database.Database.Collection("images").InsertOne(context.TODO(), imageMetadata)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, "Could not save image metadata")
	}

	return c.JSON(imageMetadata)
}

// func ShowImage(c *fiber.)

func DeleteImage(c *fiber.Ctx) error {
	type RequestBody struct {
		PublicID string `json:"public_id"`
	}

	var body RequestBody
	if err := c.BodyParser(&body); err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "Invalid JSON body")
	}

	if body.PublicID == "" {
		return fiber.NewError(fiber.StatusBadRequest, "Missing public_id")
	}

	// Delete image from Cloudinary
	destroyResp, err := config.Cloudinary.Upload.Destroy(context.Background(), uploader.DestroyParams{
		PublicID: body.PublicID,
	})
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, "Failed to delete image from Cloudinary")
	}

	if destroyResp.Result != "ok" && destroyResp.Result != "not found" {
		// Cloudinary responded but with an unexpected result
		return fiber.NewError(fiber.StatusInternalServerError, fmt.Sprintf("Cloudinary response: %s", destroyResp.Result))
	}

	// Delete image metadata from MongoDB
	dbResp, err := database.Database.Collection("images").DeleteOne(context.TODO(), bson.M{"public_id": body.PublicID})
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, "Failed to delete image record from database")
	}

	// Return appropriate messages
	if destroyResp.Result == "not found" && dbResp.DeletedCount == 0 {
		return fiber.NewError(fiber.StatusNotFound, "Image not found in Cloudinary or database")
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message":             "Image deleted (if existed)",
		"cloudinary_result":   destroyResp.Result,
		"mongo_deleted_count": dbResp.DeletedCount,
	})
}
