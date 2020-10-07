var express = require('express');
var router = express.Router();
const sql = require('../sql');
const jwt = require('jsonwebtoken')
const fileController = require('../modules/file-controller');

const { injectUerforAPI } = require('../modules/check-login-middleware')

router.post('/authRedirect',  async function (req, res, next){
	// const { userId, authToken } = req.body;
	// try {
	// 	const [rows] = await db.query(sql.user.getUserById, [userId]);
	// 	if(rows.length == 1)
	// 	{
	// 		let timecreated = rows[0].timecreated;
	// 		let encodeValue = SHA256(String(timecreated));
	// 		if(encodeValue === authToken)
	// 		{
	// 			req.session.username = rows.user_id;
	// 			req.session.login = 'login';
	// 			req.session.save(() => {
	// 				const token = jwt.sign({ _user: rows }, process.env.TOKEN);
	// 				res.header('auth-token', token).send({
	// 					result: true,
	// 					jwt: token,
	// 					message: "해당하는 유저를 확인 정상"
	// 				});
	// 			});
	// 		}else{
	// 			res.status(401).send({
	// 				result: false,
	// 				data: [],
	// 				message: `해당하는 유저를 확인 실패`
	// 			})
	// 		}
	// 	}else{
	// 		res.status(401).send({
	// 			result: false,
	// 			data: [],
	// 			message: `해당하는 사용자의 정보가 없음.`
	// 		})
	// 	}
	// } catch (error) {
	// 	console.log('Get last access api: ' + error)
	// 	res.status(401).send({
	// 		result: false,
	// 		data: [],
	// 		message: `해당하는 사용자의 정보가 없음`
	// 	})
	// }
})

// check user for authentication
router.post('/auth', injectUerforAPI, async function (req, res, next) {
	// try {
	// 	res.status(200).send({
	// 		result: true,
	// 		data: req.user._user[0],
	// 		message: '사용자 정보',
	// 		isAuth: true
	// 	})
	// } catch (error) {
	// 	console.log(error)
	// 	res.status(401).send({
	// 		result: false,
	// 		data: [],
	// 		message: '사용자 정보 인증 실패',
	// 		isAuth: false
	// 	})
	// }
});

module.exports = router;
