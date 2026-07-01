output "user_pool_id" {
  description = "ID of the Cognito User Pool"
  value       = aws_cognito_user_pool.this.id
}

output "app_client_id" {
  description = "ID of the Cognito User Pool Client used by the web/API"
  value       = aws_cognito_user_pool_client.this.id
}

output "lambda_function_arn" {
  description = "ARN of the Custom Message Lambda function"
  value       = aws_lambda_function.custom_message.arn
}

output "lambda_function_name" {
  description = "Name of the Custom Message Lambda function"
  value       = aws_lambda_function.custom_message.function_name
}
