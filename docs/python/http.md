# http 项目

## 创建项目目录

1. 目录

    ```shell
    project/
    ├── app/
    │   ├── __init__.py
    │   ├── models/
    │   │   ├── __init__.py
    │   │   └── user.py
    │   ├── services/
    │   │   ├── __init__.py
    │   │   └── chat_service.py
    │   ├── routes/
    │   │   ├── __init__.py
    │   │   └── api.py
    │   ├── ws/
    │   │   ├── __init__.py
    │   │   └── chat_ws.py
    ├── run.py
    └── requirements.txt
    ```

1. requirements.txt

    ```shell
    flask
    flask-socketio
    eventlet
    flask_sqlalchemy
    ```

1. run.py

    ```python
    from app import create_app, socketio

    app = create_app()

    if __name__ == '__main__':
        socketio.run(app, host='0.0.0.0', port=5000)
    ```

1. `app/__init__.py`


    ```python
    from flask import Flask
    from flask_socketio import SocketIO
    from .routes import register_routes
    from .models import db, init_db

    socketio = SocketIO(cors_allowed_origins="*")

    def create_app():
        app = Flask(__name__)
        app.config['SECRET_KEY'] = 'chat-secret'
        app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///chat.db'
        app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

        db.init_app(app)
        init_db(app)
        register_routes(app)
        socketio.init_app(app)

        return app
    ```

1. `app/routes/__init__.py`

    ```python
    from .chat import chat_bp

    def register_routes(app):
        app.register_blueprint(chat_bp, url_prefix="/api/chat")
    ```

1. `app/routes/chat.py`

    ```python
    from flask import Blueprint, request, jsonify
    from app.services.chat_service import save_message, get_messages

    chat_bp = Blueprint("chat", __name__)

    @chat_bp.route("/", methods=["POST"])
    def post_message():
        data = request.json
        username = data.get("username")
        message = data.get("message")

        if not username or not message:
            return jsonify({"error": "Username and message are required"}), 400

        save_message(username, message)
        return jsonify({"status": "Message saved"}), 201

    @chat_bp.route("/", methods=["GET"])
    def fetch_messages():
        return jsonify(get_messages())
    ```

1. `app/services/chat_service.py`

    ```python 
    from app.models import db, ChatMessage
    from datetime import datetime

    def save_message(username, message):
        msg = ChatMessage(username=username, message=message, timestamp=datetime.utcnow())
        db.session.add(msg)
        db.session.commit()

    def get_messages(limit=50):
        messages = ChatMessage.query.order_by(ChatMessage.timestamp.desc()).limit(limit).all()
        return [
            {
                "id": msg.id,
                "username": msg.username,
                "message": msg.message,
                "timestamp": msg.timestamp.isoformat()
            }
            for msg in reversed(messages)
        ]
    ```

1. `app/apis/chat_api.py`

    ```python
    from flask import Blueprint, request, jsonify
    from app.services.chat_service import ChatService

    chat_bp = Blueprint('chat', __name__, url_prefix='/api/chat')


    @chat_bp.route('/send', methods=['POST'])
    def send_message():
        data = request.get_json()
        username = data.get('username')
        message = data.get('message')

        if not username or not message:
            return jsonify({'error': 'username and message required'}), 400

        ChatService.store_message(username, message)
        return jsonify({'status': 'ok'})


    @chat_bp.route('/history', methods=['GET'])
    def get_history():
        messages = ChatService.get_messages()
        return jsonify(messages)
    ```

1. `app/services/chat_service.py`

```python
from app.models import db, Message
from datetime import datetime

class ChatService:
    @staticmethod
    def store_message(username, message):
        msg = Message(username=username, message=message, timestamp=datetime.utcnow())
        db.session.add(msg)
        db.session.commit()

    @staticmethod
    def get_messages(limit=100):
        messages = Message.query.order_by(Message.timestamp.desc()).limit(limit).all()
        return [
            {
                'username': m.username,
                'message': m.message,
                'timestamp': m.timestamp.isoformat() + 'Z'
            }
            for m in reversed(messages)
        ]
```
