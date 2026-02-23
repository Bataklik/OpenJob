from pydantic import BaseModel

class MatchRequest(BaseModel):
    cv_text:str
    vacancy_text:str
