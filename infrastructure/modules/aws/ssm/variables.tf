variable "environment" {
  type        = string
  description = "Environment name (e.g., production, staging)"
}

variable "rds_security_group_id" {
  type        = string
  description = "ID of the RDS security group for egress/ingress rules"
}

variable "subnet_id" {
  type        = string
  description = "Subnet ID for the bastion instance"
}

variable "vpc_id" {
  type        = string
  description = "ID of the VPC"
}
