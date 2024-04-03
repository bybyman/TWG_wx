# coding:utf8
import os

from PIL import Image
from sklearn.model_selection import train_test_split
from torch.utils import data

Labels = {'三食堂': 0, '二食堂': 1, '先骕楼': 2, '名达楼': 3, '国际教育学院': 4, '图书馆': 5, '天浪楼': 6,
          '实验大楼': 7, '惟义楼': 8, '方荫楼': 9, '正大广场': 10, '洁琼楼': 11, '瑶湖体育场': 12, '瑶湖体育馆': 13,
          '知行楼': 14, '超真楼': 15, '长胜体育场': 16,'静湖': 17, '音乐学院': 18, '风雨球场': 19, '风雨球馆': 20}


class BuildingData(data.Dataset):

    def __init__(self, file, transforms=None, train=True, test=False):
        """
        主要目标： 获取所有图片的地址，并根据训练，验证，测试划分数据
        """
        self.test = test
        self.transforms = transforms

        if self.test:
            imgs = [file]
            self.imgs = imgs
        else:
            imgs_labels = []
            imgs = []
            for imglable in imgs_labels:
                for imgname in os.listdir(imglable):
                    imgpath = os.path.join(imglable, imgname)
                    imgs.append(imgpath)
            trainval_files, val_files = train_test_split(imgs, test_size=0.3, random_state=42)
            if train:
                self.imgs = trainval_files
            else:
                self.imgs = val_files

    def __getitem__(self, index):
        """
        一次返回一张图片的数据
        """
        img_path = self.imgs[index]
        img_path = img_path.replace("\\", '/')
        if self.test:
            label = -1
        else:
            labelname = img_path.split('/')[-2]
            label = Labels[labelname]
        data = Image.open(img_path).convert('RGB')
        data = self.transforms(data)
        return data, label

    def __len__(self):
        return len(self.imgs)
