package database

import (
	"context"
	"fmt"
	"log"
	"time"

	"portfolioWebsite/backend/config"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var Client *mongo.Client
var Database *mongo.Database

func ConnectMongoDB() {
	if config.DB_USERNAME == "" || config.DB_PASSWORD == "" {
		log.Fatal("Missing DB credentials: check your .env file and config.LoadConfig()")
	}
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	uri := fmt.Sprintf("mongodb+srv://%s:%s@portfoliowebsite.qwwppyo.mongodb.net/?retryWrites=true&w=majority&appName=portfolioWebsite", config.DB_USERNAME, config.DB_PASSWORD)
	// uri := "mongodb+srv://" + config.DB_USERNAME + ":" + config.DB_PASSWORD + "@portfoliowebsite.qwwppyo.mongodb.net/?retryWrites=true&w=majority&appName=portfolioWebsite"
	clientOptions := options.Client().ApplyURI(uri)
	var err error
	Client, err = mongo.Connect(ctx, clientOptions)
	if err != nil {
		log.Fatal("MongoDB connection error:", err)
	}

	Database = Client.Database("your-db-name")
	Database = Client.Database("portfolioWebsite")
	log.Println("Connected to MongoDB")
}

// func AddArticle(article models.Article) (*mongo.InsertOneResult, error) {
// 	collection := Database.Collection("articles")
// 	return collection.InsertOne(context.TODO(), article)
// }

// func GetAllArticles() ([]models.Article, error) {
// 	collection := Database.Collection("articles")

// 	cursor, err := collection.Find(context.TODO(), bson.D{})
// 	if err != nil {
//     	return nil, err
// 	}
// 	defer cursor.Close(context.TODO())

// 	var articles []models.Article
// 	err = cursor.All(context.TODO(), &articles)
// 	return articles, err
// }

func DisconnectMongoDB() {
	if err := Client.Disconnect(context.TODO()); err != nil {
		log.Fatal(err)
	}
}
