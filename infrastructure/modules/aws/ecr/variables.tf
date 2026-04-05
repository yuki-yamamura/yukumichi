variable "environment" {
  type        = string
  description = "Environment name (e.g., production, staging)"
}

variable "name" {
  type        = string
  description = "Repository name prefix (e.g., api)"
}

variable "max_image_count" {
  type        = number
  description = "Maximum number of images to retain in the repository"
  default     = 3
}
