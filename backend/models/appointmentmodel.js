const mongoose=require('mongoose')


const appointschema=new mongoose.Schema({
    userId:{
        type:String,
        required:true
    },
    docId:{
        required:true,
        type:String
    },
    slotDate:{
        type:String,
        required:true
    },
    slotTime:{
        type:String,
        required:true
    },
    userdata:{
        type:String,
        required:true
    },
    docdata:{
        type:Object,
        required:true
    },
    amount:{
        type:Number,
        required:true
    },
    date:{
        type:Number,
        required:true
    },
    cancelled:{
        type:Boolean,
        default:false
    },
    payment:{
        type:Boolean,
        default:false
    },
    iscompleted:{
        type:Boolean,
        default:false
    }
})

const appointmentmodel=mongoose.model.appointment||mongoose.model('appointment',appointschema)

module.exports=appointmentmodel