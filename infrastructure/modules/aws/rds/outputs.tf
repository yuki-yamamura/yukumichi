output "endpoint" {
  description = "Connection endpoint for the RDS instance"
  value       = aws_db_instance.this.endpoint
}

output "identifier" {
  description = "Identifier of the RDS instance"
  value       = aws_db_instance.this.identifier
}

output "security_group_id" {
  description = "ID of the RDS security group (rules managed by initiator modules)"
  value       = aws_security_group.this.id
}
