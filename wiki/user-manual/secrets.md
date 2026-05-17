# Secret Management

Secrets live in AWS SSM Parameter Store as `SecureString` parameters. Terraform reads them via `data` sources; the values themselves are created and rotated out-of-band so they never appear in source code or commit history.

## Naming

`/{product}/{environment}/{component}/{key}`

Example: `/yukumichi/production/db/password`.

## Add a new secret

```bash
aws ssm put-parameter \
  --name /yukumichi/production/<component>/<key> \
  --type SecureString \
  --value '<value>'
```

Then declare it in Terraform:

```hcl
data "aws_ssm_parameter" "<key>" {
  name = "/yukumichi/production/<component>/<key>"
}
```

Reference `data.aws_ssm_parameter.<key>.value` from the resource that consumes it. Mark the consuming field with `lifecycle { ignore_changes = [<field>] }` so subsequent rotations do not trigger drift on a `terraform plan`.

## Rotate a secret

```bash
aws ssm put-parameter \
  --name /yukumichi/production/<component>/<key> \
  --type SecureString \
  --value '<new-value>' \
  --overwrite
```

After rotation, restart consumers that read the value at startup (Lambda picks up the new value on the next cold start; long-lived processes do not).

## Plaintext in Terraform state

Reading a `SecureString` via `data "aws_ssm_parameter"` materialises the plaintext value into Terraform state. We accept this because the state bucket (`yukumichi-terraform-state`) is private and read access is restricted to a small number of operators with admin-level credentials.
