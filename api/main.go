package main

import (
	"net/http"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

type inventory struct {
	Id           int    `json:"id"`
	Category     string `json:"category"`
	TotalStock   int    `json:"total_stock"`
	ProductCount int    `json:"product_count"`
}

var inventoryData = []inventory{
	{Id: 1, Category: "Electronics", TotalStock: 5432, ProductCount: 500},
	{Id: 2, Category: "Clothing", TotalStock: 8765, ProductCount: 350},
	{Id: 3, Category: "Home Goods", TotalStock: 3456, ProductCount: 95},
	{Id: 4, Category: "Sporting Goods", TotalStock: 2345, ProductCount: 75},
	{Id: 5, Category: "Books", TotalStock: 6789, ProductCount: 210},
}

func getInventories(c *gin.Context) {
	returnedData := gin.H{
		"total":   len(inventoryData),
		"columns": []string{"id", "category", "total_stock", "product_count"},
		"rows":    inventoryData,
	}

	c.IndentedJSON(http.StatusOK, returnedData)
}

func postInventories(c *gin.Context) {
	var newInventory inventory

	if err := c.BindJSON(&newInventory); err != nil {
		return
	}

	inventoryData = append(inventoryData, newInventory)
	c.IndentedJSON(http.StatusCreated, newInventory)
}

func defaultRoute(c *gin.Context) {
	c.IndentedJSON(http.StatusOK, gin.H{"message": "Welcome to the Hooper API!"})
}

func main() {
	router := gin.Default()

	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept"},
		AllowCredentials: true,
	}))

	router.GET("/", defaultRoute)

	router.GET("/inventories", getInventories)
	router.POST("/inventories", postInventories)

	router.Run("0.0.0.0:6969")
}
