import pandas as pd
import numpy as np
import json
import MeCab
import collections
import xlsxwriter


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
            # res = {'0': 0, '1': 0, '2': 0, '3': 0, '4': 0, '5': 0}
            res = {'1': 0, '2': 0, '3': 0, '4': 0, '5': 0}
            for answer in question:  # each answer
                if np.isnan(answer):
                    # res['5'] += 1
                    pass
                else:
                    res[str(int(answer))] += 1
            for key, val in res.items():
                jsonfile.append(dict(question=x, answer=int(key)-1, value=val))
        with open('../static/' + fn + '.json', 'w') as f:
            json.dump(jsonfile, f)


def wordcloud_data():
    tagger = MeCab.Tagger('mecabrc')
    tagger.parse('')
    fileinfo = {'c_all': 'C妊娠期仕事有n=527', 'c_1': 'C1初産n=322',
                'c_2': 'C2径産n=205', 'c_3': 'C3初期n=206', 'c_4': 'C4中期n=160',
                'c_5': 'C5後期n=161', 'd_all': 'D妊娠期仕事なしn=709'}
    deal_jsonfile = {}
    service_jsonfile = {}
    for filename, desc in fileinfo.items():
        dataset = pd.read_csv('../data/raw/dataset/' + filename + '.csv',
                              usecols=range(152, 158))
        dataset = dataset.values.T
        deal_result = collections.defaultdict(int)
        service_result = collections.defaultdict(int)
        for i in [0, 2, 4]:
            deal_data = dataset[i]
            for text in deal_data:
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
                        if pos == '名詞' or pos == '動詞':  # or pos == '形容詞':
                            deal_result[word] += 1
        for i in [1, 3, 5]:
            service_data = dataset[i]
            for text in service_data:
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
                            service_result[word] += 1
        deal_jsonfile[filename] = deal_result
        service_jsonfile[filename] = service_result
    with open('../static/wordcloud/deal.json', 'w') as f:
        json.dump(deal_jsonfile, f)
    with open('../static/wordcloud/service.json', 'w') as f:
        json.dump(service_jsonfile, f)

# def wordcloud_data():
#     tagger = MeCab.Tagger('mecabrc')
#     tagger.parse('')
#     filenames = ['A', 'B']
#     jsonfile = {}
#     for fn in filenames:
#         result = collections.defaultdict(int)
#         dataset = pd.read_csv('../data/' + fn + '.csv',
#                               usecols=range(104, 110))
#         dataset = dataset.values
#         for row_data in dataset:
#             for text in row_data:
#                 if pd.isnull(text):
#                     continue
#                 temp = tagger.parse(text)
#                 for row in temp.split('\n'):
#                     word = row.split('\t')[0]
#                     if word == 'EOS':
#                         break
#                     else:
#                         pos = row.split('\t')[1].split(',')[0]
#                         # if pos != '助詞' and pos != '助動詞':
#                         if pos == '名詞' or pos == '動詞' or pos == '形容詞':
#                             result[word] += 1
#         jsonfile[fn] = result
#     with open('../static/wordcloud.json', 'w') as f:
#         json.dump(jsonfile, f)


def question_xlsx():
    # index: quesion
    filename = '../data/raw/dataset/layout.csv'
    dataset = pd.read_csv(filename, header=None, usecols=[8])
    dataset = dataset.values
    questions = dataset[860: 957]
    q_description = {}
    for i, v in enumerate(questions):
        q_description[i+1] = v[0]

    def ranking(filename):
        # index: ranking | index: nums
        filepath = '../data/raw/dataset/' + filename + '.csv'
        dataset = pd.read_csv(filepath, usecols=range(149, 158))
        dataset = dataset.values.T
        q_index = dataset[:3]
        ranks = collections.defaultdict(int)
        q_nums = collections.defaultdict(int)
        for i, v in enumerate(q_index):
            for index in v:
                if pd.isnull(index):
                    continue
                ranks[int(index)] += 3 - i
                q_nums[int(index)] += 1
        ranks_list = [dict(q_index=i, q_score=k) for i, k in ranks.items()]
        ranks_list.sort(key=lambda x: x['q_score'], reverse=True)
        return ranks_list, q_nums
    # export to xls
    fileinfo = {'c_all': 'C妊娠期仕事有n=527', 'c_1': 'C1初産n=322',
                'c_2': 'C2径産n=205', 'c_3': 'C3初期n=206', 'c_4': 'C4中期n=160',
                'c_5': 'C5後期n=161', 'd_all': 'D妊娠期仕事なしn=709'}
    workbook = xlsxwriter.Workbook('../static/妊娠期問題.xlsx')
    for filename, sheet in fileinfo.items():
        ranks_list, q_nums = ranking(filename)
        worksheet = workbook.add_worksheet(sheet)
        worksheet.set_column('D:D', 100)
        worksheet.set_column('E:E', 15)
        worksheet.write('A1', '順位')
        worksheet.write('B1', '点数')
        worksheet.write('C1', '問題番号')
        worksheet.write('D1', '問題内容')
        worksheet.write('E1', 'top3にする人数')
        # print(q_description)
        for i, v in enumerate(ranks_list):
            q_index, q_score = v['q_index'], v['q_score']
            row = str(i + 2)
            worksheet.write('A'+row, i+1)
            worksheet.write('B'+row, q_score)
            worksheet.write('C'+row, q_index)
            worksheet.write('D'+row, q_description[q_index])
            worksheet.write('E'+row, q_nums[q_index])
    workbook.close()


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
    with open('../static/questions.json', 'w') as f:
        json.dump(jsonfile, f)


if __name__ == '__main__':
    heatmap_data()
    # wordcloud_data()
    # question_list()
    # question_xlsx()
