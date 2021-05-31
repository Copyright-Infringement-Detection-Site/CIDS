import crawling
import db_config
import train as tr
import check
import result
from tensorflow.keras.models import load_model
import sys
import pymongo
import datetime
from pandas import DataFrame
import ssl
import os
loaded_model = load_model('../../my_model')
keyword = {}

db_info = db_config.db_info()

"""DB는 전역으로 선언"""
connection = pymongo.MongoClient(db_config.db_info()['db_address'],
                                 username=db_config.db_info()['db_id'],
                                 password=db_config.db_info()['db_pw'])
global flag

global db
db = connection['cids_db']
global keywords_col
keywords_col = db['keywords']
global urls_col
urls_col = db['urls']
global words_col
words_col = db['words']
global sites_col
sites_col = db['sites']
global results_col
results_col = db['results']
global train_col
train_col = db['train_words']
global count_col
count_col = db['countdomains']

ssl._create_default_https_context = ssl._create_unverified_context


"""
    CIDS MAIN함수
"""
def main():
    _keyword_id = int(sys.argv[1])
    keyword_doc = keywords_col.find_one({'_id': _keyword_id})
    keyword = str(keyword_doc['keyword'])
    urls_col = db['urls']

    # train_data 콜렉션 전처리
    train_data = DataFrame(list(train_col.find({})))
    train_data = train_data.drop(['_id'], axis=1)
    tr.preprocess(train_data)
    flag = 0
    currentURL = ""
    ## 학습 후 의심 사이트 url만 있는 것으로 가정
    for i in range(2):
        if flag == 0 or flag == 1:
            result_url_list, currentURL = crawling.craurl(keyword, flag, currentURL)

            for url in result_url_list:
                # 저작권 침해 비디오 스트리밍 사이트 사전체크 후 탐지됬을 경우 OCR에 넘기지 않고 바로 DB에 저장
                # 이 전에 이미 발견됐던 데이터 인 경우 체크
                pre_check_result = check.site_pre_check(url)
                # 존재하는 결과 result에 insert

                if pre_check_result['result']:#result가 true면 있는것.
                    result.result_insert(_keyword_id, url, pre_check_result['label'])
                    if pre_check_result['label'] == 0:
                        flag += 2
                elif pre_check_result['result'] == False:

                    if check.video_check(url) == True:
                        result.result_insert(_keyword_id, url, 0)
                        flag += 2
                    else:

                        if crawling.banner_craweling_function(url):
                            if result.result_insert(_keyword_id, url) == True:
                                flag += 2

                                continue
        flag += 1


    updateKeywords = {"$set": {'status': 0, 'updated_date': datetime.datetime.utcnow()}}
    keywords_col.update_one(keyword_doc, updateKeywords)

    print(True)

if __name__ == "__main__":
    # execute only if run as a script
    main()
