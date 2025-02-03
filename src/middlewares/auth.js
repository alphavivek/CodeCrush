const userauth = (req,res,next)=>{
    console.log("Admin auth is getting checked!!");
    const token = "xyz";
    const isAdminAuthorized = token === "xyz";
    if(!isAdminAuthorized){
        res.status(401).send("unAuthorized Access")
    }
    else{
        next();
    }
}

const adminauth = (req,res,next)=>{
    console.log("Admin auth is getting checked!!");
    const token = "xyz";
    const isAdminAuthorized = token === "xyz";
    if(!isAdminAuthorized){
        res.status(401).send("unAuthorized Access")
    }
    else{
        next();
    }
}

module.exports = {userauth,adminauth};