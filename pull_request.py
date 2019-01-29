from dataclasses import asdict, dataclass
from datetime import datetime

TIME_FORMAT = "%Y-%m-%dT%H:%M:%SZ"

def parse_date(date_str):
    return datetime.strptime(date_str, TIME_FORMAT)


def open_duration(pull_request):
    """ Duration between open & closed in days
    """
    created = parse_date(pull_request["created_at"])
    merged = parse_date(pull_request["merged_at"])
    return (merged - created).seconds


@dataclass
class PullRequest:
    id: int
    number: int
    state: str

    created_at: datetime
    updated_at: datetime
    closed_at: datetime
    merged_at: datetime
    open_duration: datetime

    title: str
    body: str

    author_login: str
    merged_by_login: str

    merged: bool

    comments: int
    review_comments: int
    maintainer_can_modify: bool

    commits: int
    additions: int
    deletions: int
    changed_files: int

    @staticmethod
    def deserialize(pr):
        return asdict(PullRequest.from_json(pr))

    @staticmethod
    def from_json(pr):
        return PullRequest(
            id=pr["id"],
            number=pr["number"],
            state=pr["state"],

            created_at=parse_date(pr["created_at"]),
            updated_at=parse_date(pr["updated_at"]),
            closed_at=parse_date(pr["closed_at"]),
            merged_at=parse_date(pr["merged_at"]),
            open_duration=open_duration(pr),

            title=pr["title"],
            body=pr["body"],

            author_login=pr["user"]["login"],
            merged_by_login=pr["merged_by"]["login"] if "merged_by" in pr and
            pr["merged_by"] is not None else
            None,

            merged=pr["merged"],

            comments=pr["comments"],
            review_comments=pr["review_comments"],
            maintainer_can_modify=pr["maintainer_can_modify"],

            commits=pr["commits"],
            additions=pr["additions"],
            deletions=pr["deletions"],
            changed_files=pr["changed_files"]
        )

