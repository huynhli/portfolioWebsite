package models

import "go.mongodb.org/mongo-driver/bson/primitive"

type ArticleBanner struct {
	Id    primitive.ObjectID `json:"id" bson:"_id,omitempty"`
	Title string             `json:"title" bson:"title"`
	Date  string             `json:"date" bson:"date"`
	Cover string             `json:"cover" bson:"cover"`
}

type Article struct {
	Id      primitive.ObjectID `json:"id" bson:"_id,omitempty"`
	Title   string             `json:"title" bson:"title"`
	Date    string             `json:"date" bson:"date"`
	Cover   string             `json:"cover" bson:"cover"`
	Content []ContentBlock     `json:"content" bson:"content"`
}

type ProjectBanner struct {
	Id    primitive.ObjectID `json:"id" bson:"_id,omitempty"`
	Title string             `json:"title" bson:"title"`
	Date  string             `json:"date" bson:"date"`
	Cover string             `json:"cover" bson:"cover"`
	Link  string             `json:"link" bson:"link"`
}

type ContentBlock struct {
	Type string `json:"type" bson:"type"` // "Text", "Heading", "Image", "Subheading"
	Data string `json:"data" bson:"data"`
}

type Image struct {
	PublicID string `bson:"public_id" json:"public_id"`
	URL      string `bson:"url" json:"url"`
	Format   string `bson:"format" json:"format"`
	Width    int    `bson:"width" json:"width"`
	Height   int    `bson:"height" json:"height"`
}
