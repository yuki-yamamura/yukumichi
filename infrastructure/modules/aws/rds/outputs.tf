output "security_group_id" {
  description = "ID of the RDS security group (rules managed by initiator modules)"
  value       = aws_security_group.this.id
}
