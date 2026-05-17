---
paths: "infrastructure/**/*.{tf,hcl}"
---

# Terraform Guidelines

This document extends the official [Terraform Style Guide](https://developer.hashicorp.com/terraform/language/style) with project-specific rules. Follow the style guide for anything not addressed below.

## Directory Structure

```
infrastructure/
├── environments/
│   └── {environment}/         # Composition: how this environment wires modules together
│       ├── main.tf
│       ├── providers.tf
│       ├── backend.tf
│       └── terraform.tf
└── modules/
    └── aws/
        └── {module}/          # Reusable, environment-agnostic module
            ├── main.tf
            ├── variables.tf
            └── outputs.tf
```

- **environments/** holds the composition root for each deployable environment. It instantiates modules and passes environment-specific values. It contains no `resource` blocks of its own — everything is delegated to modules.
- **modules/aws/** holds reusable building blocks. Each module is named for what it builds — usually a single AWS service, occasionally a higher-level grouping. The module's name and the AWS resource names it produces are separate concerns and need not match.

## Environment Composition

`main.tf` in an environment follows a fixed shape:

1. `locals` at the top for values used across modules (`environment`, `region`, shared identifiers).
2. `data` sources for values resolved from outside Terraform.
3. One `module` block per included module, separated by section dividers.

```hcl
locals {
  environment = "production"
  region      = "ap-northeast-1"
}

# -----------------------------------------------------------------------------
# VPC
# -----------------------------------------------------------------------------

module "vpc" {
  source = "../../modules/aws/vpc"
  # ...
}
```

## Resource Addressing

- A module's single primary resource is named `"this"`.
- When a module declares several resources of the same type, each gets a descriptive name.

```hcl
resource "aws_vpc" "this" { ... }

resource "aws_subnet" "public"  { for_each = var.public_subnets  ... }
resource "aws_subnet" "private" { for_each = var.private_subnets ... }

resource "aws_vpc_security_group_ingress_rule" "rds_from_lambda" { ... }
resource "aws_vpc_security_group_ingress_rule" "rds_from_ssm"    { ... }
```

## Variables

- `environment` is declared first. Other variables follow in a logical grouping (inputs from upstream modules, then resource configuration).
- Every variable declares `type` and `description`. The description is a full sentence; it appears in module documentation and in `terraform plan` output.
- Secrets are marked `sensitive = true` so their values are redacted from plan and state output.
- Collections that need per-element configuration use `map(object({...}))` keyed by a short stable key.

## Outputs

- Output keys are lower snake_case and describe the value (e.g. `id`, `arn`).
- Every output declares `description`. The description states what the value is
- Expose only what downstream modules consume. Outputs are part of the module's public contract; adding them later is cheaper than removing them.
