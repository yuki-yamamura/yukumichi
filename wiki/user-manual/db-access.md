# Production DB Access

Connect a local client (e.g. TablePlus) to the production RDS through an SSM port-forwarding tunnel via the bastion EC2.

## Prerequisites

- AWS Session Manager plugin installed locally
- `AWS_PROFILE=yukumichi-production` exported
- Signed in: `aws sso login --sso-session yukumichi`

## Connect

Run the following commands in a terminal to start the tunnel:

```bash
# Resolve bastion instance id
BASTION_ID=$(aws ec2 describe-instances \
  --filters "Name=tag:Name,Values=ssm-production" \
  --query 'Reservations[0].Instances[0].InstanceId' --output text)

# Start bastion and RDS (skip if already running)
aws ec2 start-instances --instance-ids $BASTION_ID
aws ec2 wait instance-running --instance-ids $BASTION_ID
aws rds start-db-instance --db-instance-identifier yukumichi-db

# Wait until SSM registers the bastion (~30-90s)
until aws ssm describe-instance-information \
  --filters "Key=InstanceIds,Values=$BASTION_ID" \
  --query 'InstanceInformationList[0].PingStatus' \
  --output text 2>/dev/null | grep -q "Online"; do sleep 10; done

# Open the tunnel (keep this terminal open)
aws ssm start-session \
  --target $BASTION_ID \
  --document-name AWS-StartPortForwardingSessionToRemoteHost \
  --parameters '{
    "host": ["yukumichi-db.cf8mkcmsyk9k.ap-northeast-1.rds.amazonaws.com"],
    "portNumber": ["5432"],
    "localPortNumber": ["5432"]
  }'
```

You can now connect to `localhost:5432` from your DB client with the credentials stored in SSM Parameter Store.

```bash
aws ssm get-parameter \
  --name /yukumichi/production/db/password \
  --with-decryption \
  --query 'Parameter.Value' --output text
```

## Disconnect

Ctrl+C the tunnel terminal, then stop the bastion and RDS:

```bash
aws ec2 stop-instances --instance-ids $BASTION_ID
aws rds stop-db-instance --db-instance-identifier yukumichi-db
```
