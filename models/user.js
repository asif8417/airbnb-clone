const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const passportLocalMongoose=require("passport-local-mongoose").default;

const userSchema=new Schema ({
email:{
    type:String,
    required:true,
},
  about: {
        type: String,
        maxlength: 500,
        default: ""
    },
wishlist: [
        {
            type: Schema.Types.ObjectId,
            ref: "Listing"
        }
    ]

});

userSchema.plugin(passportLocalMongoose);
module.exports=mongoose.model('User', userSchema); 