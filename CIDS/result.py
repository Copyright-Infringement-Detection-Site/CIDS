import CIDS_Main as CM
import counter_domain as cd
import datetime
import train as tr
import ocr_module as om
from urllib import parse


def result_insert(keyword_id, url, label = 3):
    global urls_col
    global result_col
    if label != 3:
        if label == 0:
            count_domain(url)
            score = 100.0
            ob = {'keyword_id': keyword_id, 'url': url, 'label': label, 'accuracy': score,
                  'created_date': datetime.datetime.utcnow()}
            CM.results_col.insert_one(ob)

        else:
            ob = {'keyword_id': keyword_id, 'url': url, 'label': label,
                  'created_date': datetime.datetime.utcnow()}
            CM.results_col.insert_one(ob)
        return True

    word_list = om.ocr_function(url)
    ###############################label = a(word_list)
    # label 값 처리 분기 필요  -> 학습 결과로 넣을 것
    label, score = tr.infringement_detection(word_list)

    ob = {'keyword_id': keyword_id, 'url': url, 'wordlist': word_list,
          'created_date': datetime.datetime.utcnow()}
    CM.urls_col.insert_one(ob)

    if label == 2:
        return False
    else:
        if label == 0:
            count_domain(url)
            ob = {'keyword_id': keyword_id, 'url': url, 'label': label, 'accuracy': score,
                  'created_date': datetime.datetime.utcnow()}
            CM.results_col.insert_one(ob)
        else:
            ob = {'keyword_id': keyword_id, 'url': url, 'label': label, 'accuracy' : score,
                  'created_date': datetime.datetime.utcnow()}
            CM.results_col.insert_one(ob)
        return True



def count_domain(url):
    global count_col
    check_flag =0
    url_list =list(CM.count_col.find({}))
    parse_url =parse.urlparse(url)
    url =parse_url[1]
    for urls in url_list:
        url_hits =urls['hit']
        urls =urls['url_domain']
        if url == urls:
            find_url ={'url_domain' :url}
            new_values ={"$set" :{'hit' :url_hits +1 ,'updated_date' :datetime.datetime.utcnow()}}
            CM.count_col.update_one(find_url ,new_values)
            check_flag =1
            break

    if check_flag == 0:
        ob = {'url_domain' :url ,'hit' :1 ,'created_date': datetime.datetime.utcnow()
              ,'updated_date' :datetime.datetime.utcnow()}
        CM.count_col.insert_one(ob)
