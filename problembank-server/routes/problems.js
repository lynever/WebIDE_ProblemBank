var express = require('express');
var router = express.Router();
var db = require('../modules/db-connection');
var sql = require('../sql');
var checkLoginMiddleWare = require('../modules/check-login-middleware');
var randomstring = require("randomstring");
var fileController = require('../modules/file-controller');
var path = require('path');



// const CODE = process.env.ROOT_CODE; //project path
// Check user for api
router.use(checkLoginMiddleWare.injectUerforAPI)

/**
 * get
 * 사용자 프로젝트 출력
 * @param
 */
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

router.get('/getmyproblems', async function(req, res){
    try {
        const { id } = req.user._user[0];
        const [rows] = await db.query(sql.problems.getMyListProblem,[id])
        
        var listProblem = [];
        for(let i = 0; i < rows.length; i++){
            const [problem] = await db.query(sql.problems.selectTagById,[rows[i].id])
            listProblem = [...listProblem, problem[0]];
        }

        res.status(200).send({
            result : true,
            data: listProblem,
            message : '내문제 출력 성곡'
        })
    } catch (error) {
        console.log(error)
        res.status(400).send({
            result : false,
            data: [],
            message : "내문제 출력 실패"
        })
    }
})
//Get tags tree structure
router.get('/treetags', async function(req, res) {
    try {
        let [level1] = await db.query(sql.problems.selectTagsByTutorialId2,[0])
        for(let i = 0; i < level1.length; i++){
            let [level2] = await db.query(sql.problems.selectTagsByTutorialId2,[level1[i].id])
            level1[i].level2 = level2;
            for(let j = 0; j <  level1[i].level2.length; j++ ){
                let [level3] = await db.query(sql.problems.selectTagsByTutorialId2,[level1[i].level2[j].id])
                if(level3.length !== 0)
                {
                    level1[i].level2[j].level3 = level3;
                }else{
                    level1[i].level2[j].level3 = [];
                    continue;
                }
            }
        }
        res.status(200).send({
                result: true,
                data: level1,
                message:'Tutorisl 리스트'
            })
    } catch (e) {
        console.log(e)
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
        // let firstTagId = tags[0].id;
        // let [childTags] = await db.query(sql.problems.selectTagsByTutorialId,[firstTagId])
        
        // //Level2 with 알고리즘 및 자료구죠
        // if(childTags.length !== 0){
        //     for (let i = 0; i < tags.length; i++) { 
        //         let [child_tags] = await db.query(sql.problems.selectTagsByTutorialId,[tags[i].id])
        //         tags[i] = {...tags[i], childTag : child_tags};
        //         for(let j = 0; j < tags[i].childTag.length; j++){
        //             let [problems] = await db.query(sql.problems.selectProblemsByTagId,[tags[i].childTag[j].id]);
        //             tags[i].childTag[j] = {... tags[i].childTag[j], problems}
        //         }
        //     }
        //     res.status(200).send({
        //         result: true,
        //         data: tags,
        //         message:'해당하는 Tutorial tag 리스트'
        //     })
        // }else{

        //     // category tag id를 받음
        //     let [tag] = await db.query(sql.problems.selectTagById, [id]);
        //     console.log(tag)
        //     tag[0].childTag = tags;
        //     console.log(tag)
            // for(let j = 0; j < tag[0].childTag.length; j++){

            //     let categoryId =  tag[0].childTag[j].id;
            //     let [problemsbyCategory] = await db.query(sql.problems.selectProblemByCategoryId,[categoryId])
            //     //해당하는 문제를 테스트 케이스를 출력함
            //     for(let k = 0; k < problemsbyCategory.length; k++){
            //         let { problem_id } = problemsbyCategory[k];
            //         console.log(problem_id)
            //         let [testcases] = await db.query(sql.problems.selectTestCaseFromProblemId,[problem_id])
            //         let filterTestCase = testcases.map(testcase => ({
            //             input_exp: testcase.input_example, 
            //             output_exp: testcase.output_example
            //             }
            //         ))
            //         problemsbyCategory[k]["testcases"] = filterTestCase;
            //     }
            //     // let [problems] = await db.query(sql.problems.selectProblemsByTagId,[tag[0].childTag[j].id]);
            //     tag[0].childTag[j] = {...tag[0].childTag[j], problemsbyCategory}
            // }
        //     res.status(200).send({
        //         result: true,
        //         data: tag,
        //         message:'해당하는 Tutorial tag 리스트'
        //     })
        // }
    } catch (e) {
        console.log(e)
    }
})
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
router.get('/problemsdata', async function(req, res) {
    const { id : userId } = req.user._user[0];
    try {
        let [rows] = await db.query(sql.problems.selectProblems)

        //!수정 필요함
        // for(let j = 0; j < rows.length; j++) 
        // let tempRows = rows.splice(0,23);
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

            //유저를 좋아하는 문제인제 체크함
            let [problem] = await db.query(sql.problems.checkLikeProblem, [userId, id])
            rows[j]["like"] = problem.length === 1 ? true : false;
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
// //문제 등록
// router.post('/', async function(req, res){
//     try{
//         if(helper.isAdmin(req)){
//             const {name, content, input, output, testCases, level, category, tagId} = req.body;
//             if(name && content && input && output){
//                 const [problem] = await db.query(sql.selectProblemByNameContent, [name, content]);
//                 if(problem.length != 0){
//                     res.status(200).send({
//                         result : false,
//                         data: problem,
//                         message : '이미 같은 문제가 존재합니다.'
//                     })    
//                 }else{
//                     let result = await db.query(sql.insertProblem, [name, content, input, output, level, category]);
//                     let insertTestCaseQuery;
//                     try {
//                         insertTestCaseQuery = sql.insertTestCase(-1);
//                     } catch(e) {
//                         res.status(400).send({ result: false, message: "잘못된 testcase 입력" })
//                         return;
//                     }
//                     console.log(insertTestCaseQuery)
//                     await db.query(insertTestCaseQuery, testCases.reduce((prev, e)=>{
//                         console.log(prev.concat([ e.input_example, e.output_example, result[0].insertId ]))
//                         return prev.concat([ e.input_example, e.output_example, result[0].insertId ]);
//                     }, []));
//                     await db.query(sql.problems.insertProblemTag, [result[0].insertId, tagId]);

//                     // TODO: 이거 의도를 모르겠음 확인 부탁
//                     // let [problemIDmathching] = await db.query(sql.selectProblemById,[result[0].insertId])
//                     res.status(200).send({
//                         result : true,
//                         data: [],
//                         message : '문제가 추가되었습니다.'
//                     })  
//                 }  
//             }else{
//                 res.status(200).send({
//                     result : false,
//                     data: [],
//                     message : '입력 정보에 빈 칸이 존재합니다.'
//                 })
//             }
//         }else{
//             res.status(201).send({
//                 result : false,
//                 data: [],
//                 message : '문제 추가 권한이 없습니다.'
//             })
//         }
//     }catch(error){
//         console.log(error)
//         helper.failedConnectionServer(res, error);
//     }
// })

router.put('/:problem_id', async function(req, res){
    const { problem_id } = req.params;
    try{
        if(helper.isAdmin(req)){
            const {name, content, input, output, output_example, input_example, level, category} = req.body;
            console.log(name, content, input, output, output_example, input_example, level, category)
            if(name && content && input && output){
                const [problem] = await db.query(sql.selectProblemById,[problem_id]);
                if(problem.length == 0){
                    res.status(200).send({
                        result : false,
                        data: problem,
                        message : '존재하지 않는 문제입니다.'
                    })    
                }else{
                    await db.query(sql.updateProblem, [name, content, input, output, level, category, problem_id]);
                    await db.query(sql.updateTestCase, [input_example, output_example, problem_id, problem_id]);  
                    res.status(200).send({
                        result : true,
                        data: [],
                        message : '문제가 수정되었습니다.'
                    })  
                }  
            }else{
                res.status(200).send({
                    result : false,
                    data: [],
                    message : '입력 정보에 빈 칸이 존재합니다.'
                })
            }
        }else{
            res.status(201).send({
                result : false,
                data: [],
                message : '문제 추가 권한이 없습니다.'
            })
        }
    }catch(error){
        helper.failedConnectionServer(res, error);
    }
})
router.post('/problemtomylist', async function(req, res){
    try {
        const { problemId } = req.body;
        const { id } = req.user._user[0];
        const [row] = await db.query(sql.problems.checkLikeProblem,[id, problemId])
        if(row.length === 1){ //liked
            await db.query(sql.problems.removeProblemMyList,[id, problemId])
        }else{ //don't like
            await db.query(sql.problems.setProblemMyList,[id, problemId])
        }
        res.status(200).send({
            result : true,
            data: [],
            message : '내문제 추가 성곡'
        })
    } catch (error) {
        res.status(400).send({
            result : false,
            data: [],
            message : "내문제 추가 실패함"
        })
    }
})


module.exports = router;