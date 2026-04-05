terraform {
  backend "s3" {
    bucket       = "sanpo-terraform-state"
    key          = "production/terraform.tfstate"
    region       = "ap-northeast-1"
    use_lockfile = true
    encrypt      = true
  }
}
