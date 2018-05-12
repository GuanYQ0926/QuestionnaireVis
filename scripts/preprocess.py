import pandas as pd
import numpy as np
import json
import MeCab
import collections


def heatmap_data():
    filenames = ['A', 'A1', 'A2', 'A3', 'B', 'B1', 'B2', 'B3']
    '''
    q12: [4, 33), q13: [33, 58), q14: [58: 75), q15: [75, 101)
    '''
    for fn in filenames:
        jsonfile = []
        dataset = pd.read_csv('../data/' + fn + '.csv',
                              usecols=range(4, 101))
        dataset = dataset.values.T  # question 12 to 15
        # parti_count = len(dataset[0])
        for x, question in enumerate(dataset):  # a certain question
            res = {'0': 0, '1': 0, '2': 0, '3': 0, '4': 0, '5': 0}
            for answer in question:  # each answer
                if np.isnan(answer):
                    res['5'] += 1
                else:
                    res[str(int(answer))] += 1
            # real_count = parti_count - res['nan']
            for key, val in res.items():
                # if real_count == 0:
                #     val = 0
                # else:
                #     val = float(val) / float(real_count)
                jsonfile.append(dict(question=x, answer=int(key), value=val))
        with open('../assets/' + fn + '.json', 'w') as f:
            json.dump(jsonfile, f)


def parallel_data():
    filenames = ['A', 'A1', 'A2', 'A3', 'B', 'B1', 'B2', 'B3']
    '''
    q12: [4, 33), q13: [33, 58), q14: [58: 75), q15: [75, 101)
    '''
    for fn in filenames:
        jsonfile = []
        dataset = pd.read_csv('../data/' + fn + '.csv',
                              usecols=range(4, 101), header=None)
        dataset = dataset.values
        labels = dataset[0].tolist()
        data = []
        for i in dataset[1:]:
            temp = []
            for j in i:
                if pd.isnull(j):
                    temp.append(6)
                else:
                    temp.append(int(j))
            data.append(temp)
        jsonfile = dict(label=labels, data=data)
        with open('../assets/par_' + fn + '.json', 'w') as f:
            json.dump(jsonfile, f)


def wordcloud_data():
    tagger = MeCab.Tagger('mecabrc')
    tagger.parse('')
    filenames = ['A', 'B']
    jsonfile = {}
    for fn in filenames:
        result = collections.defaultdict(int)
        dataset = pd.read_csv('../data/' + fn + '.csv',
                              usecols=range(104, 110))
        dataset = dataset.values
        for row_data in dataset:
            for text in row_data:
                if pd.isnull(text):
                    continue
                temp = tagger.parse(text)
                for row in temp.split('\n'):
                    word = row.split('\t')[0]
                    if word == 'EOS':
                        break
                    else:
                        pos = row.split('\t')[1].split(',')[0]
                        # if pos != '助詞' and pos != '助動詞':
                        if pos == '名詞' or pos == '動詞' or pos == '形容詞':
                            result[word] += 1
        jsonfile[fn] = result
    with open('../assets/wordcloud.json', 'w') as f:
        json.dump(jsonfile, f)


def question_list():
    filename = 'Layout'
    dataset = pd.read_csv('../data/' + filename + '.csv',
                          header=None, usecols=[8])
    dataset = dataset.values.T[0]
    q12 = dataset[271:440:6].tolist()
    q13 = dataset[446:591:6].tolist()
    q14 = dataset[597:694:6].tolist()
    q15 = dataset[700:851:6].tolist()
    questions = q12 + q13 + q14 + q15
    jsonfile = dict(questions=questions)
    with open('../assets/questions.json', 'w') as f:
        json.dump(jsonfile, f)


if __name__ == '__main__':
    # heatmap_data()
    # parallel_data()
    wordcloud_data()
    # question_list()
