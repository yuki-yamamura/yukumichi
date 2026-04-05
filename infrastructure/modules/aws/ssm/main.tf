# -----------------------------------------------------------------------------
# AMI
# -----------------------------------------------------------------------------

data "aws_ami" "amazon_linux" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["al2023-ami-*-arm64"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
}

# -----------------------------------------------------------------------------
# IAM
# -----------------------------------------------------------------------------

resource "aws_iam_role" "this" {
  name = "ssm-${var.environment}"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Service = "ec2.amazonaws.com"
        }
        Action = "sts:AssumeRole"
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "ssm" {
  role       = aws_iam_role.this.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore"
}

resource "aws_iam_instance_profile" "this" {
  name = "ssm-${var.environment}"
  role = aws_iam_role.this.name
}

# -----------------------------------------------------------------------------
# Security Group
# -----------------------------------------------------------------------------

resource "aws_security_group" "this" {
  name        = "ssm-${var.environment}"
  description = "Security group for the SSM bastion"
  vpc_id      = var.vpc_id
}

# Egress: Bastion → RDS (port 5432)
resource "aws_vpc_security_group_egress_rule" "rds" {
  security_group_id = aws_security_group.this.id

  referenced_security_group_id = var.rds_security_group_id
  from_port                    = 5432
  to_port                      = 5432
  ip_protocol                  = "tcp"
}

# Egress: Bastion → SSM endpoints (port 443)
resource "aws_vpc_security_group_egress_rule" "ssm" {
  security_group_id = aws_security_group.this.id

  cidr_ipv4   = "0.0.0.0/0"
  from_port   = 443
  to_port     = 443
  ip_protocol = "tcp"
}

# Ingress on RDS SG: allow traffic from this bastion SG
# SG rules belong to the connection initiator.
resource "aws_vpc_security_group_ingress_rule" "rds_from_ssm" {
  security_group_id = var.rds_security_group_id

  referenced_security_group_id = aws_security_group.this.id
  from_port                    = 5432
  to_port                      = 5432
  ip_protocol                  = "tcp"
}

# -----------------------------------------------------------------------------
# EC2
# -----------------------------------------------------------------------------

resource "aws_instance" "this" {
  ami                  = data.aws_ami.amazon_linux.id
  instance_type        = "t4g.nano"
  subnet_id            = var.subnet_id
  iam_instance_profile = aws_iam_instance_profile.this.name

  vpc_security_group_ids = [aws_security_group.this.id]

  metadata_options {
    http_tokens                 = "required"
    http_put_response_hop_limit = 2
    http_endpoint               = "enabled"
  }

  tags = {
    Name = "ssm-${var.environment}"
  }
}
