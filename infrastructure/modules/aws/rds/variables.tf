variable "environment" {
  type        = string
  description = "Environment name (e.g., production, staging)"
}

variable "allocated_storage" {
  type        = number
  description = "Allocated storage in GB"
}

variable "db_name" {
  type        = string
  description = "Name of the database to create"
}

variable "db_subnet_group_name" {
  type        = string
  description = "Name of the DB subnet group"
}

variable "engine_version" {
  type        = string
  description = "PostgreSQL engine version"
}

variable "identifier" {
  type        = string
  description = "RDS instance identifier"
}

variable "instance_class" {
  type        = string
  description = "RDS instance class"
}

variable "private_subnet_ids" {
  type        = list(string)
  description = "List of private subnet IDs for the DB subnet group"
}

variable "username" {
  type        = string
  description = "Master username for the database"
}

variable "vpc_id" {
  type        = string
  description = "ID of the VPC"
}
