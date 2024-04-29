import os
import sys
import base64
import requests
import torch.utils.data.distributed
import torchvision.transforms as transforms
from dataset import BuildingData
from torch.autograd import Variable
from flask import Flask, render_template, request, jsonify
import json
import numpy as np
import cv2
import StyleTransfer
from ImageToText import ImageToText_Handle
import shutil

app = Flask(__name__)

classes = ['古乐坊', '好风徐来', '起凤亭', '神风亭', '太极广场', '腾蛟亭',
           '滕王阁', '滕王台', '压江亭', '挹翠亭', '悠然亭', '章江晓渡', '长天秋水']
transform_test = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize([0.5, 0.5, 0.5], [0.5, 0.5, 0.5])
])
DEVICE = torch.device("cpu")
model = torch.load("./database/model.pth", map_location=DEVICE)
model.eval()
model.to(DEVICE)

users = []
with open('./database/usersheet.json', 'r', encoding='utf-8') as f:
    users = json.load(f)


@app.route('/')
def hello_world():
    return 'Hello World!'


@app.route('/te', methods=['POST'])
def te():
    return jsonify({'code': 200, 'data': 'success'})


@app.route('/login', methods=['POST'])
def login():
    data = request.get_data()
    data = json.loads(data)
    openid = data['openid']
    user = list(filter(lambda t: t['openid'] == openid, users))
    if len(user) == 0:
        user = register(openid)
    else:
        user = user[0]
    return jsonify({'code': 200, 'data': user})


@app.route('/modifyUserData', methods=['POST'])
def modifyUserData():
    data = json.loads(request.get_data())
    userInfo = data['userInfo']
    print(userInfo)
    if data['avatar'] != '':
        img_data = base64.b64decode(data['avatar'])
        with open('C:/upload/images/avatars/' + userInfo['openid'] + '.jpg', 'wb') as fp:
            fp.write(img_data)
    user = list(filter(lambda t: t['openid'] == userInfo['openid'], users))[0]
    print(user)
    idx = users.index(user)
    users[idx] = userInfo
    with open('./database/usersheet.json', 'w', encoding='utf-8') as f:
        json.dump(users, f, ensure_ascii=False, indent=4)
    return jsonify({'code': 200, 'data': 'success'})


@app.route('/onRecognition', methods=['POST'])
def onRecognition():
    data = request.get_data()
    data = json.loads(data)
    print(data)
    # filePath = data['imgPath']
    img_data = base64.b64decode(data['imgPath'])

    with open('C:/upload/images/recog.jpg', 'wb') as fp:
        fp.write(img_data)
    dataset_test = BuildingData('C:/upload/images/recog.jpg', transform_test, test=True)
    res = -1

    for index in range(len(dataset_test)):
        item = dataset_test[index]
        img, label = item
        img.unsqueeze_(0)
        data = Variable(img).to(DEVICE)
        output = model(data)
        _, pred = torch.max(output.data, 1)
        # print('Image Name:{},predict:{}'.format(dataset_test.imgs[index], classes[pred.data.item()]))
        res = classes[pred.data.item()]
        # print('Image Name:{},predict:{}'.format(1, classes[pred.data.item()]))
        # sys.stdout = classes[pred.data.item()]
        index += 1

    return jsonify({'code': 200, 'data': res})


@app.route('/getSceneData', methods=['GET'])
def getSceneData():
    with open('./database/scenes.json', 'r', encoding='utf-8') as f:
        data = json.load(f)
    return jsonify({'code': 200, 'data': data})


@app.route('/getRouteData', methods=['GET'])
def getRouteData():
    with open('./database/plan.json', 'r', encoding='utf-8') as f:
        data = json.load(f)
    return jsonify({'code': 200, 'data': data})


@app.route('/getComment', methods=['GET'])
def getComment():
    with open('./database/comment.json', 'r', encoding='utf-8') as f:
        data = json.load(f)
    return jsonify({'code': 200, 'data': data})


