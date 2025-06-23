package main

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"path/filepath"
)

func main() {
	const publicDir = "./public"
	fs := http.FileServer(http.Dir(publicDir))

	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		cleanPath := filepath.Clean(r.URL.Path)
		filePath := filepath.Join(publicDir, cleanPath)
		if info, err := os.Stat(filePath); err == nil && !info.IsDir() {
			fs.ServeHTTP(w, r)
			return
		}
		http.ServeFile(w, r, filepath.Join(publicDir, "index.html"))
	})

	// Get port from environment variable for cloud platforms like Render
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080" // Default port if not specified
	}

	fmt.Printf("Go server listening on port %s\n", port)
	log.Fatal(http.ListenAndServe(":"+port, nil))
}
