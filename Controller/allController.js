const urlModel = require('../model/urlModel')
const shorten = require('shortid')
const validator = require('valid-url')
const redis = require('redis')
const isValidReqBody = (reqBody) =>{
  return Object.keys(reqBody).length >0
}
const isValid = (value)=>{
  if(typeof value =='undefined'|| typeof value == null) return false;
  if(typeof value == 'string' && value.trim().length == 0) return false;
  return true
}
const { promisify } = require("util");

const redisClient = redis.createClient(
  13190,
  "redis-13190.c301.ap-south-1-1.ec2.cloud.redislabs.com",
  { no_ready_check: true }
);
redisClient.auth("gkiOIPkytPI3ADi14jHMSWkZEo2J5TDG", function (err) {
  if (err) throw err;
});

redisClient.on("connect", async function () {
  console.log("Connected to Redis..");
});

const SET_ASYNC = promisify(redisClient.SET).bind(redisClient);
const GET_ASYNC = promisify(redisClient.GET).bind(redisClient);

const posturl = async function(req,res){
   try{ const data = req.body
    let baseUrl =req.headers.host // localhost:portNumber
    // console.log(baseUrl)
    if(!isValidReqBody(data)) return res.status(400).send({status:false,message:"plese fill some data"})
    let {longUrl} = data
    //-------------longUrl validation------------//
    if(!isValid(longUrl)) return res.status(400).send({status:false,message:"plese enter longUrl"})
    if (!validator.isUri(longUrl.trim())) return res.status(400).send({status: false,message: "please provide a valid longUrl"})
  
    //-------generate shortId---------------//

    let urlCode = shorten.generate().toLocaleLowerCase()
    //-----------shortUrl formate-----------//
    let shortUrl =  baseUrl + "/" + urlCode;
    
    let createData = {longUrl,shortUrl,urlCode}

  let saveData = await urlModel.create(createData)
  // console.log(saveData)
  //-------------responce formate-------------//
  let urlRes = await urlModel.findOne(saveData).select({ longUrl: 1,shortUrl: 1, urlCode: 1})
  // console.log(urlRes)
  return res.status(201).send({ status: true, message: `Succesfully url is created`, data:urlRes});
}catch(err){
  res.status(500).send({status:false,error:err.message})
}
}

const get = async function(req,res){
try {
     const Params = req.params.code

     let findInCache = await GET_ASYNC(`${Params}`)
     let parseLongUrl = JSON.parse(findInCache)
     if(parseLongUrl){
       res.status(302).redirect(parseLongUrl.longUrl)
     }else{
       let urlData = await urlModel.findOne({urlCode:Params})
       if(!urlData) return res.status(404).send({status:false,message:`no url found with this code ${Params}`})
       await SET_ASYNC(`${Params}`,JSON.stringify(urlData))
       res.status(302).redirect(urlData.longUrl)
     }
    
  } catch (err) {
    console.error(err);
    res.status(500).send({status:false,error:err.message});
  }
}
module.exports={
    posturl , get
}  