@app.route('/postComment', methods=['POST'])
def postComment():
    data = json.loads(request.get_data())
    print(data)
    with open('./database/comment.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=4)
    return jsonify({'code': 200, 'data': 'success'})


@app.route('/modifySceneData', methods=['POST'])
def modifySceneData():
    data = request.get_data()
    data = json.loads(data)
    print(data)
    with open('./database/scenes.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=4)
    return jsonify({'code': 200, 'data': 'success'})


@app.route('/modifyRouteData', methods=['POST'])
def modifyRouteData():
    data = request.get_data()
    data = json.loads(data)
    print(data)
    with open('./database/plan.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=4)
    return jsonify({'code': 200, 'data': 'success'})


@app.route('/getScenePhoto', methods=['POST'])
def getScenePhoto():
    Id = json.loads(request.get_data())['Id']
    dirs = os.listdir('C:/upload/scenePhotos/' + Id)
    for i in range(len(dirs)):
        dirs[i] = 'http://47.99.147.35:8081/images/scenePhotos/' + Id + dirs[i]
    return jsonify({'code': 200, 'data': dirs})


@app.route('/getRoutePhoto', methods=['POST'])
def getRoutePhoto():
    Id = json.loads(request.get_data())['Id']
    dirs = os.listdir('C:/upload/routePhotos/' + Id)
    for i in range(len(dirs)):
        dirs[i] = 'http://47.99.147.35:8081/images/routePhotos/' + Id + dirs[i]
    return jsonify({'code': 200, 'data': dirs})


@app.route('/publicScenePhoto', methods=['POST'])
def publicScenePhoto():
    data = json.loads(request.get_data())
    Id = data['Id']
    img_data = base64.b64decode(data['imgPath'])
    rname = randomStr(Id)
    with open('C:/upload/images/scenePhotos/' + Id + '/' + rname + '.jpg', 'wb') as fp:
        fp.write(img_data)
    return jsonify({'code': 200, 'innerPath': 'images/scenePhotos/' + Id + '/' + rname + '.jpg'})


@app.route('/publicRoutePhoto', methods=['POST'])
def publicRoutePhoto():
    data = json.loads(request.get_data())
    Id = data['Id']
    img_data = base64.b64decode(data['imgPath'])
    rname = randomStr(Id)
    with open('C:/upload/images/routePhotos/' + Id + '/' + rname + '.jpg', 'wb') as fp:
        fp.write(img_data)
    return jsonify({'code': 200, 'innerPath': 'images/routePhotos/' + Id + '/' + rname + '.jpg'})

@app.route('/publicCommentPhoto', methods=['POST'])
def publicCommentPhoto():
    data = json.loads(request.get_data())
    img_data = base64.b64decode(data['imgPath'])
    rname = randomStr(0)
    with open('C:/upload/images/commentPhotos/' + rname + '.jpg', 'wb') as fp:
        fp.write(img_data)
    return jsonify({'code': 200, 'innerPath': 'images/commentPhotos/' + rname + '.jpg'})
def randomStr(Id, randomlength=12):
    str = ''
    chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    length = len(chars) - 1
    import random
    for i in range(randomlength):
        str += chars[random.randint(0, length)]
    if os.path.exists('C:/upload/scenePhotos/Id/' + str + '.jpg'):
        str = randomStr(Id)
    return str


@app.route('/DIPUpload', methods=['POST'])
def DIPUpload():
    img_localpath = 'DIP/origin.jpg'
    data = request.get_data()
    data = json.loads(data)
    img_data = base64.b64decode(data['imgPath'])
    with open(img_localpath, 'wb') as fp:
        fp.write(img_data)
    return jsonify({'code': 200, 'data': img_localpath})


@app.route('/DIP', methods=['POST'])
def DIP():
    data = request.get_data()
    data = json.loads(data)
    opration = data['operation']
    img_localpath = 'DIP/origin.jpg'
    img = cv2.imread(img_localpath)
    img_localpatha = ''
    print(opration)
    if opration == 'gray':
        img_localpatha = 'DIP/gray.jpg'
        img = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        cv2.imwrite(img_localpatha, img)
    elif opration == 'compress':
        img_localpatha = 'DIP/compress.jpg'
        height, width, channels = img.shape
        compress_ratio = 0.75  # 改为可调参数
        compress_height = int(height * compress_ratio)
        compress_width = int(width * compress_ratio)
        compressed_img = cv2.resize(img, (compress_width, compress_height))
        cv2.imwrite(img_localpatha, compressed_img)
    elif opration == 'sharpen':
        img_localpatha = 'DIP/sharpen.jpg'
        sharp_kernel = np.array([[0, -1, 0],
                                 [-1, 5, -1],
                                 [0, -1, 0]])
        sharpened_img = cv2.filter2D(img, -1, sharp_kernel)
        cv2.imwrite(img_localpatha, sharpened_img)
    elif opration == 'ICS':
        img_localpatha = 'DIP/ICS.jpg'
        hsv_img = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
        hsv_img[:, :, 1] = hsv_img[:, :, 1] * 1.2
        final_img = cv2.cvtColor(hsv_img, cv2.COLOR_HSV2BGR)
        cv2.imwrite(img_localpatha, final_img)
    elif opration == 'Rr':
        img_localpatha = 'DIP/Rr.jpg'
        height, width = img.shape[:2]
        rotated_img = np.zeros((width, height, 3), dtype=np.uint8)
        for i in range(width):
            for j in range(height):
                rotated_img[i, j] = img[height - j - 1, i]
        cv2.imwrite(img_localpatha, rotated_img)
    elif opration == 'Rl':
        img_localpatha = 'DIP/Rl.jpg'
        height, width = img.shape[:2]
        rotated_img = np.zeros((width, height, 3), dtype=np.uint8)
        for i in range(width):
            for j in range(height):
                rotated_img[i, j] = img[j, width - i - 1]
        cv2.imwrite(img_localpatha, rotated_img)
    elif opration == 'koutu':
        img_localpatha = koutu()

    return jsonify({'code': 200, 'data': img_localpatha})


@app.route('/styleTransfer', methods=['POST'])
def styleTransfer():
    data = request.get_data()
    data = json.loads(data)
    img_data = base64.b64decode(data['imgPath'])
    with open('StyleTransfer/input/img.png', 'wb') as fp:
        fp.write(img_data)

    StyleTransfer.styleTransfer()

    return jsonify({'code': 200, 'data': 'StyleTransfer/output/img.png'})


@app.route('/imageToText', methods=['POST'])
def imageToText():
    data = request.get_data()
    data = json.loads(data)
    img_data = base64.b64decode(data['imgPath'])
    with open('Image2Text.jpg', 'wb') as fp:
        fp.write(img_data)
    return jsonify({'code': 200, 'data': ImageToText_Handle()})


API_KEY = 'wxos57mdj907zy5yg'


def koutu(return_type=2):
    headers = {'X-API-KEY': API_KEY}
    data = {'sync': '1'}
    files = {'image_file': open('DIP/origin.jpg', 'rb')}
    url = 'https://techsz.aoscdn.com/api/tasks/visual/segmentation'

    # Create a task
    response = requests.post(url, headers=headers, data=data, files=files)

    response_json = response.json()
    if 'status' in response_json and response_json['status'] == 200:
        result_tag = 'failed'
        if 'data' in response_json:
            response_json_data = response_json['data']
            if 'state' in response_json_data:
                task_state = response_json_data['state']
                # task success
                if task_state == 1:
                    result_tag = 'successful'
                elif task_state < 0:
                    # request failed, log the details
                    pass
                else:
                    # Task processing, abnormal situation, seeking assistance from customer service of picwish
                    pass
        print(f'Result({result_tag}): {response_json}')
    else:
        # request failed, log the details
        print(f'Error: Failed to get the result,{response.text}')
    return response_json['data']['image']


def register(openid):
    user = {
        'openid': openid,
        'nickName': '未设置姓名',
        'role': 'normal',
        'avatarUrl': 'http://121.41.99.200/backend/images/avatars/' + openid + '.jpg',
    }
    shutil.copy('./images/avatars/default.png', './images/avatars/' + openid + '.jpg')
    users.append(user)
    with open('./database/usersheet.json', 'w', encoding='utf-8') as f:
        json.dump(users, f, ensure_ascii=False, indent=4)
    return user


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
