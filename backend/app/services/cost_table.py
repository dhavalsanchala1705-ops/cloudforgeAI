# Static AWS monthly price lookup table (USD)
# These are approximate on-demand prices for us-east-1 as of 2024
# AI must ONLY use these prices — never invent its own

AWS_PRICE_TABLE = {
    # Compute
    "EC2 t2.micro": 8.47,
    "EC2 t3.micro": 7.59,
    "EC2 t3.small": 15.18,
    "EC2 t3.medium": 30.37,
    "EC2 t3.large": 60.74,
    "EC2 t3.xlarge": 121.47,
    "EC2 t3.2xlarge": 242.94,
    "EC2 m5.large": 70.08,
    "EC2 m5.xlarge": 140.16,
    "EC2 c5.large": 62.05,
    "ECS Fargate (1 vCPU, 2GB, 730h)": 35.56,
    "EKS Cluster": 73.00,
    "Lambda (1M requests, 512MB)": 1.00,
    "Lambda (10M requests, 512MB)": 8.34,
    # Databases
    "RDS PostgreSQL db.t3.micro": 15.33,
    "RDS PostgreSQL db.t3.small": 30.66,
    "RDS PostgreSQL db.t3.medium": 61.32,
    "RDS PostgreSQL db.m5.large": 138.70,
    "RDS Aurora Serverless v2 (min)": 48.96,
    "DynamoDB (25GB free tier)": 0.00,
    "DynamoDB (100GB, 1M reads/writes)": 25.00,
    "ElastiCache Redis t3.micro": 11.52,
    "ElastiCache Redis t3.small": 23.04,
    # Storage
    "S3 (10GB, standard)": 0.23,
    "S3 (100GB, standard)": 2.30,
    "S3 (1TB, standard)": 23.00,
    "EBS gp3 (20GB)": 1.60,
    "EBS gp3 (100GB)": 8.00,
    # Networking
    "CloudFront (100GB transfer)": 8.50,
    "CloudFront (1TB transfer)": 85.00,
    "ALB (Application Load Balancer)": 22.27,
    "NAT Gateway (100GB)": 14.50,
    "API Gateway (1M requests)": 3.50,
    # Auth & Security
    "Cognito (0-10k MAU)": 0.00,
    "Cognito (10k-50k MAU)": 0.0055,
    "WAF (1M requests)": 6.00,
    "Secrets Manager (10 secrets)": 0.40,
    # Monitoring
    "CloudWatch (basic)": 0.00,
    "CloudWatch (detailed, 10 metrics)": 3.00,
    "CloudWatch Logs (10GB)": 5.00,
    # Other
    "SES (10k emails)": 1.00,
    "SQS (1M requests)": 0.40,
    "SNS (1M notifications)": 0.50,
    "Route 53 (hosted zone)": 0.50,
    "ACM (certificate)": 0.00,
}


def get_price_table_text() -> str:
    """Returns the price table as a formatted string for injection into the AI prompt."""
    lines = [
        "AWS SERVICE PRICE LOOKUP TABLE (USD/month, us-east-1, approximate on-demand):"
    ]
    for service, price in AWS_PRICE_TABLE.items():
        lines.append(f"  {service}: ${price:.2f}")
    return "\n".join(lines)
