package main

import (
	"database/sql"
	"fmt"
	"net/http"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	_ "github.com/lib/pq"
)

type ReturnSQL struct {
	Total   int64                    `json:"total"`
	Columns []string                 `json:"columns"`
	Rows    []map[string]interface{} `json:"rows"`
}

func initPostgresConnection() (*sql.DB, error) {

	host := "postgres"
	port := 5432
	user := "airflow"
	password := "airflow"
	dbname := "airflow"

	psqlInfo := fmt.Sprintf("host=%s port=%d user=%s password=%s dbname=%s sslmode=disable", host, port, user, password, dbname)

	db, err := sql.Open("postgres", psqlInfo)
	if err != nil {
		fmt.Println("Error connecting to the database:", err)
		return nil, err
	}

	err = db.Ping()
	if err != nil {
		fmt.Println("Error pinging the database:", err)
		return nil, err
	}

	return db, nil
}

func executeSQLQuery(sqlQuery string) (*ReturnSQL, error) {
	db, err := initPostgresConnection()
	if err != nil {
		return nil, err
	}
	defer db.Close()

	rows, err := db.Query(sqlQuery)
	if err != nil {
		fmt.Println("Error executing SQL query:", err)
		return nil, err
	}
	defer rows.Close()

	columns, err := rows.Columns()
	if err != nil {
		return nil, err
	}

	result := &ReturnSQL{
		Columns: columns,
		Rows:    []map[string]any{},
	}

	for rows.Next() {
		columnPointers := make([]any, len(columns))
		columnValues := make([]any, len(columns))
		for i := range columnPointers {
			columnPointers[i] = &columnValues[i]
		}

		if err := rows.Scan(columnPointers...); err != nil {
			return nil, err
		}

		rowMap := make(map[string]any)
		for i, colName := range columns {
			val := columnValues[i]
			b, ok := val.([]byte)
			if ok {
				rowMap[colName] = string(b)
			} else {
				rowMap[colName] = val
			}
		}
		result.Rows = append(result.Rows, rowMap)
	}

	result.Total = int64(len(result.Rows))

	return result, nil
}

func postSQLQuery(c *gin.Context) {
	var requestBody struct {
		Query string `json:"query"`
	}

	if err := c.ShouldBindJSON(&requestBody); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	result, err := executeSQLQuery(requestBody.Query)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to execute SQL query"})
		return
	}

	c.JSON(http.StatusOK, result)
}

func main() {
	router := gin.Default()

	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept"},
		AllowCredentials: true,
	}))

	router.POST("/query", postSQLQuery)

	router.Run("0.0.0.0:6969")
}
