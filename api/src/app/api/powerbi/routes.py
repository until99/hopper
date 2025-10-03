import logging

from fastapi import APIRouter, HTTPException, Path, Depends
from fastapi.responses import HTMLResponse

from api.powerbi import crud
from api.powerbi.models import (
    GroupSchema,
    ReportSchema,
)
from api.auth.dependencies import get_current_user
from api.user.models import User

logger = logging.getLogger(__name__)

router = APIRouter()


@router.post("/groups/", response_model=GroupSchema, status_code=201)
def create_group(
    *, 
    name: str,
    current_user: User = Depends(get_current_user)
):
    """Create a new Power BI group (workspace)."""

    logger.info(f"Creating PowerBI group with name: {name}")

    try:
        group = crud.post_group(name=name)
        logger.info(f"PowerBI group created successfully with ID: {group.id}")
        return group
    except Exception as e:
        logger.error(f"Error creating PowerBI group '{name}': {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"Error creating PowerBI group: {str(e)}"
        )


@router.get("/groups/", response_model=list[GroupSchema])
def read_all_groups(current_user: User = Depends(get_current_user)):
    """Get all Power BI groups (workspaces)."""

    logger.info("Retrieving all PowerBI groups")

    try:
        groups = crud.get_all_groups()
        print(groups)
        logger.info(f"Retrieved {len(groups)} PowerBI groups successfully")
        return groups
    except Exception as e:
        logger.error(f"Error retrieving PowerBI groups: {str(e)}")
        raise HTTPException(status_code=500, detail="Error retrieving PowerBI groups")


@router.get("/groups/{group_id}/", response_model=GroupSchema)
def read_group(
    group_id: str = Path(..., description="The ID of the PowerBI group"),
    current_user: User = Depends(get_current_user)
):
    """Get a specific Power BI group (workspace)."""

    logger.info(f"Retrieving PowerBI group with ID: {group_id}")

    try:
        group = crud.get_group(id=group_id)
        if not group:
            logger.warning(f"PowerBI group not found with ID: {group_id}")
            raise HTTPException(status_code=404, detail="PowerBI group not found")

        logger.info(f"PowerBI group retrieved successfully: ID {group_id}")
        return group
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error retrieving PowerBI group {group_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Error retrieving PowerBI group")


@router.delete("/groups/{group_id}/", response_model=GroupSchema)
def delete_group(
    group_id: str = Path(..., description="The ID of the PowerBI group"),
    current_user: User = Depends(get_current_user)
):
    """Delete a Power BI group (workspace)."""

    logger.info(f"Deleting PowerBI group with ID: {group_id}")

    try:
        # First check if group exists
        group = crud.get_group(id=group_id)
        if not group:
            logger.warning(
                f"Delete failed - PowerBI group not found with ID: {group_id}"
            )
            raise HTTPException(status_code=404, detail="PowerBI group not found")

        deleted_group = crud.delete_group(id=group_id)
        logger.info(f"PowerBI group {group_id} deleted successfully")
        return deleted_group
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting PowerBI group {group_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Error deleting PowerBI group")


@router.get("/groups/{group_id}/reports/", response_model=list[ReportSchema])
def read_all_reports_in_group(
    group_id: str = Path(..., description="The ID of the PowerBI group"),
    current_user: User = Depends(get_current_user)
):
    """Get all reports in a specific Power BI group (workspace)."""

    logger.info(f"Retrieving all reports in PowerBI group: {group_id}")

    try:
        reports = crud.get_all_reports_in_group(group_id=group_id)
        logger.info(f"Retrieved {len(reports)} reports from PowerBI group {group_id}")
        return reports
    except Exception as e:
        logger.error(
            f"Error retrieving reports from PowerBI group {group_id}: {str(e)}"
        )
        raise HTTPException(
            status_code=500, detail="Error retrieving reports from PowerBI group"
        )


@router.get("/groups/{group_id}/reports/{report_id}/", response_model=ReportSchema)
def read_report_in_group(
    group_id: str = Path(..., description="The ID of the PowerBI group"),
    report_id: str = Path(..., description="The ID of the PowerBI report"),
    current_user: User = Depends(get_current_user)
):
    """Get a specific report in a Power BI group (workspace)."""

    logger.info(f"Retrieving PowerBI report {report_id} from group {group_id}")

    try:
        report = crud.get_report_in_group(report_id=report_id, group_id=group_id)
        if not report:
            logger.warning(f"PowerBI report not found: {report_id} in group {group_id}")
            raise HTTPException(status_code=404, detail="PowerBI report not found")

        logger.info(f"PowerBI report retrieved successfully: {report_id}")
        return report
    except HTTPException:
        raise
    except Exception as e:
        logger.error(
            f"Error retrieving PowerBI report {report_id} from group {group_id}: {str(e)}"
        )
        raise HTTPException(status_code=500, detail="Error retrieving PowerBI report")


@router.get("/reports/{report_id}/embed/", response_class=HTMLResponse)
def get_report_embed(
    report_id: str = Path(..., description="The ID of the PowerBI report"),
    width: int = 800,
    height: int = 600,
    current_user: User = Depends(get_current_user)
):
    """Generate an embed iframe for a Power BI report."""

    logger.info(
        f"Generating embed iframe for PowerBI report: {report_id} (size: {width}x{height})"
    )

    try:
        iframe = crud.generate_report_iframe(
            report_id=report_id, width=width, height=height
        )
        logger.info(f"Embed iframe generated successfully for report: {report_id}")
        return HTMLResponse(content=iframe)
    except Exception as e:
        logger.error(
            f"Error generating embed iframe for PowerBI report {report_id}: {str(e)}"
        )
        raise HTTPException(
            status_code=500, detail="Error generating embed iframe for PowerBI report"
        )
