let stringify = function(val) {
    return val ? JSON.stringify(val) : undefined;
};

module.exports = function({ offset = 0, count = 0, sort = undefined, fields = undefined, query = undefined}) {
    return { offset, count, query : stringify(query), fields : stringify(fields), sort : stringify(sort) };
};