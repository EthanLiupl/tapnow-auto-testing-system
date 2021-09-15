dir=$1
aws s3 sync ~/Downloads/allure_test_report_html s3://tapnow-dev/doc/testing-reports/${dir}