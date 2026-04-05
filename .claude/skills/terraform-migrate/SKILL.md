---
name: terraform-migrate
description: Migrate existing AWS infrastructure to Terraform module by module. Accepts a module name argument (vpc, rds, lambda, ecr, ssm, ci) and performs the full migration workflow — fetching current AWS state via CLI, writing Terraform code following project conventions, validating with terraform plan, and reporting results. Use this skill when the user wants to codify existing AWS resources as Terraform, says things like "migrate the VPC to Terraform", "write Terraform for Lambda", or references infrastructure-as-code migration for any supported module.
---

# Terraform Migrate

Migrate a single AWS module from manually-created infrastructure to Terraform. The module name is passed as an argument (e.g., `/terraform-migrate vpc`).

**Supported modules:** `vpc`, `rds`, `lambda`, `ecr`, `ssm`, `ci`

## Style Guide

All generated Terraform code must follow the [HashiCorp Terraform Style Guide](https://developer.hashicorp.com/terraform/language/style). Read `references/terraform-style.md` before writing any `.tf` files — it covers argument ordering, naming, formatting, and file organization conventions. The most critical rules are:

- **Argument ordering in resource blocks:** meta-arguments → single-line arguments → block arguments → `lifecycle` → `depends_on`, with blank lines between groups
- **Argument ordering in variable blocks:** `type` → `description` → `default` → `sensitive` → `validation`
- **Argument ordering in output blocks:** `description` → `value` → `sensitive`
- **Every variable** must have both `type` and `description`
- **Every output** must have a `description`
- **Alphabetical order** for `variable` and `output` blocks within their files
- **Comments** use `#` only (not `//` or `/* */`)
- **Equals sign alignment** for consecutive arguments at the same nesting level

## Prerequisites

Before starting, verify the toolchain is available:

```bash
aws sts get-caller-identity   # AWS CLI authenticated
terraform -version             # Terraform installed
```

If either fails, stop and inform the user.

## Directory Layout

```
infrastructure/
├── modules/
│   └── aws/
│       ├── vpc/          # VPC, Subnets, IGW, Route Tables, Route Table Associations
│       ├── rds/          # RDS Instance, DB Subnet Group, Security Group (shell only)
│       ├── lambda/       # Lambda, Function URL, SG, SG egress rule (→ RDS) + ingress rule (on RDS SG), IAM Role, Policy Attachments, CW Log Group
│       ├── ecr/          # ECR Repository, Lifecycle Policy
│       ├── ssm/          # Bastion EC2, IAM Role, Instance Profile, Policy Attachment, SG, SG egress rule (→ RDS)
│       └── ci/           # OIDC Provider, IAM Role, IAM Role Policy (ECR push + Lambda update + Terraform apply)
└── environments/
    └── production/
        ├── main.tf       # Provider, backend, module calls, import blocks
        ├── variables.tf
        └── terraform.tfvars
```

Each module directory contains exactly three files: `main.tf`, `variables.tf`, `outputs.tf`.

## Phase 1: Gather Current State

Run `aws` CLI commands to fetch the **full configuration** of every AWS resource in this module. Do not rely on reference tables alone — always verify with the CLI.

### Commands by Module

#### vpc
```bash
aws ec2 describe-vpcs --vpc-ids vpc-0ea012f1e028bca25
aws ec2 describe-subnets --filters "Name=vpc-id,Values=vpc-0ea012f1e028bca25"
aws ec2 describe-internet-gateways --filters "Name=attachment.vpc-id,Values=vpc-0ea012f1e028bca25"
aws ec2 describe-route-tables --filters "Name=vpc-id,Values=vpc-0ea012f1e028bca25"
```

#### rds
```bash
aws rds describe-db-instances --db-instance-identifier sanpo-db
aws rds describe-db-subnet-groups --db-subnet-group-name sanpo-db-subnet-group
aws ec2 describe-security-groups --group-ids sg-0d91f6920360e377c
# SG rules — fetch but DO NOT codify them in the rds module (they belong to initiator modules)
aws ec2 describe-security-group-rules --filters "Name=group-id,Values=sg-0d91f6920360e377c"
```

#### lambda
```bash
aws lambda get-function --function-name sanpo-api
aws lambda get-function-url-config --function-name sanpo-api
aws ec2 describe-security-groups --group-ids sg-064f8dc0f22d49288
aws ec2 describe-security-group-rules --filters "Name=group-id,Values=sg-064f8dc0f22d49288"
# Also fetch the ingress rule on the RDS SG that Lambda's module owns:
aws ec2 describe-security-group-rules --filters "Name=group-id,Values=sg-0d91f6920360e377c"
aws iam get-role --role-name sanpo-production-api-lambda-execution-role
aws iam list-attached-role-policies --role-name sanpo-production-api-lambda-execution-role
aws logs describe-log-groups --log-group-name-prefix /aws/lambda/sanpo-api
```

#### ecr
```bash
aws ecr describe-repositories --repository-names sanpo-production
aws ecr get-lifecycle-policy --repository-name sanpo-production
```

#### ssm
```bash
aws ec2 describe-instances --instance-ids i-0aad0b2731e8b77ea
aws ec2 describe-security-groups --group-ids sg-096e05bca15824718
aws ec2 describe-security-group-rules --filters "Name=group-id,Values=sg-096e05bca15824718"
aws iam get-role --role-name sanpo-ssm-role
aws iam list-attached-role-policies --role-name sanpo-ssm-role
aws iam get-instance-profile --instance-profile-name sanpo-ssm-role  # may differ, verify
```

#### ci
```bash
aws iam list-open-id-connect-providers
# Then describe the GitHub Actions provider:
aws iam get-open-id-connect-provider --open-id-connect-provider-arn <arn-from-above>
aws iam get-role --role-name sanpo-production-github-actions-role
aws iam list-role-policies --role-name sanpo-production-github-actions-role
aws iam get-role-policy --role-name sanpo-production-github-actions-role --policy-name <name>
```

Record all output. Extract every attribute needed for the Terraform resource definitions.

## Phase 2: Write Terraform Code

### 2a. Environment Scaffolding (first module only)

If `infrastructure/environments/production/main.tf` does not exist, create the scaffolding:

**infrastructure/environments/production/main.tf:**
```hcl
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
```

**infrastructure/environments/production/variables.tf:**
```hcl
variable "environment" {
  type        = string
  description = "Environment name (e.g., production, staging)"
}

variable "region" {
  type        = string
  description = "AWS region to deploy resources in"
}
```

**infrastructure/environments/production/terraform.tfvars:**
```hcl
region      = "ap-northeast-1"
environment = "production"
```

**infrastructure/environments/production/.gitignore:**
```gitignore
# Terraform state (local state, not committed)
*.tfstate
*.tfstate.*
.terraform.tfstate.lock.info

# Terraform working directory
.terraform/

# Plan files
*.tfplan
tfplan
```

Commit the `.terraform.lock.hcl` file — it ensures reproducible provider installations.

### 2b. Module Code

Write the module's three files under `infrastructure/modules/aws/{module}/`.

Follow these conventions strictly:

#### AWS Resource Naming
Pattern: `{role}[-{identifier}]-{env}`
- `role`: resource purpose (`api`, `db`, `ci`, `network`, `ssm`)
- `identifier`: only when disambiguation is needed (AZ name, function name, etc.)
- `env`: environment name (`production`, `staging`)
- Do NOT include project name (`sanpo`) — AWS account IS the project boundary
- Do NOT include AWS service names (`lambda`, `rds`, `vpc`)
- Exception: S3 buckets need project name for global uniqueness

Examples:
```
network-production              # VPC
network-public-1a-production    # Public Subnet in ap-northeast-1a
api-production                  # Lambda Function, ECR Repository
db-production                   # RDS Instance
ci-production                   # GitHub Actions IAM Role
```

#### Terraform Resource Names (HCL identifiers)
- Single resource of a type in module: `this`
- Multiple resources of same type: descriptive name (`public`, `private_a`, `private_c`)
- Never include the resource type in the identifier
- Use underscores for separators

```hcl
resource "aws_vpc" "this" { ... }
resource "aws_subnet" "public" { ... }
resource "aws_subnet" "private_a" { ... }
```

#### Module Design Principles
- "Everything about X lives in X's module" — Lambda's SG, IAM role, CW log group all live in the lambda module
- SG rules belong to the connection initiator — Lambda module defines both its own egress rule AND the ingress rule on the RDS SG
- The RDS module creates the SG resource as an empty shell (no rules)

#### Default Values Policy
- Explicitly set values that were intentionally chosen (e.g., `image_tag_mutability = "IMMUTABLE"`)
- Explicitly set defaults when it improves readability (e.g., `authorization_type = "NONE"`)
- Omit defaults that add no information (e.g., `architectures = ["x86_64"]`)
- When unsure, check Terraform provider docs

#### Cross-Module Dependencies
- When a module needs another module's outputs, check if that module is already implemented
- If implemented: wire the output via module reference in environment's `main.tf`
- If NOT implemented: use a variable with a `# TODO: wire from {module} module` comment

### 2c. Module Call

Add the module call to `infrastructure/environments/production/main.tf`:

```hcl
module "{module_name}" {
  source = "../../modules/aws/{module_name}"

  environment = var.environment
  # ... other variables
}
```

### 2d. Import Blocks

Add `import` blocks in `infrastructure/environments/production/main.tf` ONLY for resources where recreation causes data loss or significant disruption:

**Import (recreation is dangerous):**
- RDS instances (data loss)
- VPC, Subnets (many dependent resources)
- Internet Gateways, Route Tables (network disruption)

**Do NOT import (safe to recreate):**
- Lambda functions, ECR repositories
- IAM Roles, Policies, OIDC Providers
- Security Groups, Security Group Rules
- CloudWatch Log Groups
- EC2 instances (stateless bastion)
- DB Subnet Groups

Import block format:
```hcl
import {
  to = module.vpc.aws_vpc.this
  id = "vpc-0ea012f1e028bca25"
}
```

### Specific Settings Reference

| Setting | Value |
|---------|-------|
| ECR lifecycle policy | Keep only 3 most recent images |
| CloudWatch Log Group retention | 90 days |
| Lambda memory | 128 MB |
| Lambda timeout | 3 seconds |
| Lambda package type | Image |
| Lambda Function URL auth | `NONE` (intentional) |
| RDS engine | PostgreSQL |
| Bastion instance type | t4g.nano |

## Phase 3: Validate

### 3a. Format and Validate

```bash
cd infrastructure/environments/production
terraform fmt -recursive ../..
terraform init
terraform validate
```

Fix any errors and repeat until both commands pass.

### 3b. Plan and Analyze

```bash
terraform plan -out=tfplan 2>&1
```

Analyze the plan output carefully:

- **Resources with `import` blocks:** Must show `will be imported` with **no changes** or only cosmetic changes (tag format differences, etc.). If real drift is detected, update the Terraform code to match the actual state.
- **Resources without `import` blocks:** Must show `will be created`. This is expected — they will be recreated with new names following the naming conventions.
- **No unexpected destroys:** Unless a resource is being renamed (destroy old + create new), there should be no surprise deletions.

If the plan does not match expectations, iterate:
1. Read the diff carefully
2. Adjust the `.tf` files
3. Re-run `terraform fmt` and `terraform plan`
4. Repeat until the plan is clean

### 3c. Special Cases

- If `terraform init` fails due to missing providers, check the `required_providers` block
- If plan shows changes on imported resources, the Terraform code does not match actual state — fix the code, not the import
- If plan shows dependency errors between modules, ensure required module outputs exist and are wired correctly

## Phase 4: Report

Present a clear summary to the user:

### Report Template

```
## Terraform Migration: {module}

### Files Written
- `infrastructure/modules/aws/{module}/main.tf`
- `infrastructure/modules/aws/{module}/variables.tf`
- `infrastructure/modules/aws/{module}/outputs.tf`
- `infrastructure/environments/production/main.tf` (updated)

### Resources
| Resource | Terraform Address | Strategy | Notes |
|----------|-------------------|----------|-------|
| ... | module.{mod}.aws_xxx.yyy | Import | Matches current state |
| ... | module.{mod}.aws_xxx.zzz | Create | Will be recreated with new name |

### Name Changes
| Resource Type | Current Name | New Name |
|---------------|-------------|----------|
| ... | sanpo-xxx | role-env |

### Cross-Module Dependencies
- Depends on: {list of modules this module needs}
- Depended on by: {list of modules that need this module's outputs}
- TODOs: {any unresolved wiring due to unimplemented modules}

### Manual Steps Required
- [ ] Review the plan output
- [ ] Run `terraform apply` to execute
- [ ] Verify resources in AWS Console after apply
- [ ] {any module-specific manual steps}
```

**IMPORTANT:** Do NOT run `terraform apply`. The user will do this manually after reviewing the plan.

## Idempotency

Before writing any file, check if it already exists:
- If the module directory already exists, read existing files and update them rather than overwriting blindly
- If the module call already exists in `main.tf`, update it rather than duplicating
- If import blocks already exist, do not duplicate them

## Guardrails

After all code is written and validated:
1. Run `terraform fmt -check -recursive infrastructure/` — must pass
2. Run `terraform validate` — must pass
3. Run `terraform plan` — must produce expected output (imports clean, creates expected)

## Commit

Once validation passes, commit using the `commit` skill. Stage only the infrastructure files that were created or modified.
