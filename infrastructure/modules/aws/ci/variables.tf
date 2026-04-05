variable "environment" {
  type        = string
  description = "Environment name (e.g., production, staging)"
}

variable "ecr_repository_arn" {
  type        = string
  description = "ARN of the ECR repository for deploy permissions"
}

variable "github_repository" {
  type        = string
  description = "GitHub repository in owner/repo format"
}

variable "lambda_function_arn" {
  type        = string
  description = "ARN of the Lambda function for deploy permissions"
}
