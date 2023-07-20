from hcp_server.context import app
from hcp_server import generate
from hcp_server import train
from hcp_server import dataset
from hcp_server import file
from hcp_server import pt

if __name__ == '__main__':
    app.run(port=3001)
