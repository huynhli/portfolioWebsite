package handlers

import (
	"backend/config"
	"backend/database"
	"backend/models"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"os"
	"time"

	"github.com/cloudinary/cloudinary-go/v2/api/uploader"
	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
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

func GetArticleWithID(c *fiber.Ctx) error {
	// Get ID from URL parameter instead of query parameter
	id := c.Params("id")

	objID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "Invalid article ID format")
	}

	// query database and unload as struct
	var article models.Article
	err = database.Database.Collection("articles").FindOne(context.TODO(), bson.D{{Key: "_id", Value: objID}}).Decode(&article)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return fiber.NewError(fiber.StatusNotFound, "No article found with that ID")
		}
		return fiber.NewError(fiber.StatusInternalServerError, "Failed to fetch article")
	}

	//return
	return c.JSON(article)
}

func DeleteArticleById(c *fiber.Ctx) error {
	// Get ID from URL parameter instead of request body
	id := c.Params("id")

	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "Invalid article ID format")
	}

	result := database.Database.Collection("articles").FindOneAndDelete(context.TODO(), bson.D{{Key: "_id", Value: objectID}})
	var articleModel models.Article
	err = result.Decode(&articleModel)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return fiber.NewError(fiber.StatusNotFound, "No article found with that ID")
		}
		return fiber.NewError(fiber.StatusInternalServerError, "Failed to delete article")
	}
	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "Article deleted successfully",
		"article": articleModel,
	})
}

func GetAllArticleBanners(c *fiber.Ctx) error {
	// query database
	articleCollection := database.Database.Collection("articles")
	projection := bson.D{ // filter query
		{Key: "title", Value: 1},
		{Key: "date", Value: 1},
		{Key: "cover", Value: 1},
	}
	cursor, err := articleCollection.Find(context.TODO(), bson.D{}, options.Find().SetProjection(projection)) // cursor := iterable results of query
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, "Failed to fetch articles")
	}
	defer cursor.Close(context.TODO())

	// unloads cursor into []Banners
	articleBanners := make([]models.ArticleBanner, 0)
	if err := cursor.All(context.TODO(), &articleBanners); err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, "Failed to decode articles")
	}

	return c.JSON(articleBanners)
}

func GetProjects(c *fiber.Ctx) error {
	return c.JSON("project")
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

	imageMetadata := models.Image{
		PublicID: uploadResult.PublicID,
		URL:      uploadResult.SecureURL,
		Format:   uploadResult.Format,
		Width:    uploadResult.Width,
		Height:   uploadResult.Height,
	}

	// Database stores metadata
	_, err = database.Database.Collection("images").InsertOne(context.TODO(), imageMetadata)
	if err != nil {
		// TODO combine w/ delete from cloud
		return fiber.NewError(fiber.StatusInternalServerError, "Could not save image metadata")
	}

	return c.Status(fiber.StatusCreated).JSON(imageMetadata)
}

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

func GetImageMetaDatasFromDBCloud(c *fiber.Ctx) error {
	articleCollection := database.Database.Collection("images")
	projection := bson.D{ // filter query
		{Key: "public_id", Value: 1},
		{Key: "url", Value: 1},
	}
	cursor, err := articleCollection.Find(context.TODO(), bson.D{}, options.Find().SetProjection(projection)) // cursor := iterable results of query
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, "Failed to fetch images")
	}
	defer cursor.Close(context.TODO())

	// unloads cursor into []images
	var images []models.Image
	if err := cursor.All(context.TODO(), &images); err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, "Failed to decode images")
	}

	return c.JSON(images)
}

func GithubLogin(c *fiber.Ctx) error {
	url := fmt.Sprintf(
		"https://github.com/login/oauth/authorize?client_id=%s&redirect_uri=%s&scope=user",
		os.Getenv("GITHUB_CLIENT_ID"),
		os.Getenv("GITHUB_REDIRECT_URI"),
	)
	return c.Redirect(url)
}

type GitHubUser struct {
	Login string `json:"login"`
}

func GithubCallback(c *fiber.Ctx) error {
	code := c.Query("code")
	if code == "" {
		return c.Status(400).SendString("No code provided")
	}

	// Step 1: Exchange code for access token
	tokenResp, err := http.PostForm("https://github.com/login/oauth/access_token", url.Values{
		"client_id":     {os.Getenv("GITHUB_CLIENT_ID")},
		"client_secret": {os.Getenv("GITHUB_CLIENT_SECRET")},
		"code":          {code},
	})
	if err != nil {
		return c.Status(500).SendString("Failed to get access token")
	}
	defer tokenResp.Body.Close()

	bodyBytes, err := io.ReadAll(tokenResp.Body)
	if err != nil {
		return c.Status(500).SendString("Failed to read access token response")
	}

	values, err := url.ParseQuery(string(bodyBytes))
	if err != nil {
		return c.Status(500).SendString("Failed to parse access token response")
	}

	accessToken := values.Get("access_token")
	if accessToken == "" {
		return c.Status(500).SendString("No access token received")
	}

	// Step 2: Get GitHub user data
	req, _ := http.NewRequest("GET", "https://api.github.com/user", nil)
	req.Header.Set("Authorization", "token "+accessToken)
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return c.Status(500).SendString("Failed to fetch user data")
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return c.Status(500).SendString("GitHub user API returned error")
	}

	var githubUser GitHubUser
	if err := json.NewDecoder(resp.Body).Decode(&githubUser); err != nil {
		return c.Status(500).SendString("Failed to decode user data")
	}

	// Step 3: Generate JWT with GitHub username
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"username": githubUser.Login,
		"exp":      time.Now().Add(time.Hour * 24).Unix(),
	})

	tokenString, err := token.SignedString([]byte(os.Getenv("JWT_SECRET")))
	if err != nil {
		return c.Status(500).SendString("Could not generate JWT")
	}

	// Step 4: Redirect to frontend with token
	redirectURL := fmt.Sprintf("%sImageUpload?token=%s", os.Getenv("FRONTEND_URL"), tokenString)
	return c.Redirect(redirectURL)
}
