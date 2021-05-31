from konlpy.tag import Okt
import pandas as pd
from pandas import DataFrame
import tensorflow
from tensorflow.keras.preprocessing.text import Tokenizer
from tensorflow.keras.preprocessing.sequence import pad_sequences
from tensorflow.keras.models import load_model
import CIDS_Main as CM


#words 컬럼이 비어져있으면 drop
def empty_drop(data):
    d_size = len(data['wordlist'])
    temp = data
    for i in range(d_size):
        if(len(data.iloc[i]['wordlist'])==0):
            temp = temp.drop(index=i)
    return temp

def one_word_drop(input_list):
    temp = []
    for r in input_list:
        res = []
        for i in r:
            if len(i) == 1:
                continue
            else:
                res.append(i)
        res = list(filter(None, res))
        temp.append(res)
    return temp


def preprocess(train_data):
    train_data = train_data.sort_values(by='label')
    train_data = train_data.dropna()
    train_data = train_data.reset_index(drop=True)

    a = list(train_data['wordlist'])
    okt = Okt()
    result = []
#     for i in a:
#         temp = []
#         for j in i:
#             temp += okt.nouns(j)
#         result.append(temp)
    for i in a:
        temp = okt.nouns(i)
        result.append(temp)
    result = one_word_drop(result)

    pds = pd.Series(result)
    train_data['wordlist'] = pds

    X = list(train_data['wordlist'])
    x = train_data['wordlist']

    global tokenizer
    tokenizer = Tokenizer()
    tokenizer.fit_on_texts(X)

    threshold = 3
    total_cnt = len(tokenizer.word_index)  # 단어의 수
    rare_cnt = 0  # 등장 빈도수가 threshold보다 작은 단어의 개수를 카운트
    total_freq = 0  # 훈련 데이터의 전체 단어 빈도수 총 합
    rare_freq = 0  # 등장 빈도수가 threshold보다 작은 단어의 등장 빈도수의 총 합
    vocab_size = 0
    # 단어와 빈도수의 쌍(pair)을 key와 value로 받는다.
    for key, value in tokenizer.word_counts.items():
        total_freq = total_freq + value

        # 단어의 등장 빈도수가 threshold보다 작으면
        if (value < threshold):
            rare_cnt = rare_cnt + 1
            rare_freq = rare_freq + value
        vocab_size = total_cnt - rare_cnt + 1

    tokenizer = Tokenizer(vocab_size)
    tokenizer.fit_on_texts(x)



def _predict(new_sentence):
  encoded = tokenizer.texts_to_sequences([new_sentence]) # 정수 인코딩
  pad_new = pad_sequences(encoded, maxlen = 200) # 패딩
  score = float(CM.loaded_model.predict(pad_new)) # 예측

  if(score < 0.3):
      score = ((1-score)*100)
      score = round(score,1)
      return 0, score
  else:
      return 1, score

def infringement_detection(word_list):

    okt = Okt()
    temp = []
    score = 0.0
    for i in word_list:
        temp += okt.nouns(i)
    result = []
    for i in temp:
        if len(i) == 1:
            continue
        else:
            result.append(i)
    if len(result) == 0:
        return 2, score

    label, score = _predict(result)
    if(label == 0):
        return  label, score
    return label, score

