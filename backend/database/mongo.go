package database

import (
	"context"
	"log"
	"time"

	"portfolioWebsite/backend/models"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var Client *mongo.Client
var Database *mongo.Database

func ConnectMongoDB() {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	clientOptions := options.Client().ApplyURI("your-mongodb-connection-uri")
	var err error
	Client, err = mongo.Connect(ctx, clientOptions)
	if err != nil {
		log.Fatal("MongoDB connection error:", err)
	}

	Database = Client.Database("your-db-name")
	log.Println("Connected to MongoDB")
}

func AddArticle(article models.Article) (*mongo.InsertOneResult, error) {
	collection := Database.Collection("articles")
	return collection.InsertOne(context.TODO(), article)
}

func GetAllArticles() ([]models.Article, error) {
	collection := Database.Collection("articles")

	cursor, err := collection.Find(context.TODO(), bson.D{})
	if err != nil {
		return nil, err
	}
	defer cursor.Close(context.TODO())

	var articles []models.Article
	err = cursor.All(context.TODO(), &articles)
	return articles, err
}

func DisconnectMongoDB() {
	if err := Client.Disconnect(context.TODO()); err != nil {
		log.Fatal(err)
	}
	log.Println("Disconnected from MongoDB")
}
