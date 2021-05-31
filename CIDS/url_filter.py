def url_filtering(url):
    # 해당 domain이 tistory
    if "tistory.com" in url:
        return {"result": True, "label": 1}
    # 해당 domain이 torrent임
    elif "torrent" in url:
        return {"result": True, "label": 0}
    # 해당 domain이 google임
    elif "google" in url:
        return {"result": True, "label": 1}
    # 해당 domain이 naver임
    elif "naver" in url:
        return {"result": True, "label": 1}
    # 해당 domain이 daum임
    elif "daum" in url:
        return {"result": True, "label": 1}
    # 해당 domain이 google임
    elif "kakao" in url:
        return {"result": True, "label": 1}
    # 해당 domain에 wiki포함
    elif "wiki" in url:
        return {"result": True, "label": 1}
    # 해당 domain에 yes24포함
    elif "yes24" in url:
        return {"result": True, "label": 1}
    # 해당 domain에 kyobobook포함
    elif "kyobobook" in url:
        return {"result": True, "label": 1}
    # 해당 domain에 inven포함
    elif "inven" in url:
        return {"result": True, "label": 1}
    elif "gmarket" in url:
        return {"result": True, "label": 1}
    elif "youtube" in url:
        return {"result": True, "label": 1}
    elif "netflix" in url:
        return {"result": True, "label": 1}
    elif "interpark" in url:
        return {"result": True, "label": 1}
    elif "coupang" in url:
        return {"result": True, "label": 1}
    elif "aladin" in url:
        return {"result": True, "label": 1}
    elif "interpark" in url:
        return {"result": True, "label": 1}
    elif "lottecinema" in url:
        return {"result": True, "label": 1}
    elif "ebs" in url:
        return {"result": True, "label": 1}
    elif "vlive" in url:
        return {"result": True, "label": 1}
    elif "chosun" in url:
        return {"result": True, "label": 1}
    elif "mediatoday" in url:
        return {"result": True, "label": 1}
    elif "news" in url:
        return {"result": True, "label": 1}
    else:
        return {"result": False, "label": -1}



