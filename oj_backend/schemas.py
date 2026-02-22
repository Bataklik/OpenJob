from pydantic import BaseModel


class TargetJobRequest(BaseModel):
    text:str
