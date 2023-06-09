# Sprinkler Util
Utility functions for use within `sprinkler` python tasks.

## get_request_body
Use this function to get the request body if it exists.
Optionally convert it to JSON with the `as_json` argument.
Will return `None` if there is no request body.
```python
from sprinkler_util import get_request_body
body = get_request_body(as_json=True)
if body is None:
    raise Exception("NO REQUEST BODY")
...
```

## get_secret
Use this function to get a secret value. Case insensitive.
If the secret is not set, then a `SprinklerSecretNotSetException` will be raised.
```python
from sprinkler_util import get_secret

api_key = get_secret("GOOGLE_API_KEY")
...

```

## send_response
This function is used to send a response for a `call-and-response` type job.

**Only call this function once.**

Internally this function wraps what you pass to it in `json.dumps`.
```python
from sprinkler_util import send_response

send_response("hello world")
```
