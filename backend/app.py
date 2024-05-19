from flask import Flask, jsonify, request
from flask_cors import CORS, cross_origin

from pymongo import MongoClient
import json
import copy

app = Flask(__name__)

cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

client = MongoClient('mongodb://localhost:27017/',
                        username='rootroot', password='example123!')
db = client['hackathon']
col_patients = db['patients']


def update_dict(d, new_d):
    d.update(new_d)
    return d

@app.route('/', methods=(['GET']))
def index():
    data = {
        'test': 'test'
    }
    return jsonify(data)


@app.route('/patients', methods=(['GET']))
def get_patients():
    result = []
    for c in col_patients.find():
        c['_id'] = str(c['_id'])
        result.append(c)
    return result

@app.route('/patient/<id>', methods=(['GET', 'DELETE', 'PUT']))
def get_patient(id):
    result = []
    for c in col_patients.find({'id': id}):
        result.append(c)
    if(len(result) == 0):
        return {'status': 'failed', 'message': 'no result'}
    else:
        if request.method == 'GET':
            doc = result[0]
            doc['_id'] = str(doc['_id'])
            return doc
        elif request.method == 'DELETE':
            col_patients.delete_one(result[0])
            return {'status': 'ok'}
        elif request.method == 'PUT':
            new_doc = request.json
            print(new_doc)
            col_patients.update_one(result[0], new_doc)
            return {'status': 'ok'}

@app.route('/patient/<pid>/record/<rid>', methods=(['DELETE', 'PUT', 'POST']))
def do_record(pid, rid):
    cols = []
    for c in col_patients.find({'id': pid}):
        cols.append(c)
    if(len(cols) == 0):
        return {'status': 'failed', 'message': 'no such patient'}
    else:
        patient = cols[0]
        records = patient['records']
        if request.method == 'DELETE':
            records = list(filter(lambda r: r['id'] != rid, records))
            col_patients.update_one(patient, {"$set": {'records': records}})
            return {'status': 'ok'}
        elif request.method == 'PUT':
            new_record = request.json
            new_records = copy.deepcopy(records)
            for r in new_records:
                if r['id'] == rid:
                    r.update(new_record)
            col_patients.update_one(patient, {"$set": {'records': new_records}})
            return {'status': 'ok'}
        elif request.method == 'POST':
            record = request.json
            new_records = copy.deepcopy(records)
            new_records.append(record)
            col_patients.update_one(patient, {"$set": {'records': new_records}})
            return {'status': 'ok'}

if __name__ == '__main__':
    app.run(host='0.0.0.0', port='3030', debug=True)
