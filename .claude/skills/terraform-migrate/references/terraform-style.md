# Terraform Style Guide Reference

Based on: https://developer.hashicorp.com/terraform/language/style

This reference covers the HCL code style conventions that apply when writing Terraform files. `terraform fmt` handles indentation and basic formatting automatically, but the conventions below go beyond what the formatter enforces — they affect readability, maintainability, and consistency.

## Table of Contents

1. [Block Argument Ordering](#block-argument-ordering)
2. [Variables and Outputs](#variables-and-outputs)
3. [Formatting and Whitespace](#formatting-and-whitespace)
4. [Comments](#comments)
5. [File Organization](#file-organization)
6. [Version Pinning](#version-pinning)
7. [Git Hygiene](#git-hygiene)

---

## Block Argument Ordering

The ordering of arguments within a block matters for readability. Consistent ordering lets readers predict where to find information.

### Resource Blocks

```hcl
resource "aws_instance" "web" {
  # 1. Meta-arguments (count, for_each, provider)
  count = var.enable_feature ? 1 : 0

  # 2. Resource-specific single-line arguments (non-block)
  ami           = "ami-abc123"
  instance_type = "t3.micro"
  subnet_id     = var.subnet_id

  # 3. Resource-specific block arguments
  root_block_device {
    volume_size = 20
  }

  tags = {
    Name = "web-${var.environment}"
  }

  # 4. lifecycle block (if needed)
  lifecycle {
    create_before_destroy = true
  }

  # 5. depends_on (if needed, as last item)
  depends_on = [aws_iam_role_policy_attachment.this]
}
```

Separate each group with a blank line. Within a group, place related arguments together.

### Variable Blocks

```hcl
variable "instance_type" {
  type        = string
  description = "EC2 instance type for the bastion host"
  default     = "t4g.nano"
}

variable "db_password" {
  type        = string
  description = "Database master password"
  sensitive   = true
}

variable "allowed_cidrs" {
  type        = list(string)
  description = "CIDR blocks allowed to access the service"

  validation {
    condition     = alltrue([for cidr in var.allowed_cidrs : can(cidrhost(cidr, 0))])
    error_message = "Each element must be a valid CIDR block."
  }
}
```

Order: `type` → `description` → `default` → `sensitive` → `validation`

Every variable requires both `type` and `description`. If a variable is optional, provide a `default`. Mark secrets with `sensitive = true`.

### Output Blocks

```hcl
output "vpc_id" {
  description = "ID of the VPC"
  value       = aws_vpc.this.id
}

output "db_password" {
  description = "Database master password"
  value       = aws_db_instance.this.password
  sensitive   = true
}
```

Order: `description` → `value` → `sensitive`

Every output requires a `description`.

---

## Variables and Outputs

### Alphabetical Ordering

Define `variable` blocks in `variables.tf` and `output` blocks in `outputs.tf` in **alphabetical order** by name. This makes it easy to locate a specific variable or output in larger files.

### Naming

Use descriptive nouns with underscores as word separators. Do not include the resource type in the name.

```hcl
# Good
variable "subnet_ids" { ... }
output "security_group_id" { ... }

# Bad
variable "subnetIds" { ... }        # camelCase
output "sg_security_group_id" { ... } # redundant type prefix
```

---

## Formatting and Whitespace

`terraform fmt` handles indentation (2 spaces) and basic alignment, but these patterns improve readability further:

### Equals Sign Alignment

Align `=` signs for consecutive single-line arguments at the same nesting level:

```hcl
# Good — aligned
ami           = "ami-abc123"
instance_type = "t3.micro"
subnet_id     = var.subnet_id

# Bad — ragged
ami = "ami-abc123"
instance_type = "t3.micro"
subnet_id = var.subnet_id
```

`terraform fmt` does this automatically for arguments within the same "group" (separated by blank lines). Use blank lines intentionally to create logical groups.

### Blank Lines

- Separate top-level blocks (resource, variable, output, etc.) with exactly one blank line
- Within a block, use blank lines to separate logical groups of arguments
- Place all single-line arguments before nested blocks, with a blank line between

### Argument-Then-Block Pattern

```hcl
resource "aws_security_group" "this" {
  # Single-line arguments first
  name        = "api-sg-${var.environment}"
  description = "Security group for the API"
  vpc_id      = var.vpc_id

  # Then block arguments, separated by a blank line
  tags = {
    Name = "api-sg-${var.environment}"
  }
}
```

---

## Comments

Use `#` exclusively for comments. While Terraform also supports `//` and `/* */`, the `#` style is the idiomatic convention and what `terraform fmt` normalizes to.

```hcl
# Good — idiomatic Terraform comment
resource "aws_vpc" "this" {
  cidr_block = "10.0.0.0/16"  # Chosen to allow up to 65k hosts
}

// Bad — not idiomatic
/* Also bad — not idiomatic */
```

Write self-documenting code. Use comments only to explain non-obvious decisions or context that cannot be expressed through naming and structure alone.

---

## File Organization

### Module Files

Each module has three files:

| File | Contents | Notes |
|------|----------|-------|
| `main.tf` | Resources and data sources | Group related resources together |
| `variables.tf` | All `variable` blocks | Alphabetical order |
| `outputs.tf` | All `output` blocks | Alphabetical order |

For large modules, split `main.tf` by logical group (e.g., `iam.tf`, `networking.tf`), but this project's modules are small enough that a single `main.tf` suffices.

### Environment Files

| File | Contents |
|------|----------|
| `main.tf` | `terraform` block, `provider` blocks, `module` calls, `import` blocks |
| `variables.tf` | Environment-level variables (alphabetical) |
| `terraform.tfvars` | Variable values for this environment |

---

## Version Pinning

Pin provider versions with a pessimistic constraint to allow patch updates while preventing breaking changes:

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
```

---

## Git Hygiene

The environment directory needs a `.gitignore` to exclude Terraform working files:

```gitignore
# Terraform state (using local state, not committed)
*.tfstate
*.tfstate.*
.terraform.tfstate.lock.info

# Terraform working directory
.terraform/

# Plan files
*.tfplan
tfplan

# Sensitive variable files
*.auto.tfvars
!terraform.tfvars
```

Commit the `.terraform.lock.hcl` dependency lock file — it ensures reproducible provider installations across machines.
