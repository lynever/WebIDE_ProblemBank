var express = require('express');
var router = express.Router();
var db = require('../modules/db-connection');
var sql = require('../sql');
var checkLoginMiddleWare = require('../modules/check-login-middleware');
var randomstring = require("randomstring");
var fileController = require('../modules/file-controller');
var path = require('path');

// Check user for api
// router.use(checkLoginMiddleWare.injectUerforAPI)


//전체 카테고리 출력함
router.get('/getcategory', async function(req, res) {
    // const { id } = req.user._user[0];
    try {
        const [rows] = await db.query(sql.problems.getCategoryProblems)
        res.status(200).send({
            result: true,
            data: rows,
            message: '해당하는 유저 프로젝트 리스트'
        })
    } catch (error) {
        console.log(`유저 프로젝트 출력 API 오류 ${error}`)
    }
})

//해당하는 Tutorial tag 리스트 출력함, 해당하는 tag 문제 리스트를 출력함
//! 수정필요함
router.get('/category', async function(req, res) {
    try {
        const { id } = req.query;
        let [childCategories] = await db.query(sql.problems.selectTagsByTutorialId,[id])
        if(childCategories.length === 0 ){
            res.status(200).send({
                result: true,
                data: [],
                message:'해당하는 Tutorial tag 리스트'
            })
        }else{
            for(let i = 0; i < childCategories.length; i++){
                let [problemsbyCategory] = await db.query(sql.problems.selectProblemByCategoryId,[childCategories[i].id])
                childCategories[i].problems = [];
                childCategories[i].problems.push(problemsbyCategory[0])
            }
        }
        res.status(200).send({
                result: true,
                data: childCategories,
                message:'해당하는 Tutorial tag 리스트'
        })
    } catch (e) {
        console.log(e)
    }
})

//문제정보를 출력함
router.get('/getproblemsinfor', async function(req, res) {
    try {
        let [row] = await db.query(sql.problems.getCountProblem)
        const { count } = row[0];
        res.status(200).send({
            result : true,
            data: {
                "pbl_count": count,
                "pbl_scoring": count,
                "pbl_dont": 10,
                "language_scroring": 5
            },
            message : '문제 정보'
        })
        
    } catch (error) {
        console.log("Get problem info" + error)
    }
    
})

//전체문제 출력함
router.get('/problemsdata', async function(req, res) {
    try {
        let [rows] = await db.query(sql.problems.selectProblems)
        //!수정 필요함
        for(let j = 0; j < rows.length; j++)
        {
            var { id } = rows[j];
            //해당하는 문제의 테스트 케이스를 출력함
            let [testcases] = await db.query(sql.problems.selectTestCaseFromProblemId,[id])
            let filterTestCase = testcases.map(testcase => ({
                input_exp: testcase.input_example, 
                output_exp: testcase.output_example
                }
            ))
            rows[j]["testcases"] = filterTestCase;

            //해당하는 문제는 Category를 출력
            let [row] = await db.query(sql.problems.selectCategoryFromProblemId,[id]);
            let { parent_id } = row[0];
            let [tagRow] = await db.query(sql.problems.getNameTag, [parent_id]);
            row[0]["parent_name"] = tagRow[0].name;
            rows[j]["tagInfo"] = row[0];

        }
        res.status(200).send({
            result : true,
            data: rows,
            message : '전체 문제 리스트'
        })
        
    } catch (error) {
        console.log("Problems Data" + error)
    }
    
})

//특정 문제의 정보를 출력함
router.get('/:problem_id', async function(req, res) {
    const { problem_id } = req.params
    try {
        const [rows] = await db.query(sql.selectProblemById,[problem_id])
        if(rows.length > 0)
        {
            res.status(200).send({
                result : true,
                data : rows,
                message : '특정한 문제 리스트 입니다'
            })
        }else{
            res.status(200).send({
                result : true,
                data: [],
                message : '해당 문제가 없습니다'
            })
        }
    } catch (e) {
    
    }
})

module.exports = router;