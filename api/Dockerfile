# Use the official Golang image as a parent image
FROM golang:1.23

# Set the working directory inside the container
WORKDIR /api

# Copy the Go modules manifests
COPY go.mod go.sum ./

# Download Go modules
RUN go mod download

# Install Air for hot reloading
RUN go install github.com/air-verse/air@latest

# Copy the source code into the container
COPY . .

# Expose the port the app runs on
EXPOSE 6969

# Command to run the application with Air
CMD ["air"]