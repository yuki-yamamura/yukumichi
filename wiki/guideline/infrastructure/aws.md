---
paths: "infrastructure/**/*.{tf,hcl}"
---

# AWS Guidelines

Every AWS resource carries an environment identifier so a single account can hold multiple environments without collision. Names also encode the resource's purpose so they remain self-describing in the console, CLI output, and CloudWatch dashboards.

## AWS Account Boundary

Each service runs in a dedicated AWS account. The account itself is the service boundary: no other product's resources share this namespace, so resource names inside the account do not need to include the product name to disambiguate.
This is the reason most resources use `{component}-{environment}` instead of `{product}-{component}-{environment}`. Inside the `yukumichi` account, `api-production` cannot collide with another product's `api-production` — there is no other product here.

The `{product}` prefix is reserved for namespaces that cross the account boundary:

- **AWS-global namespaces** (e.g, S3 bucket names) — collide with every other AWS account on the planet.
- **Account-region-global identifiers that outlive the resource** (e.g, RDS instance identifiers and the snapshot names derived from them) — snapshots can be shared, copied across accounts, or restored years later; a product-qualified identifier stays meaningful out of context.

## Vocabulary

- **`{product}`** — `yukumichi`. Used only where the namespace crosses the account boundary.
- **`{environment}`** — `production`, `staging`, etc. Always present in regional resource names.
- **`{component}`** — the logical role of the resource within the system, not the AWS service that implements it. Current components: `network`, `db`, `api`, `ssm`, `ci`.

## Naming Patterns

### Regional Resources

Form: `{component}-{environment}`.

Applies to any resource whose namespace is scoped to the account, region, or VPC.

```
api-production
db-production
network-production
```

### Subnets

Form: `network-{public|private}-{az-suffix}-{environment}`.

Subnets are the only resource that embeds the availability zone in its name, because there are multiple subnets per VPC and the AZ is the meaningful discriminator.

```
network-public-1a-production
network-private-1a-production
network-private-1c-production
```

### SSM Parameter Store

Use `{product}` as the first segment and group by environment, then component:

```
/yukumichi/production/db/password
```

### CloudWatch Log Groups

Use `/aws/{service}/...`) for AWS-managed log groups:

```
/aws/lambda/api-production
```

## Tagging

### Default Tags

Default tags are applied to every resource that supports tags, so do not re-declare these tags on individual resources.

```hcl
provider "aws" {
  default_tags {
    tags = {
      Environment = local.environment
      ManagedBy   = "Terraform"
    }
  }
}
```

### Name Tag

Set the `Name` tag explicitly on every resource that surfaces it in the console to make it easier to identify.

```hcl
resource "aws_subnet" "public" {
  # ...
  tags = {
    Name = "network-public-${each.key}-${var.environment}"
  }
}
```
