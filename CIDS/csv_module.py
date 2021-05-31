import csv
import os


"""
csv 파일 저장할 dir root경로를 찾아주는 함수
"""
def find_dir(target):
    root_dir = "./"
    for (root, dirs, files) in os.walk(root_dir):
        if len(dirs) > 0:
            for dir_name in dirs:
                if target in dir_name:
                    return root+'/'+dir_name+'/'


"""
배너 URL 리스트 CSV 파일로 저장하는 함수
"""
def write_bannerUrlList_csv(banner_url_list):
    f=open('../../data_dir/banner_url_list.csv', 'w',newline='',encoding='utf-8')
    wcsv=csv.writer(f)
    wcsv.writerow(banner_url_list)
    f.close()

"""
    WORDLIST CSV WRITE 함수
"""
def write_wordList_csv(word_list) :
    with open('../../data_dir/word_list.csv', 'a', newline='',encoding='utf-8') as f:
        writer = csv.writer(f)
        writer.writerow(word_list)
    f.close()

"""
    URL별 WORDLIST CSV WRITE 함수
"""
def write_url_wordList_csv(url,word_list) :
    with open('../../data_dir/_wordList.csv', 'a', newline='',encoding='utf-8') as f:
        writer = csv.writer(f)
        writer.writerow(word_list)
    f.close()

"""
    CSV LOAD 함수
"""
def load_csv(input_csv):
    result_list = []

    f = open(input_csv, 'r', encoding='utf-8')
    rdr = csv.reader(f)
    for line in rdr:
        for url in line:
            result_list.append(url)
    f.close()

    return result_list

