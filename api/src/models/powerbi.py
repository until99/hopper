from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
from datetime import datetime


class ReportUpdateRequest(BaseModel):
    model_config = ConfigDict(extra="ignore")

    name: str


class Report(BaseModel):
    model_config = ConfigDict(extra="ignore", populate_by_name=True)

    id: str
    name: str
    dataset_id: str = Field(alias="datasetId")
    dataset_workspace_id: Optional[str] = Field(alias="datasetWorkspaceId", default=None)
    web_url: Optional[str] = Field(alias="webUrl", default=None)
    embed_url: Optional[str] = Field(alias="embedUrl", default=None)
    is_from_pbix: Optional[bool] = Field(alias="isFromPbix", default=None)
    is_owned_by_me: Optional[bool] = Field(alias="isOwnedByMe", default=None)


class Group(BaseModel):
    model_config = ConfigDict(extra="ignore", populate_by_name=True)

    id: str
    name: str
    description: Optional[str] = None
    is_on_dedicated_capacity: bool = Field(alias="isOnDedicatedCapacity")


class Dataset(BaseModel):
    model_config = ConfigDict(extra="ignore", populate_by_name=True)

    id: str
    name: str
    group_id: Optional[str] = Field(alias="groupId", default=None)
    configured_by: Optional[str] = Field(alias="configuredBy", default=None)
    is_refreshable: Optional[bool] = Field(alias="isRefreshable", default=None)


class DatasetRefresh(BaseModel):
    model_config = ConfigDict(extra="ignore", populate_by_name=True)

    id: Optional[str] = None
    refresh_type: Optional[str] = Field(alias="refreshType", default=None)
    start_time: Optional[datetime] = Field(alias="startTime", default=None)
    end_time: Optional[datetime] = Field(alias="endTime", default=None)
    status: Optional[str] = None
    service_exception_json: Optional[str] = Field(
        alias="serviceExceptionJson", default=None
    )


class RefreshSchedule(BaseModel):
    model_config = ConfigDict(extra="ignore", populate_by_name=True)

    days: List[str]
    times: List[str]
    enabled: bool
    local_time_zone_id: str = Field(alias="localTimeZoneId")
    notify_option: str = Field(alias="notifyOption")


class ImportInfo(BaseModel):
    model_config = ConfigDict(extra="ignore", populate_by_name=True)

    id: str
    import_state: str = Field(alias="importState")
    created_date_time: datetime = Field(alias="createdDateTime")
    updated_date_time: datetime = Field(alias="updatedDateTime")
    name: str
    connection_type: Optional[str] = Field(alias="connectionType", default=None)
    source: Optional[str] = None


class DeleteResponse(BaseModel):
    model_config = ConfigDict(extra="ignore")

    status: str
    status_code: int


# Response containers
class GroupsResponse(BaseModel):
    model_config = ConfigDict(extra="ignore")

    value: List[Group]


class ReportsResponse(BaseModel):
    model_config = ConfigDict(extra="ignore")

    value: List[Report]


class DatasetsResponse(BaseModel):
    model_config = ConfigDict(extra="ignore")

    value: List[Dataset]


class DatasetRefreshesResponse(BaseModel):
    model_config = ConfigDict(extra="ignore")

    value: List[DatasetRefresh]
