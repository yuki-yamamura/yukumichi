# -----------------------------------------------------------------------------
# IAM (Custom Message Lambda)
# -----------------------------------------------------------------------------

resource "aws_iam_role" "custom_message" {
  name = "cognito-custom-message-${var.environment}"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
        Action = "sts:AssumeRole"
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "custom_message_basic" {
  role       = aws_iam_role.custom_message.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

# -----------------------------------------------------------------------------
# CloudWatch (Custom Message Lambda)
# -----------------------------------------------------------------------------

resource "aws_cloudwatch_log_group" "custom_message" {
  name              = "/aws/lambda/cognito-custom-message-${var.environment}"
  retention_in_days = 90
}

# -----------------------------------------------------------------------------
# Lambda (Custom Message)
# -----------------------------------------------------------------------------

resource "aws_lambda_function" "custom_message" {
  function_name = "cognito-custom-message-${var.environment}"
  role          = aws_iam_role.custom_message.arn
  package_type  = "Image"
  image_uri     = var.image_uri
  memory_size   = 128
  timeout       = 3

  environment {
    variables = {
      WEB_ORIGIN = var.web_origin
    }
  }

  logging_config {
    log_format = "Text"
    log_group  = aws_cloudwatch_log_group.custom_message.name
  }

  lifecycle {
    ignore_changes = [image_uri]
  }

  depends_on = [aws_iam_role_policy_attachment.custom_message_basic]
}

# -----------------------------------------------------------------------------
# Cognito User Pool
# -----------------------------------------------------------------------------

resource "aws_cognito_user_pool" "this" {
  name = "yukumichi-${var.environment}"

  username_attributes      = ["email"]
  auto_verified_attributes = ["email"]
  mfa_configuration        = "OFF"

  schema {
    name                = "email"
    attribute_data_type = "String"
    required            = true
    mutable             = true

    string_attribute_constraints {
      min_length = 0
      max_length = 2048
    }
  }

  lambda_config {
    custom_message = aws_lambda_function.custom_message.arn
  }
}

resource "aws_cognito_user_pool_client" "this" {
  name         = "yukumichi-${var.environment}"
  user_pool_id = aws_cognito_user_pool.this.id

  generate_secret               = false
  prevent_user_existence_errors = "ENABLED"

  explicit_auth_flows = [
    "ALLOW_ADMIN_USER_PASSWORD_AUTH",
    "ALLOW_REFRESH_TOKEN_AUTH",
  ]
}

# -----------------------------------------------------------------------------
# Lambda Permission (Cognito -> Lambda)
# -----------------------------------------------------------------------------

resource "aws_lambda_permission" "cognito_invoke" {
  statement_id  = "AllowCognitoInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.custom_message.function_name
  principal     = "cognito-idp.amazonaws.com"
  source_arn    = aws_cognito_user_pool.this.arn
}
