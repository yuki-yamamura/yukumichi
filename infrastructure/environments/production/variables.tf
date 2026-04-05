variable "database_password" {
  type        = string
  description = "Master password for the RDS instance"
  sensitive   = true
}

variable "database_url" {
  type        = string
  description = "Database connection URL for the API Lambda function"
  sensitive   = true
}
