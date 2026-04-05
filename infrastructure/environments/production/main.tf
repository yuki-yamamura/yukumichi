terraform {
  required_version = ">= 1.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = local.region

  default_tags {
    tags = {
      Environment = local.environment
      ManagedBy   = "Terraform"
    }
  }
}

locals {
  environment = "production"
  region      = "ap-northeast-1"
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

  identifier           = "sanpo-db"
  engine_version       = "18.3"
  instance_class       = "db.t4g.micro"
  allocated_storage = 20
  db_name           = "sanpo"
  username          = "sanpo"
  password          = var.database_password
}

# -----------------------------------------------------------------------------
# ECR
# -----------------------------------------------------------------------------

module "ecr" {
  source = "../../modules/aws/ecr"

  name        = "api"
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
  database_url          = var.database_url
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
# CI (GitHub Actions)
# -----------------------------------------------------------------------------

module "ci" {
  source = "../../modules/aws/ci"

  environment         = local.environment
  github_repository   = "yuki-yamamura/sanpo"
  ecr_repository_arn  = module.ecr.arn
  lambda_function_arn = module.lambda.arn
}
