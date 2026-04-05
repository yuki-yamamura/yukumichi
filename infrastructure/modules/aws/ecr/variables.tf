variable "environment" {
  type        = string
  description = "Environment name (e.g., production, staging)"
}

variable "max_image_count" {
  type        = number
  description = "Maximum number of images to retain in the repository"
  default     = 3
}

variable "name" {
  type        = string
  description = "Repository name prefix (e.g., api)"
}
