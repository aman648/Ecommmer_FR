from flask_jwt_extended import create_access_token
import datetime
def generateJWT(username):
    expiration = datetime.timedelta(hours=1)
    token = create_access_token(identity=username, expires_delta=expiration)
    return token