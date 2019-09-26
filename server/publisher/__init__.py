__version__ = "0.1"


import superdesk


def init_app(app):
    superdesk.privilege(name="publisher_dashboard", label="Publisher Dashboard")
