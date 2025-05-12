package main

import (
	"log"
	"net/http"

	"github.com/rs/cors"
)

func main() {
	mux := http.NewServeMux()

	// Handle a basic route
	mux.HandleFunc("/articles", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.Write([]byte(`["Article 1", "Article 2", "Article 3"]`))
	})

	// Enable CORS
	handler := cors.Default().Handler(mux)

	log.Println("Server running on http://localhost:8080")
	if err := http.ListenAndServe(":8080", handler); err != nil {
		log.Fatal(err)
	}
}
