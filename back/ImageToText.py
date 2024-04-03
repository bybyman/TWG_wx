import base64
from openai import OpenAI
def ImageToText_Handle():
    client = OpenAI(
        base_url="https://api.rcouyi.com/v1",
        api_key="sk-VRZJipcSsramiTy30709BfAfC43c432cA7A32036Cd6938Fd"
    )
    with open('Image2Text.jpg', "rb") as image_file:
        base64_image= base64.b64encode(image_file.read()).decode('utf-8')
        response = client.chat.completions.create(
            model="gpt-4-vision-preview",
            messages=[
                {
                    "role": "user",
                    "content": [
                        # {"type": "text", "text": "Please describe the above picture, the content of the description should correspond to the content in the picture, in addition, you can use more adjectives or use some rhetorical devices to describe"},
                        {"type": "text",
                         "text": "请详细生动地描述这张图片的内容"},
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": f"data:image/jpeg;base64,{base64_image}",
                            },
                        },
                    ],
                }
            ],
            max_tokens=300,
        )
    return response.choices[0].message.content
