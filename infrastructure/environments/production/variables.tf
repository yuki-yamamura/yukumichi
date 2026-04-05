variable "database_url" {
  type        = string
  description = "Database connection URL for the API Lambda function"
  sensitive   = true
}

variable "environment" {
  type        = string
  description = "Environment name (e.g., production, staging)"
}

variable "region" {
  type        = string
  description = "AWS region to deploy resources in"
}
