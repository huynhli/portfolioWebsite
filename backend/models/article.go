package models

import "go.mongodb.org/mongo-driver/bson/primitive"

type ArticleBanner struct {
	Id    primitive.ObjectID `json:"id" bson:"_id,omitempty"`
	Title string             `json:"title" bson:"title"`
	Date  string             `json:"date" bson:"date"`
}

type Article struct {
	Id      primitive.ObjectID `json:"id" bson:"_id,omitempty"`
	Title   string             `json:"title" bson:"title"`
	Date    string             `json:"date" bson:"date"`
	Content []ContentBlock     `json:"content" bson:"content"`
}

type ContentBlock struct {
	Type string `json:"type" bson:"type"`
	Data string `json:"data" bson:"data"`
}
