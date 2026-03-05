from pydantic import BaseModel


class MatchResponse(BaseModel):
    """ Response model for the match endpoint.

    Attributes:
        match_percentage (int): The match percentage between the CV and the vacancy.
        matched_skills (list[str]): The skills that are matched between the CV and the vacancy.
        missing_skills (list[str]): The skills that are missing from the CV.
        motivation_letter (str): The motivation letter for the match.
        match_text (str): The text of the match.
    """
    match_percentage: int
    matched_skills: list[str]
    missing_skills: list[str]
    motivation_letter: str
    match_text: str
