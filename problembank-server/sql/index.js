module.exports = {
    user: require('./user'),
    problems: require('./problems'),
    selectTestCaseByProblemId: `select id, input_example as input, output_example as output from testCases where problem = ?`,
}