/* eslint-disable no-eval */
/* eslint-disable no-unused-vars */

const MongoClient = require('mongodb').MongoClient;

const buildQuery = async (uri, script) => {
    const lines = script.split('\n');
    lines[lines.length - 1] = `return ${lines[lines.length - 1]}`;
    script = lines.join('\n');
    console.log(script)
    const listing = `(async () => {
        const connection = await MongoClient.connect('${uri}', { useNewUrlParser: true });
        var db = connection.db("er_bbdd");
        var a = db.collection('sample_airbnb');
        const script = async () => {${script}};
        const result = await script();

        connection.close();
        return result;
    })`;

    return { execute: eval(listing) };
}

module.exports = {
  buildQuery,
};
