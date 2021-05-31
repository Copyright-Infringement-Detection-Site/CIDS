import csv_module as cm
from urllib.parse import quote_plus
from selenium import webdriver
from selenium.common.exceptions import NoSuchElementException
import time
import random
from bs4 import BeautifulSoup
import chromedriver_autoinstaller
import re

options = webdriver.ChromeOptions()
options.add_argument('--headless')
options.add_argument('--no-sandbox')
options.add_argument("--single-process")
options.add_argument("--disable-dev-shm-usage")

global path
path = chromedriver_autoinstaller.install()
"""
    셀레니움을 사용하여 크롤링하여 키워드에 맞는 url list을 반환  
"""

def craurl(keyword, flag, currentURL):
    try:
        baseUrl = 'https://www.google.com/search?q=' #접속할 url
        if flag == 0:
            url = baseUrl + quote_plus(keyword)
        else:
            url = currentURL
        driver = webdriver.Chrome(path, chrome_options = options)

        driver.get(url)
        result = [] #url 저장할 리스트
    except FileNotFoundError as err:
        print("chrome driver error")


    for j in range(6):
        html = driver.page_source
        soup = BeautifulSoup(html, 'html.parser')

        v = soup.select('.yuRUbf') #yuRUbf들 밑에 속해있는 전부. v에 저장.

        for i in v: #타겟 하이퍼텍스트 레퍼런스 append
            result.append(i.a.attrs['href'])
        try:
            driver.find_element_by_xpath('//*[@id="pnnext"]').click()#다음페이지로이동
        except NoSuchElementException:
            currentURL = driver.current_url
            driver.close()
            return result, currentURL

        time.sleep(random.uniform(1,3)) #ddos 차단으로 인한 1~3초 랜덤 sleep

    currentURL = driver.current_url
    driver.close()

    return result, currentURL


"""
URL을 인풋으로 받아서 내부 광고 배너 URL을 리스트에 저장하는 함수
"""

def crawel(url):
    headers = {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.2 Safari/605.1.15"}

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

    find_banner_list = []
    result = []
    tag_list = []
    res = 0
    try:
        driver = webdriver.Chrome(path, chrome_options=options)
        driver.get(url)
        html = driver.page_source
        soup = BeautifulSoup(html, "html.parser")
        driver.close()

        for image_url in soup.find_all("div", style=re.compile("background-image")):

            s_index = str(image_url).find("url")
            e_index = str(image_url).find(")")
            extract_url = str(image_url)[s_index:e_index + 1]

            if len(extract_url) > 131072:
                continue
            columncount = extract_url.count("\"")
            doublecolumncount = extract_url.count('\'')
            if columncount >= 2 or doublecolumncount >= 2:
                if len(result) <= 15:

                    if extract_url[5:7] == "//":
                        result.append("https:" + extract_url[5:-2])


                    elif extract_url[5] == "/":

                        result.append(divide_url + extract_url[5:-2])
                    elif extract_url[5] == "h":
                        result.append(extract_url[5:-2])
                    else:
                        result.append(divide_url + "/" + extract_url[5:-2])

            else:
                if len(result) <= 15:

                    if extract_url[4:6] == "//":
                        result.append("https:" + extract_url[4:-1])


                    elif extract_url[4] == "/":

                        result.append(divide_url + extract_url[4:-1])
                    elif extract_url[4] == "h":
                        result.append(extract_url[4:-1])
                    else:
                        result.append(divide_url + "/" + extract_url[4:-1])

        for href in soup.find_all("a"):


            if "data-image-id" in str(href):
                find_banner_list.append(href.next_sibling.next_sibling)

            

            if "href" in str(href):
                start_index=str(href).find('href="')
                if start_index !=-1:
                    end_index=str(href).find("\"",start_index+6)
                    href_url=str(href)[start_index+6:end_index]
                    
                    if len(href_url) !=0 and href_url[0] !="/":
                        find_banner_list.append(href)



        for banner in find_banner_list:
            if 'img' in str(banner):
                tag_list.append(banner)

        for tag in tag_list:
            start_index = str(tag).find('src="')
            end_index = str(tag).find("\"", start_index + 5)

            result_url = str(tag)[start_index + 5:end_index].replace("&amp;", "&")

            if len(result_url) > 131072:
                continue

            if start_index != -1:

                if str(tag)[start_index + 5:start_index + 7] == "//":
                    if len(result) <= 15:
                        result.append("https:" + result_url)


                elif str(tag)[start_index + 5] == "/":
                    if len(result) <= 15:
                        result.append(divide_url + result_url)

                elif str(tag)[start_index + 5] == "h":
                    if len(result) <= 15:
                        result.append(result_url)
                else:
                    if len(result) <= 15:
                        result.append(divide_url + "/" + result_url)

        result = list(set(result))

        return result

    except Exception:
        return result



"""
    banner 크롤링 모듈 fuction
"""


def banner_craweling_function(url):
    banner_url_list = crawel(url)
    if len(banner_url_list) == 0:
        return False
    else:
        cm.write_bannerUrlList_csv(banner_url_list)
        return True



