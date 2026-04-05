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
  region = var.region
}

# -----------------------------------------------------------------------------
# VPC
# -----------------------------------------------------------------------------

module "vpc" {
  source = "../../modules/aws/vpc"

  cidr_block  = "10.0.0.0/16"
  environment = var.environment

  public_subnets = {
    "1a" = { cidr_block = "10.0.100.0/24", availability_zone = "ap-northeast-1a" }
  }

  private_subnets = {
    "1a" = { cidr_block = "10.0.1.0/24", availability_zone = "ap-northeast-1a" }
    "1c" = { cidr_block = "10.0.2.0/24", availability_zone = "ap-northeast-1c" }
  }
}

import {
  to = module.vpc.aws_vpc.this
  id = "vpc-0ea012f1e028bca25"
}

import {
  to = module.vpc.aws_subnet.public["1a"]
  id = "subnet-074f73be776ac3f9a"
}

import {
  to = module.vpc.aws_subnet.private["1a"]
  id = "subnet-0eda3406059835bd4"
}

import {
  to = module.vpc.aws_subnet.private["1c"]
  id = "subnet-052a264ffcce7fb2b"
}

import {
  to = module.vpc.aws_internet_gateway.this
  id = "igw-05b67083b1253e610"
}

import {
  to = module.vpc.aws_route_table.public
  id = "rtb-084df636deaf79697"
}

import {
  to = module.vpc.aws_route.public_internet
  id = "rtb-084df636deaf79697_0.0.0.0/0"
}

import {
  to = module.vpc.aws_route_table_association.public["1a"]
  id = "subnet-074f73be776ac3f9a/rtb-084df636deaf79697"
}

# -----------------------------------------------------------------------------
# RDS
# -----------------------------------------------------------------------------

module "rds" {
  source = "../../modules/aws/rds"

  environment        = var.environment
  vpc_id             = module.vpc.id
  private_subnet_ids = module.vpc.private_subnet_ids

  identifier           = "sanpo-db"
  engine_version       = "18.3"
  instance_class       = "db.t4g.micro"
  db_subnet_group_name = "sanpo-db-subnet-group"

  allocated_storage = 20
  db_name           = "sanpo"
  username          = "sanpo"
}

import {
  to = module.rds.aws_db_instance.this
  id = "sanpo-db"
}

import {
  to = module.rds.aws_db_subnet_group.this
  id = "sanpo-db-subnet-group"
}

# -----------------------------------------------------------------------------
# ECR
# -----------------------------------------------------------------------------

module "ecr" {
  source = "../../modules/aws/ecr"

  name        = "api"
  environment = var.environment
}

# -----------------------------------------------------------------------------
# Lambda
# -----------------------------------------------------------------------------

module "lambda" {
  source = "../../modules/aws/lambda"

  environment           = var.environment
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

  environment           = var.environment
  vpc_id                = module.vpc.id
  subnet_id             = module.vpc.public_subnet_ids[0]
  rds_security_group_id = module.rds.security_group_id
}

# -----------------------------------------------------------------------------
# CI (GitHub Actions)
# -----------------------------------------------------------------------------

module "ci" {
  source = "../../modules/aws/ci"

  environment         = var.environment
  github_repository   = "yuki-yamamura/sanpo"
  ecr_repository_arn  = module.ecr.arn
  lambda_function_arn = module.lambda.arn
}

import {
  to = module.ci.aws_iam_openid_connect_provider.github
  id = "arn:aws:iam::730763715580:oidc-provider/token.actions.githubusercontent.com"
}
