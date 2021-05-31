from google.cloud import vision
import csv_module as cm
import os
import io
import requests

"""
    Google Vision OCR API를 이용해서 URL를 통한 OCR API 함수 

    사용을 위해선 google_Vision_Api_Key.json을 환경변수로 지정해야 한다.

    export GOOGLE_APPLICATION_CREDENTIALS="인증파일 JSON 위치"
    -> 영구 지정 방안 모색
    -> 우선은 따로 인증을 안해도 실행가능(코드안에서 구현)
"""
def detect_text_url(url):
    """Detects text in the file located in Google Cloud Storage or on the Web.
    """

    os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = '../../config/google_Vision_Api_Key.json'
    client = vision.ImageAnnotatorClient()

    word_list = []

    image = vision.Image()
    image.source.image_uri = url

    response = client.text_detection(image=image)
    
    if response.error.message:
        if response.error.message:
            word_list = local_detect_text_url(url)
        return word_list 
    else:
        texts = response.text_annotations
        
        for text in texts:
            word_list.append(text.description)

        return word_list


"""
    We're not allowed to access the URL on your behalf. Please download the content and pass it in.
    위와 같은 에러 케이스가 발생했을 때, IMG를 직접 다운로드해서 OCR 판단해야한다. 
    해당 함수는 url을 통해 img를 다운로드 후 파일을 통해 OCR을 수행하는 함수이다.
"""
def local_detect_text_url(url):
    client = vision.ImageAnnotatorClient()

    save_path = "../../data_dir/img/banner.gif"


    #os.system("wget -O ./data_dir/img/banner.gif " + url) -> &를 옵션 구분자로 인식

    if os.path.isfile(save_path):
        os.remove(save_path)

    download_file = requests.get(url)
    with open(save_path,'wb') as img:
        img.write(download_file.content)

    with io.open(save_path, 'rb') as image_file:
        content = image_file.read()

    word_list = []
    
    image = vision.Image(content=content)
    response = client.text_detection(image=image)
    texts = response.text_annotations

    for text in texts:
        word_list.append(text.description)
    
    return word_list


"""
    OCR 모듈 fuction
"""


def ocr_function(url):
    banner_url_list = cm.load_csv("../../data_dir/banner_url_list.csv")
    word_list = []

    for banner_url in banner_url_list:
        # print(banner_url)
        if len(banner_url) == 0:
            continue
        else:
            word_list += detect_text_url(banner_url)

    word_list = list(set(word_list))  # 중복 word 제거
    # cm.write_wordList_csv(word_list)
    return word_list
    # cm.write_url_wordList_csv(url,word_list) # 사이트 별 wordList 모음
    #
    # word_list를 학습알고리즘에 적용하여 판단해야함
    #
