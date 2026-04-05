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

  cidr_block  = "172.31.0.0/16"
  environment = var.environment

  public_subnets = {
    "1a" = { cidr_block = "172.31.32.0/20", availability_zone = "ap-northeast-1a" }
    "1c" = { cidr_block = "172.31.0.0/20", availability_zone = "ap-northeast-1c" }
    "1d" = { cidr_block = "172.31.16.0/20", availability_zone = "ap-northeast-1d" }
  }
}

import {
  to = module.vpc.aws_vpc.this
  id = "vpc-062b29ec5a1f36a42"
}

import {
  to = module.vpc.aws_subnet.public["1a"]
  id = "subnet-02f5165418483fbd1"
}

import {
  to = module.vpc.aws_subnet.public["1c"]
  id = "subnet-0a720b7498a306f01"
}

import {
  to = module.vpc.aws_subnet.public["1d"]
  id = "subnet-08ba2d8ef73c09dcf"
}

import {
  to = module.vpc.aws_internet_gateway.this
  id = "igw-0bd493d69d21f2de0"
}

import {
  to = module.vpc.aws_route_table.public
  id = "rtb-054cd243db113bf34"
}

import {
  to = module.vpc.aws_route.public_internet
  id = "rtb-054cd243db113bf34_0.0.0.0/0"
}
