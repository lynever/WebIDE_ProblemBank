var express=require('express');
var router=express.Router();
var docker = require('../modules/containers');

router.get('/', async function(req,res,next){
        var containers = await docker.run("./modules/containers.sh");
        res.json(containers);
});

router.get('/setup', async function(req,res,next){
        await docker.setUpContainer(req.query.id);
        res.send('setup');
});

router.get('/setdown', async function(req,res,next){
        await docker.setDownContainer(req.query.id);
        res.send('setdown');
});

module.exports=router;
