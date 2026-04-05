variable "database_url" {
  type        = string
  description = "Database connection URL for the Lambda environment"
  sensitive   = true
}

variable "environment" {
  type        = string
  description = "Environment name (e.g., production, staging)"
}

variable "image_uri" {
  type        = string
  description = "ECR image URI for the Lambda function"
}

variable "private_subnet_ids" {
  type        = list(string)
  description = "List of private subnet IDs for Lambda VPC configuration"
}

variable "rds_security_group_id" {
  type        = string
  description = "ID of the RDS security group for egress/ingress rules"
}

variable "vpc_id" {
  type        = string
  description = "ID of the VPC"
}
