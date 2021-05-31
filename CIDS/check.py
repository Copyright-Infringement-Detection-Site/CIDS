import CIDS_Main as CM
import url_filter
import requests
import random
from bs4 import BeautifulSoup
from urllib import parse
import re
from urllib.request import urlopen

import url_filter

"""
    이미 DB에 존재하는 URL을 먼저 거르기위한 작업 
"""
def site_pre_check(url):
    url_check_list = list(CM.sites_col.find({}))
    for url_check in url_check_list:
        url_check_url = url_check['url']
        url_check_label = url_check['label']

        db_parse_result = parse.urlparse(url_check_url)
        url_parse_result = parse.urlparse(url)
        # 이미 DB에 존재
        if db_parse_result[1] == url_parse_result[1]:
            return {"result": True, "label": url_check['label']}
        else:
            result = url_filter.url_filtering(url_parse_result[1])
            return result

def video_check(url):
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36"}

    try:
        res = requests.get(url, headers=headers)
        res.encoding = None
        soup=BeautifulSoup(res.text,"html.parser")

        video_check_list=["영화","드라마","예능"]
        count = 0
        for video in video_check_list:
            if video in str(soup):
                count = 1
                break
        if count == 0:
            return False

        exception_keywords = ['png', 'jpg', 'jpeg', 'gif', 'mp3', 'mp4', 'wav']
        video_keywords = ['Ultravid', 'GGvid', 'Gdriverplayer', 'Dood', 'Straemsb', 'Popvod', 'Szjal',
                        'Evoload', 'Mixdrop', 'Streamtape', 'Supervid', 'Fcdn', 'Flashvid', 'Ninjastream', 'HDvid',
                        'MVplayer', 'gounlimited', 'onlystream', 'jetload', 'vidlox', 'jawcloud',
                        'cloudvideo', 'gcloud', 'mvlink', 'vmega']

        soup = str(soup)
        soup = soup.lower()

        for video_keyword in video_keywords:
            if video_keyword.lower() in soup:
                return True


        url = res.url
        slashcount = url.count("/")

        if slashcount >= 3:
            count = 0
            index = 0
            while (count < 3):
                if url[index] == '/':
                    count += 1
                index += 1

            divide_url = url[:index - 1]
        else:
            divide_url = url

        res = requests.get(divide_url, headers = headers)
        res.encoding = None

        soup = BeautifulSoup(res.text, "html.parser")

        

        internal_list = []
        choose_internal_lists = []
        for href in soup.find_all("a"):
            if 'href' in href.attrs:

                for exception_keyword in exception_keywords:
                    if exception_keyword in str(href):
                        continue
                    else:
                        s_index = str(href).find('href="')
                        e_index = str(href).find('"', s_index + 6)
                        internal_url = str(href)[s_index + 6:e_index]

                        if len(internal_url) == 0:
                            continue

                        if internal_url[:len(divide_url)] == divide_url:
                            if len(internal_url) * 2 >= len(divide_url):
                                internal_url = internal_url.replace("&amp;", "&")
                                if len(internal_list) <= 200:
                                    internal_list.append(internal_url)
                        elif internal_url[0] == "/":
                            if len(internal_url) * 2 >= len(divide_url):
                                internal_url = internal_url.replace("&amp;", "&")
                                if len(internal_list) <= 200:
                                    internal_list.append(divide_url + internal_url)

        choose_internal_lists = random.sample(internal_list, 10)
        # print(choose_internal_lists)
        check = 0
        for choose_interal_list in choose_internal_lists:
            try:
                if check == 1:
                    break
                res = requests.get(choose_interal_list, headers=headers)
                soup = BeautifulSoup(res.text, "html.parser")
                soup = str(soup)
                soup = soup.lower()
                for video_keyword in video_keywords:
                    if video_keyword.lower() in soup:
                        return True
            except Exception:
                continue


        if check == 0:
            return False

    except Exception as e:
        return -1