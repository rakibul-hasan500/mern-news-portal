const mongoose = require('mongoose')

const connectDB = async ()=>{
    try{
        if(process.env.MODE === 'production'){
            await mongoose.connect(process.env.DB_PRODUCTION_URL)
            return console.log('MongoDB production connected')
        }else{
            await mongoose.connect(process.env.DB_LOCAL_URL)
            return console.log('MongoDB local connected')
        }
    }catch(error){
        console.log('MongoDB connection error: ', error)
    }
}

module.exports = connectDB