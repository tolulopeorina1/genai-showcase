provider "aws" {
  region = "us-east-1" # Change to your desired region
}

# # AMPLIFY SERVICE ROLE
# resource "aws_iam_role" "amplify_role" {
#     name = "amplify_service_role"
#     assume_role_policy = <<EOF
# {
#   "Version": "2012-10-17",
#   "Statement": [
#     {
#       "Effect": "Allow",
#       "Principal": {
#         "Service": "amplify.amazonaws.com"
#       },
#       "Action": "sts:AssumeRole"
#     }
#   ]
# }
# EOF
# }

# resource "aws_iam_policy" "cloudwatch_logs_policy" {
#   name        = "CloudWatchLogsPolicy"
#   description = "Policy for managing CloudWatch Logs resources"

#   policy = jsonencode({
#     Version = "2012-10-17",
#     Statement = [
#       {
#         Effect   = "Allow",
#         Action   = [
#           "logs:CreateLogStream",
#           "logs:CreateLogGroup",
#           "logs:DescribeLogGroups",
#           "logs:PutLogEvents"
#         ],
#         Resource = "*"
#       }
#     ]
#   })
# }


# resource "aws_iam_role_policy_attachment" "amplify_codecommit_attachment" {
#   role       = aws_iam_role.amplify_role.name
#   policy_arn = "arn:aws:iam::aws:policy/AWSCodeCommitFullAccess"
# }


# resource "aws_iam_role_policy_attachment" "cloudwatch_logs_policy_attachment" {
#   role       = aws_iam_role.amplify_role.name
#   policy_arn = aws_iam_policy.cloudwatch_logs_policy.arn
# }

resource "aws_amplify_app" "cil-gen-ai-use-cases" {
  name       = "cil-gen-ai-use-cases"
  repository = "https://git-codecommit.us-east-1.amazonaws.com/v1/repos/cil-gen-ai-use-cases"

  build_spec = file("${path.root}/../../amplify.yml")

  # Auto Branch
  enable_auto_branch_creation   = true
  enable_branch_auto_deletion   = true
  # auto_branch_creation_patterns = ["main", "dev", ] // default is just main
  # auto_branch_creation_config {
  #   enable_auto_build           = true
  #   enable_pull_request_preview = false
  #   enable_performance_mode     = false
  #   framework                   = "Next.js - SSR"
  # }
  
  platform = "WEB_COMPUTE" # Important for Next.js application
  # The default rewrites and redirects added by the Amplify Console.
  # custom_rule {
  #   source = "/<*>"
  #   status = "404"
  #   target = "/index.html"
  # }
  
  iam_service_role_arn = "arn:aws:iam::165553610930:role/amplify_service_role"
  
  environment_variables = {
    # CODECOMMIT_REPO_ID  = "e494320c-2de1-4708-8e6d-3636bebc2129"
    # USER_POOL_ID        = "us-east-1_UgMHhEUnI"
    # APP_CLIENT_ID       = "1bgilld04aolmv61jc00h4mq9q"
    REGION = "us-east-1"
    AMPLIFY_MONOREPO_APP_ROOT = "web-content"
  }
}

resource "aws_amplify_branch" "main_prod" {
  app_id      = aws_amplify_app.cil-gen-ai-use-cases.id
  branch_name = "main"
  
  enable_auto_build = true

  framework = "Next.js - SSR"
  stage     = "PRODUCTION"

}

