variable "environment" {
  type        = string
  description = "Environment name (e.g., production, staging)"
}

variable "ecr_repository_arns" {
  type        = list(string)
  description = "ARNs of the ECR repositories for deploy permissions"
}

variable "github_repository" {
  type        = string
  description = "GitHub repository in owner/repo format"
}

variable "lambda_function_arns" {
  type        = list(string)
  description = "ARNs of the Lambda functions for deploy permissions"
}
