const register = async (req,res)=>{
    console.log('register works');
}
const login = async (req,res)=>{
    console.log('login works');
}
module.exports = {
    register,
    login
}

// once you declare a controller you need to export it so that you can import it in your route.js
// as you can see i exported register and login