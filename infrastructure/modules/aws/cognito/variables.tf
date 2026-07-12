variable "environment" {
  type        = string
  description = "Environment name (e.g., production, staging)"
}

variable "image_uri" {
  type        = string
  description = "ECR image URI for the Custom Message Lambda function"
}
