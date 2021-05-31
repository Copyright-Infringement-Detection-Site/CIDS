from urllib import parse
import CIDS_Main
import datetime

def count_domain(url):
    global count_col
    check_flag =0
    url_list =list(CIDS_Main.count_col.find({}))
    parse_url =parse.urlparse(url)
    url =parse_url[1]
    for urls in url_list:
        url_hits =urls['hit']
        urls =urls['url_domain']
        if url == urls:
            find_url ={'url_domain' :url}
            new_values ={"$set" :{'hit' :url_hits +1 ,'updated_date' :datetime.datetime.utcnow()}}
            CIDS_Main.count_col.update_one(find_url ,new_values)
            check_flag =1
            break

    if check_flag == 0:
        ob = {'url_domain' :url ,'hit' :1 ,'created_date': datetime.datetime.utcnow()
              ,'updated_date' :datetime.datetime.utcnow()}
        CIDS_Main.count_col.insert_one(ob)
