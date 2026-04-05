# The SG is an empty shell — ingress rules are managed by
# the connection initiator modules (lambda, ssm).
resource "aws_security_group" "this" {
  name        = "db-${var.environment}"
  description = "Security group for the database"
  vpc_id      = var.vpc_id
}

resource "aws_db_subnet_group" "this" {
  name       = var.db_subnet_group_name
  subnet_ids = var.private_subnet_ids
}

resource "aws_db_instance" "this" {
  identifier     = var.identifier
  engine         = "postgres"
  engine_version = var.engine_version
  instance_class = var.instance_class

  allocated_storage  = var.allocated_storage
  storage_type       = "gp3"
  iops               = 3000
  storage_throughput = 125
  storage_encrypted  = true

  db_name  = var.db_name
  username = var.username

  db_subnet_group_name   = aws_db_subnet_group.this.name
  vpc_security_group_ids = [aws_security_group.this.id]
  publicly_accessible    = false
  network_type           = "IPV4"

  multi_az = false

  backup_retention_period = 7
  backup_window           = "18:21-18:51"
  maintenance_window      = "sat:17:00-sat:17:30"
  copy_tags_to_snapshot   = true

  auto_minor_version_upgrade = false
  ca_cert_identifier         = "rds-ca-rsa2048-g1"

  enabled_cloudwatch_logs_exports = ["postgresql"]
  deletion_protection             = true
  skip_final_snapshot             = false
  final_snapshot_identifier       = "${var.identifier}-final"

  engine_lifecycle_support = "open-source-rds-extended-support-disabled"

  lifecycle {
    ignore_changes = [password]
  }
}
