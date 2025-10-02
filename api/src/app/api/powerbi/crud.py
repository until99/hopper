from api.powerbi.models import (
    GroupSchema,
    GroupUpdateSchema,
    ReportSchema,
    ReportUpdateSchema,
)
# import requests

from api.powerbi.utils import acquire_bearer_token
from pbipy import PowerBI

import logging

logger = logging.getLogger(__name__)
bearer_token = acquire_bearer_token()


def check_if_bearer_token_exists() -> str:
    if bearer_token is not None:
        return bearer_token
    else:
        raise ValueError("Bearer token is not available.")


# Powerbi Groups
def get_group(id):
    """Get a specific Power BI group."""
    pbi = PowerBI(check_if_bearer_token_exists())
    group = pbi.group(
        group_id=id,
    )
    print(group)
    return group


def get_all_groups():
    """Get all Power BI groups."""
    pbi = PowerBI(check_if_bearer_token_exists())
    groups = pbi.groups()
    return groups


def post_group(name):
    """Create a new Power BI group."""
    pbi = PowerBI(check_if_bearer_token_exists())
    group = pbi.create_group(name=name)
    return group


def delete_group(id):
    """Delete a Power BI group."""
    pbi = PowerBI(check_if_bearer_token_exists())
    group = pbi.delete_group(group=id)
    return group


# Powerbi Reports
# def get_report(report_id):
#     """Get a specific Power BI report."""
#     pbi = PowerBI(check_if_bearer_token_exists())
#     groups = get_all_groups()
#     for group in groups:
#         reports = get_all_reports_in_group(group.id)
#         for report in reports:
#             if report.id == report_id:
#                 return report
#     return None


def get_report_in_group(report_id, group_id):
    """Get a specific report in a Power BI group."""
    pbi = PowerBI(check_if_bearer_token_exists())
    report = pbi.report(
        report=report_id,
        group=group_id,
    )
    print(report)
    return report


def get_all_reports_in_group(group_id):
    """Get all reports in a Power BI group."""
    pbi = PowerBI(check_if_bearer_token_exists())
    reports = pbi.reports(
        group=group_id,
    )
    print(reports)
    return reports


def generate_report_iframe(report_id, width, height):
    """Generate an iframe for a Power BI report."""
    iframe = f"<iframe width='{width}' height='{height}' src='https://app.powerbi.com/reportEmbed?reportId={report_id}&autoAuth=true' frameborder='0' allowFullScreen='true'></iframe>"
    print(iframe)
    return iframe


# def refresh_report(report_id):
#     """Refresh a Power BI report."""
#     pbi = PowerBI(check_if_bearer_token_exists())

#     requests.post(
#         f"https://api.powerbi.com/v1.0/myorg/reports/{report_id}/Refresh",
#         headers={
#             "Authorization": f"Bearer {check_if_bearer_token_exists()}",
#             "Content-Type": "application/json"
#         }
#     )

#     return report
