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

	port := ":8080"
	fmt.Printf("Go server listening on http://localhost%s\n", port)
	log.Fatal(http.ListenAndServe(port, nil))
}
