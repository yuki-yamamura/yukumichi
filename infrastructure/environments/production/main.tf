locals {
  environment = "production"
  app_env     = "production"
  region      = "ap-northeast-1"
  db_name     = "yukumichi"
  db_username = "yukumichi"
}

# -----------------------------------------------------------------------------
# SSM Parameter Store
# -----------------------------------------------------------------------------

data "aws_ssm_parameter" "db_password" {
  name = "/yukumichi/production/db/password"
}

# -----------------------------------------------------------------------------
# VPC
# -----------------------------------------------------------------------------

module "vpc" {
  source = "../../modules/aws/vpc"

  cidr_block  = "10.0.0.0/16"
  environment = local.environment

  public_subnets = {
    "1a" = { cidr_block = "10.0.100.0/24", availability_zone = "${local.region}a" }
  }

  private_subnets = {
    "1a" = { cidr_block = "10.0.1.0/24", availability_zone = "${local.region}a" }
    "1c" = { cidr_block = "10.0.2.0/24", availability_zone = "${local.region}c" }
  }
}

# -----------------------------------------------------------------------------
# RDS
# -----------------------------------------------------------------------------

module "rds" {
  source = "../../modules/aws/rds"

  environment        = local.environment
  vpc_id             = module.vpc.id
  private_subnet_ids = module.vpc.private_subnet_ids

  identifier     = "yukumichi-db"
  engine_version = "18.3"
  instance_class = "db.t4g.micro"

  allocated_storage = 20
  db_name           = local.db_name
  username          = local.db_username
  password          = data.aws_ssm_parameter.db_password.value
}

# -----------------------------------------------------------------------------
# ECR
# -----------------------------------------------------------------------------

module "ecr" {
  source = "../../modules/aws/ecr"

  name        = "api"
  environment = local.environment
}

module "ecr_cognito_custom_message" {
  source = "../../modules/aws/ecr"

  name        = "cognito-custom-message"
  environment = local.environment
}

# -----------------------------------------------------------------------------
# Lambda
# -----------------------------------------------------------------------------

module "lambda" {
  source = "../../modules/aws/lambda"

  environment           = local.environment
  vpc_id                = module.vpc.id
  private_subnet_ids    = module.vpc.private_subnet_ids
  rds_security_group_id = module.rds.security_group_id
  image_uri             = "${module.ecr.repository_url}:latest"
  database_url          = "postgresql://${local.db_username}:${urlencode(data.aws_ssm_parameter.db_password.value)}@${module.rds.endpoint}/${local.db_name}"
  app_env               = local.app_env
}

# -----------------------------------------------------------------------------
# SSM (Bastion)
# -----------------------------------------------------------------------------

module "ssm" {
  source = "../../modules/aws/ssm"

  environment           = local.environment
  vpc_id                = module.vpc.id
  subnet_id             = module.vpc.public_subnet_ids[0]
  rds_security_group_id = module.rds.security_group_id
}

# -----------------------------------------------------------------------------
# Cognito
# -----------------------------------------------------------------------------

module "cognito" {
  source = "../../modules/aws/cognito"

  environment = local.environment
  image_uri   = "${module.ecr_cognito_custom_message.repository_url}:latest"
}

# -----------------------------------------------------------------------------
# CI (GitHub Actions)
# -----------------------------------------------------------------------------

module "ci" {
  source = "../../modules/aws/ci"

  environment          = local.environment
  github_repository    = "yuki-yamamura/yukumichi"
  ecr_repository_arns  = [module.ecr.arn, module.ecr_cognito_custom_message.arn]
  lambda_function_arns = [module.lambda.arn, module.cognito.lambda_function_arn]
}
