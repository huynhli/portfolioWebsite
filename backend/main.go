package main

import (
	"context"
	"encoding/json"
	"log"
	"net/http"

	"portfolioWebsite/backend/database"
	"portfolioWebsite/backend/models"

	"go.mongodb.org/mongo-driver/bson"
)

func main() {
	database.ConnectMongoDB()
	defer database.DisconnectMongoDB()

	// Define the route for fetching articles
	http.HandleFunc("/api/articles", func(w http.ResponseWriter, r *http.Request) {
		if r.Method == "GET" {
			collection := database.Database.Collection("articles") // "articles" is the collection name

			// Fetch all articles from the MongoDB collection
			cursor, err := collection.Find(context.TODO(), bson.D{})
			if err != nil {
				http.Error(w, "DB error", http.StatusInternalServerError)
				return
			}
			defer cursor.Close(context.TODO())

			var results []models.Article
			if err = cursor.All(context.TODO(), &results); err != nil {
				http.Error(w, "Cursor decode error", http.StatusInternalServerError)
				return
			}

			w.Header().Set("Content-Type", "application/json")
			json.NewEncoder(w).Encode(results)
		} else if r.Method == "POST" {
			var article models.Article
			err := json.NewDecoder(r.Body).Decode(&article)
			if err != nil {
				http.Error(w, "Invalid request body", http.StatusBadRequest)
				return
			}
			result, err := database.AddArticle(article)
			if err != nil {
				http.Error(w, "Failed to insert article", http.StatusInternalServerError)
				return
			}
			w.Header().Set("Content-Type", "application/json")
			json.NewEncoder(w).Encode(result)
		} else {
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		}
	})

	// Start the server
	log.Println("Server running at http://localhost:8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
