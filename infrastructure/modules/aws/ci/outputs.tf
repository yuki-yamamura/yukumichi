output "role_arn" {
  description = "ARN of the CI IAM role for GitHub Actions"
  value       = aws_iam_role.this.arn
}
