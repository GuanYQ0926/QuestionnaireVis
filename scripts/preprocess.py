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


def question_xlsx():
    '''
    export overview of concerned question to xlsx
    '''
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
                'c_5': 'C5後期n=161', 'd_all': 'D妊娠期仕事なしn=709',
                'cd_all': '妊娠期全体N=1236'}
    workbook = xlsxwriter.Workbook('../data/raw/text_questions/妊娠期問題.xlsx')
    for filename, sheet in fileinfo.items():
        ranks_list, q_nums = ranking(filename)
        # new sheet
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


def answer_xlsx():
    '''
    return top quesiton and answers(self handle, deseired service)
    {question:{handle1:[service1, service2]}}
    export to xlsx
    '''
    fileinfo = {'c_all': 'C妊娠期仕事有n=527', 'c_1': 'C1初産n=322',
                'c_2': 'C2径産n=205', 'c_3': 'C3初期n=206', 'c_4': 'C4中期n=160',
                'c_5': 'C5後期n=161', 'd_all': 'D妊娠期仕事なしn=709',
                'cd_all': '妊娠期全体N=1236'}
    fileinfo = {'cd_all': '妊娠期全体N=1236'}
    for fn, desc in fileinfo.items():
        # question information
        dataset = pd.read_csv('../data/raw/text_questions/'+fn+'_ranking.csv')
        q_info = dataset.values[:10]
        q_info = dataset.values[:]
        # answer information
        dataset = pd.read_csv('../data/raw/dataset/'+fn+'.csv',
                              usecols=range(149, 158))
        a_info = dataset.values
        # process data
        question_handle = collections.defaultdict(
            lambda: collections.defaultdict(list))
        for q_one in q_info:
            q_index = q_one[2]
            for a_one in a_info:
                for i in [0, 1, 2]:
                    if pd.isnull(a_one[i]):
                        continue
                    if a_one[i] == q_index:
                        handle, service = a_one[3+i*2], a_one[4+i*2]
                        if pd.isnull(handle) or pd.isnull(service):
                            continue
                        question_handle[q_index][handle].append(service)
        # export to xlsx
        xls_path = '../data/raw/text_questions/'+desc+'_answer.xlsx'
        workbook = xlsxwriter.Workbook(xls_path)
        for question, handle_service in question_handle.items():
            worksheet = workbook.add_worksheet(str(question))
            worksheet.set_column('A:A', 100)
            worksheet.set_column('B:B', 100)
            worksheet.write('A1', '自己対処')
            worksheet.write('B1', 'サービス')
            row = 2
            for handle, service in handle_service.items():
                worksheet.write('A'+str(row), handle)
                for serv in service:
                    worksheet.write('B'+str(row), serv)
                    row += 1
        workbook.close()


def handle_service_graph_data():
    '''
    prepare data for causality graph
    '''
    filenames = ['q31_all', 'q31_with_job', 'q31_without_job']
    for fn in filenames:
        dataset = pd.read_csv('../data/raw/text_questions/'+fn+'.csv',
                              usecols=[0, 1])
        dataset = dataset.values
        handle_count = collections.defaultdict(int)
        service_count = collections.defaultdict(int)
        for data in dataset:
            handle, service = data[0], data[1]
            handle_count[handle] += 1
            service_count[service] += 1
        # generate node
        hnodes, snodes, edges = [], [], []
        node_handle_id = {}
        node_service_id = {}
        hnode_id, snode_id = 0, 0
        for data in dataset:
            handle, service = data[0], data[1]
            if handle not in node_handle_id:
                node_handle_id[handle] = hnode_id
                count = handle_count[handle]
                hnodes.append(dict(nid=hnode_id, count=count, type='handle',
                                   text=handle))
                hnode_id += 1
            if service not in node_service_id:
                node_service_id[service] = snode_id
                count = service_count[service]
                snodes.append(dict(nid=snode_id, count=count, type='service',
                                   text=service))
                snode_id += 1
            edges.append(dict(source=node_handle_id[handle],
                              target=node_service_id[service]))
        with open('../data/raw/text_questions/'+fn+'.json', 'w') as f:
            jsonfile = dict(hnodes=hnodes, snodes=snodes, edges=edges)
            json.dump(jsonfile, f)
            print('end')


def generate_relation_graph_data():
    '''
    generate relation graph data
    '''
    relationgraph = {}
    # ordered by concernedness
    filenames = [31, 19, 3, 35, 30, 9, 94, 34, 4, 6]
    for fn in filenames:
        dataset = pd.read_csv('../data/raw/revised/answer_csv/'+str(fn)+'.csv',
                              usecols=[0, 1])
        dataset = dataset.values
        handle_count = collections.defaultdict(int)
        service_count = collections.defaultdict(int)
        for data in dataset:
            handle, service = data[0], data[1]
            handle_count[handle] += 1
            service_count[service] += 1
        # generate node
        hnodes, snodes, edges = [], [], []
        node_handle_id = {}
        node_service_id = {}
        hnode_id, snode_id = 0, 0
        for data in dataset:
            handle, service = data[0], data[1]
            if pd.isnull(handle) or pd.isnull(service):
                print('empty')
                continue
            if handle not in node_handle_id:
                node_handle_id[handle] = hnode_id
                count = handle_count[handle]
                hnodes.append(dict(nid=hnode_id, count=count, type='handle',
                                   text=handle))
                hnode_id += 1
            if service not in node_service_id:
                node_service_id[service] = snode_id
                count = service_count[service]
                snodes.append(dict(nid=snode_id, count=count, type='service',
                                   text=service))
                snode_id += 1
            edges.append(dict(source=node_handle_id[handle],
                              target=node_service_id[service]))
        relationgraph[str(fn)] = dict(hnodes=hnodes, snodes=snodes,
                                      edges=edges)
    with open('../data/raw/revised/relationgraph.json', 'w') as f:
        json.dump(relationgraph, f)


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
    # heatmap_data()
    # wordcloud_data()
    # question_list()
    # question_xlsx()
    # answer_xlsx()
    generate_relation_graph_data()
