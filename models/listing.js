// const { ServerDescription } = require("mongodb");
const mongoose = require("mongoose");
// const { stringify } = require("node:querystring");
const Schema = mongoose.Schema;
const Review = require("./reviews.js");

const listingSchema = new Schema(
{
    title : {
        type : String,
        required : true,
    },
    description : {
        type : String, 
    },
    // image : {
    //     type : String,
    //     default : "https://unsplash.com/photos/delicate-white-blossoms-on-a-branch-with-autumn-leaves-f8RoqqN604Y",
    //     set : (v) =>  v === "" ? "https://unsplash.com/photos/delicate-white-blossoms-on-a-branch-with-autumn-leaves-f8RoqqN604Y" : v,
    //  },
    // image: {
    //     url: {
    //         type: String,
    //         default: "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
    //     },
    //     filename: {
    //         type: String,
    //         default: "listingimage",
    //     }
    // },
    image: {
  url: String,
  filename : String,
},
    price : Number,
    location : String,
    country : String,
    reviews :
    [{
        type: Schema.Types.ObjectId,
        ref : "Review",
    },
   ],
   owner : {
      type  : Schema.Types.ObjectId,
      ref : "User",
   }

});


listingSchema.post("findOneAndDelete",async(listing)=>{
if(listing){
     await Review.deleteMany({_id : {$in : listing.reviews}});
};
});





const Listing = mongoose.model("Listing",listingSchema);
module.exports = Listing;
