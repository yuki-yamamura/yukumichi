variable "environment" {
  type        = string
  description = "Environment name (e.g., production, staging)"
}

variable "region" {
  type        = string
  description = "AWS region to deploy resources in"
}
