output "security_group_id" {
  description = "ID of the RDS security group (rules managed by initiator modules)"
  value       = aws_security_group.this.id
}

output "endpoint" {
  description = "Connection endpoint of the RDS instance in host:port format"
  value       = aws_db_instance.this.endpoint
}
